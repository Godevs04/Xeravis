'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { useState } from 'react'

import { Container } from '@/components/layout/Container'
import { cn } from '@/lib/utils'

type Step = { title: string; description: string }

type StoryProcessProps = {
  eyebrow?: string | null
  heading: string
  steps?: Step[] | null
}

const FALLBACK: Step[] = [
  {
    title: 'Discover',
    description: 'Map constraints, data reality, and the decision that must improve.',
  },
  {
    title: 'Design',
    description: 'Architect the stack, compliance path, and measurable success criteria.',
  },
  {
    title: 'Build',
    description: 'Ship in slices — models, pipelines, and interfaces that operators trust.',
  },
  {
    title: 'Scale',
    description: 'Harden, observe, and expand into the next surface of the business.',
  },
]

export function StoryProcess({ eyebrow = 'Process', heading, steps }: StoryProcessProps) {
  const reduce = useReducedMotion()
  const items = steps?.length ? steps : FALLBACK
  const [active, setActive] = useState(0)

  return (
    <section className="bg-white py-24 lg:py-32">
      <Container>
        <p className="text-[11px] font-bold tracking-[0.2em] text-teal-700 uppercase">{eyebrow}</p>
        <h2 className="font-display mt-4 max-w-2xl text-[clamp(2rem,4vw,3.4rem)] font-bold tracking-[-0.04em] text-[color:var(--color-navy)]">
          {heading}
        </h2>

        <div className="mt-16 grid gap-12 lg:grid-cols-[14rem_1fr] lg:gap-20">
          <ol className="flex gap-2 overflow-x-auto lg:flex-col lg:gap-0 lg:overflow-visible">
            {items.map((step, index) => (
              <li key={step.title} className="shrink-0">
                <button
                  type="button"
                  onClick={() => setActive(index)}
                  onMouseEnter={() => setActive(index)}
                  className={cn(
                    'w-full border-l-2 px-4 py-3 text-left transition-colors',
                    index === active
                      ? 'border-teal-500 text-[color:var(--color-navy)]'
                      : 'border-transparent text-slate-400 hover:text-slate-600',
                  )}
                >
                  <span className="font-display text-xs tracking-[0.14em]">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className="font-display mt-1 block text-lg font-semibold">
                    {step.title}
                  </span>
                </button>
              </li>
            ))}
          </ol>

          <div className="relative min-h-[16rem]">
            <svg
              aria-hidden
              className="pointer-events-none absolute -top-6 left-0 h-24 w-full text-teal-500/40"
              viewBox="0 0 400 80"
              fill="none"
            >
              <motion.path
                d="M0 60 C 80 10, 160 10, 240 50 S 360 70, 400 30"
                stroke="currentColor"
                strokeWidth="2"
                initial={reduce ? false : { pathLength: 0 }}
                animate={{ pathLength: 1 }}
                key={active}
                transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              />
            </svg>

            <motion.div
              key={items[active]?.title}
              initial={reduce ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            >
              <p className="font-display text-[clamp(3rem,8vw,6rem)] leading-none font-bold tracking-[-0.06em] text-[color:var(--color-navy)]/8">
                {String(active + 1).padStart(2, '0')}
              </p>
              <h3 className="font-display -mt-6 text-3xl font-semibold tracking-[-0.03em] text-[color:var(--color-navy)] sm:text-4xl">
                {items[active]?.title}
              </h3>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-600">
                {items[active]?.description}
              </p>
            </motion.div>
          </div>
        </div>
      </Container>
    </section>
  )
}
