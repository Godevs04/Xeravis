'use client'

import { motion, useInView, useReducedMotion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'

import { Container } from '@/components/layout/Container'
import { Section } from '@/components/layout/Section'
import { FALLBACK_STATS } from '@/lib/fallback-data'
import { cn } from '@/lib/utils'

type Stat = { label: string; value: string; suffix?: string | null }

type StatsRowProps = {
  heading: string
  stats?: Stat[] | null
}

function parseStat(value: string) {
  const match = value.match(/^([^\d]*)([\d.,]+)(.*)$/)
  if (!match) return { prefix: '', num: 0, suffix: value, decimals: 0, isNumeric: false }
  const raw = match[2].replace(/,/g, '')
  const decimals = raw.includes('.') ? raw.split('.')[1].length : 0
  return {
    prefix: match[1],
    num: Number(raw),
    suffix: match[3],
    decimals,
    isNumeric: true,
  }
}

function displayValue(stat: Stat) {
  const base = stat.value?.trim() || ''
  const extra = stat.suffix?.trim() || ''
  if (!extra) return base
  if (base.endsWith(extra)) return base
  return `${base}${extra}`
}

function AnimatedValue({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-10%' })
  const reduce = useReducedMotion()
  const { prefix, num, suffix, decimals, isNumeric } = parseStat(value)
  const [display, setDisplay] = useState(reduce || !isNumeric ? value : `${prefix}0${suffix}`)

  useEffect(() => {
    if (!inView || reduce || !isNumeric || !num) {
      setDisplay(value)
      return
    }
    const duration = 1100
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
  }, [inView, reduce, num, prefix, suffix, decimals, value, isNumeric])

  return (
    <span
      ref={ref}
      className="font-display text-primary block truncate text-[1.75rem] leading-none font-bold tracking-tight sm:text-3xl lg:text-4xl"
    >
      {display}
    </span>
  )
}

function gridClass(count: number) {
  if (count <= 1) return 'grid-cols-1'
  if (count === 2) return 'grid-cols-1 sm:grid-cols-2'
  if (count === 3) return 'grid-cols-1 sm:grid-cols-3'
  if (count === 4) return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
  if (count <= 6) return 'grid-cols-2 md:grid-cols-3 lg:grid-cols-6'
  return 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
}

export function StatsRow({ heading, stats }: StatsRowProps) {
  const reduce = useReducedMotion()
  const items = stats?.length ? stats : FALLBACK_STATS

  return (
    <Section>
      <Container>
        <h2 className="sr-only">{heading}</h2>
        <div className={cn('grid gap-4 sm:gap-5', gridClass(items.length))}>
          {items.map((stat, index) => (
            <motion.article
              key={`${stat.label}-${index}`}
              className="group relative isolate min-w-0 overflow-hidden rounded-[24px] border border-[color:var(--glass-border-soft)] bg-[color:var(--glass-bg)] p-5 shadow-[var(--shadow-medium)] backdrop-blur-2xl sm:p-6"
              initial={reduce ? false : { opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-8% 0px' }}
              transition={{
                duration: 0.55,
                ease: [0.22, 1, 0.36, 1],
                delay: reduce ? 0 : index * 0.06,
              }}
              whileHover={
                reduce
                  ? undefined
                  : {
                      y: -4,
                      transition: { duration: 0.28, ease: [0.22, 1, 0.36, 1] },
                    }
              }
            >
              <div
                aria-hidden
                className="pointer-events-none absolute -top-12 -right-10 h-28 w-28 rounded-full bg-[radial-gradient(circle,rgba(13,148,136,0.22),transparent_70%)] opacity-80 transition-opacity duration-300 group-hover:opacity-100"
              />
              <div className="relative min-w-0">
                <AnimatedValue value={displayValue(stat)} />
                <p className="text-secondary mt-3 text-sm leading-snug font-medium">{stat.label}</p>
              </div>
            </motion.article>
          ))}
        </div>
      </Container>
    </Section>
  )
}
