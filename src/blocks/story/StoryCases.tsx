'use client'

import Link from 'next/link'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { useState } from 'react'

import { Container } from '@/components/layout/Container'
import { cn } from '@/lib/utils'

export type CaseItem = {
  id: string
  title: string
  client: string
  outcome: string
  href: string
}

type StoryCasesProps = {
  eyebrow?: string | null
  heading: string
  items: CaseItem[]
}

export function StoryCases({ eyebrow = 'Success stories', heading, items }: StoryCasesProps) {
  const reduce = useReducedMotion()
  const [index, setIndex] = useState(0)
  const active = items[index] ?? items[0]

  if (!active) return null

  return (
    <section className="bg-[color:var(--color-navy)] py-24 text-white lg:py-32">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="text-[11px] font-bold tracking-[0.2em] text-teal-300 uppercase">
              {eyebrow}
            </p>
            <h2 className="font-display mt-4 max-w-2xl text-[clamp(2rem,4vw,3.4rem)] font-bold tracking-[-0.04em]">
              {heading}
            </h2>
          </div>
          <div className="flex gap-2">
            {items.map((item, i) => (
              <button
                key={item.id}
                type="button"
                aria-label={`Show case ${i + 1}`}
                onClick={() => setIndex(i)}
                className={cn(
                  'h-2 w-8 rounded-full transition-colors',
                  i === index ? 'bg-cyan-400' : 'bg-white/20 hover:bg-white/40',
                )}
              />
            ))}
          </div>
        </div>

        <div className="relative mt-16 min-h-[22rem] overflow-hidden lg:min-h-[26rem]">
          <AnimatePresence mode="wait">
            <motion.article
              key={active.id}
              initial={reduce ? false : { opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={reduce ? undefined : { opacity: 0, x: -40 }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0 flex flex-col justify-between"
            >
              <div>
                <p className="text-sm tracking-wide text-cyan-300/80">{active.client}</p>
                <h3 className="font-display mt-4 max-w-4xl text-[clamp(1.8rem,4vw,3.2rem)] font-semibold tracking-[-0.035em] text-balance">
                  {active.title}
                </h3>
                <p className="mt-8 max-w-2xl text-lg leading-relaxed text-slate-300">
                  {active.outcome}
                </p>
              </div>
              <Link
                href={active.href}
                className="mt-10 inline-flex w-fit text-sm font-semibold text-teal-300 underline-offset-4 hover:underline"
              >
                Read the story →
              </Link>
            </motion.article>
          </AnimatePresence>
        </div>

        <p className="mt-10">
          <Link href="/case-studies" className="text-sm text-slate-400 hover:text-white">
            All case studies
          </Link>
        </p>
      </Container>
    </section>
  )
}
