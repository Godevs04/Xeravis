'use client'

import Link from 'next/link'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

import { MeshBackdrop } from '@/components/marketing/MeshBackdrop'
import { ConstellationCanvas } from '@/components/marketing/ConstellationCanvas'
import { OrbitDiagram } from '@/components/marketing/OrbitDiagram'
import { Container } from '@/components/layout/Container'
import { Button } from '@/components/ui/button'

const EASE = [0.22, 1, 0.36, 1] as const

type BaseHero = {
  title: string
  subtitle?: string
}

/** Services — capability masthead + glass ribbon */
export function ServicesPageHero({ title, subtitle }: BaseHero) {
  const reduce = useReducedMotion()
  const ribbon = ['AI', 'Data Science', 'IT Consulting', 'Data Engineering', 'Healthcare Specialty']

  return (
    <MeshBackdrop className="pt-28 pb-0 lg:pt-36" interactive={false}>
      <Container>
        <div className="grid items-end gap-10 pb-16 lg:grid-cols-[1.2fr_0.8fr] lg:pb-20">
          <div>
            <motion.p
              className="font-display text-2xl font-bold tracking-[-0.03em] text-[color:var(--color-accent)] sm:text-3xl"
              initial={reduce ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: EASE }}
            >
              Xelarvis
            </motion.p>
            <motion.h1
              className="font-display mt-4 max-w-3xl text-[clamp(2.2rem,5vw,4rem)] leading-[1.02] font-bold tracking-[-0.045em] text-balance text-[color:var(--hero-text)]"
              initial={reduce ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.06, ease: EASE }}
            >
              {title}
            </motion.h1>
            {subtitle ? (
              <motion.p
                className="mt-5 max-w-xl text-base leading-relaxed text-[color:var(--hero-muted)]"
                initial={reduce ? false : { opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.12, ease: EASE }}
              >
                {subtitle}
              </motion.p>
            ) : null}
            <motion.div
              className="mt-8 flex flex-wrap gap-3"
              initial={reduce ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.18, ease: EASE }}
            >
              <Button
                asChild
                size="lg"
                className="rounded-full bg-gradient-to-r from-teal-500 to-cyan-500 px-7 font-semibold text-white shadow-[0_0_32px_rgba(13,148,136,0.4)] hover:from-teal-400 hover:to-cyan-400"
              >
                <Link href="#services-catalog">Browse services</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="rounded-full border-[color:var(--hero-panel-border)] bg-[color:var(--hero-panel)] px-7 font-semibold text-[color:var(--hero-text)] backdrop-blur hover:border-[color:var(--color-accent)]/50 hover:bg-[color:var(--color-hover)]"
              >
                <Link href="/contact?intent=services">Talk to an expert</Link>
              </Button>
            </motion.div>
          </div>
          <p className="text-[11px] font-bold tracking-[0.22em] text-[color:var(--color-accent)]/80 uppercase lg:text-right">
            Services
          </p>
        </div>
      </Container>

      <div className="overflow-hidden border-y border-[color:var(--hero-panel-border)] bg-[color:var(--hero-panel)] py-4 backdrop-blur-xl">
        <motion.ul
          className="flex w-max gap-10 px-6 whitespace-nowrap"
          animate={reduce ? undefined : { x: ['0%', '-50%'] }}
          transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
        >
          {[...ribbon, ...ribbon].map((label, i) => (
            <li
              key={`${label}-${i}`}
              className="font-display text-sm font-semibold tracking-wide text-[color:var(--hero-muted)]"
            >
              {label}
              <span className="ml-10 text-[color:var(--color-accent)]">·</span>
            </li>
          ))}
        </motion.ul>
      </div>
    </MeshBackdrop>
  )
}

/** Solutions — oversized editorial masthead */
export function SolutionsPageHero({ title, subtitle }: BaseHero) {
  const reduce = useReducedMotion()
  return (
    <section className="surface-navy bg-[color:var(--hero-bg)] pt-28 pb-20 text-[color:var(--hero-text)] lg:pt-36 lg:pb-28">
      <Container>
        <p className="text-[11px] font-bold tracking-[0.22em] text-[color:var(--color-accent)] uppercase">
          Solutions
        </p>
        <motion.h1
          className="font-display mt-6 max-w-5xl text-[clamp(2.6rem,7vw,5.5rem)] leading-[0.95] font-bold tracking-[-0.05em]"
          initial={reduce ? false : { opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, ease: EASE }}
        >
          {title}
        </motion.h1>
        {subtitle ? (
          <p className="mt-8 max-w-2xl text-lg text-[color:var(--hero-muted)]">{subtitle}</p>
        ) : null}
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
            <p className="text-[11px] font-bold tracking-[0.2em] text-[color:var(--color-accent)] uppercase">
              Industries
            </p>
            <h1 className="font-display mt-4 text-[clamp(2.2rem,4.5vw,3.8rem)] font-bold tracking-[-0.04em] text-balance text-[color:var(--hero-text)]">
              {title}
            </h1>
            {subtitle ? (
              <p className="mt-5 max-w-md text-base text-[color:var(--hero-muted)]">{subtitle}</p>
            ) : null}
          </div>
          <div className="relative h-64 overflow-hidden rounded-3xl border border-[color:var(--hero-panel-border)] bg-[color:var(--hero-panel)] sm:h-80">
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
          <p className="text-[11px] font-bold tracking-[0.2em] text-[color:var(--color-accent)] uppercase">
            Technologies
          </p>
          <h1 className="font-display mx-auto mt-4 max-w-3xl text-[clamp(2.2rem,5vw,4rem)] font-bold tracking-[-0.045em] text-[color:var(--hero-text)]">
            {title}
          </h1>
          {subtitle ? (
            <p className="mx-auto mt-5 max-w-xl text-[color:var(--hero-muted)]">{subtitle}</p>
          ) : null}
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
    <section className="surface-navy relative min-h-[70svh] overflow-hidden bg-[color:var(--hero-bg)] text-[color:var(--hero-text)]">
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_70%_40%,var(--hero-glow),transparent_55%),radial-gradient(ellipse_50%_40%_at_20%_80%,var(--hero-glow-2),transparent)]"
      />
      <Container className="relative flex min-h-[70svh] flex-col justify-end pt-32 pb-16 lg:pb-24">
        <p className="text-[11px] font-bold tracking-[0.2em] text-[color:var(--color-accent)] uppercase">
          Careers
        </p>
        <motion.h1
          className="font-display mt-4 max-w-3xl text-[clamp(2.6rem,6vw,5rem)] leading-[0.98] font-bold tracking-[-0.05em]"
          initial={reduce ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE }}
        >
          {title}
        </motion.h1>
        {subtitle ? (
          <p className="mt-6 max-w-xl text-lg text-[color:var(--hero-muted)]">{subtitle}</p>
        ) : null}
        <div className="mt-10 flex flex-wrap gap-3">
          <Button
            asChild
            size="lg"
            className="rounded-full bg-teal-500 text-white shadow-[0_0_40px_rgba(13,148,136,0.4)] hover:bg-cyan-400"
          >
            <Link href="#open-roles">
              View open roles
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="rounded-full border-[color:var(--hero-panel-border)] bg-[color:var(--hero-panel)] font-semibold text-[color:var(--hero-text)] backdrop-blur hover:border-[color:var(--color-accent)]/40"
          >
            <Link href="#hiring-process">Hiring process</Link>
          </Button>
        </div>
      </Container>
    </section>
  )
}

/** About — brand masthead with mesh atmosphere */
export function AboutPageHero({ title, subtitle }: BaseHero) {
  const reduce = useReducedMotion()
  const domains = [
    'Artificial Intelligence',
    'Data Science',
    'IT Consulting',
    'Healthcare Specialty',
  ]

  return (
    <MeshBackdrop className="pt-28 pb-20 lg:pt-36 lg:pb-28" interactive={false}>
      <Container>
        <div className="grid items-end gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-14">
          <div>
            <motion.p
              className="font-display text-2xl font-bold tracking-[-0.03em] text-[color:var(--color-accent)] sm:text-3xl"
              initial={reduce ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: EASE }}
            >
              Xelarvis
            </motion.p>
            <motion.p
              className="mt-3 text-[11px] font-bold tracking-[0.22em] text-[color:var(--color-accent)]/80 uppercase"
              initial={reduce ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.04, ease: EASE }}
            >
              About
            </motion.p>
            <motion.h1
              className="font-display mt-5 max-w-3xl text-[clamp(2.2rem,5vw,3.75rem)] leading-[1.05] font-bold tracking-[-0.045em] text-balance text-[color:var(--hero-text)]"
              initial={reduce ? false : { opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, delay: 0.08, ease: EASE }}
            >
              {title}
            </motion.h1>
            {subtitle ? (
              <motion.p
                className="mt-6 max-w-xl border-l-2 border-teal-400/60 pl-5 text-base leading-relaxed text-[color:var(--hero-muted)] sm:text-lg"
                initial={reduce ? false : { opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.14, ease: EASE }}
              >
                {subtitle}
              </motion.p>
            ) : null}
            <motion.div
              className="mt-8 flex flex-wrap gap-3"
              initial={reduce ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2, ease: EASE }}
            >
              <Button
                asChild
                size="lg"
                className="rounded-full bg-gradient-to-r from-teal-500 to-cyan-500 px-7 font-semibold text-white shadow-[0_0_32px_rgba(13,148,136,0.4)] hover:from-teal-400 hover:to-cyan-400"
              >
                <Link href="/contact">
                  Talk to us
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="rounded-full border-[color:var(--hero-panel-border)] bg-[color:var(--hero-panel)] px-7 font-semibold text-[color:var(--hero-text)] backdrop-blur hover:border-[color:var(--color-accent)]/40 hover:bg-[color:var(--color-hover)]"
              >
                <Link href="/about/our-approach">Our Approach</Link>
              </Button>
            </motion.div>
          </div>

          <motion.div
            className="relative overflow-hidden rounded-[28px] border border-[color:var(--hero-panel-border)] bg-[color:var(--hero-panel)] p-6 backdrop-blur-xl sm:p-7"
            initial={reduce ? false : { opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.65, delay: 0.18, ease: EASE }}
          >
            <p className="text-[10px] font-bold tracking-[0.16em] text-[color:var(--color-accent)] uppercase">
              What we do
            </p>
            <ul className="mt-5 space-y-3">
              {domains.map((d, i) => (
                <motion.li
                  key={d}
                  className="flex items-center gap-3 rounded-2xl border border-[color:var(--hero-panel-border)] bg-[color:var(--color-hover)] px-4 py-3 text-sm font-medium text-[color:var(--hero-text)]"
                  initial={reduce ? false : { opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.28 + i * 0.06, duration: 0.4, ease: EASE }}
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.8)]" />
                  {d}
                </motion.li>
              ))}
            </ul>
            <p className="mt-6 border-t border-[color:var(--hero-panel-border)] pt-5 text-xs leading-relaxed text-[color:var(--hero-muted)]">
              Discover → Strategize → Design → Build → Deploy → Optimize
            </p>
          </motion.div>
        </div>
      </Container>
    </MeshBackdrop>
  )
}

/** Insights — magazine masthead on navy mesh */
export function InsightsPageHero({ title, subtitle }: BaseHero) {
  const reduce = useReducedMotion()

  return (
    <MeshBackdrop className="pt-28 pb-16 lg:pt-36 lg:pb-20" interactive={false}>
      <Container>
        <div className="flex flex-wrap items-start justify-between gap-8">
          <div className="max-w-3xl">
            <motion.p
              className="font-display text-sm font-bold tracking-[0.08em] text-[color:var(--color-accent)]"
              initial={reduce ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: EASE }}
            >
              INSIGHTS · XELARVIS
            </motion.p>
            <motion.h1
              className="font-display mt-4 text-[clamp(2.4rem,5.5vw,4.5rem)] leading-[1] font-bold tracking-[-0.05em] text-balance text-[color:var(--hero-text)]"
              initial={reduce ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.06, ease: EASE }}
            >
              {title}
            </motion.h1>
          </div>
          {subtitle ? (
            <motion.p
              className="mt-2 max-w-xs text-sm leading-relaxed text-[color:var(--hero-muted)] lg:mt-12"
              initial={reduce ? false : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.12, ease: EASE }}
            >
              {subtitle}
            </motion.p>
          ) : null}
        </div>
        <div className="mt-12 h-px w-full bg-[color:var(--hero-panel-border)]" />
        <div className="mt-4 flex justify-between text-[10px] tracking-[0.16em] text-[color:var(--hero-muted)] uppercase">
          <span>Perspective</span>
          <span>AI · Clinical · Enterprise</span>
        </div>
      </Container>
    </MeshBackdrop>
  )
}
