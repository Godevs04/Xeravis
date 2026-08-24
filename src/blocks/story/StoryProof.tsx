'use client'

import Link from 'next/link'
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useInView,
} from 'framer-motion'
import { useEffect, useMemo, useRef, useState } from 'react'

import { Container } from '@/components/layout/Container'
import { cn } from '@/lib/utils'

type ProofStat = {
  label: string
  value: string
  suffix?: string | null
}

type StoryProofProps = {
  eyebrow?: string | null
  heading: string
  stats?: ProofStat[] | null
}

type MetricPanel = {
  id: string
  label: string
  value: number
  display: string
  suffix: string
  detail: string
  viz: 'ring' | 'bars' | 'pulse'
  nodeIds: number[]
}

const DEFAULT_METRICS: MetricPanel[] = [
  {
    id: 'services',
    label: 'Core services',
    value: 5,
    display: '5',
    suffix: '',
    detail: 'AI, Data Science, IT Consulting, Data Engineering, and Healthcare specialty.',
    viz: 'ring',
    nodeIds: [0, 1],
  },
  {
    id: 'solutions',
    label: 'Solution areas',
    value: 8,
    display: '8',
    suffix: '',
    detail: 'Business problems we solve across AI, data, automation and modernization.',
    viz: 'bars',
    nodeIds: [2, 3],
  },
  {
    id: 'pillars',
    label: 'Practice pillars',
    value: 3,
    display: '3',
    suffix: '',
    detail: 'Artificial Intelligence, Data Science and IT Consulting.',
    viz: 'ring',
    nodeIds: [3, 4],
  },
  {
    id: 'framework',
    label: 'Delivery stages',
    value: 9,
    display: '9',
    suffix: '',
    detail:
      'Discover → Strategize → Design → Build → Deploy → Optimize — the XELARVIS Delivery Framework.',
    viz: 'pulse',
    nodeIds: [5, 6],
  },
]

const PIPELINE = ['Discover', 'Strategize', 'Design', 'Build', 'Deploy', 'Optimize']

const EASE = [0.22, 1, 0.36, 1] as const

function parseStatToMetric(stat: ProofStat, index: number): MetricPanel {
  const numeric = Number.parseFloat(stat.value.replace(/[^\d.]/g, ''))
  const value = Number.isFinite(numeric) ? numeric : index + 1
  const suffix =
    stat.suffix || (stat.value.includes('%') ? '%' : stat.value.includes('+') ? '+' : '')
  const display = Number.isFinite(numeric) ? String(numeric) : stat.value
  const base = DEFAULT_METRICS[index % DEFAULT_METRICS.length]
  return {
    ...base,
    id: `cms-${index}`,
    label: stat.label,
    value,
    display,
    suffix: suffix || base.suffix,
  }
}

function CountNumber({
  value,
  decimals = 0,
  active,
}: {
  value: number
  decimals?: number
  active: boolean
}) {
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
    const duration = 1200
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration)
      const eased = 1 - Math.pow(1 - t, 3)
      const current = value * eased
      setN(decimals > 0 ? Number(current.toFixed(decimals)) : Math.round(current))
      if (t < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [active, value, decimals, reduce])

  return <span className="tabular-nums">{decimals > 0 ? n.toFixed(decimals) : n}</span>
}

function ProgressRing({
  progress,
  accent,
  active,
}: {
  progress: number
  accent: string
  active: boolean
}) {
  const reduce = useReducedMotion()
  const r = 18
  const c = 2 * Math.PI * r
  const target = c * (1 - Math.min(1, progress / 100))

  return (
    <svg width="48" height="48" viewBox="0 0 48 48" aria-hidden className="shrink-0">
      <circle cx="24" cy="24" r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="3" />
      <motion.circle
        cx="24"
        cy="24"
        r={r}
        fill="none"
        stroke={accent}
        strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray={c}
        initial={{ strokeDashoffset: c }}
        animate={{ strokeDashoffset: active || reduce ? target : c }}
        transition={{ duration: 1.1, ease: EASE }}
        transform="rotate(-90 24 24)"
      />
    </svg>
  )
}

function MiniBars({ active, accent }: { active: boolean; accent: string }) {
  const heights = [40, 65, 45, 80, 55, 92]
  return (
    <div className="flex h-10 items-end gap-1" aria-hidden>
      {heights.map((h, i) => (
        <motion.div
          key={i}
          className="w-1.5 rounded-sm"
          style={{ background: accent }}
          initial={{ height: 4 }}
          animate={{ height: active ? `${h}%` : 4 }}
          transition={{ delay: i * 0.05, duration: 0.7, ease: EASE }}
        />
      ))}
    </div>
  )
}

function ProofEcosystem({
  activeNodes,
  inView,
  reduce,
}: {
  activeNodes: number[]
  inView: boolean
  reduce: boolean | null
}) {
  const nodes = useMemo(
    () =>
      [
        { x: 200, y: 70 },
        { x: 95, y: 130 },
        { x: 305, y: 130 },
        { x: 70, y: 220 },
        { x: 200, y: 200 },
        { x: 330, y: 220 },
        { x: 120, y: 310 },
        { x: 280, y: 310 },
      ] as const,
    [],
  )

  const edges: [number, number][] = [
    [0, 1],
    [0, 2],
    [1, 3],
    [1, 4],
    [2, 4],
    [2, 5],
    [3, 6],
    [4, 6],
    [4, 7],
    [5, 7],
  ]

  return (
    <div className="relative mx-auto aspect-square w-full max-w-[26rem]">
      <div
        aria-hidden
        className="absolute inset-[6%] rounded-full border border-[color:var(--hero-panel-border)] bg-[color:var(--hero-panel)] shadow-[inset_0_0_100px_var(--hero-glow)] backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.03] dark:shadow-[inset_0_0_100px_rgba(13,148,136,0.12)]"
      />
      <motion.div
        aria-hidden
        className="absolute inset-[16%] rounded-full border border-cyan-400/15"
        animate={reduce ? undefined : { rotate: 360 }}
        transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
      />
      <motion.div
        aria-hidden
        className="absolute inset-[26%] rounded-full border border-teal-400/10"
        animate={reduce ? undefined : { rotate: -360 }}
        transition={{ duration: 80, repeat: Infinity, ease: 'linear' }}
      />

      <svg viewBox="0 0 400 400" className="relative z-10 h-full w-full" aria-hidden>
        <defs>
          <linearGradient id="xe-proof-line" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0D9488" />
            <stop offset="100%" stopColor="#06B6D4" />
          </linearGradient>
          <filter id="xe-proof-glow">
            <feGaussianBlur stdDeviation="2.5" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {edges.map(([a, b], i) => {
          const n1 = nodes[a]
          const n2 = nodes[b]
          const lit = activeNodes.includes(a) || activeNodes.includes(b)
          return (
            <motion.line
              key={`${a}-${b}`}
              x1={n1.x}
              y1={n1.y}
              x2={n2.x}
              y2={n2.y}
              stroke="url(#xe-proof-line)"
              strokeWidth={lit ? 2 : 1}
              initial={{ opacity: 0 }}
              animate={{ opacity: inView ? (lit ? 0.95 : 0.28) : 0 }}
              transition={{ delay: 0.15 + i * 0.04, duration: 0.6 }}
            />
          )
        })}

        {/* Flowing packet along primary path */}
        {!reduce && inView ? (
          <motion.circle
            r={3.5}
            fill="#22D3EE"
            filter="url(#xe-proof-glow)"
            animate={{
              cx: [200, 95, 200, 330, 280, 200],
              cy: [70, 130, 200, 220, 310, 70],
            }}
            transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
          />
        ) : null}

        {nodes.map((n, i) => {
          const lit = activeNodes.includes(i)
          return (
            <motion.circle
              key={i}
              cx={n.x}
              cy={n.y}
              r={lit ? 9 : 6}
              fill={lit ? '#06B6D4' : '#0D9488'}
              filter="url(#xe-proof-glow)"
              initial={{ opacity: 0, scale: 0.4 }}
              animate={
                inView
                  ? reduce
                    ? { opacity: 1, scale: 1 }
                    : { opacity: [0.55, 1, 0.55], scale: 1 }
                  : { opacity: 0, scale: 0.4 }
              }
              transition={{
                delay: 0.2 + i * 0.06,
                duration: lit ? 1.4 : 2.4,
                repeat: reduce || !inView ? 0 : Infinity,
              }}
            />
          )
        })}
      </svg>

      {/* Pipeline ribbon */}
      <div className="absolute inset-x-2 bottom-2 overflow-hidden rounded-2xl border border-[color:var(--hero-panel-border)] bg-[color:var(--hero-panel)] px-2 py-2 shadow-[var(--shadow-light)] backdrop-blur-xl dark:border-white/10 dark:bg-[rgba(15,23,42,0.72)]">
        <div className="flex items-center justify-between gap-1">
          {PIPELINE.map((stage, i) => (
            <motion.div
              key={stage}
              className="min-w-0 flex-1 text-center"
              initial={{ opacity: 0, y: 6 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.35 + i * 0.07, duration: 0.45, ease: EASE }}
            >
              <span className="block truncate text-[8px] font-semibold tracking-wide text-[color:var(--color-accent)] uppercase sm:text-[9px] dark:text-cyan-200/90">
                {stage}
              </span>
              {i < PIPELINE.length - 1 ? (
                <span className="mx-auto mt-1 hidden h-px w-full max-w-[2rem] bg-gradient-to-r from-teal-400/50 to-cyan-400/50 sm:block" />
              ) : null}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

export function StoryProof({ eyebrow = 'Proof', heading, stats }: StoryProofProps) {
  const reduce = useReducedMotion()
  const sectionRef = useRef<HTMLElement>(null)
  const inView = useInView(sectionRef, { once: false, amount: 0.25 })
  const [activeId, setActiveId] = useState<string | null>(null)

  const metrics = useMemo(() => {
    if (stats?.length) {
      return stats.slice(0, 6).map(parseStatToMetric)
    }
    return DEFAULT_METRICS
  }, [stats])

  const activeNodes = useMemo(() => {
    if (!activeId) return [0, 4, 7]
    return metrics.find((m) => m.id === activeId)?.nodeIds ?? [0, 4, 7]
  }, [activeId, metrics])

  const mx = useMotionValue(50)
  const my = useMotionValue(40)
  const sx = useSpring(mx, { stiffness: 40, damping: 22 })
  const sy = useSpring(my, { stiffness: 40, damping: 22 })
  const cursorGlow = useMotionTemplate`radial-gradient(ellipse 48% 40% at ${sx}% ${sy}%, rgba(13,148,136,0.3), transparent 62%)`

  useEffect(() => {
    if (reduce) return
    const onMove = (e: PointerEvent) => {
      mx.set((e.clientX / window.innerWidth) * 100)
      my.set((e.clientY / window.innerHeight) * 100)
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [reduce, mx, my])

  const heroValue = 9

  return (
    <section
      ref={sectionRef}
      className="surface-navy relative overflow-hidden bg-[color:var(--hero-bg)] py-24 text-[color:var(--hero-text)] lg:py-32"
      aria-label={eyebrow || 'Proof'}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_75%_55%_at_10%_15%,var(--hero-glow),transparent_55%),radial-gradient(ellipse_65%_50%_at_90%_85%,var(--hero-glow-2),transparent_50%)]"
      />
      {!reduce ? (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{ backgroundImage: cursorGlow }}
        />
      ) : null}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -top-24 left-[20%] h-[26rem] w-[26rem] rounded-full bg-[radial-gradient(circle,rgba(13,148,136,0.32),transparent_70%)] blur-3xl"
        animate={reduce ? undefined : { opacity: [0.35, 0.65, 0.35], x: [0, 30, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.055]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
          backgroundSize: '68px 68px',
          maskImage: 'radial-gradient(ellipse at center, black 20%, transparent 75%)',
        }}
      />
      {!reduce
        ? Array.from({ length: 12 }).map((_, i) => (
            <motion.span
              key={i}
              aria-hidden
              className="pointer-events-none absolute h-1 w-1 rounded-full bg-cyan-300/45"
              style={{
                left: `${10 + ((i * 19) % 80)}%`,
                top: `${15 + ((i * 29) % 70)}%`,
              }}
              animate={{ y: [0, -14, 0], opacity: [0.15, 0.7, 0.15] }}
              transition={{
                duration: 3.5 + (i % 4),
                repeat: Infinity,
                delay: i * 0.2,
                ease: 'easeInOut',
              }}
            />
          ))
        : null}

      <Container className="relative z-10">
        <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.15fr)_minmax(0,0.95fr)] lg:gap-8 xl:gap-12">
          {/* LEFT */}
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-10%' }}
            transition={{ duration: 0.75, ease: EASE }}
          >
            <p className="font-display text-[clamp(3rem,8vw,5.5rem)] leading-none font-bold tracking-[-0.06em] text-[color:var(--color-accent)]">
              {eyebrow?.toUpperCase() || 'PROOF'}
            </p>
            <p className="mt-4 text-sm tracking-[0.14em] text-[color:var(--hero-muted)] uppercase">
              Engineering metrics that matter
            </p>
            <h2 className="font-display mt-6 max-w-md text-[clamp(1.5rem,2.8vw,2.1rem)] leading-snug font-semibold tracking-[-0.03em] text-[color:var(--hero-text)]">
              {heading}
            </h2>

            <div className="mt-10">
              <p className="font-display text-[clamp(3.5rem,8vw,5.5rem)] leading-none font-bold tracking-[-0.06em] text-[color:var(--hero-text)]">
                <CountNumber value={heroValue} active={inView} />
              </p>
              <p className="mt-3 text-sm font-medium tracking-wide text-[color:var(--hero-muted)] uppercase">
                Delivery framework stages
              </p>
            </div>

            <p className="mt-8 max-w-sm text-base leading-relaxed text-[color:var(--hero-muted)]">
              Enterprise buyers look for clarity, evidence, expertise and governance—a credible path
              from problem to solution to measurable outcome.
            </p>

            <Link
              href="/case-studies"
              className="group mt-8 inline-flex items-center gap-2 text-sm font-semibold text-[color:var(--color-accent)] transition-colors hover:text-[color:var(--color-accent-hover)]"
            >
              Explore our work
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </Link>
          </motion.div>

          {/* CENTER */}
          <motion.div
            initial={reduce ? false : { opacity: 0, scale: 0.94 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-8%' }}
            transition={{ duration: 0.8, ease: EASE }}
            className="order-first lg:order-none"
          >
            <ProofEcosystem activeNodes={activeNodes} inView={inView} reduce={reduce} />
          </motion.div>

          {/* RIGHT — glass metric stack */}
          <div className="flex flex-col gap-3">
            {metrics.map((metric, index) => {
              const open = activeId === metric.id
              const accent = index % 2 === 0 ? '#0D9488' : '#06B6D4'
              const decimals = metric.display.includes('.') ? 1 : 0

              return (
                <motion.button
                  key={metric.id}
                  type="button"
                  onMouseEnter={() => setActiveId(metric.id)}
                  onMouseLeave={() => setActiveId(null)}
                  onFocus={() => setActiveId(metric.id)}
                  onBlur={() => setActiveId(null)}
                  initial={reduce ? false : { opacity: 0, x: 24 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-5%' }}
                  transition={{ delay: index * 0.06, duration: 0.55, ease: EASE }}
                  whileHover={reduce ? undefined : { y: -2, scale: 1.01 }}
                  className={cn(
                    'relative overflow-hidden rounded-[22px] border px-4 py-3.5 text-left backdrop-blur-xl transition-[border-color,box-shadow] duration-300',
                    open
                      ? 'border-[color:var(--color-accent)]/40 bg-[color:var(--hero-panel)] shadow-[var(--shadow-hover)] dark:border-cyan-300/40 dark:bg-white/[0.1] dark:shadow-[0_20px_60px_rgba(0,0,0,0.35),0_0_40px_rgba(13,148,136,0.2)]'
                      : 'border-[color:var(--hero-panel-border)] bg-[color:var(--hero-panel)] hover:border-[color:var(--color-accent)]/30 dark:border-white/10 dark:bg-white/[0.05] dark:hover:border-teal-400/30',
                  )}
                >
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 opacity-60"
                    style={{
                      background: `linear-gradient(135deg, ${accent}22, transparent 50%)`,
                    }}
                  />
                  <div className="relative flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-[10px] font-semibold tracking-[0.16em] text-[color:var(--hero-muted)] uppercase">
                        {metric.label}
                      </p>
                      <p className="font-display mt-1 text-2xl font-bold tracking-[-0.04em] text-[color:var(--hero-text)]">
                        <CountNumber value={metric.value} decimals={decimals} active={inView} />
                        {metric.suffix}
                      </p>
                    </div>
                    {metric.viz === 'ring' ? (
                      <ProgressRing
                        progress={Math.min(
                          100,
                          metric.value <= 100 ? metric.value * (metric.value < 20 ? 12 : 1) : 92,
                        )}
                        accent={accent}
                        active={inView}
                      />
                    ) : metric.viz === 'bars' ? (
                      <MiniBars active={inView} accent={accent} />
                    ) : (
                      <motion.span
                        className="h-3 w-3 rounded-full"
                        style={{ background: accent, boxShadow: `0 0 18px ${accent}` }}
                        animate={
                          reduce ? undefined : { scale: [1, 1.35, 1], opacity: [0.6, 1, 0.6] }
                        }
                        transition={{ duration: 1.8, repeat: Infinity }}
                      />
                    )}
                  </div>
                  <motion.div
                    initial={false}
                    animate={{
                      height: open ? 'auto' : 0,
                      opacity: open ? 1 : 0,
                      marginTop: open ? 10 : 0,
                    }}
                    transition={{ duration: 0.35, ease: EASE }}
                    className="relative overflow-hidden"
                  >
                    <p className="text-sm leading-relaxed text-slate-300">{metric.detail}</p>
                  </motion.div>
                </motion.button>
              )
            })}
          </div>
        </div>
      </Container>
    </section>
  )
}
