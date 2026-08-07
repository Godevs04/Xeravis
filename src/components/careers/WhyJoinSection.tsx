'use client'

import Link from 'next/link'
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useInView,
} from 'framer-motion'
import {
  ArrowRight,
  Brain,
  Cloud,
  Cpu,
  FlaskConical,
  Globe2,
  GraduationCap,
  HeartHandshake,
  Rocket,
  Users,
  type LucideIcon,
} from 'lucide-react'
import { useEffect, useMemo, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react'

import { Container } from '@/components/layout/Container'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type WhyJoinSectionProps = {
  benefits: readonly string[]
}

const EASE = [0.22, 1, 0.36, 1] as const

const CULTURE_STATS = [
  { value: 120, suffix: '+', label: 'Engineers' },
  { value: 18, suffix: '+', label: 'Countries' },
  { value: 95, suffix: '%', label: 'Employee Satisfaction' },
  { value: 500, suffix: '+', label: 'Projects Delivered' },
] as const

const JOURNEY = ['Join', 'Learn', 'Build', 'Lead', 'Innovate'] as const

const CARD_META: {
  match: RegExp
  icon: LucideIcon
  description: string
  accent: string
  featured?: boolean
}[] = [
  {
    match: /ai|healthcare project/i,
    icon: Brain,
    description: 'Ship real clinical intelligence — not demos that fade after the pitch.',
    accent: '#0D9488',
    featured: true,
  },
  {
    match: /research/i,
    icon: FlaskConical,
    description: 'Curiosity is a craft. Experiment, publish, and put findings into production.',
    accent: '#06B6D4',
  },
  {
    match: /learning|certification/i,
    icon: GraduationCap,
    description: 'Budgets and time for certifications, courses, and deep technical craft.',
    accent: '#14B8A6',
  },
  {
    match: /flexible/i,
    icon: Cloud,
    description: 'Work styles that respect deep focus — remote-friendly, outcome-driven.',
    accent: '#22D3EE',
  },
  {
    match: /global/i,
    icon: Globe2,
    description: 'Collaborate across time zones with teams solving regulated, real-world problems.',
    accent: '#0D9488',
  },
  {
    match: /career|mentorship/i,
    icon: Rocket,
    description: 'Mentorship paths from contributor to technical lead — with clear milestones.',
    accent: '#06B6D4',
    featured: true,
  },
  {
    match: /modern|technolog/i,
    icon: Cpu,
    description: 'Next.js, React, AI stacks, cloud, and Kubernetes — tools worthy of the work.',
    accent: '#10B981',
  },
  {
    match: /inclusive/i,
    icon: HeartHandshake,
    description: 'Diverse voices, psychological safety, and teams that ship with respect.',
    accent: '#0D9488',
  },
]

const HEADING_LINES = [
  'Build the future of AI Research,',
  'Healthcare Intelligence &',
  'Enterprise Consulting.',
]

function metaForBenefit(title: string) {
  const found = CARD_META.find((m) => m.match.test(title))
  return (
    found ?? {
      icon: Users,
      description: 'A workplace built for people who care about craft and impact.',
      accent: '#0D9488',
      featured: false,
    }
  )
}

function CountUp({ value, suffix, active }: { value: number; suffix: string; active: boolean }) {
  const reduce = useReducedMotion()
  const [n, setN] = useState(reduce ? value : 0)

  useEffect(() => {
    if (!active) {
      setN(reduce ? value : 0)
      return
    }
    if (reduce) {
      setN(value)
      return
    }
    let frame = 0
    const start = performance.now()
    const duration = 1100
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration)
      const eased = 1 - Math.pow(1 - t, 3)
      setN(Math.round(value * eased))
      if (t < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [active, value, reduce])

  return (
    <span className="tabular-nums">
      {n}
      {suffix}
    </span>
  )
}

function BenefitCard({
  title,
  index,
  reduce,
}: {
  title: string
  index: number
  reduce: boolean | null
}) {
  const meta = metaForBenefit(title)
  const Icon = meta.icon
  const mx = useMotionValue(50)
  const my = useMotionValue(40)
  const glow = useMotionTemplate`radial-gradient(420px circle at ${mx}% ${my}%, ${meta.accent}33, transparent 55%)`

  const onMove = (e: ReactPointerEvent<HTMLElement>) => {
    if (reduce) return
    const rect = e.currentTarget.getBoundingClientRect()
    mx.set(((e.clientX - rect.left) / rect.width) * 100)
    my.set(((e.clientY - rect.top) / rect.height) * 100)
  }

  return (
    <motion.article
      className={cn(
        'group relative z-0 h-full overflow-hidden rounded-[24px] border border-[color:var(--glass-border)]',
        'bg-[color:var(--glass-bg-strong)] shadow-[var(--shadow-medium)] backdrop-blur-xl',
        'transition-[box-shadow,border-color,z-index] duration-300',
        'hover:z-10 hover:border-[color:var(--color-accent)] hover:shadow-[var(--shadow-hover)]',
        meta.featured && 'sm:col-span-2',
      )}
      initial={reduce ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-6% 0px' }}
      transition={{ duration: 0.5, delay: 0.05 * index, ease: EASE }}
      whileHover={reduce ? undefined : { y: -6, transition: { duration: 0.25, ease: EASE } }}
      onPointerMove={onMove}
      onPointerLeave={() => {
        mx.set(50)
        my.set(40)
      }}
    >
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: glow }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-10 -right-8 h-28 w-28 rounded-full blur-2xl"
        style={{ background: `radial-gradient(circle, ${meta.accent}40, transparent 70%)` }}
      />
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[color:var(--color-secondary-accent)] to-transparent opacity-60"
      />

      <div
        className={cn(
          'relative flex h-full flex-col p-5 sm:p-6',
          meta.featured
            ? 'min-h-[10.5rem] sm:min-h-[11rem] sm:flex-row sm:items-start sm:gap-6'
            : 'min-h-[11rem]',
        )}
      >
        <div
          className={cn(
            'flex items-start justify-between gap-3',
            meta.featured && 'sm:flex-col sm:items-start',
          )}
        >
          <motion.span
            className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl border border-[color:var(--glass-border)] bg-[color:var(--glass-bg)] text-[color:var(--color-accent)] shadow-[0_0_24px_var(--color-accent-soft)]"
            animate={reduce ? undefined : { y: [0, -4, 0] }}
            transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut', delay: index * 0.2 }}
            whileHover={reduce ? undefined : { rotate: 8, scale: 1.06 }}
          >
            <Icon className="h-5 w-5" strokeWidth={1.75} />
          </motion.span>
          <span
            className="font-display text-[10px] font-bold tracking-[0.16em] uppercase sm:ml-auto"
            style={{ color: meta.accent }}
          >
            {String(index + 1).padStart(2, '0')}
          </span>
        </div>

        <div className={cn(meta.featured && 'sm:min-w-0 sm:flex-1')}>
          <h3 className="font-display mt-4 text-lg font-semibold tracking-tight text-[color:var(--color-primary)] sm:text-xl">
            {title}
          </h3>
          <p className="mt-2 max-w-prose text-sm leading-relaxed text-[color:var(--color-secondary)]">
            {meta.description}
          </p>

          <span className="mt-5 inline-flex items-center gap-1.5 text-xs font-semibold text-[color:var(--color-accent)]">
            Explore culture
            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
          </span>
        </div>
      </div>
    </motion.article>
  )
}

export function WhyJoinSection({ benefits }: WhyJoinSectionProps) {
  const reduce = useReducedMotion()
  const statsRef = useRef<HTMLDivElement>(null)
  const statsInView = useInView(statsRef, { once: true, margin: '-10% 0px' })
  const cards = useMemo(() => benefits.map((title, i) => ({ title, i })), [benefits])

  return (
    <section className="relative overflow-hidden bg-[color:var(--color-neutral)] py-20 sm:py-24 lg:py-32">
      {/* Atmosphere */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_8%_20%,rgba(13,148,136,0.14),transparent_55%),radial-gradient(ellipse_55%_45%_at_92%_75%,rgba(6,182,212,0.12),transparent_50%),linear-gradient(180deg,#FFFFFF_0%,#F8FAFC_45%,#FFFFFF_100%)] dark:bg-[radial-gradient(ellipse_70%_55%_at_8%_20%,rgba(13,148,136,0.18),transparent_55%),radial-gradient(ellipse_55%_45%_at_92%_75%,rgba(6,182,212,0.14),transparent_50%),linear-gradient(180deg,#020617_0%,#0f172a_50%,#020617_100%)]"
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -top-24 left-[15%] h-[26rem] w-[26rem] rounded-full bg-[radial-gradient(circle,rgba(13,148,136,0.28),transparent_70%)] blur-3xl"
        animate={reduce ? undefined : { x: [0, 36, 0], y: [0, 22, 0], opacity: [0.45, 0.7, 0.45] }}
        transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute right-[5%] bottom-0 h-[22rem] w-[22rem] rounded-full bg-[radial-gradient(circle,rgba(6,182,212,0.22),transparent_70%)] blur-3xl"
        animate={
          reduce ? undefined : { x: [0, -28, 0], y: [0, -18, 0], opacity: [0.35, 0.6, 0.35] }
        }
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.045]"
        style={{
          backgroundImage:
            'linear-gradient(var(--grid-line) 1px, transparent 1px), linear-gradient(90deg, var(--grid-line) 1px, transparent 1px)',
          backgroundSize: '64px 64px',
          maskImage: 'radial-gradient(ellipse 75% 65% at 50% 40%, black, transparent)',
        }}
      />
      <div aria-hidden className="noise-overlay opacity-[0.035]" />
      {!reduce
        ? Array.from({ length: 12 }).map((_, i) => (
            <motion.span
              key={i}
              aria-hidden
              className="pointer-events-none absolute h-1 w-1 rounded-full bg-teal-500/40"
              style={{
                left: `${8 + ((i * 17) % 84)}%`,
                top: `${12 + ((i * 23) % 76)}%`,
              }}
              animate={{ y: [0, -14, 0], opacity: [0.15, 0.65, 0.15] }}
              transition={{
                duration: 4 + (i % 5),
                repeat: Infinity,
                delay: i * 0.22,
                ease: 'easeInOut',
              }}
            />
          ))
        : null}

      <Container className="relative z-10">
        <div className="grid items-start gap-12 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.18fr)] lg:gap-14 xl:gap-16">
          {/* LEFT */}
          <div className="lg:sticky lg:top-28 lg:self-start">
            <motion.p
              className="text-[11px] font-bold tracking-[0.22em] text-[color:var(--color-accent)] uppercase"
              initial={reduce ? false : { opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: EASE }}
            >
              Why Join XELARVIS
            </motion.p>

            <h2 className="font-display mt-5 max-w-xl text-[clamp(2rem,4.2vw,3.35rem)] leading-[1.05] font-bold tracking-[-0.045em] text-[color:var(--color-primary)]">
              {HEADING_LINES.map((line, i) => (
                <motion.span
                  key={line}
                  className="block"
                  initial={reduce ? false : { opacity: 0, y: 22 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.55, delay: 0.08 + i * 0.1, ease: EASE }}
                >
                  {line}
                </motion.span>
              ))}
            </h2>

            <motion.p
              className="mt-6 max-w-md text-base leading-relaxed text-[color:var(--color-secondary)]"
              initial={reduce ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: 0.35, ease: EASE }}
            >
              An AI-first culture where research, regulated healthcare delivery, and cloud craft
              live in the same room — with mentorship, modern stacks, and work that compounds.
            </motion.p>

            <motion.div
              className="mt-8 flex flex-wrap gap-3"
              initial={reduce ? false : { opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.42, ease: EASE }}
            >
              <Button
                asChild
                size="lg"
                className="rounded-full bg-[color:var(--color-accent)] px-7 font-semibold text-white shadow-[var(--shadow-hover)] hover:bg-[color:var(--color-accent-hover)]"
              >
                <Link href="#open-roles">
                  View Open Positions
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="rounded-full border-[color:var(--glass-border)] bg-[color:var(--glass-bg)] px-7 font-semibold text-[color:var(--color-primary)] backdrop-blur hover:border-[color:var(--color-accent)] hover:bg-[color:var(--color-hover)]"
              >
                <Link href="/about/leadership">Meet Our Team</Link>
              </Button>
            </motion.div>

            {/* Culture stats */}
            <div ref={statsRef} className="mt-12">
              <p className="text-[10px] font-bold tracking-[0.16em] text-[color:var(--color-muted)] uppercase">
                Our Culture
              </p>
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
                {CULTURE_STATS.map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    className="rounded-2xl border border-[color:var(--glass-border)] bg-[color:var(--glass-bg)] px-3 py-3.5 backdrop-blur-md"
                    initial={reduce ? false : { opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.05 * i, duration: 0.45, ease: EASE }}
                  >
                    <p className="font-display text-xl font-bold tracking-tight text-[color:var(--color-primary)] sm:text-2xl">
                      <CountUp value={stat.value} suffix={stat.suffix} active={statsInView} />
                    </p>
                    <p className="mt-1 text-[10px] leading-snug tracking-wide text-[color:var(--color-muted)] uppercase">
                      {stat.label}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT — benefit cards */}
          <div>
            <div className="grid auto-rows-fr grid-cols-1 gap-4 sm:grid-cols-2">
              {cards.map(({ title, i }) => (
                <BenefitCard key={title} title={title} index={i} reduce={reduce} />
              ))}
            </div>
          </div>
        </div>

        {/* Career journey */}
        <motion.div
          className="relative mt-16 overflow-hidden rounded-[28px] border border-[color:var(--glass-border)] bg-[color:var(--glass-bg)] p-6 shadow-[var(--shadow-medium)] backdrop-blur-xl sm:mt-20 sm:p-8"
          initial={reduce ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-8% 0px' }}
          transition={{ duration: 0.6, ease: EASE }}
        >
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_80%_at_0%_50%,rgba(13,148,136,0.1),transparent_55%),radial-gradient(ellipse_50%_70%_at_100%_50%,rgba(6,182,212,0.08),transparent_50%)]"
          />
          <p className="relative text-[10px] font-bold tracking-[0.16em] text-[color:var(--color-accent)] uppercase">
            Career journey
          </p>
          <ol className="relative mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-2">
            {JOURNEY.map((stage, i) => (
              <li
                key={stage}
                className="relative flex flex-1 items-center gap-3 sm:flex-col sm:gap-3"
              >
                <motion.span
                  className="font-display grid h-11 w-11 shrink-0 place-items-center rounded-full border border-teal-500/40 bg-gradient-to-br from-teal-500/20 to-cyan-400/10 text-sm font-bold text-[color:var(--color-accent)] shadow-[0_0_24px_var(--color-accent-soft)]"
                  initial={reduce ? false : { scale: 0.7, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.45, ease: EASE }}
                >
                  {String(i + 1).padStart(2, '0')}
                </motion.span>
                <motion.span
                  className="font-display text-base font-semibold tracking-tight text-[color:var(--color-primary)] sm:text-center"
                  initial={reduce ? false : { opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.05 + i * 0.08, duration: 0.4, ease: EASE }}
                >
                  {stage}
                </motion.span>
                {i < JOURNEY.length - 1 ? (
                  <span
                    aria-hidden
                    className="absolute top-5 right-0 hidden h-px w-[calc(100%-2.75rem)] translate-x-1/2 bg-gradient-to-r from-teal-500/50 to-cyan-400/30 sm:block"
                  />
                ) : null}
                {i < JOURNEY.length - 1 ? (
                  <span
                    aria-hidden
                    className="ml-4 h-6 w-px bg-gradient-to-b from-teal-500/50 to-transparent sm:hidden"
                  />
                ) : null}
              </li>
            ))}
          </ol>
        </motion.div>
      </Container>
    </section>
  )
}
