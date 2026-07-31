'use client'

import Link from 'next/link'
import { motion, useReducedMotion } from 'framer-motion'

import { MeshBackdrop } from '@/components/marketing/MeshBackdrop'
import { ConstellationCanvas } from '@/components/marketing/ConstellationCanvas'
import { OrbitDiagram } from '@/components/marketing/OrbitDiagram'
import { Container } from '@/components/layout/Container'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const EASE = [0.22, 1, 0.36, 1] as const

type BaseHero = {
  title: string
  subtitle?: string
}

/** Services — horizontal capability ribbon + split type */
export function ServicesPageHero({ title, subtitle }: BaseHero) {
  const reduce = useReducedMotion()
  const ribbon = ['AI Research', 'Data Science', 'IT Consulting', 'Clinical', 'Cloud']

  return (
    <section className="relative overflow-hidden bg-[color:var(--color-neutral)] pt-28 pb-16 lg:pt-36 lg:pb-20">
      <Container>
        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
          <div>
            <p className="font-display text-2xl font-bold tracking-[-0.03em] text-teal-700">
              Xelarvis
            </p>
            <motion.h1
              className="font-display mt-4 text-[clamp(2.4rem,5vw,4.2rem)] leading-[1.02] font-bold tracking-[-0.045em] text-[color:var(--color-navy)]"
              initial={reduce ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: EASE }}
            >
              {title}
            </motion.h1>
            {subtitle ? <p className="mt-5 max-w-xl text-base text-slate-600">{subtitle}</p> : null}
          </div>
          <p className="text-right text-[11px] font-bold tracking-[0.2em] text-slate-400 uppercase">
            Services
          </p>
        </div>
      </Container>
      <div className="mt-12 overflow-hidden border-y border-[color:var(--color-navy)]/10 bg-white/60 py-4 backdrop-blur">
        <motion.ul
          className="flex w-max gap-10 px-6 whitespace-nowrap"
          animate={reduce ? undefined : { x: ['0%', '-50%'] }}
          transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
        >
          {[...ribbon, ...ribbon].map((label, i) => (
            <li
              key={`${label}-${i}`}
              className="font-display text-sm font-semibold tracking-wide text-[color:var(--color-navy)]/70"
            >
              {label}
              <span className="ml-10 text-teal-500">·</span>
            </li>
          ))}
        </motion.ul>
      </div>
    </section>
  )
}

/** Solutions — oversized editorial masthead */
export function SolutionsPageHero({ title, subtitle }: BaseHero) {
  const reduce = useReducedMotion()
  return (
    <section className="bg-[color:var(--color-navy)] pt-28 pb-20 text-white lg:pt-36 lg:pb-28">
      <Container>
        <p className="text-[11px] font-bold tracking-[0.22em] text-teal-300 uppercase">Solutions</p>
        <motion.h1
          className="font-display mt-6 max-w-5xl text-[clamp(2.6rem,7vw,5.5rem)] leading-[0.95] font-bold tracking-[-0.05em]"
          initial={reduce ? false : { opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, ease: EASE }}
        >
          {title}
        </motion.h1>
        {subtitle ? <p className="mt-8 max-w-2xl text-lg text-slate-300">{subtitle}</p> : null}
      </Container>
    </section>
  )
}

/** Industries — sector constellation */
export function IndustriesPageHero({ title, subtitle }: BaseHero) {
  return (
    <MeshBackdrop className="pt-28 pb-20 lg:pt-36 lg:pb-28" interactive={false}>
      <Container>
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <p className="text-[11px] font-bold tracking-[0.2em] text-teal-300 uppercase">
              Industries
            </p>
            <h1 className="font-display mt-4 text-[clamp(2.2rem,4.5vw,3.8rem)] font-bold tracking-[-0.04em] text-balance text-white">
              {title}
            </h1>
            {subtitle ? <p className="mt-5 max-w-md text-base text-slate-300">{subtitle}</p> : null}
          </div>
          <div className="relative h-64 overflow-hidden rounded-3xl border border-white/10 sm:h-80">
            <ConstellationCanvas className="opacity-90" />
          </div>
        </div>
      </Container>
    </MeshBackdrop>
  )
}

/** Technologies — full-bleed orbit */
export function TechnologiesPageHero({ title, subtitle }: BaseHero) {
  const nodes = [
    { id: '1', label: 'Python', category: 'ai' },
    { id: '2', label: 'SAS', category: 'clinical' },
    { id: '3', label: 'Spark', category: 'data' },
    { id: '4', label: 'OpenAI', category: 'ai' },
    { id: '5', label: 'Power BI', category: 'bi' },
    { id: '6', label: 'LangChain', category: 'ai' },
  ]
  return (
    <MeshBackdrop className="pt-24 pb-16 lg:pt-32 lg:pb-20" interactive>
      <Container>
        <div className="text-center">
          <p className="text-[11px] font-bold tracking-[0.2em] text-cyan-300 uppercase">
            Technologies
          </p>
          <h1 className="font-display mx-auto mt-4 max-w-3xl text-[clamp(2.2rem,5vw,4rem)] font-bold tracking-[-0.045em] text-white">
            {title}
          </h1>
          {subtitle ? <p className="mx-auto mt-5 max-w-xl text-slate-300">{subtitle}</p> : null}
        </div>
        <div className="mt-10">
          <OrbitDiagram nodes={nodes} className="max-w-md" />
        </div>
      </Container>
    </MeshBackdrop>
  )
}

/** Careers — atmosphere + type */
export function CareersPageHero({ title, subtitle }: BaseHero) {
  const reduce = useReducedMotion()
  return (
    <section className="relative min-h-[70svh] overflow-hidden bg-[color:var(--color-navy)] text-white">
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_70%_40%,rgba(13,148,136,0.35),transparent_55%),radial-gradient(ellipse_50%_40%_at_20%_80%,rgba(6,182,212,0.2),transparent)]"
      />
      <Container className="relative flex min-h-[70svh] flex-col justify-end pt-32 pb-16 lg:pb-24">
        <p className="text-[11px] font-bold tracking-[0.2em] text-teal-300 uppercase">Careers</p>
        <motion.h1
          className="font-display mt-4 max-w-3xl text-[clamp(2.6rem,6vw,5rem)] leading-[0.98] font-bold tracking-[-0.05em]"
          initial={reduce ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE }}
        >
          {title}
        </motion.h1>
        {subtitle ? <p className="mt-6 max-w-xl text-lg text-slate-300">{subtitle}</p> : null}
        <div className="mt-10">
          <Button
            asChild
            size="lg"
            className="rounded-full bg-teal-500 text-white shadow-[0_0_40px_rgba(13,148,136,0.4)] hover:bg-cyan-400"
          >
            <Link href="#open-roles">View open roles</Link>
          </Button>
        </div>
      </Container>
    </section>
  )
}

/** About — mission typography void */
export function AboutPageHero({ title, subtitle }: BaseHero) {
  const reduce = useReducedMotion()
  return (
    <section className="bg-[color:var(--color-neutral)] pt-32 pb-24 lg:pt-40 lg:pb-32">
      <Container>
        <p className="text-[11px] font-bold tracking-[0.22em] text-teal-700 uppercase">About</p>
        <motion.h1
          className="font-display mt-8 max-w-5xl text-[clamp(2.8rem,7vw,6rem)] leading-[0.92] font-bold tracking-[-0.055em] text-[color:var(--color-navy)]"
          initial={reduce ? false : { opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: EASE }}
        >
          {title}
        </motion.h1>
        {subtitle ? (
          <p className="mt-10 max-w-2xl border-l-2 border-teal-500 pl-6 text-lg leading-relaxed text-slate-600">
            {subtitle}
          </p>
        ) : null}
      </Container>
    </section>
  )
}

/** Insights — magazine masthead */
export function InsightsPageHero({ title, subtitle }: BaseHero) {
  return (
    <section className="border-b border-[color:var(--color-navy)]/10 bg-white pt-28 pb-16 lg:pt-36">
      <Container>
        <div className="flex flex-wrap items-start justify-between gap-8">
          <div className="max-w-3xl">
            <p className="font-display text-sm font-bold tracking-[0.08em] text-teal-700">
              INSIGHTS · XELARVIS
            </p>
            <h1
              className={cn(
                'font-display mt-4 text-[clamp(2.4rem,5.5vw,4.5rem)] leading-[1] font-bold tracking-[-0.05em] text-[color:var(--color-navy)]',
              )}
            >
              {title}
            </h1>
          </div>
          {subtitle ? (
            <p className="mt-2 max-w-xs text-sm leading-relaxed text-slate-500 lg:mt-12">
              {subtitle}
            </p>
          ) : null}
        </div>
        <div className="mt-12 h-px w-full bg-[color:var(--color-navy)]" />
        <div className="mt-4 flex justify-between text-[10px] tracking-[0.16em] text-slate-400 uppercase">
          <span>Perspective</span>
          <span>AI · Clinical · Enterprise</span>
        </div>
      </Container>
    </section>
  )
}
