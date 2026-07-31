'use client'

import { motion, useInView, useReducedMotion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'

import { Container } from '@/components/layout/Container'

type ProofStat = {
  label: string
  value: string
  suffix?: string | null
}

type StoryProofProps = {
  eyebrow?: string | null
  heading: string
  stats?: ProofStat[] | null
}

const FALLBACK: ProofStat[] = [
  { label: 'Core services', value: '5' },
  { label: 'Industries', value: '8' },
  { label: 'Solution areas', value: '8' },
  { label: 'Focus', value: 'AI', suffix: '+Health' },
]

function CountValue({ value, suffix }: { value: string; suffix?: string | null }) {
  const reduce = useReducedMotion()
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-10%' })
  const numeric = Number.parseFloat(value.replace(/[^\d.]/g, ''))
  const isNumeric = Number.isFinite(numeric) && /^\d/.test(value.trim())
  const [n, setN] = useState(reduce || !isNumeric ? value : '0')

  useEffect(() => {
    if (!inView || reduce || !isNumeric) {
      setN(value)
      return
    }
    const duration = 1100
    const start = performance.now()
    let frame = 0
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration)
      const eased = 1 - Math.pow(1 - t, 3)
      const current = Math.round(numeric * eased)
      setN(String(current))
      if (t < 1) frame = requestAnimationFrame(tick)
      else setN(value.replace(/[^\d.].*$/, '') === String(numeric) ? value : String(current))
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [inView, reduce, isNumeric, numeric, value])

  return (
    <span ref={ref} className="tabular-nums">
      {isNumeric ? n : value}
      {suffix ? <span className="text-[0.45em] font-semibold text-teal-600">{suffix}</span> : null}
    </span>
  )
}

export function StoryProof({ eyebrow = 'Proof', heading, stats }: StoryProofProps) {
  const reduce = useReducedMotion()
  const items = stats?.length ? stats : FALLBACK

  return (
    <section className="relative overflow-hidden bg-[color:var(--color-neutral)] py-28 lg:py-36">
      <Container>
        <p className="text-[11px] font-bold tracking-[0.2em] text-teal-700 uppercase">{eyebrow}</p>
        <h2 className="font-display mt-4 max-w-3xl text-[clamp(2rem,4.5vw,3.8rem)] font-bold tracking-[-0.045em] text-[color:var(--color-navy)]">
          {heading}
        </h2>

        <div className="mt-20 flex flex-col gap-16 sm:gap-20">
          {items.map((stat, index) => (
            <motion.div
              key={`${stat.label}-${stat.value}`}
              className="flex flex-wrap items-baseline justify-between gap-4 border-b border-[color:var(--color-navy)]/10 pb-10"
              initial={reduce ? false : { opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-8%' }}
              transition={{ delay: index * 0.06, duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
              style={{ paddingLeft: `${(index % 3) * 4}%` }}
            >
              <p className="font-display text-[clamp(3.5rem,10vw,7.5rem)] leading-none font-bold tracking-[-0.06em] text-[color:var(--color-navy)]">
                <CountValue value={stat.value} suffix={stat.suffix} />
              </p>
              <p className="max-w-xs text-right text-sm font-medium tracking-wide text-slate-500 uppercase sm:text-base">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  )
}
