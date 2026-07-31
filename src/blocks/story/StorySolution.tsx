'use client'

import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'

import { ConstellationCanvas } from '@/components/marketing/ConstellationCanvas'
import { Container } from '@/components/layout/Container'
import { cn } from '@/lib/utils'

type Chapter = { title: string; body: string }

type StorySolutionProps = {
  eyebrow?: string | null
  heading: string
  chapters?: Chapter[] | null
}

const FALLBACK: Chapter[] = [
  {
    title: 'Intelligence that ships',
    body: 'We design AI and analytics systems that survive audits, scale in production, and move real clinical and enterprise decisions.',
  },
  {
    title: 'Healthcare-first engineering',
    body: 'CDISC, SAS, and regulated workflows sit beside modern cloud and LLM stacks — not as afterthoughts.',
  },
  {
    title: 'One narrative, many surfaces',
    body: 'From research lab to delivery cockpit, every capability connects to a measurable outcome for your teams.',
  },
]

export function StorySolution({ eyebrow = 'The solution', heading, chapters }: StorySolutionProps) {
  const reduce = useReducedMotion()
  const items = chapters?.length ? chapters : FALLBACK
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end'],
  })
  const lineHeight = useTransform(scrollYProgress, [0, 1], ['0%', '100%'])

  return (
    <section ref={ref} className="relative bg-[color:var(--color-navy)] text-white">
      <div className="pointer-events-none absolute inset-0 opacity-40">
        <ConstellationCanvas />
      </div>

      <Container className="relative">
        <div className="grid lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-16">
          <div className="lg:sticky lg:top-28 lg:self-start lg:py-32">
            <p className="text-[11px] font-bold tracking-[0.2em] text-teal-300 uppercase">
              {eyebrow}
            </p>
            <h2 className="font-display mt-5 max-w-md text-[clamp(2rem,4vw,3.4rem)] font-bold tracking-[-0.04em] text-balance">
              {heading}
            </h2>
            {!reduce ? (
              <div className="relative mt-12 hidden h-40 w-px overflow-hidden bg-white/10 lg:block">
                <motion.div
                  className="absolute top-0 left-0 w-full bg-gradient-to-b from-teal-400 to-cyan-400"
                  style={{ height: lineHeight }}
                />
              </div>
            ) : null}
          </div>

          <div className="space-y-0 py-20 lg:py-32">
            {items.map((chapter, index) => (
              <motion.article
                key={chapter.title}
                className={cn(
                  'border-t border-white/10 py-16 first:border-t-0 lg:min-h-[70vh] lg:py-24',
                )}
                initial={reduce ? false : { opacity: 0.35, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.45 }}
                transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
              >
                <p className="font-display text-sm tracking-[0.18em] text-cyan-300/70">
                  {String(index + 1).padStart(2, '0')}
                </p>
                <h3 className="font-display mt-4 text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">
                  {chapter.title}
                </h3>
                <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-300">
                  {chapter.body}
                </p>
              </motion.article>
            ))}
          </div>
        </div>
      </Container>
    </section>
  )
}
