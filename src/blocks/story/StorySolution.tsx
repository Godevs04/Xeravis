'use client'

import Link from '@/components/ui/link'
import { m as motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { useRef } from 'react'

import { ConstellationCanvas } from '@/components/marketing/ConstellationCanvas'
import { Container } from '@/components/layout/Container'
import { cn } from '@/lib/utils'

export type SolutionChapter = { title: string; body: string; href?: string }

type StorySolutionProps = {
  eyebrow?: string | null
  heading: string
  chapters?: SolutionChapter[] | null
  viewAllHref?: string
}

const FALLBACK: SolutionChapter[] = [
  {
    title: 'Intelligence that ships',
    body: 'We design AI and analytics systems that survive audits, scale in production, and move real enterprise decisions.',
  },
  {
    title: 'Research-driven engineering',
    body: 'Evaluation, governance, and regulated workflows sit beside modern cloud and LLM stacks — not as afterthoughts. Healthcare is a specialty practice.',
  },
  {
    title: 'One narrative, many surfaces',
    body: 'From research lab to delivery cockpit, every capability connects to an outcome your teams can track.',
  },
]

export function StorySolution({
  eyebrow = 'The solution',
  heading,
  chapters,
  viewAllHref,
}: StorySolutionProps) {
  const reduce = useReducedMotion()
  const items = chapters?.length ? chapters : FALLBACK
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end'],
  })
  const lineHeight = useTransform(scrollYProgress, [0, 1], ['0%', '100%'])

  return (
    <section
      ref={ref}
      className="surface-navy relative bg-[color:var(--hero-bg)] text-[color:var(--hero-text)]"
    >
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
            {viewAllHref ? (
              <Link
                href={viewAllHref}
                className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-teal-300 underline-offset-4 hover:underline"
              >
                All services
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            ) : null}
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
                className={cn('border-t border-white/10 py-12 first:border-t-0 lg:py-20')}
                initial={reduce ? false : { opacity: 0, y: 24 }}
                data-reveal
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
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
                {chapter.href ? (
                  <Link
                    href={chapter.href}
                    className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-teal-300 underline-offset-4 hover:underline"
                  >
                    Explore {chapter.title}
                    <ArrowRight className="h-4 w-4" aria-hidden />
                  </Link>
                ) : null}
              </motion.article>
            ))}
          </div>
        </div>
      </Container>
    </section>
  )
}
