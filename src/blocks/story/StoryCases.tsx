'use client'

import Link from 'next/link'
import {
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from 'framer-motion'
import { useEffect, useRef, useState, type MouseEvent } from 'react'

import { Container } from '@/components/layout/Container'

export type CaseMetric = { label: string; value: string }

export type CaseItem = {
  id: string
  title: string
  client: string
  outcome: string
  href: string
  challenge?: string | null
  industry?: string | null
  metrics?: CaseMetric[] | null
  technologies?: string[] | null
  timeline?: string | null
  solution?: string | null
}

type StoryCasesProps = {
  eyebrow?: string | null
  heading: string
  items: CaseItem[]
}

const KPI_BADGES = ['ROI Increased', 'Cost Reduced', 'Faster Deployment', 'AI Accuracy', 'Uptime']

const DEFAULT_TECH = ['Python', 'Azure', 'AI', 'Next.js', 'Cloud']

const EASE = [0.22, 1, 0.36, 1] as const

function enrichCase(
  item: CaseItem,
  index: number,
): Required<Pick<CaseItem, 'challenge' | 'solution' | 'industry' | 'timeline'>> &
  CaseItem & { metrics: CaseMetric[]; technologies: string[] } {
  const presets = [
    {
      industry: 'Healthcare',
      challenge: 'Hospitals lacked unified patient intelligence across clinical systems.',
      solution: 'AI-powered clinical analytics platform with governed data pipelines.',
      technologies: ['Python', 'Azure', 'AI', 'Power BI', 'CDISC'],
      timeline: '14 weeks',
      metrics: [
        { value: '98%', label: 'Prediction accuracy' },
        { value: '45%', label: 'Less manual effort' },
        { value: '3×', label: 'Faster reporting' },
      ],
    },
    {
      industry: 'Fintech',
      challenge: 'Legacy monolith limiting release velocity and compliance reporting.',
      solution: 'Cloud-native architecture with continuous delivery and audit-ready trails.',
      technologies: ['Next.js', 'Node.js', 'Kubernetes', 'AWS', 'Docker'],
      timeline: '20 weeks',
      metrics: [
        { value: '3×', label: 'Deployment speed' },
        { value: '70%', label: 'Infra cost down' },
        { value: '99.9%', label: 'Availability' },
      ],
    },
    {
      industry: 'Life sciences',
      challenge: 'Fragmented trial data slowing submission-ready analytics.',
      solution: 'Clinical data science stack aligned to SDTM/ADaM with automated QC.',
      technologies: ['SAS', 'Python', 'CDISC', 'Spark', 'Azure'],
      timeline: '18 weeks',
      metrics: [
        { value: '120M', label: 'Records processed' },
        { value: '40%', label: 'Ops efficiency' },
        { value: '2×', label: 'Faster cycles' },
      ],
    },
    {
      industry: 'Enterprise AI',
      challenge: 'Models impressed demos but stalled before regulated production.',
      solution: 'Grounded LLM workflows with evaluation, observability, and human oversight.',
      technologies: ['LangChain', 'OpenAI', 'Python', 'Docker', 'Cloud'],
      timeline: '12 weeks',
      metrics: [
        { value: '4×', label: 'Time to value' },
        { value: '99%', label: 'Eval pass rate' },
        { value: '24/7', label: 'Monitoring' },
      ],
    },
  ]

  const preset = presets[index % presets.length]
  return {
    ...item,
    industry: item.industry || preset.industry,
    challenge: item.challenge || preset.challenge,
    solution: item.solution || item.outcome || preset.solution,
    timeline: item.timeline || preset.timeline,
    metrics: item.metrics?.length ? item.metrics : preset.metrics,
    technologies: item.technologies?.length ? item.technologies : preset.technologies,
  }
}

function CountMetric({ value, active }: { value: string; active: boolean }) {
  const reduce = useReducedMotion()
  const numeric = Number.parseFloat(value.replace(/[^\d.]/g, ''))
  const isNumeric = Number.isFinite(numeric) && /^\d/.test(value.trim())
  const suffix = value.replace(/^[\d.]+/, '')
  const [n, setN] = useState(reduce || !isNumeric ? value : '0')

  useEffect(() => {
    if (!active || reduce || !isNumeric) {
      setN(value)
      return
    }
    let frame = 0
    const start = performance.now()
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / 1000)
      const eased = 1 - Math.pow(1 - t, 3)
      const current = numeric * eased
      const decimals = value.includes('.') ? 1 : 0
      setN(`${decimals ? current.toFixed(decimals) : Math.round(current)}${suffix}`)
      if (t < 1) frame = requestAnimationFrame(tick)
      else setN(value)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [active, value, reduce, isNumeric, numeric, suffix])

  return <span className="tabular-nums">{isNumeric ? n : value}</span>
}

function CaseVisual({ variant, accent }: { variant: number; accent: string }) {
  const reduce = useReducedMotion()
  const mode = variant % 4

  return (
    <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[24px] border border-[color:var(--hero-panel-border)] bg-[color:var(--color-neutral)] dark:border-white/12 dark:bg-[rgba(15,23,42,0.65)]">
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse 70% 60% at 30% 20%, ${accent}28, transparent 55%), radial-gradient(ellipse 50% 50% at 80% 80%, rgba(6,182,212,0.16), transparent 50%)`,
        }}
      />
      <svg viewBox="0 0 640 400" className="relative z-10 h-full w-full" aria-hidden>
        <defs>
          <linearGradient id={`case-grad-${variant}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0D9488" />
            <stop offset="100%" stopColor="#06B6D4" />
          </linearGradient>
        </defs>

        {mode === 0 ? (
          <>
            {/* Healthcare dashboard */}
            <rect
              x="40"
              y="40"
              width="560"
              height="320"
              rx="20"
              className="fill-white/70 stroke-[color:var(--hero-panel-border)] dark:fill-white/[0.04] dark:stroke-white/10"
              strokeWidth="1"
            />
            {[0, 1, 2].map((i) => (
              <motion.rect
                key={i}
                x={70 + i * 175}
                y="70"
                width="150"
                height="70"
                rx="14"
                className="fill-white dark:fill-white/[0.05]"
                stroke={accent}
                strokeOpacity={0.35}
                animate={reduce ? undefined : { y: [70, 66, 70] }}
                transition={{ duration: 3 + i * 0.4, repeat: Infinity }}
              />
            ))}
            {[40, 70, 55, 90, 65, 85, 50, 95].map((h, i) => (
              <motion.rect
                key={`b-${i}`}
                x={80 + i * 60}
                y={320 - h * 1.4}
                width="28"
                height={h * 1.4}
                rx="6"
                fill={`url(#case-grad-${variant})`}
                initial={{ scaleY: 0 }}
                whileInView={{ scaleY: 1 }}
                style={{ originY: 1 }}
                transition={{ delay: 0.1 + i * 0.05, duration: 0.7, ease: EASE }}
              />
            ))}
          </>
        ) : null}

        {mode === 1 ? (
          <>
            {/* Cloud architecture */}
            <motion.circle
              cx="320"
              cy="200"
              r="70"
              fill="rgba(13,148,136,0.15)"
              stroke={accent}
              animate={reduce ? undefined : { r: [65, 75, 65] }}
              transition={{ duration: 4, repeat: Infinity }}
            />
            {[0, 1, 2, 3, 4, 5].map((i) => {
              const a = (i / 6) * Math.PI * 2
              const x = Math.round((320 + Math.cos(a) * 140) * 10000) / 10000
              const y = Math.round((200 + Math.sin(a) * 100) * 10000) / 10000
              return (
                <g key={i}>
                  <line
                    x1="320"
                    y1="200"
                    x2={x}
                    y2={y}
                    stroke={`url(#case-grad-${variant})`}
                    strokeOpacity={0.45}
                  />
                  <motion.circle
                    cx={x}
                    cy={y}
                    r="14"
                    fill="var(--hero-panel)"
                    className="dark:fill-[#0F172A]"
                    stroke={accent}
                    animate={reduce ? undefined : { opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.15 }}
                  />
                </g>
              )
            })}
          </>
        ) : null}

        {mode === 2 ? (
          <>
            {/* AI graph / network */}
            {[
              [120, 100],
              [280, 80],
              [440, 110],
              [180, 220],
              [320, 200],
              [480, 230],
              [220, 320],
              [400, 310],
            ].map(([x, y], i, arr) => (
              <g key={i}>
                {i < arr.length - 1 ? (
                  <line
                    x1={x}
                    y1={y}
                    x2={arr[i + 1][0]}
                    y2={arr[i + 1][1]}
                    stroke={`url(#case-grad-${variant})`}
                    strokeWidth="1.5"
                    opacity={0.55}
                  />
                ) : null}
                <motion.circle
                  cx={x}
                  cy={y}
                  r="8"
                  fill="#06B6D4"
                  animate={reduce ? undefined : { scale: [1, 1.25, 1] }}
                  transition={{ duration: 2.2, repeat: Infinity, delay: i * 0.1 }}
                />
              </g>
            ))}
          </>
        ) : null}

        {mode === 3 ? (
          <>
            {/* Workflow / digital twin */}
            {[0, 1, 2, 3].map((i) => (
              <motion.rect
                key={i}
                x={70 + i * 135}
                y="140"
                width="110"
                height="120"
                rx="18"
                fill="rgba(255,255,255,0.85)"
                className="dark:fill-white/[0.05]"
                stroke={accent}
                strokeOpacity={0.4}
                initial={{ y: 160, opacity: 0 }}
                whileInView={{ y: 140, opacity: 1 }}
                transition={{ delay: i * 0.1, duration: 0.55, ease: EASE }}
              />
            ))}
            {[0, 1, 2].map((i) => (
              <motion.path
                key={`p-${i}`}
                d={`M${180 + i * 135} 200 H${205 + i * 135}`}
                stroke="#22D3EE"
                strokeWidth="2"
                strokeDasharray="4 6"
                animate={reduce ? undefined : { strokeDashoffset: [0, -20] }}
                transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
              />
            ))}
          </>
        ) : null}
      </svg>
    </div>
  )
}

function ProjectPanel({ item, index }: { item: ReturnType<typeof enrichCase>; index: number }) {
  const reduce = useReducedMotion()
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { amount: 0.45, once: false })
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const rx = useSpring(useTransform(my, [-0.5, 0.5], [4, -4]), { stiffness: 120, damping: 18 })
  const ry = useSpring(useTransform(mx, [-0.5, 0.5], [-5, 5]), { stiffness: 120, damping: 18 })
  const accent = index % 2 === 0 ? '#0D9488' : '#06B6D4'

  const onMove = (e: MouseEvent<HTMLElement>) => {
    if (reduce) return
    const rect = e.currentTarget.getBoundingClientRect()
    mx.set((e.clientX - rect.left) / rect.width - 0.5)
    my.set((e.clientY - rect.top) / rect.height - 0.5)
  }

  const onLeave = () => {
    mx.set(0)
    my.set(0)
  }

  return (
    <motion.article
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={reduce ? undefined : { rotateX: rx, rotateY: ry, transformPerspective: 1200 }}
      initial={reduce ? false : { opacity: 0, y: 48 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.7, ease: EASE }}
      className="relative mb-10 overflow-hidden rounded-[28px] border border-[color:var(--hero-panel-border)] bg-[color:var(--hero-panel)] p-5 shadow-[var(--shadow-floating)] backdrop-blur-xl last:mb-0 sm:p-7 lg:min-h-[85vh] lg:p-8 dark:border-white/12 dark:bg-white/[0.04] dark:shadow-[0_30px_100px_rgba(0,0,0,0.35)]"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-80"
        style={{
          background: `linear-gradient(145deg, ${accent}18, transparent 42%)`,
        }}
      />

      <div className="relative flex flex-wrap items-center gap-3">
        <span className="rounded-full border border-[color:var(--color-accent)]/40 bg-[color:var(--color-accent-soft)] px-3 py-1 text-[10px] font-bold tracking-[0.16em] text-[color:var(--color-accent)] uppercase">
          {item.industry}
        </span>
        <span className="text-sm text-[color:var(--hero-muted)]">{item.client}</span>
        {item.timeline ? (
          <span className="ml-auto text-[11px] tracking-wide text-[color:var(--color-accent)]/80 uppercase">
            {item.timeline}
          </span>
        ) : null}
      </div>

      <h3 className="font-display relative mt-5 text-[clamp(1.6rem,3vw,2.5rem)] font-semibold tracking-[-0.035em] text-balance text-[color:var(--hero-text)]">
        {item.title}
      </h3>

      <div className="relative mt-6">
        <CaseVisual variant={index} accent={accent} />
      </div>

      <div className="relative mt-8 grid gap-6 lg:grid-cols-2">
        <div>
          <p className="text-[10px] font-bold tracking-[0.18em] text-[color:var(--color-accent)] uppercase">
            Challenge
          </p>
          <p className="mt-2 text-sm leading-relaxed text-[color:var(--hero-muted)]">
            {item.challenge}
          </p>
        </div>
        <div>
          <p className="text-[10px] font-bold tracking-[0.18em] text-[color:var(--color-accent)] uppercase">
            Our solution
          </p>
          <p className="mt-2 text-sm leading-relaxed text-[color:var(--hero-muted)]">
            {item.solution}
          </p>
        </div>
      </div>

      <div className="relative mt-8">
        <p className="text-[10px] font-bold tracking-[0.18em] text-[color:var(--hero-muted)] uppercase">
          Business impact
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {item.metrics.slice(0, 3).map((m) => (
            <div
              key={`${m.label}-${m.value}`}
              className="rounded-2xl border border-[color:var(--hero-panel-border)] bg-[color:var(--color-hover)] px-4 py-4 dark:border-white/10 dark:bg-white/[0.05]"
            >
              <p className="font-display text-2xl font-bold tracking-[-0.04em] text-[color:var(--hero-text)] sm:text-3xl">
                <CountMetric value={m.value} active={inView} />
              </p>
              <p className="mt-1 text-xs text-[color:var(--hero-muted)]">{m.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="relative mt-8 flex flex-wrap items-center gap-2">
        <p className="mr-2 text-[10px] font-bold tracking-[0.16em] text-[color:var(--hero-muted)] uppercase">
          Technology
        </p>
        {(item.technologies.length ? item.technologies : DEFAULT_TECH).map((tech, i) => (
          <motion.span
            key={tech}
            className="rounded-full border border-[color:var(--hero-panel-border)] bg-[color:var(--hero-panel)] px-3 py-1 text-xs font-medium text-[color:var(--hero-text)] dark:border-white/15 dark:bg-white/[0.06] dark:text-slate-200"
            animate={
              reduce
                ? undefined
                : inView
                  ? {
                      opacity: [0.7, 1, 0.7],
                      borderColor: [
                        'var(--hero-panel-border)',
                        `${accent}66`,
                        'var(--hero-panel-border)',
                      ],
                    }
                  : {}
            }
            transition={{ duration: 2.8, repeat: Infinity, delay: i * 0.15 }}
          >
            {tech}
          </motion.span>
        ))}
      </div>

      <Link
        href={item.href}
        className="relative mt-8 inline-flex text-sm font-semibold text-[color:var(--color-accent)] underline-offset-4 hover:underline"
      >
        Read the full story →
      </Link>
    </motion.article>
  )
}

export function StoryCases({ eyebrow = 'Success stories', heading, items }: StoryCasesProps) {
  const reduce = useReducedMotion()
  const stories = items.map((item, i) => enrichCase(item, i))

  if (!stories.length) return null

  return (
    <section className="surface-navy relative overflow-hidden bg-[color:var(--hero-bg)] py-24 text-[color:var(--hero-text)] lg:py-32">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_15%_20%,rgba(13,148,136,0.22),transparent_55%),radial-gradient(ellipse_60%_45%_at_90%_70%,rgba(6,182,212,0.18),transparent_50%)]"
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute top-20 right-10 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(6,182,212,0.25),transparent_70%)] blur-3xl"
        animate={reduce ? undefined : { opacity: [0.35, 0.65, 0.35], y: [0, 24, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
          backgroundSize: '64px 64px',
          maskImage: 'radial-gradient(ellipse at center, black 25%, transparent 75%)',
        }}
      />

      <Container className="relative z-10">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.25fr)] lg:gap-14 xl:gap-16">
          {/* LEFT sticky */}
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <p className="text-[11px] font-bold tracking-[0.22em] text-[color:var(--color-accent)] uppercase">
              {eyebrow}
            </p>
            <motion.h2
              className="font-display mt-5 max-w-md text-[clamp(2rem,4vw,3.4rem)] leading-[1.05] font-bold tracking-[-0.045em] text-balance text-[color:var(--hero-text)]"
              initial={reduce ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: EASE }}
            >
              {heading || 'Engineering solutions that deliver measurable outcomes.'}
            </motion.h2>
            <p className="mt-5 max-w-md text-base leading-relaxed text-[color:var(--hero-muted)]">
              Complex transformation programs across healthcare, AI, and enterprise platforms —
              designed for regulated reality, not demos.
            </p>

            <div className="mt-8 flex flex-wrap gap-2">
              {KPI_BADGES.map((badge, i) => (
                <motion.span
                  key={badge}
                  className="rounded-full border border-[color:var(--hero-panel-border)] bg-[color:var(--hero-panel)] px-3 py-1.5 text-[11px] font-medium text-[color:var(--hero-text)] shadow-[var(--shadow-light)] dark:border-white/12 dark:bg-white/[0.05] dark:text-slate-200 dark:shadow-none"
                  initial={reduce ? false : { opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.05 * i, duration: 0.45 }}
                >
                  {badge}
                </motion.span>
              ))}
            </div>

            <Link
              href="/case-studies"
              className="mt-10 inline-flex items-center gap-2 rounded-full border border-[color:var(--color-accent)]/40 bg-[color:var(--color-accent-soft)] px-5 py-2.5 text-sm font-semibold text-[color:var(--color-accent)] transition-colors hover:bg-[color:var(--color-hover)] dark:border-cyan-400/40 dark:bg-cyan-400/10 dark:text-cyan-200 dark:hover:bg-cyan-400/20 dark:hover:text-white"
            >
              View all case studies
              <span aria-hidden>→</span>
            </Link>

            <ol className="mt-12 hidden space-y-3 lg:block">
              {stories.map((s, i) => (
                <li
                  key={s.id}
                  className="border-l-2 border-[color:var(--hero-panel-border)] pl-3 text-sm text-[color:var(--hero-muted)]"
                >
                  <span className="font-display text-xs tracking-wide text-[color:var(--color-accent)]/80">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="mt-0.5 block truncate text-[color:var(--hero-muted)]">
                    {s.title}
                  </span>
                </li>
              ))}
            </ol>
          </aside>

          {/* RIGHT scroll stack */}
          <div>
            {stories.map((story, index) => (
              <ProjectPanel key={story.id} item={story} index={index} />
            ))}
          </div>
        </div>
      </Container>
    </section>
  )
}
