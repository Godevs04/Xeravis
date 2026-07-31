'use client'

import { motion, useReducedMotion } from 'framer-motion'

import { Container } from '@/components/layout/Container'

type ChallengeItem = { title: string; body?: string | null }

type StoryChallengeProps = {
  eyebrow?: string | null
  heading: string
  items?: ChallengeItem[] | null
}

const FALLBACK: ChallengeItem[] = [
  {
    title: 'Fragmented clinical & enterprise data',
    body: 'Signals live in silos. Decisions wait on spreadsheets.',
  },
  {
    title: 'AI without operational grounding',
    body: 'Models that impress demos but stall in regulated reality.',
  },
  {
    title: 'Transformation without craft',
    body: 'Generic platforms. Generic outcomes. Forgotten brands.',
  },
]

export function StoryChallenge({ eyebrow = 'The challenge', heading, items }: StoryChallengeProps) {
  const reduce = useReducedMotion()
  const list = items?.length ? items : FALLBACK

  return (
    <section className="relative overflow-hidden bg-[color:var(--color-neutral)] py-28 lg:py-36">
      <Container>
        <p className="text-[11px] font-bold tracking-[0.2em] text-teal-700 uppercase">{eyebrow}</p>
        <motion.h2
          className="font-display mt-6 max-w-4xl text-[clamp(2.5rem,6vw,5.5rem)] leading-[0.95] font-bold tracking-[-0.05em] text-[color:var(--color-navy)]"
          initial={reduce ? false : { opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-10%' }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          {heading}
        </motion.h2>

        <ul className="mt-20 space-y-0">
          {list.map((item, index) => (
            <motion.li
              key={item.title}
              className="group border-t border-[color:var(--color-navy)]/15 py-10 last:border-b"
              initial={reduce ? false : { opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-8%' }}
              transition={{ delay: index * 0.08, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="grid gap-4 lg:grid-cols-[5rem_1fr_1.1fr] lg:items-baseline">
                <span className="font-display text-sm font-semibold tracking-[0.16em] text-teal-600">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <h3 className="font-display text-2xl font-semibold tracking-[-0.03em] text-[color:var(--color-navy)] sm:text-3xl">
                  {item.title}
                </h3>
                {item.body ? (
                  <p className="max-w-md text-base leading-relaxed text-slate-600 lg:justify-self-end">
                    {item.body}
                  </p>
                ) : null}
              </div>
            </motion.li>
          ))}
        </ul>
      </Container>
    </section>
  )
}
