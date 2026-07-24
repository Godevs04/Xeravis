'use client'

import { motion, useInView, useReducedMotion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'

import { Container } from '@/components/layout/Container'
import { Section } from '@/components/layout/Section'
import { AnimateIn } from '@/components/motion/AnimateIn'
import { FALLBACK_STATS } from '@/lib/fallback-data'

type Stat = { label: string; value: string }

type StatsRowProps = {
  heading: string
  stats?: Stat[] | null
}

function parseStat(value: string) {
  const match = value.match(/^([^\d]*)([\d.,]+)(.*)$/)
  if (!match) return { prefix: '', num: 0, suffix: value, decimals: 0 }
  const raw = match[2].replace(/,/g, '')
  const decimals = raw.includes('.') ? raw.split('.')[1].length : 0
  return {
    prefix: match[1],
    num: Number(raw),
    suffix: match[3],
    decimals,
  }
}

function AnimatedValue({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-10%' })
  const reduce = useReducedMotion()
  const { prefix, num, suffix, decimals } = parseStat(value)
  const [display, setDisplay] = useState(reduce || !num ? value : `${prefix}0${suffix}`)

  useEffect(() => {
    if (!inView || reduce || !num) {
      setDisplay(value)
      return
    }
    const duration = 1200
    const start = performance.now()
    let frame = 0
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration)
      const eased = 1 - Math.pow(1 - t, 3)
      const current = num * eased
      setDisplay(
        `${prefix}${decimals ? current.toFixed(decimals) : Math.round(current).toLocaleString()}${suffix}`,
      )
      if (t < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [inView, reduce, num, prefix, suffix, decimals, value])

  return (
    <span ref={ref} className="font-display text-4xl font-bold tracking-tight sm:text-5xl">
      {display}
    </span>
  )
}

export function StatsRow({ heading, stats }: StatsRowProps) {
  const items = stats?.length ? stats : FALLBACK_STATS

  return (
    <Section>
      <Container>
        <h2 className="sr-only">{heading}</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {items.map((stat, index) => (
            <AnimateIn key={stat.label} delay={index * 0.05}>
              <motion.div
                whileHover={{ y: -6 }}
                className="rounded-[24px] border border-[color:var(--glass-border-soft)] bg-[color:var(--card-bg)] p-5 shadow-[var(--shadow-light)] backdrop-blur-xl"
              >
                <AnimatedValue value={stat.value} />
                <p className="text-secondary mt-2 text-sm">{stat.label}</p>
              </motion.div>
            </AnimateIn>
          ))}
        </div>
      </Container>
    </Section>
  )
}
