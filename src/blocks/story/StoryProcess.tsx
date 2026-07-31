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

/** Canonical business → results pipeline */
const JOURNEY: JourneyStage[] = [
  {
    title: 'Business Problem',
    description: 'Every engagement starts with a real constraint — not a technology preference.',
    items: ['Stakeholder friction', 'Data silos', 'Outcome gaps'],
    transitionLabel: 'Discovery begins',
    visual: 'problem',
  },
  {
    title: 'Discovery',
    description: 'Workshops and research turn the problem into a shared, actionable frame.',
    items: ['Stakeholders', 'Research', 'Workshops'],
    transitionLabel: 'Animated flow',
    visual: 'discovery',
  },
  {
    title: 'Solution Architecture',
    description: 'The blueprint assembles — AI, cloud, and APIs designed to survive production.',
    items: ['AI Models', 'Cloud Design', 'APIs'],
    transitionLabel: 'Blueprint assembles',
    visual: 'architecture',
  },
  {
    title: 'Development',
    description: 'Code appears. Components connect. Tests run. Operators stay in the loop.',
    items: ['Code appears', 'Components connect', 'Tests run'],
    transitionLabel: 'Deployment pipeline animates',
    visual: 'development',
  },
  {
    title: 'Cloud Infrastructure',
    description:
      'Secure, observable infrastructure — Kubernetes, monitoring, and hardened controls.',
    items: ['Kubernetes', 'Monitoring', 'Security'],
    transitionLabel: 'Live analytics activate',
    visual: 'cloud',
  },
  {
    title: 'Business Results',
    description: 'The system pays for itself — measurable ROI, performance, cost, and growth.',
    items: ['ROI', 'Performance', 'Cost', 'Growth'],
    transitionLabel: 'Journey complete',
    visual: 'results',
    metrics: [
      { label: 'ROI', trend: 'up' },
      { label: 'Performance', trend: 'up' },
      { label: 'Cost', trend: 'down' },
      { label: 'Growth', trend: 'up' },
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
      <div className="absolute inset-[6%] rounded-[28px] border border-slate-200/90 bg-white/80 shadow-[0_28px_80px_rgba(15,23,42,0.1)] backdrop-blur-xl" />
      <div
        aria-hidden
        className="absolute inset-[6%] rounded-[28px] opacity-50"
        style={{
          backgroundImage:
            'linear-gradient(rgba(13,148,136,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(13,148,136,0.07) 1px, transparent 1px)',
          backgroundSize: '26px 26px',
        }}
      />

      <svg viewBox="0 0 400 400" className="relative z-10 h-full w-full p-6" aria-hidden>
        <defs>
          <linearGradient id="xe-journey-line" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#0D9488" />
            <stop offset="100%" stopColor="#06B6D4" />
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
              animate={{ opacity: active ? 1 : 0.4 }}
              exit={{ opacity: 0 }}
            >
              <motion.rect
                x="120"
                y="150"
                width="160"
                height="100"
                rx="18"
                fill="rgba(15,23,42,0.06)"
                stroke="#0F172A"
                strokeOpacity={0.25}
                animate={reduce ? undefined : { y: [150, 146, 150] }}
                transition={{ duration: 3, repeat: Infinity }}
              />
              <text
                x="200"
                y="208"
                textAnchor="middle"
                fill="#0F172A"
                fontSize="14"
                fontFamily="var(--font-display), system-ui"
                fontWeight="600"
              >
                Problem
              </text>
              {[0, 1, 2].map((i) => (
                <motion.circle
                  key={i}
                  cx={90 + i * 110}
                  cy={100}
                  r="6"
                  fill="#94A3B8"
                  animate={reduce ? undefined : { opacity: [0.3, 0.8, 0.3] }}
                  transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
                />
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
              {['Stakeholders', 'Research', 'Workshops'].map((label, i) => (
                <motion.g key={label}>
                  <motion.rect
                    x="70"
                    y={80 + i * 85}
                    width="260"
                    height="58"
                    rx="14"
                    fill="rgba(13,148,136,0.08)"
                    stroke="#0D9488"
                    strokeOpacity={0.45}
                    initial={{ x: 40, opacity: 0 }}
                    animate={{ x: 70, opacity: 1 }}
                    transition={{ delay: i * 0.12, duration: 0.5, ease: EASE }}
                  />
                  <motion.text
                    x="200"
                    y={115 + i * 85}
                    textAnchor="middle"
                    fill="#0F172A"
                    fontSize="13"
                    fontFamily="var(--font-sans), system-ui"
                    fontWeight="600"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.15 + i * 0.12 }}
                  >
                    {label}
                  </motion.text>
                </motion.g>
              ))}
            </motion.g>
          ) : null}

          {visual === 'architecture' ? (
            <motion.g
              key="arch"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {[
                { label: 'AI Models', x: 200, y: 90 },
                { label: 'Cloud Design', x: 110, y: 210 },
                { label: 'APIs', x: 290, y: 210 },
              ].map((n, i) => (
                <g key={n.label}>
                  {i > 0 ? (
                    <motion.line
                      x1="200"
                      y1="110"
                      x2={n.x}
                      y2={n.y - 20}
                      stroke="url(#xe-journey-line)"
                      strokeWidth="2"
                      initial={{ pathLength: 0 }}
                      animate={{ opacity: 0.7 }}
                      transition={{ delay: 0.2 + i * 0.1 }}
                    />
                  ) : null}
                  <motion.circle
                    cx={n.x}
                    cy={n.y}
                    r="36"
                    fill="rgba(6,182,212,0.1)"
                    stroke="#06B6D4"
                    initial={{ scale: 0.6, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: i * 0.12, duration: 0.5, ease: EASE }}
                  />
                  <text
                    x={n.x}
                    y={n.y + 4}
                    textAnchor="middle"
                    fill="#0F172A"
                    fontSize="11"
                    fontWeight="600"
                  >
                    {n.label.split(' ')[0]}
                  </text>
                </g>
              ))}
            </motion.g>
          ) : null}

          {visual === 'development' ? (
            <motion.g
              key="dev"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {[0, 1, 2, 3].flatMap((row) =>
                [0, 1, 2, 3, 4].map((col) => (
                  <motion.rect
                    key={`${row}-${col}`}
                    x={70 + col * 52}
                    y={90 + row * 55}
                    width="40"
                    height="40"
                    rx="8"
                    fill={row === 1 && col === 2 ? '#0D9488' : 'rgba(15,23,42,0.05)'}
                    stroke={row === 1 && col === 2 ? '#06B6D4' : 'rgba(15,23,42,0.12)'}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: (row * 5 + col) * 0.03, duration: 0.35 }}
                  />
                )),
              )}
              {!reduce ? (
                <motion.circle
                  r="4"
                  fill="#06B6D4"
                  filter="url(#xe-journey-glow)"
                  animate={{
                    cx: [90, 310, 310, 90, 90],
                    cy: [110, 110, 290, 290, 110],
                  }}
                  transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
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
              {['Kubernetes', 'Monitoring', 'Security'].map((label, i) => {
                const y = 100 + i * 80
                return (
                  <g key={label}>
                    <motion.rect
                      x="80"
                      y={y}
                      width="240"
                      height="52"
                      rx="12"
                      fill="rgba(13,148,136,0.08)"
                      stroke="#0D9488"
                      strokeOpacity={0.5}
                      initial={{ scaleX: 0.6, opacity: 0 }}
                      animate={{ scaleX: 1, opacity: 1 }}
                      transition={{ delay: i * 0.15, duration: 0.5, ease: EASE }}
                      style={{ originX: 0.5 }}
                    />
                    <text
                      x="200"
                      y={y + 32}
                      textAnchor="middle"
                      fill="#0F172A"
                      fontSize="13"
                      fontWeight="600"
                    >
                      {label}
                    </text>
                    {i < 2 ? (
                      <motion.line
                        x1="200"
                        y1={y + 52}
                        x2="200"
                        y2={y + 80}
                        stroke="url(#xe-journey-line)"
                        strokeWidth="2"
                        strokeDasharray="4 6"
                        animate={reduce ? undefined : { strokeDashoffset: [0, -20] }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      />
                    ) : null}
                  </g>
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
                { label: 'ROI', trend: '↑', x: 120, y: 130 },
                { label: 'Perf', trend: '↑', x: 280, y: 130 },
                { label: 'Cost', trend: '↓', x: 120, y: 260 },
                { label: 'Growth', trend: '↑', x: 280, y: 260 },
              ].map((m, i) => (
                <motion.g
                  key={m.label}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1, duration: 0.45 }}
                >
                  <rect
                    x={m.x - 55}
                    y={m.y - 40}
                    width="110"
                    height="80"
                    rx="16"
                    fill="rgba(16,185,129,0.08)"
                    stroke="#10B981"
                    strokeOpacity={0.45}
                  />
                  <text
                    x={m.x}
                    y={m.y - 5}
                    textAnchor="middle"
                    fill="#0F172A"
                    fontSize="12"
                    fontWeight="600"
                  >
                    {m.label}
                  </text>
                  <text
                    x={m.x}
                    y={m.y + 22}
                    textAnchor="middle"
                    fill="#0D9488"
                    fontSize="22"
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
      <section className="bg-[#F8FAFC] py-20 sm:py-24 lg:py-32 dark:bg-[color:var(--color-neutral)]">
        <Container>
          <p className="text-[11px] font-bold tracking-[0.2em] text-teal-700 uppercase dark:text-teal-300">
            {eyebrow}
          </p>
          <h2 className="font-display mt-4 max-w-2xl text-[clamp(1.85rem,6vw,3.4rem)] font-bold tracking-[-0.04em] text-[color:var(--color-navy)] dark:text-[color:var(--color-primary)]">
            {heading}
          </h2>
          <ol className="mt-10 space-y-8 sm:mt-14">
            {stages.map((stage, i) => (
              <li
                key={stage.title}
                className="border-l-2 border-teal-500 pl-5 sm:pl-6 dark:border-teal-400"
              >
                <p className="font-display text-xs tracking-[0.14em] text-teal-600 dark:text-teal-300">
                  {String(i + 1).padStart(2, '0')}
                </p>
                <h3 className="font-display mt-1 text-lg font-semibold sm:text-xl">
                  {stage.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600 sm:text-base dark:text-slate-300">
                  {stage.description}
                </p>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
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
      className="relative bg-white"
      style={{ height: `${count * 100}vh` }}
      aria-label={eyebrow || 'Engineering journey'}
    >
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_15%_10%,rgba(13,148,136,0.09),transparent_55%),radial-gradient(ellipse_55%_40%_at_90%_85%,rgba(6,182,212,0.07),transparent_50%),linear-gradient(180deg,#FFFFFF_0%,#F8FAFC_55%,#FFFFFF_100%)]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              'linear-gradient(rgba(15,23,42,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(15,23,42,0.035) 1px, transparent 1px)',
            backgroundSize: '52px 52px',
            maskImage: 'radial-gradient(ellipse at center, black 28%, transparent 78%)',
          }}
        />

        <Container className="relative z-10 flex h-full flex-col justify-center py-12 lg:py-14">
          <div className="mb-6 max-w-2xl lg:mb-8">
            <p className="text-[11px] font-bold tracking-[0.2em] text-teal-700 uppercase">
              {eyebrow}
            </p>
            <h2 className="font-display mt-3 text-[clamp(1.75rem,3.4vw,2.85rem)] font-bold tracking-[-0.04em] text-[color:var(--color-navy)]">
              {heading}
            </h2>
          </div>

          <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.05fr)_minmax(0,1fr)] lg:gap-8 xl:gap-10">
            {/* LEFT — vertical pipeline timeline */}
            <div className="relative">
              <div className="flex gap-4">
                <div className="relative hidden h-[22rem] w-px overflow-hidden bg-slate-200 sm:block">
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
                            currentStep && 'bg-teal-500/10',
                          )}
                        >
                          <span
                            className={cn(
                              'font-display grid h-8 w-8 place-items-center rounded-full border text-[10px] font-bold',
                              currentStep
                                ? 'border-cyan-400 bg-teal-500 text-white shadow-[0_0_22px_rgba(13,148,136,0.4)]'
                                : done
                                  ? 'border-teal-500/50 bg-teal-500/15 text-teal-700'
                                  : 'border-slate-200 bg-white text-slate-400',
                            )}
                          >
                            {String(i + 1).padStart(2, '0')}
                          </span>
                          <div className="hidden min-w-0 sm:block">
                            <p
                              className={cn(
                                'truncate text-sm font-semibold',
                                currentStep
                                  ? 'text-[color:var(--color-navy)]'
                                  : done
                                    ? 'text-teal-800/80'
                                    : 'text-slate-400',
                              )}
                            >
                              {stage.title}
                            </p>
                            {currentStep ? (
                              <p className="mt-0.5 text-[10px] tracking-wide text-cyan-700/80 uppercase">
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
                className="mt-4 text-center text-[11px] font-semibold tracking-[0.16em] text-teal-700/80 uppercase"
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
                  className="overflow-hidden rounded-[28px] border border-slate-200/90 bg-white/85 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur-xl sm:p-7"
                >
                  <p className="font-display text-[clamp(2.4rem,5vw,3.6rem)] leading-none font-bold tracking-[-0.06em] text-[color:var(--color-navy)]/10">
                    {String(active + 1).padStart(2, '0')}
                  </p>
                  <h3 className="font-display -mt-3 text-[clamp(1.5rem,2.8vw,2.1rem)] font-semibold tracking-[-0.03em] text-[color:var(--color-navy)]">
                    {current.title}
                  </h3>
                  <p className="mt-4 text-base leading-relaxed text-slate-600">
                    {current.description}
                  </p>

                  <div className="mt-6 space-y-0 overflow-hidden rounded-2xl border border-slate-200">
                    {current.items.map((item, i) => (
                      <motion.div
                        key={item}
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.08 + i * 0.06, duration: 0.35 }}
                        className="flex items-center justify-between border-b border-slate-100 bg-slate-50/80 px-4 py-3 last:border-b-0"
                      >
                        <span className="text-sm font-medium text-slate-800">{item}</span>
                        {current.metrics?.[i] ? (
                          <span
                            className={cn(
                              'font-display text-lg font-bold',
                              current.metrics[i].trend === 'up'
                                ? 'text-emerald-600'
                                : 'text-teal-600',
                            )}
                          >
                            {current.metrics[i].trend === 'up' ? '↑' : '↓'}
                          </span>
                        ) : (
                          <span className="grid h-5 w-5 place-items-center rounded-full bg-emerald-500/15 text-[10px] font-bold text-emerald-600">
                            ✓
                          </span>
                        )}
                      </motion.div>
                    ))}
                  </div>

                  {active < count - 1 ? (
                    <p className="mt-6 text-[11px] tracking-[0.14em] text-slate-400 uppercase">
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
                    <p className="mt-6 text-[11px] font-semibold tracking-[0.14em] text-teal-700 uppercase">
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
