'use client'

import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'framer-motion'
import { useMemo, useRef, useState } from 'react'

import { Container } from '@/components/layout/Container'
import { useMediaQuery, useMounted } from '@/hooks/useMediaQuery'
import { cn } from '@/lib/utils'

type Step = { title: string; description: string }

type StoryProcessProps = {
  eyebrow?: string | null
  heading: string
  steps?: Step[] | null
}

type JourneyStage = {
  title: string
  description: string
  items: string[]
  transitionLabel: string
  visual: 'problem' | 'discovery' | 'architecture' | 'development' | 'cloud' | 'results'
  metrics?: { label: string; trend: 'up' | 'down' }[]
}

/** Canonical XELARVIS Delivery Framework (6 steps) */
const JOURNEY: JourneyStage[] = [
  {
    title: 'Discover',
    description:
      'Understand the business problem, stakeholders, constraints, and success criteria.',
    items: ['Stakeholders', 'Constraints', 'Success criteria'],
    transitionLabel: 'Strategy begins',
    visual: 'problem',
  },
  {
    title: 'Strategize',
    description: 'Define the AI, data and technology roadmap aligned to outcomes and readiness.',
    items: ['Roadmap', 'Priorities', 'Readiness'],
    transitionLabel: 'Design begins',
    visual: 'discovery',
  },
  {
    title: 'Design',
    description: 'Architect scalable solutions, data flows, governance, and delivery plans.',
    items: ['Architecture', 'Governance', 'Delivery plan'],
    transitionLabel: 'Build begins',
    visual: 'architecture',
  },
  {
    title: 'Build',
    description: 'Develop models, platforms, and applications with quality and security built in.',
    items: ['Models', 'Platforms', 'Applications'],
    transitionLabel: 'Deploy begins',
    visual: 'development',
  },
  {
    title: 'Deploy',
    description: 'Ship to production with monitoring, documentation, and operational readiness.',
    items: ['Production', 'Monitoring', 'Documentation'],
    transitionLabel: 'Optimize begins',
    visual: 'cloud',
  },
  {
    title: 'Optimize',
    description:
      'Measure outcomes, refine performance, and expand what works across the organization.',
    items: ['Outcomes', 'Performance', 'Expansion'],
    transitionLabel: 'Journey complete',
    visual: 'results',
    metrics: [
      { label: 'Outcomes', trend: 'up' },
      { label: 'Performance', trend: 'up' },
      { label: 'Adoption', trend: 'up' },
    ],
  },
]

const EASE = [0.22, 1, 0.36, 1] as const

function mergeWithCms(steps?: Step[] | null): JourneyStage[] {
  if (!steps?.length) return JOURNEY
  // Prefer canonical journey; overlay CMS titles/descriptions when counts align
  if (steps.length === JOURNEY.length) {
    return JOURNEY.map((stage, i) => ({
      ...stage,
      title: steps[i]?.title || stage.title,
      description: steps[i]?.description || stage.description,
    }))
  }
  // Map by keyword when CMS has fewer/different steps
  return JOURNEY
}

function StageVisual({
  visual,
  active,
  reduce,
}: {
  visual: JourneyStage['visual']
  active: boolean
  reduce: boolean | null
}) {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[24rem]">
      {/* Premium frame — soft glass, teal edge light, theme-safe */}
      <div
        aria-hidden
        className="absolute inset-[5%] rounded-[32px] bg-gradient-to-br from-[color:var(--color-accent)]/25 via-transparent to-[color:var(--color-accent-light)]/20 p-px"
      >
        <div className="relative h-full w-full overflow-hidden rounded-[31px] border border-[color:var(--glass-border)] bg-[color:var(--glass-bg-strong)] shadow-[var(--shadow-large)] backdrop-blur-2xl">
          <div
            className="absolute inset-0 opacity-[0.35]"
            style={{
              backgroundImage:
                'linear-gradient(var(--grid-line) 1px, transparent 1px), linear-gradient(90deg, var(--grid-line) 1px, transparent 1px)',
              backgroundSize: '28px 28px',
              maskImage: 'radial-gradient(ellipse at center, black 40%, transparent 85%)',
            }}
          />
          <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-[color:var(--color-accent)]/50 to-transparent" />
          <div className="absolute top-5 left-5 h-2.5 w-2.5 rounded-full border border-[color:var(--color-accent)]/40" />
          <div className="absolute top-5 right-5 h-2.5 w-2.5 rounded-full border border-[color:var(--color-accent)]/40" />
          <div className="absolute bottom-5 left-5 h-2.5 w-2.5 rounded-full border border-[color:var(--color-accent)]/40" />
          <div className="absolute right-5 bottom-5 h-2.5 w-2.5 rounded-full border border-[color:var(--color-accent)]/40" />
        </div>
      </div>

      <svg
        viewBox="0 0 400 400"
        className="relative z-10 h-full w-full p-7 text-[color:var(--color-primary)]"
        aria-hidden
      >
        <defs>
          <linearGradient id="xe-journey-line" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0D9488" />
            <stop offset="100%" stopColor="#06B6D4" />
          </linearGradient>
          <linearGradient id="xe-journey-fill" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#0D9488" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#06B6D4" stopOpacity="0.06" />
          </linearGradient>
          <filter id="xe-journey-glow">
            <feGaussianBlur stdDeviation="2.2" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <AnimatePresence mode="wait">
          {visual === 'problem' ? (
            <motion.g
              key="problem"
              initial={{ opacity: 0 }}
              animate={{ opacity: active ? 1 : 0.45 }}
              exit={{ opacity: 0 }}
            >
              {/* Constraint pulse rings */}
              {[0, 1, 2].map((i) => (
                <motion.circle
                  key={`ring-${i}`}
                  cx="200"
                  cy="175"
                  r={48 + i * 28}
                  fill="none"
                  stroke="url(#xe-journey-line)"
                  strokeWidth={1}
                  strokeOpacity={0.28 - i * 0.06}
                  animate={
                    reduce
                      ? undefined
                      : { r: [48 + i * 28, 56 + i * 28, 48 + i * 28], opacity: [0.2, 0.55, 0.2] }
                  }
                  transition={{ duration: 3.2 + i * 0.4, repeat: Infinity, ease: 'easeInOut' }}
                />
              ))}
              <motion.circle
                cx="200"
                cy="175"
                r="34"
                fill="url(#xe-journey-fill)"
                stroke="#0D9488"
                strokeWidth={1.6}
                animate={reduce ? undefined : { scale: [1, 1.04, 1] }}
                transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
                style={{ originX: '200px', originY: '175px' }}
              />
              <text
                x="200"
                y="180"
                textAnchor="middle"
                fill="currentColor"
                fontSize="13"
                fontFamily="var(--font-display), system-ui"
                fontWeight="700"
              >
                Problem
              </text>
              {/* Friction nodes around the core */}
              {[
                { x: 110, y: 100, label: 'Stake' },
                { x: 290, y: 100, label: 'Data' },
                { x: 200, y: 290, label: 'Gap' },
              ].map((n, i) => (
                <g key={n.label}>
                  <motion.line
                    x1="200"
                    y1="175"
                    x2={n.x}
                    y2={n.y}
                    stroke="url(#xe-journey-line)"
                    strokeWidth={1.2}
                    strokeDasharray="4 6"
                    opacity={0.45}
                    animate={reduce ? undefined : { strokeDashoffset: [0, -20] }}
                    transition={{ duration: 2.2, repeat: Infinity, ease: 'linear', delay: i * 0.2 }}
                  />
                  <motion.circle
                    cx={n.x}
                    cy={n.y}
                    r="18"
                    fill="var(--glass-bg-strong, #fff)"
                    stroke="#0D9488"
                    strokeWidth={1.4}
                    strokeOpacity={0.55}
                    animate={reduce ? undefined : { opacity: [0.65, 1, 0.65] }}
                    transition={{ duration: 2.4, repeat: Infinity, delay: i * 0.25 }}
                  />
                  <text
                    x={n.x}
                    y={n.y + 4}
                    textAnchor="middle"
                    fill="currentColor"
                    fontSize="9"
                    fontWeight="600"
                    opacity={0.8}
                  >
                    {n.label}
                  </text>
                </g>
              ))}
            </motion.g>
          ) : null}

          {visual === 'discovery' ? (
            <motion.g
              key="discovery"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Centered discovery flow — matches cloud fit treatment */}
              <rect
                x="78"
                y="92"
                width="244"
                height="216"
                rx="22"
                fill="url(#xe-journey-fill)"
                stroke="#0D9488"
                strokeWidth={1.2}
                strokeOpacity={0.28}
              />
              {['Stakeholders', 'Research', 'Workshops'].map((label, i) => {
                const rowY = 112 + i * 62
                const isActive = i === 1
                return (
                  <motion.g
                    key={label}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.12, duration: 0.45, ease: EASE }}
                  >
                    <rect
                      x="96"
                      y={rowY}
                      width="208"
                      height="48"
                      rx="14"
                      fill={
                        isActive
                          ? 'color-mix(in srgb, #0D9488 16%, transparent)'
                          : 'var(--glass-bg-strong, #fff)'
                      }
                      stroke={isActive ? '#0D9488' : 'color-mix(in srgb, #0D9488 28%, transparent)'}
                      strokeWidth={isActive ? 1.6 : 1.2}
                    />
                    <motion.circle
                      cx="120"
                      cy={rowY + 24}
                      r="7"
                      fill={isActive ? '#06B6D4' : '#0D9488'}
                      filter="url(#xe-journey-glow)"
                      animate={reduce ? undefined : { opacity: [0.55, 1, 0.55] }}
                      transition={{ duration: 2, repeat: Infinity, delay: i * 0.18 }}
                    />
                    <text
                      x="140"
                      y={rowY + 20}
                      fill="currentColor"
                      fontSize="9"
                      fontWeight="600"
                      letterSpacing="0.12em"
                      opacity={0.5}
                    >
                      {String(i + 1).padStart(2, '0')}
                    </text>
                    <text
                      x="140"
                      y={rowY + 36}
                      fill="currentColor"
                      fontSize="13"
                      fontFamily="var(--font-sans), system-ui"
                      fontWeight="600"
                    >
                      {label}
                    </text>
                    {i < 2 ? (
                      <line
                        x1="200"
                        y1={rowY + 48}
                        x2="200"
                        y2={rowY + 62}
                        stroke="url(#xe-journey-line)"
                        strokeWidth={1.5}
                        strokeOpacity={0.45}
                      />
                    ) : null}
                  </motion.g>
                )
              })}
            </motion.g>
          ) : null}

          {visual === 'architecture' ? (
            <motion.g
              key="arch"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Hub + orbit blueprint */}
              <motion.circle
                cx="200"
                cy="200"
                r="78"
                fill="none"
                stroke="url(#xe-journey-line)"
                strokeWidth={1}
                strokeDasharray="6 10"
                animate={reduce ? undefined : { rotate: 360 }}
                transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
                style={{ originX: '200px', originY: '200px' }}
              />
              {[
                { label: 'AI', x: 200, y: 96 },
                { label: 'Cloud', x: 108, y: 248 },
                { label: 'APIs', x: 292, y: 248 },
              ].map((n, i) => (
                <g key={n.label}>
                  <motion.line
                    x1="200"
                    y1="200"
                    x2={n.x}
                    y2={n.y}
                    stroke="url(#xe-journey-line)"
                    strokeWidth={1.6}
                    strokeOpacity={0.55}
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ delay: 0.1 + i * 0.12, duration: 0.6, ease: EASE }}
                  />
                  <motion.circle
                    cx={n.x}
                    cy={n.y}
                    r="32"
                    fill="url(#xe-journey-fill)"
                    stroke="#06B6D4"
                    strokeWidth={1.6}
                    initial={{ scale: 0.7, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: i * 0.12, duration: 0.5, ease: EASE }}
                    style={{ originX: `${n.x}px`, originY: `${n.y}px` }}
                  />
                  <text
                    x={n.x}
                    y={n.y + 4}
                    textAnchor="middle"
                    fill="currentColor"
                    fontSize="12"
                    fontWeight="700"
                  >
                    {n.label}
                  </text>
                </g>
              ))}
              <motion.circle
                cx="200"
                cy="200"
                r="16"
                fill="#0D9488"
                filter="url(#xe-journey-glow)"
                animate={reduce ? undefined : { scale: [1, 1.12, 1] }}
                transition={{ duration: 2.4, repeat: Infinity }}
                style={{ originX: '200px', originY: '200px' }}
              />
            </motion.g>
          ) : null}

          {visual === 'development' ? (
            <motion.g
              key="dev"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Pipeline rail */}
              <motion.path
                d="M70 200 H330"
                stroke="url(#xe-journey-line)"
                strokeWidth={2}
                strokeOpacity={0.35}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.8, ease: EASE }}
              />
              {[0, 1, 2, 3, 4].map((col) => {
                const x = 78 + col * 52
                const activeCol = col === 2
                return (
                  <motion.g key={col}>
                    <motion.rect
                      x={x}
                      y={148}
                      width="44"
                      height="104"
                      rx="12"
                      fill={activeCol ? 'url(#xe-journey-fill)' : 'var(--glass-bg-strong, #fff)'}
                      stroke={
                        activeCol
                          ? '#0D9488'
                          : 'color-mix(in srgb, var(--color-primary) 16%, transparent)'
                      }
                      strokeWidth={activeCol ? 1.8 : 1.2}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: col * 0.07, duration: 0.4, ease: EASE }}
                    />
                    {[0, 1, 2].map((row) => (
                      <rect
                        key={row}
                        x={x + 10}
                        y={164 + row * 26}
                        width="24"
                        height="8"
                        rx="3"
                        fill={
                          activeCol
                            ? '#0D9488'
                            : 'color-mix(in srgb, var(--color-primary) 14%, transparent)'
                        }
                        opacity={activeCol ? 0.85 - row * 0.18 : 0.55}
                      />
                    ))}
                  </motion.g>
                )
              })}
              {!reduce ? (
                <motion.circle
                  r="6"
                  fill="#06B6D4"
                  filter="url(#xe-journey-glow)"
                  animate={{ cx: [90, 310, 90], cy: [200, 200, 200] }}
                  transition={{ duration: 3.6, repeat: Infinity, ease: 'easeInOut' }}
                />
              ) : null}
            </motion.g>
          ) : null}

          {visual === 'cloud' ? (
            <motion.g
              key="cloud"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Centered control stack — safe inset inside frame */}
              <rect
                x="78"
                y="92"
                width="244"
                height="216"
                rx="22"
                fill="url(#xe-journey-fill)"
                stroke="#0D9488"
                strokeWidth={1.2}
                strokeOpacity={0.28}
              />
              {['Kubernetes', 'Monitoring', 'Security'].map((label, i) => {
                const rowY = 112 + i * 62
                const isActive = i === 1
                return (
                  <motion.g
                    key={label}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.12, duration: 0.45, ease: EASE }}
                  >
                    <rect
                      x="96"
                      y={rowY}
                      width="208"
                      height="48"
                      rx="14"
                      fill={
                        isActive
                          ? 'color-mix(in srgb, #0D9488 16%, transparent)'
                          : 'var(--glass-bg-strong, #fff)'
                      }
                      stroke={isActive ? '#0D9488' : 'color-mix(in srgb, #0D9488 28%, transparent)'}
                      strokeWidth={isActive ? 1.6 : 1.2}
                    />
                    <motion.circle
                      cx="120"
                      cy={rowY + 24}
                      r="6"
                      fill={isActive ? '#06B6D4' : '#0D9488'}
                      filter="url(#xe-journey-glow)"
                      animate={reduce ? undefined : { opacity: [0.55, 1, 0.55] }}
                      transition={{ duration: 2, repeat: Infinity, delay: i * 0.18 }}
                    />
                    <text x="140" y={rowY + 29} fill="currentColor" fontSize="13" fontWeight="600">
                      {label}
                    </text>
                    <rect
                      x="262"
                      y={rowY + 17}
                      width="26"
                      height="14"
                      rx="7"
                      fill="color-mix(in srgb, #0D9488 20%, transparent)"
                    />
                    {i < 2 ? (
                      <line
                        x1="200"
                        y1={rowY + 48}
                        x2="200"
                        y2={rowY + 62}
                        stroke="url(#xe-journey-line)"
                        strokeWidth={1.5}
                        strokeOpacity={0.45}
                      />
                    ) : null}
                  </motion.g>
                )
              })}
            </motion.g>
          ) : null}

          {visual === 'results' ? (
            <motion.g
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {[
                { label: 'ROI', trend: '↑', x: 126, y: 138 },
                { label: 'Perf', trend: '↑', x: 274, y: 138 },
                { label: 'Cost', trend: '↓', x: 126, y: 262 },
                { label: 'Growth', trend: '↑', x: 274, y: 262 },
              ].map((m, i) => (
                <motion.g
                  key={m.label}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1, duration: 0.45, ease: EASE }}
                >
                  <rect
                    x={m.x - 58}
                    y={m.y - 42}
                    width="116"
                    height="84"
                    rx="18"
                    fill="url(#xe-journey-fill)"
                    stroke="#0D9488"
                    strokeWidth={1.5}
                    strokeOpacity={0.5}
                  />
                  <text
                    x={m.x}
                    y={m.y - 8}
                    textAnchor="middle"
                    fill="currentColor"
                    fontSize="12"
                    fontWeight="600"
                    opacity={0.85}
                  >
                    {m.label}
                  </text>
                  <text
                    x={m.x}
                    y={m.y + 24}
                    textAnchor="middle"
                    fill="#0D9488"
                    fontSize="24"
                    fontWeight="700"
                    fontFamily="var(--font-display), system-ui"
                  >
                    {m.trend}
                  </text>
                </motion.g>
              ))}
            </motion.g>
          ) : null}
        </AnimatePresence>
      </svg>
    </div>
  )
}

export function StoryProcess({
  eyebrow = 'The Engineering Journey',
  heading,
  steps,
}: StoryProcessProps) {
  const mounted = useMounted()
  const reduce = useReducedMotion()
  const isDesktop = useMediaQuery('(min-width: 1024px)')
  const sticky = mounted && !reduce && isDesktop
  const stages = useMemo(() => mergeWithCms(steps), [steps])
  const count = stages.length
  const containerRef = useRef<HTMLElement>(null)
  const [active, setActive] = useState(0)

  const { scrollYProgress } = useScroll(
    sticky ? { target: containerRef, offset: ['start start', 'end end'] } : undefined,
  )

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    if (!sticky) return
    const next = Math.min(count - 1, Math.max(0, Math.floor(v * count)))
    setActive((prev) => (prev === next ? prev : next))
  })

  const progressHeight = useTransform(scrollYProgress, [0, 1], ['0%', '100%'])
  const current = stages[active] ?? stages[0]

  if (!sticky) {
    return (
      <section className="bg-[color:var(--color-background)] py-20 sm:py-24 lg:py-32">
        <Container>
          <p className="text-[11px] font-bold tracking-[0.2em] text-[color:var(--color-accent)] uppercase">
            {eyebrow}
          </p>
          <h2 className="font-display mt-4 max-w-2xl text-[clamp(1.85rem,6vw,3.4rem)] font-bold tracking-[-0.04em] text-[color:var(--color-primary)]">
            {heading}
          </h2>
          <ol className="mt-10 space-y-8 sm:mt-14">
            {stages.map((stage, i) => (
              <li
                key={stage.title}
                className="border-l-2 border-[color:var(--color-accent)] pl-5 sm:pl-6"
              >
                <p className="font-display text-xs tracking-[0.14em] text-[color:var(--color-accent)]">
                  {String(i + 1).padStart(2, '0')}
                </p>
                <h3 className="font-display mt-1 text-lg font-semibold text-[color:var(--color-primary)] sm:text-xl">
                  {stage.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[color:var(--color-secondary)] sm:text-base">
                  {stage.description}
                </p>
                <p className="mt-2 text-sm text-[color:var(--color-muted)]">
                  {stage.items.join(' · ')}
                </p>
              </li>
            ))}
          </ol>
        </Container>
      </section>
    )
  }

  return (
    <section
      ref={containerRef}
      className="relative bg-[color:var(--color-background)]"
      style={{ height: `${count * 100}vh` }}
      aria-label={eyebrow || 'Engineering journey'}
    >
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_15%_10%,rgba(13,148,136,0.12),transparent_55%),radial-gradient(ellipse_55%_40%_at_90%_85%,rgba(6,182,212,0.1),transparent_50%)]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.045]"
          style={{
            backgroundImage:
              'linear-gradient(var(--grid-line) 1px, transparent 1px), linear-gradient(90deg, var(--grid-line) 1px, transparent 1px)',
            backgroundSize: '52px 52px',
            maskImage: 'radial-gradient(ellipse at center, black 28%, transparent 78%)',
          }}
        />

        <Container className="relative z-10 flex h-full flex-col justify-center py-12 lg:py-14">
          <div className="mb-6 max-w-2xl lg:mb-8">
            <p className="text-[11px] font-bold tracking-[0.2em] text-[color:var(--color-accent)] uppercase">
              {eyebrow}
            </p>
            <h2 className="font-display mt-3 text-[clamp(1.75rem,3.4vw,2.85rem)] font-bold tracking-[-0.04em] text-[color:var(--color-primary)]">
              {heading}
            </h2>
          </div>

          <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.05fr)_minmax(0,1fr)] lg:gap-8 xl:gap-10">
            {/* LEFT — vertical pipeline timeline */}
            <div className="relative">
              <div className="flex gap-4">
                <div className="relative hidden h-[22rem] w-px overflow-hidden bg-[color:var(--glass-border)] sm:block">
                  <motion.div
                    className="absolute top-0 left-0 w-full origin-top bg-gradient-to-b from-teal-500 to-cyan-400"
                    style={{ height: progressHeight }}
                  />
                </div>
                <ol className="flex max-h-[48vh] flex-row gap-2 overflow-x-auto sm:max-h-none sm:flex-col sm:gap-0.5 sm:overflow-visible">
                  {stages.map((stage, i) => {
                    const done = i < active
                    const currentStep = i === active
                    return (
                      <li key={stage.title} className="shrink-0">
                        <div
                          className={cn(
                            'flex items-center gap-3 rounded-xl px-2 py-2.5 transition-colors',
                            currentStep && 'bg-[color:var(--color-hover)]',
                          )}
                        >
                          <span
                            className={cn(
                              'font-display grid h-8 w-8 place-items-center rounded-full border text-[10px] font-bold',
                              currentStep
                                ? 'border-cyan-400 bg-teal-500 text-white shadow-[0_0_22px_var(--color-accent-glow)]'
                                : done
                                  ? 'border-teal-500/50 bg-teal-500/15 text-[color:var(--color-accent)]'
                                  : 'border-[color:var(--glass-border)] bg-[color:var(--glass-bg)] text-[color:var(--color-muted)]',
                            )}
                          >
                            {String(i + 1).padStart(2, '0')}
                          </span>
                          <div className="hidden min-w-0 sm:block">
                            <p
                              className={cn(
                                'truncate text-sm font-semibold',
                                currentStep
                                  ? 'text-[color:var(--color-primary)]'
                                  : done
                                    ? 'text-[color:var(--color-accent)]'
                                    : 'text-[color:var(--color-muted)]',
                              )}
                            >
                              {stage.title}
                            </p>
                            {currentStep ? (
                              <p className="mt-0.5 text-[10px] tracking-wide text-[color:var(--color-accent)] uppercase">
                                {stage.transitionLabel}
                              </p>
                            ) : null}
                          </div>
                        </div>
                      </li>
                    )
                  })}
                </ol>
              </div>
            </div>

            {/* CENTER — stage visualization */}
            <div className="order-first lg:order-none">
              <StageVisual visual={current.visual} active reduce={reduce} />
              <motion.p
                key={current.transitionLabel}
                className="mt-4 text-center text-[11px] font-semibold tracking-[0.16em] text-[color:var(--color-accent)] uppercase"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {current.transitionLabel}
              </motion.p>
            </div>

            {/* RIGHT — active stage detail */}
            <div className="relative min-h-[20rem]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={current.title}
                  initial={{ opacity: 0, y: 22, filter: 'blur(6px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, y: -14, filter: 'blur(4px)' }}
                  transition={{ duration: 0.5, ease: EASE }}
                  className="overflow-hidden rounded-[28px] border border-[color:var(--glass-border)] bg-[color:var(--glass-bg)] p-6 shadow-[var(--shadow-medium)] backdrop-blur-xl sm:p-7"
                >
                  <p className="font-display text-[clamp(2.4rem,5vw,3.6rem)] leading-none font-bold tracking-[-0.06em] text-[color:var(--color-primary)]/10">
                    {String(active + 1).padStart(2, '0')}
                  </p>
                  <h3 className="font-display -mt-3 text-[clamp(1.5rem,2.8vw,2.1rem)] font-semibold tracking-[-0.03em] text-[color:var(--color-primary)]">
                    {current.title}
                  </h3>
                  <p className="mt-4 text-base leading-relaxed text-[color:var(--color-secondary)]">
                    {current.description}
                  </p>

                  <div className="mt-6 space-y-0 overflow-hidden rounded-2xl border border-[color:var(--glass-border)]">
                    {current.items.map((item, i) => (
                      <motion.div
                        key={item}
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.08 + i * 0.06, duration: 0.35 }}
                        className="flex items-center justify-between border-b border-[color:var(--glass-border)] bg-[color:var(--color-hover)] px-4 py-3 last:border-b-0"
                      >
                        <span className="text-sm font-medium text-[color:var(--color-primary)]">
                          {item}
                        </span>
                        {current.metrics?.[i] ? (
                          <span
                            className={cn(
                              'font-display text-lg font-bold',
                              current.metrics[i].trend === 'up'
                                ? 'text-emerald-500'
                                : 'text-[color:var(--color-accent)]',
                            )}
                          >
                            {current.metrics[i].trend === 'up' ? '↑' : '↓'}
                          </span>
                        ) : (
                          <span className="grid h-5 w-5 place-items-center rounded-full bg-emerald-500/15 text-[10px] font-bold text-emerald-500">
                            ✓
                          </span>
                        )}
                      </motion.div>
                    ))}
                  </div>

                  {active < count - 1 ? (
                    <p className="mt-6 text-[11px] tracking-[0.14em] text-[color:var(--color-muted)] uppercase">
                      Scroll → {stages[active + 1]?.title}
                      <motion.span
                        className="ml-2 inline-block"
                        animate={{ y: [0, 4, 0] }}
                        transition={{ duration: 1.3, repeat: Infinity }}
                      >
                        ↓
                      </motion.span>
                    </p>
                  ) : (
                    <p className="mt-6 text-[11px] font-semibold tracking-[0.14em] text-[color:var(--color-accent)] uppercase">
                      Journey complete
                    </p>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </Container>
      </div>
    </section>
  )
}
