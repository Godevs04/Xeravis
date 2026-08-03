'use client'

import { ConstellationCanvas } from '@/components/marketing/ConstellationCanvas'
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type MotionValue,
} from 'framer-motion'
import { Activity, Cpu, Lock, Radio, Sparkles, Stethoscope } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

const EASE = [0.22, 1, 0.36, 1] as const

const BARS = [42, 58, 36, 74, 52, 88, 64, 92, 70, 80, 55, 96]
const SPARK = [28, 36, 32, 48, 44, 62, 58, 74, 68, 82, 78, 90, 84, 96]

const WIDGETS = [
  {
    id: 'clinical',
    label: 'Clinical AI',
    value: '94.2%',
    sub: 'Precision',
    icon: Stethoscope,
    className: 'top-[4%] left-0 sm:-left-1',
    delay: 0.85,
    float: 7,
  },
  {
    id: 'cloud',
    label: 'Cloud Status',
    value: 'Healthy',
    sub: '12 regions',
    icon: Radio,
    className: 'top-0 right-0 sm:-right-1',
    delay: 1,
    float: 8.5,
  },
  {
    id: 'security',
    label: 'Security',
    value: 'SOC 2',
    sub: 'Zero critical',
    icon: Lock,
    className: 'bottom-[10%] left-0 sm:-left-1',
    delay: 1.1,
    float: 9,
  },
  {
    id: 'gpu',
    label: 'GPU / Inference',
    value: '12ms',
    sub: 'p99 latency',
    icon: Cpu,
    className: 'right-0 bottom-[6%] sm:-right-1',
    delay: 1.2,
    float: 6.5,
  },
] as const

function CountUp({
  value,
  delay = 0,
  suffix = '',
  decimals = 0,
}: {
  value: number
  delay?: number
  suffix?: string
  decimals?: number
}) {
  const reduce = useReducedMotion()
  const [n, setN] = useState(reduce ? value : 0)

  useEffect(() => {
    if (reduce) {
      setN(value)
      return
    }
    let frame = 0
    const timeout = window.setTimeout(() => {
      const duration = 1100
      const start = performance.now()
      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / duration)
        const eased = 1 - Math.pow(1 - t, 3)
        const next = value * eased
        setN(decimals > 0 ? Number(next.toFixed(decimals)) : Math.round(next))
        if (t < 1) frame = requestAnimationFrame(tick)
      }
      frame = requestAnimationFrame(tick)
    }, delay * 1000)
    return () => {
      clearTimeout(timeout)
      cancelAnimationFrame(frame)
    }
  }, [value, delay, reduce, decimals])

  return (
    <>
      {decimals > 0 ? n.toFixed(decimals) : n}
      {suffix}
    </>
  )
}

type HeroProductVisualProps = {
  scrollProgress?: MotionValue<number>
}

/** Premium floating AI control surface for the hero */
export function HeroProductVisual({ scrollProgress }: HeroProductVisualProps) {
  const reduce = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const fallbackScroll = useMotionValue(0)
  const progress = scrollProgress ?? fallbackScroll
  const sx = useSpring(mx, { stiffness: 90, damping: 20, mass: 0.55 })
  const sy = useSpring(my, { stiffness: 90, damping: 20, mass: 0.55 })

  const scrollTilt = useTransform(progress, [0, 1], [0, reduce ? 0 : -5])
  const scrollY = useTransform(progress, [0, 1], [0, reduce ? 0 : 28])
  const rotateX = useTransform(sy, [-30, 30], reduce ? [0, 0] : [5, -5])
  const rotateY = useTransform(sx, [-30, 30], reduce ? [0, 0] : [-5, 5])
  const combinedRotateX = useTransform([rotateX, scrollTilt], ([rx, st]) => Number(rx) + Number(st))
  const glowX = useTransform(sx, [-30, 30], [36, 64])
  const glowY = useTransform(sy, [-30, 30], [26, 54])
  const glowBg = useMotionTemplate`radial-gradient(circle at ${glowX}% ${glowY}%, rgba(13,148,136,0.55), rgba(6,182,212,0.2) 42%, transparent 70%)`

  const widgetShiftX = useTransform(sx, [-30, 30], reduce ? [0, 0] : [-4, 4])
  const widgetShiftY = useTransform(sy, [-30, 30], reduce ? [0, 0] : [3, -3])

  // Live bar pulse heights
  const [liveBars, setLiveBars] = useState(BARS)
  useEffect(() => {
    if (reduce) return
    const id = window.setInterval(() => {
      setLiveBars((prev) =>
        prev.map((v, i) =>
          Math.max(28, Math.min(98, v + ((i % 3) - 1) * 4 + (Math.random() * 8 - 4))),
        ),
      )
    }, 2400)
    return () => clearInterval(id)
  }, [reduce])

  return (
    <div
      ref={ref}
      className="relative mx-auto aspect-[5/4] w-full max-w-2xl overflow-visible [perspective:1600px] lg:max-w-none"
      onMouseMove={(e) => {
        if (reduce) return
        const rect = ref.current?.getBoundingClientRect()
        if (!rect) return
        mx.set(((e.clientX - rect.left) / rect.width - 0.5) * 60)
        my.set(((e.clientY - rect.top) / rect.height - 0.5) * 60)
      }}
      onMouseLeave={() => {
        mx.set(0)
        my.set(0)
      }}
    >
      {/* Soft reflection plane */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-x-8 -bottom-6 h-16 rounded-[100%] bg-cyan-400/10 blur-2xl"
        animate={reduce ? undefined : { opacity: [0.25, 0.5, 0.25] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      />

      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[48px] blur-3xl"
        style={{ background: glowBg }}
        initial={{ opacity: 0 }}
        animate={{ opacity: reduce ? 0.65 : [0.5, 0.82, 0.5] }}
        transition={
          reduce ? { duration: 0.6 } : { duration: 8, repeat: Infinity, ease: 'easeInOut' }
        }
      />

      {/* Orbit ring */}
      {!reduce ? (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute top-1/2 left-1/2 h-[118%] w-[118%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-400/15"
          animate={{ rotate: 360 }}
          transition={{ duration: 48, repeat: Infinity, ease: 'linear' }}
        >
          <span className="absolute top-0 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.8)]" />
        </motion.div>
      ) : null}

      <motion.div
        initial={reduce ? false : { opacity: 0, y: 36, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.9, ease: EASE, delay: 0.12 }}
        className="relative h-full w-full overflow-visible"
      >
        <motion.div
          style={{
            rotateX: combinedRotateX,
            rotateY,
            y: scrollY,
            transformStyle: 'preserve-3d',
          }}
          className="relative z-10 h-full w-full overflow-visible will-change-transform"
        >
          {/* Main glass dashboard — theme-aware product chrome */}
          <div className="absolute inset-y-3 right-6 left-6 overflow-hidden rounded-[28px] border border-[color:var(--hero-panel-border)] bg-[color:var(--hero-panel)] shadow-[var(--shadow-floating)] backdrop-blur-xl sm:inset-y-4 sm:right-10 sm:left-10 lg:right-12 lg:left-12 dark:border-white/15 dark:bg-[#0B1224]/88 dark:shadow-[0_28px_90px_rgba(0,0,0,0.55)]">
            {/* Moving light sheen */}
            {!reduce ? (
              <motion.div
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-[linear-gradient(110deg,transparent_20%,rgba(15,23,42,0.04)_42%,transparent_65%)] dark:bg-[linear-gradient(110deg,transparent_20%,rgba(255,255,255,0.08)_42%,transparent_65%)]"
                animate={{ x: ['-40%', '60%'] }}
                transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut', repeatDelay: 3 }}
              />
            ) : null}

            <div className="relative flex items-center gap-2 border-b border-[color:var(--hero-panel-border)] bg-[color:var(--color-neutral)]/80 px-4 py-3.5 dark:border-white/10 dark:bg-[#0F172A]/90">
              <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
              <span className="ml-3 text-[11px] font-semibold tracking-[0.12em] text-[color:var(--hero-muted)] uppercase">
                Xelarvis Control
              </span>
              <span className="ml-auto inline-flex items-center gap-1.5 rounded-full bg-[color:var(--color-accent-soft)] px-2.5 py-0.5 text-[10px] font-bold tracking-wide text-[color:var(--color-accent)] dark:text-[#5EEAD4]">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500 dark:bg-emerald-400" />
                LIVE
              </span>
            </div>

            <div className="grid h-[calc(100%-50px)] grid-cols-[64px_1fr] sm:grid-cols-[78px_1fr]">
              <aside className="space-y-1.5 border-r border-[color:var(--hero-panel-border)] bg-[color:var(--color-neutral)]/70 p-2.5 sm:p-3 dark:border-white/10 dark:bg-[#0F172A]/80">
                {['Ops', 'AI', 'Cloud', 'Data', 'Sec'].map((item, i) => (
                  <motion.div
                    key={item}
                    initial={reduce ? false : { opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + i * 0.05, duration: 0.4, ease: EASE }}
                    className={`rounded-xl px-1.5 py-2 text-center text-[9px] font-bold tracking-wide sm:text-[10px] ${
                      i === 1
                        ? 'bg-gradient-to-br from-[#0D9488] to-[#06B6D4] text-white shadow-[0_8px_20px_rgba(13,148,136,0.45)]'
                        : 'bg-[color:var(--color-hover)] text-[color:var(--hero-muted)] dark:bg-white/5 dark:text-slate-400'
                    }`}
                  >
                    {item}
                  </motion.div>
                ))}
              </aside>

              <div className="space-y-2.5 overflow-hidden bg-[color:var(--hero-bg)] p-2.5 sm:space-y-3 sm:p-3.5 dark:bg-gradient-to-br dark:from-[#0F172A] dark:via-[#0B1224] dark:to-[#020617]">
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: 'Accuracy', value: 99.2, suffix: '%', decimals: 1 },
                    { label: 'Uptime', value: 99.98, suffix: '%', decimals: 2 },
                    { label: 'Deploys', value: 120, suffix: '+', decimals: 0 },
                  ].map((metric, i) => (
                    <motion.div
                      key={metric.label}
                      initial={reduce ? false : { opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.38 + i * 0.08, duration: 0.5, ease: EASE }}
                      className="rounded-2xl border border-[color:var(--hero-panel-border)] bg-[color:var(--hero-panel)] p-2.5 shadow-[var(--shadow-light)] sm:p-3 dark:border-white/10 dark:bg-white/[0.06] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]"
                    >
                      <p className="text-[9px] font-semibold tracking-[0.12em] text-[color:var(--hero-muted)] uppercase sm:text-[10px]">
                        {metric.label}
                      </p>
                      <p className="font-display mt-1 text-base font-bold tracking-tight text-[color:var(--hero-text)] tabular-nums sm:text-xl">
                        <CountUp
                          value={metric.value}
                          delay={0.5 + i * 0.08}
                          suffix={metric.suffix}
                          decimals={metric.decimals}
                        />
                      </p>
                      <div className="mt-2 h-1 overflow-hidden rounded-full bg-[color:var(--hero-panel-border)] dark:bg-white/10">
                        <motion.div
                          className="h-full rounded-full bg-gradient-to-r from-[#0D9488] to-[#22D3EE]"
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min(100, metric.value)}%` }}
                          transition={{
                            delay: reduce ? 0 : 0.7 + i * 0.1,
                            duration: 0.9,
                            ease: EASE,
                          }}
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="grid grid-cols-[1.15fr_0.85fr] gap-2 sm:gap-2.5">
                  <motion.div
                    initial={reduce ? false : { opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.55, duration: 0.5, ease: EASE }}
                    className="rounded-2xl border border-[color:var(--hero-panel-border)] bg-[color:var(--hero-panel)] p-2.5 sm:p-3 dark:border-white/10 dark:bg-white/[0.05]"
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <p className="text-[10px] font-semibold text-[color:var(--hero-text)] sm:text-xs">
                        Prediction chart
                      </p>
                      <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[9px] font-bold text-emerald-600 dark:text-emerald-400">
                        +38% QoQ
                      </span>
                    </div>
                    <div className="flex h-16 items-end gap-1 sm:h-20 sm:gap-1.5">
                      {liveBars.map((v, i) => (
                        <motion.div
                          key={i}
                          className="flex-1 origin-bottom rounded-t-md bg-gradient-to-t from-[#0D9488] to-[#99F6E4]"
                          animate={{ height: `${v}%` }}
                          transition={{ duration: 0.8, ease: EASE }}
                          style={{ minHeight: 4 }}
                        />
                      ))}
                    </div>
                  </motion.div>

                  <motion.div
                    initial={reduce ? false : { opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.62, duration: 0.5, ease: EASE }}
                    className="relative overflow-hidden rounded-2xl border border-[color:var(--hero-panel-border)] bg-[color:var(--hero-panel)] p-2.5 sm:p-3 dark:border-white/10 dark:bg-white/[0.05]"
                  >
                    <div className="mb-1.5 flex items-center gap-1.5">
                      <Activity className="h-3 w-3 text-[color:var(--color-accent)]" />
                      <p className="text-[10px] font-semibold text-[color:var(--hero-text)]">
                        Network
                      </p>
                    </div>
                    <div className="h-[4.5rem] sm:h-[5.25rem]">
                      <ConstellationCanvas className="opacity-95" />
                    </div>
                  </motion.div>
                </div>

                <motion.div
                  initial={reduce ? false : { opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7, duration: 0.45, ease: EASE }}
                  className="rounded-2xl border border-[color:var(--hero-panel-border)] bg-[color:var(--hero-panel)] px-3 py-2 dark:border-white/10 dark:bg-white/[0.04]"
                >
                  <div className="mb-1.5 flex items-center justify-between">
                    <p className="text-[10px] font-semibold text-[color:var(--hero-muted)]">
                      Cloud deployment timeline
                    </p>
                    <Sparkles className="h-3 w-3 text-[color:var(--color-accent)]" />
                  </div>
                  <svg viewBox="0 0 200 28" className="h-7 w-full" aria-hidden>
                    <path
                      d={`M0,22 ${SPARK.map((y, i) => `L${(i / (SPARK.length - 1)) * 200},${28 - y * 0.22}`).join(' ')}`}
                      fill="none"
                      stroke="url(#hero-spark)"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    <defs>
                      <linearGradient id="hero-spark" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#0D9488" />
                        <stop offset="100%" stopColor="#06B6D4" />
                      </linearGradient>
                    </defs>
                    {!reduce ? (
                      <motion.circle
                        cx="200"
                        cy="6"
                        r="2.5"
                        fill="#67E8F9"
                        animate={{ cx: [0, 200], cy: [22, 6, 18, 8, 6], opacity: [0.4, 1, 0.7, 1] }}
                        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                      />
                    ) : null}
                  </svg>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Floating widgets sit above the 3D panel so they never tuck behind it */}
        {WIDGETS.map((w) => {
          const Icon = w.icon
          return (
            <motion.div
              key={w.id}
              className={`pointer-events-auto absolute z-30 hidden max-w-[148px] sm:block ${w.className}`}
              style={{ x: widgetShiftX, y: widgetShiftY }}
              initial={reduce ? false : { opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: w.delay, duration: 0.5, ease: EASE }}
            >
              <motion.div
                animate={reduce ? undefined : { y: [0, -w.float, 0] }}
                transition={
                  reduce
                    ? undefined
                    : {
                        delay: w.delay + 0.4,
                        duration: w.float + 1.5,
                        repeat: Infinity,
                        ease: 'easeInOut',
                      }
                }
                whileHover={reduce ? undefined : { scale: 1.04 }}
                className="relative"
              >
                <div className="rounded-2xl border border-[color:var(--hero-panel-border)] bg-[color:var(--hero-panel)] px-3 py-2.5 shadow-[var(--shadow-medium)] ring-1 ring-[color:var(--color-accent-soft)] backdrop-blur-xl transition-shadow hover:shadow-[var(--shadow-hover)] hover:ring-[color:var(--color-accent-glow)] dark:border-white/25 dark:bg-[#0B1224] dark:shadow-[0_18px_44px_rgba(0,0,0,0.55)] dark:ring-cyan-400/15 dark:hover:shadow-[0_18px_48px_rgba(13,148,136,0.32)] dark:hover:ring-cyan-300/30">
                  <div className="flex items-center gap-2">
                    <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-gradient-to-br from-teal-500/20 to-cyan-500/15 text-[color:var(--color-accent)] dark:from-teal-500/30 dark:to-cyan-500/25 dark:text-cyan-200">
                      <Icon className="h-3.5 w-3.5" aria-hidden />
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-[9px] font-bold tracking-[0.12em] text-[color:var(--hero-muted)] uppercase">
                        {w.label}
                      </p>
                      <p className="font-display text-sm font-bold text-[color:var(--hero-text)]">
                        {w.value}
                      </p>
                    </div>
                  </div>
                  <p className="mt-1 truncate pl-9 text-[10px] text-[color:var(--hero-muted)]">
                    {w.sub}
                  </p>
                </div>
              </motion.div>
            </motion.div>
          )
        })}

        <motion.div
          className="pointer-events-none absolute top-[42%] right-[2%] z-30 sm:hidden"
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.45 }}
        >
          <div className="rounded-full bg-gradient-to-r from-[#0D9488] to-[#06B6D4] px-3 py-1 text-[10px] font-bold text-white shadow-[0_10px_28px_rgba(13,148,136,0.45)]">
            AI live
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}
