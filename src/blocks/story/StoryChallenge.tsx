'use client'

import {
  AnimatePresence,
  motion,
  useMotionTemplate,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion'
import { useEffect, useMemo, useRef, useState } from 'react'

import { Container } from '@/components/layout/Container'
import { useMediaQuery, useMounted } from '@/hooks/useMediaQuery'
import { cn } from '@/lib/utils'

type ChallengeItem = { title: string; body?: string | null }

type StoryChallengeProps = {
  eyebrow?: string | null
  heading: string
  items?: ChallengeItem[] | null
}

const FALLBACK: ChallengeItem[] = [
  {
    title: 'Fragmented clinical & enterprise data',
    body: 'Signals live in silos. Decisions wait on spreadsheets.',
  },
  {
    title: 'AI without operational grounding',
    body: 'Models that impress demos but stall in regulated reality.',
  },
  {
    title: 'Transformation without craft',
    body: 'Generic platforms. Generic outcomes. Forgotten brands.',
  },
]

const CHAPTER_META = [
  {
    icon: 'silos' as const,
    statValue: 73,
    statSuffix: '%',
    statLabel: 'of signals trapped in silos',
    accent: '#0D9488',
  },
  {
    icon: 'neural' as const,
    statValue: 9,
    statSuffix: '×',
    statLabel: 'demo → production gap',
    accent: '#06B6D4',
  },
  {
    icon: 'generic' as const,
    statValue: 0,
    statSuffix: '',
    statLabel: 'distinctive craft left',
    accent: '#10B981',
  },
]

const EASE = [0.22, 1, 0.36, 1] as const

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
    const duration = 900
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

function ChallengeVisual({
  mode,
  accent,
  reduce,
}: {
  mode: 0 | 1 | 2
  accent: string
  reduce: boolean | null
}) {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[28rem]">
      {/* Glass orb */}
      <div
        aria-hidden
        className="absolute inset-[8%] rounded-full border border-[color:var(--hero-panel-border)] bg-[color:var(--hero-panel)] shadow-[inset_0_0_80px_var(--hero-glow)] backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.03] dark:shadow-[inset_0_0_80px_rgba(13,148,136,0.12)]"
      />
      <motion.div
        aria-hidden
        className="absolute inset-[18%] rounded-full"
        style={{
          background: `radial-gradient(circle at 35% 30%, ${accent}55, transparent 55%)`,
        }}
        animate={reduce ? undefined : { opacity: [0.45, 0.85, 0.45], scale: [1, 1.04, 1] }}
        transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
      />

      <svg viewBox="0 0 400 400" className="relative z-10 h-full w-full" aria-hidden>
        <defs>
          <linearGradient id="xe-challenge-thread" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0D9488" />
            <stop offset="100%" stopColor="#06B6D4" />
          </linearGradient>
          <filter id="xe-challenge-glow">
            <feGaussianBlur stdDeviation="3" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <AnimatePresence mode="wait">
          {mode === 0 ? (
            <motion.g
              key="silos"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.45 }}
            >
              {/* Disconnected silo clusters */}
              {[
                { cx: 110, cy: 140, label: 'Clinical' },
                { cx: 290, cy: 120, label: 'ERP' },
                { cx: 200, cy: 280, label: 'Sheets' },
              ].map((cluster, i) => (
                <g key={cluster.label}>
                  <motion.circle
                    cx={cluster.cx}
                    cy={cluster.cy}
                    r={38}
                    fill="var(--hero-panel)"
                    className="dark:fill-[rgba(15,23,42,0.65)]"
                    stroke={accent}
                    strokeWidth={1.5}
                    strokeOpacity={0.55}
                    initial={reduce ? false : { scale: 0.7, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: i * 0.1, duration: 0.55, ease: EASE }}
                  />
                  {[0, 1, 2].map((n) => (
                    <motion.circle
                      key={n}
                      cx={cluster.cx + Math.cos((n / 3) * Math.PI * 2) * 16}
                      cy={cluster.cy + Math.sin((n / 3) * Math.PI * 2) * 16}
                      r={4}
                      fill={accent}
                      animate={reduce ? undefined : { opacity: [0.35, 1, 0.35], r: [3.5, 5, 3.5] }}
                      transition={{ duration: 2.2 + i * 0.3, repeat: Infinity, delay: n * 0.2 }}
                    />
                  ))}
                  {/* Broken link dashes toward center */}
                  <motion.path
                    d={`M ${cluster.cx} ${cluster.cy} L 200 200`}
                    stroke="url(#xe-challenge-thread)"
                    strokeWidth={1.2}
                    strokeDasharray="6 10"
                    fill="none"
                    opacity={0.35}
                    initial={reduce ? false : { pathLength: 0 }}
                    animate={{ pathLength: 0.55 }}
                    transition={{ duration: 1.1, delay: 0.2 + i * 0.12, ease: EASE }}
                  />
                </g>
              ))}
              <motion.circle
                cx={200}
                cy={200}
                r={10}
                fill="#06B6D4"
                filter="url(#xe-challenge-glow)"
                animate={reduce ? undefined : { opacity: [0.4, 0.9, 0.4] }}
                transition={{ duration: 2.4, repeat: Infinity }}
              />
            </motion.g>
          ) : null}

          {mode === 1 ? (
            <motion.g
              key="neural"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.45 }}
            >
              {/* Neural ring that never reaches the ground plane */}
              {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
                const a = (i / 8) * Math.PI * 2 - Math.PI / 2
                const x = 200 + Math.cos(a) * 95
                const y = 175 + Math.sin(a) * 70
                return (
                  <motion.circle
                    key={i}
                    cx={x}
                    cy={y}
                    r={7}
                    fill={i % 2 ? '#06B6D4' : '#0D9488'}
                    filter="url(#xe-challenge-glow)"
                    animate={reduce ? undefined : { cy: [y, y - 6, y], opacity: [0.55, 1, 0.55] }}
                    transition={{ duration: 2.8, repeat: Infinity, delay: i * 0.12 }}
                  />
                )
              })}
              {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
                const a1 = (i / 8) * Math.PI * 2 - Math.PI / 2
                const a2 = ((i + 3) / 8) * Math.PI * 2 - Math.PI / 2
                return (
                  <motion.line
                    key={`l-${i}`}
                    x1={200 + Math.cos(a1) * 95}
                    y1={175 + Math.sin(a1) * 70}
                    x2={200 + Math.cos(a2) * 95}
                    y2={175 + Math.sin(a2) * 70}
                    stroke="url(#xe-challenge-thread)"
                    strokeWidth={1}
                    animate={reduce ? { opacity: 0.4 } : { opacity: [0.2, 0.55, 0.2] }}
                    transition={{ duration: 3, repeat: Infinity, delay: i * 0.08 }}
                  />
                )
              })}
              {/* Ground / reality plane — unreachable */}
              <motion.rect
                x={90}
                y={310}
                width={220}
                height={18}
                rx={9}
                fill="rgba(255,255,255,0.06)"
                stroke="rgba(255,255,255,0.15)"
              />
              <motion.path
                d="M200 245 L200 300"
                stroke={accent}
                strokeWidth={1.5}
                strokeDasharray="4 8"
                opacity={0.5}
                animate={reduce ? undefined : { opacity: [0.2, 0.7, 0.2] }}
                transition={{ duration: 1.6, repeat: Infinity }}
              />
              <text
                x={200}
                y={338}
                textAnchor="middle"
                fill="rgba(148,163,184,0.9)"
                fontSize={11}
                fontFamily="var(--font-sans), system-ui"
              >
                Production reality
              </text>
            </motion.g>
          ) : null}

          {mode === 2 ? (
            <motion.g
              key="generic"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.45 }}
            >
              {[0, 1, 2].flatMap((row) =>
                [0, 1, 2].map((col) => {
                  const x = 95 + col * 70
                  const y = 95 + row * 70
                  return (
                    <motion.rect
                      key={`${row}-${col}`}
                      x={x}
                      y={y}
                      width={52}
                      height={52}
                      rx={14}
                      fill="rgba(255,255,255,0.04)"
                      stroke="rgba(148,163,184,0.35)"
                      strokeWidth={1}
                      initial={reduce ? false : { opacity: 0, scale: 0.8 }}
                      animate={{
                        opacity: [0.35, 0.75, 0.35],
                        y: reduce ? y : [y, y - 4, y],
                      }}
                      transition={{
                        duration: 3.2,
                        repeat: Infinity,
                        delay: (row + col) * 0.12,
                        ease: 'easeInOut',
                      }}
                    />
                  )
                }),
              )}
              {/* Fading brand mark */}
              <motion.text
                x={200}
                y={340}
                textAnchor="middle"
                fill={accent}
                fontSize={13}
                fontFamily="var(--font-display), system-ui"
                fontWeight={600}
                animate={reduce ? undefined : { opacity: [0.25, 0.85, 0.25] }}
                transition={{ duration: 2.8, repeat: Infinity }}
              >
                Identity fading…
              </motion.text>
            </motion.g>
          ) : null}
        </AnimatePresence>
      </svg>

      {/* Floating glass chip */}
      <motion.div
        className="absolute top-[12%] right-[4%] rounded-2xl border border-[color:var(--hero-panel-border)] bg-[color:var(--hero-panel)] px-3 py-2 shadow-[var(--shadow-light)] backdrop-blur-xl dark:border-white/15 dark:bg-white/[0.07] dark:shadow-none"
        animate={reduce ? undefined : { y: [0, -8, 0] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
      >
        <p className="text-[9px] tracking-[0.16em] text-[color:var(--color-accent)]/80 uppercase dark:text-cyan-200/80">
          Signal
        </p>
        <p className="font-display text-sm font-semibold text-[color:var(--hero-text)]">Live</p>
      </motion.div>
    </div>
  )
}

export function StoryChallenge({ eyebrow = 'The challenge', heading, items }: StoryChallengeProps) {
  const mounted = useMounted()
  const reduce = useReducedMotion()
  const isDesktop = useMediaQuery('(min-width: 1024px)')
  // Wait for mount so SSR + first client paint stay in sync (no media/reduced-motion mismatch)
  const sticky = mounted && !reduce && isDesktop
  const list = items?.length ? items : FALLBACK
  const chapters = useMemo(
    () =>
      list.slice(0, 3).map((item, i) => ({
        ...item,
        ...CHAPTER_META[i % CHAPTER_META.length],
      })),
    [list],
  )
  const count = Math.max(chapters.length, 1)
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
  const mx = useMotionValue(50)
  const my = useMotionValue(40)
  const sx = useSpring(mx, { stiffness: 40, damping: 22 })
  const sy = useSpring(my, { stiffness: 40, damping: 22 })
  const cursorGlow = useMotionTemplate`radial-gradient(ellipse 50% 40% at ${sx}% ${sy}%, rgba(13,148,136,0.28), transparent 60%)`

  useEffect(() => {
    if (!sticky) return
    const onMove = (e: PointerEvent) => {
      mx.set((e.clientX / window.innerWidth) * 100)
      my.set((e.clientY / window.innerHeight) * 100)
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [sticky, mx, my])

  const current = chapters[active] ?? chapters[0]
  const mode = (active % 3) as 0 | 1 | 2

  // Mobile / reduced motion / pre-hydration: stacked chapters — no sticky pin
  if (!sticky) {
    return (
      <section className="surface-navy relative overflow-hidden bg-[color:var(--hero-bg)] py-20 text-[color:var(--hero-text)] sm:py-24 lg:py-32">
        <Container>
          <p className="text-[11px] font-bold tracking-[0.22em] text-teal-300 uppercase">
            {eyebrow}
          </p>
          <h2 className="font-display mt-5 max-w-3xl text-[clamp(1.85rem,6vw,3.5rem)] font-bold tracking-[-0.04em] text-white">
            {heading}
          </h2>
          <ul className="mt-12 space-y-10 sm:mt-16 sm:space-y-12">
            {chapters.map((ch, i) => (
              <li key={ch.title} className="border-l-2 border-teal-500/50 pl-5 sm:pl-6">
                <p className="font-display text-sm tracking-[0.16em] text-teal-300">
                  {String(i + 1).padStart(2, '0')}
                </p>
                <h3 className="font-display mt-2 text-xl font-semibold text-white sm:text-2xl">
                  {ch.title}
                </h3>
                {ch.body ? (
                  <p className="mt-3 max-w-xl text-sm leading-relaxed text-slate-300 sm:text-base">
                    {ch.body}
                  </p>
                ) : null}
                <p className="font-display mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                  {ch.statValue}
                  {ch.statSuffix}
                  <span className="mt-1 block text-sm font-medium tracking-normal text-slate-400">
                    {ch.statLabel}
                  </span>
                </p>
              </li>
            ))}
          </ul>
        </Container>
      </section>
    )
  }

  return (
    <section
      ref={containerRef}
      className="relative"
      style={{ height: `${count * 100}vh` }}
      aria-label={eyebrow || 'The challenge'}
    >
      <div className="surface-navy sticky top-0 h-[100svh] overflow-hidden bg-[color:var(--hero-bg)] text-[color:var(--hero-text)]">
        {/* Background atmosphere */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_15%_20%,var(--hero-glow),transparent_55%),radial-gradient(ellipse_70%_50%_at_90%_80%,var(--hero-glow-2),transparent_50%)]"
        />
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-90"
          style={{ backgroundImage: cursorGlow }}
        />
        <motion.div
          aria-hidden
          className="pointer-events-none absolute -top-32 left-1/4 h-[28rem] w-[28rem] rounded-full bg-[radial-gradient(circle,rgba(13,148,136,0.35),transparent_70%)] blur-3xl"
          animate={{ x: [0, 40, 0], y: [0, 30, 0], opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          aria-hidden
          className="pointer-events-none absolute right-0 bottom-0 h-[24rem] w-[24rem] rounded-full bg-[radial-gradient(circle,rgba(6,182,212,0.28),transparent_70%)] blur-3xl"
          animate={{ x: [0, -30, 0], y: [0, -24, 0], opacity: [0.35, 0.6, 0.35] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.55) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.55) 1px, transparent 1px)',
            backgroundSize: '64px 64px',
            maskImage: 'radial-gradient(ellipse at center, black 25%, transparent 78%)',
          }}
        />
        {/* Particles */}
        {!reduce
          ? Array.from({ length: 14 }).map((_, i) => (
              <motion.span
                key={i}
                aria-hidden
                className="pointer-events-none absolute h-1 w-1 rounded-full bg-cyan-300/50"
                style={{
                  left: `${8 + ((i * 17) % 84)}%`,
                  top: `${12 + ((i * 23) % 76)}%`,
                }}
                animate={{ y: [0, -18, 0], opacity: [0.2, 0.8, 0.2] }}
                transition={{
                  duration: 4 + (i % 5),
                  repeat: Infinity,
                  delay: i * 0.25,
                  ease: 'easeInOut',
                }}
              />
            ))
          : null}

        <Container className="relative z-10 flex h-full flex-col justify-center py-16 lg:py-20">
          <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.1fr)_minmax(0,1fr)] lg:gap-8 xl:gap-12">
            {/* LEFT — title + progress */}
            <div className="relative">
              <p className="text-[11px] font-bold tracking-[0.22em] text-[color:var(--color-accent)] uppercase">
                {eyebrow}
              </p>
              <h2 className="font-display mt-4 max-w-md text-[clamp(2.2rem,4.2vw,3.6rem)] leading-[1.02] font-bold tracking-[-0.045em] text-balance text-[color:var(--hero-text)]">
                {heading}
              </h2>

              <div className="mt-12 flex gap-6">
                <div className="relative hidden h-48 w-px overflow-hidden bg-[color:var(--hero-panel-border)] sm:block dark:bg-white/10">
                  <motion.div
                    className="absolute top-0 left-0 w-full origin-top bg-gradient-to-b from-teal-400 to-cyan-400"
                    style={{ height: progressHeight }}
                  />
                </div>
                <ol className="flex flex-row gap-3 sm:flex-col sm:gap-5">
                  {chapters.map((ch, i) => {
                    const done = i < active
                    const currentStep = i === active
                    return (
                      <li key={ch.title} className="flex items-center gap-3">
                        <span
                          className={cn(
                            'font-display grid h-9 w-9 place-items-center rounded-full border text-xs font-bold transition-colors duration-500',
                            currentStep
                              ? 'border-[color:var(--color-accent)] bg-[color:var(--color-accent)] text-white shadow-[0_0_28px_var(--color-accent-glow)]'
                              : done
                                ? 'border-[color:var(--color-accent)]/60 bg-[color:var(--color-accent-soft)] text-[color:var(--color-accent)]'
                                : 'border-[color:var(--hero-panel-border)] bg-[color:var(--hero-panel)] text-[color:var(--hero-muted)]',
                          )}
                        >
                          {String(i + 1).padStart(2, '0')}
                        </span>
                        <span
                          className={cn(
                            'hidden max-w-[10rem] truncate text-sm sm:block',
                            currentStep
                              ? 'font-semibold text-[color:var(--hero-text)]'
                              : done
                                ? 'text-[color:var(--color-accent)]'
                                : 'text-[color:var(--hero-muted)]',
                          )}
                        >
                          {ch.title.split(' ').slice(0, 3).join(' ')}…
                        </span>
                      </li>
                    )
                  })}
                </ol>
              </div>
            </div>

            {/* CENTER — visualization */}
            <div className="relative order-first lg:order-none">
              <ChallengeVisual mode={mode} accent={current?.accent || '#0D9488'} reduce={reduce} />
            </div>

            {/* RIGHT — one chapter */}
            <div className="relative min-h-[16rem] lg:min-h-[22rem]">
              <AnimatePresence mode="wait">
                <motion.article
                  key={current?.title || active}
                  initial={{ opacity: 0, y: 28, filter: 'blur(8px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, y: -20, filter: 'blur(6px)' }}
                  transition={{ duration: 0.55, ease: EASE }}
                  className="relative"
                >
                  <div className="mb-6 inline-flex items-center gap-3 rounded-full border border-[color:var(--hero-panel-border)] bg-[color:var(--hero-panel)] px-4 py-2 shadow-[var(--shadow-light)] backdrop-blur-md dark:border-white/15 dark:bg-white/[0.06] dark:shadow-none">
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{
                        background: current?.accent,
                        boxShadow: `0 0 16px ${current?.accent}`,
                      }}
                    />
                    <span className="font-display text-xs tracking-[0.18em] text-[color:var(--color-accent)] uppercase dark:text-cyan-200/90">
                      Challenge {String(active + 1).padStart(2, '0')}
                    </span>
                  </div>

                  <h3 className="font-display text-[clamp(1.6rem,3vw,2.4rem)] leading-[1.1] font-semibold tracking-[-0.035em] text-balance text-[color:var(--hero-text)]">
                    {current?.title}
                  </h3>
                  {current?.body ? (
                    <p className="mt-5 max-w-md text-base leading-relaxed text-[color:var(--hero-muted)] sm:text-lg">
                      {current.body}
                    </p>
                  ) : null}

                  <div className="relative mt-10 overflow-hidden rounded-[24px] border border-[color:var(--hero-panel-border)] bg-[color:var(--hero-panel)] p-5 shadow-[var(--shadow-medium)] backdrop-blur-xl dark:border-white/12 dark:bg-gradient-to-br dark:from-white/[0.09] dark:to-white/[0.02] dark:shadow-[0_24px_80px_rgba(0,0,0,0.35)]">
                    <div
                      aria-hidden
                      className="pointer-events-none absolute inset-0 rounded-[24px]"
                      style={{
                        background: `linear-gradient(135deg, ${current?.accent}33, transparent 40%)`,
                      }}
                    />
                    <p className="font-display relative text-[clamp(2.4rem,5vw,3.5rem)] font-bold tracking-[-0.05em] text-[color:var(--hero-text)]">
                      <CountUp
                        value={current?.statValue ?? 0}
                        suffix={current?.statSuffix ?? ''}
                        active
                      />
                    </p>
                    <p className="relative mt-2 text-sm tracking-wide text-[color:var(--hero-muted)]">
                      {current?.statLabel}
                    </p>
                  </div>

                  <p className="mt-8 text-[11px] tracking-[0.16em] text-[color:var(--hero-muted)] uppercase">
                    Scroll to continue
                    <motion.span
                      className="ml-2 inline-block"
                      animate={{ y: [0, 4, 0] }}
                      transition={{ duration: 1.4, repeat: Infinity }}
                    >
                      ↓
                    </motion.span>
                  </p>
                </motion.article>
              </AnimatePresence>
            </div>
          </div>
        </Container>
      </div>
    </section>
  )
}
