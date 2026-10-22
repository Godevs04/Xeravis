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
const NAV = ['Ops', 'AI', 'Cloud', 'Data', 'Sec'] as const

/* Wide viewBox + h-auto keeps the sparkline full-width at a uniform scale, so the riding dot stays round */
const SPARK_W = 400
const SPARK_LINE = `M0,22 ${SPARK.map((y, i) => `L${(i / (SPARK.length - 1)) * SPARK_W},${28 - y * 0.22}`).join(' ')}`
const SPARK_AREA = `${SPARK_LINE} L${SPARK_W},28 L0,28 Z`

/*
 * Theme colours come from the `.hero-console` --hc-* tokens (tokens.css). Avoid text-white /
 * text-slate-* / border-white / bg-white/ classes: the light-theme `.surface-navy` remaps them.
 */
const AURORA =
  'conic-gradient(from 0deg, rgba(45,212,191,0) 0deg, rgba(45,212,191,0.85) 60deg, rgba(34,211,238,0.6) 120deg, rgba(45,212,191,0) 180deg, rgba(99,102,241,0.45) 260deg, rgba(45,212,191,0) 360deg)'
const CARD =
  'rounded-2xl border border-[color:var(--hc-card-border)] bg-[color:var(--hc-card)] backdrop-blur-sm'

const WIDGETS = [
  {
    id: 'clinical',
    label: 'Clinical AI',
    value: '94.2%',
    sub: 'Precision',
    icon: Stethoscope,
    position: 'top-left',
    delay: 0.85,
    float: 7,
  },
  {
    id: 'cloud',
    label: 'Cloud Status',
    value: 'Healthy',
    sub: '12 regions',
    icon: Radio,
    position: 'top-right',
    delay: 1,
    float: 8.5,
  },
  {
    id: 'security',
    label: 'Security',
    value: 'SOC 2',
    sub: 'Zero critical',
    icon: Lock,
    position: 'bottom-left',
    delay: 1.1,
    float: 9,
  },
  {
    id: 'gpu',
    label: 'Inference',
    value: '12ms',
    sub: 'p99 latency',
    icon: Cpu,
    position: 'bottom-right',
    delay: 1.2,
    float: 6.5,
  },
] as const

const WIDGET_POSITION: Record<(typeof WIDGETS)[number]['position'], string> = {
  'top-left': '-top-8 left-0 -translate-x-2',
  'top-right': '-top-8 right-0 translate-x-2',
  'bottom-left': '-bottom-8 left-0 -translate-x-2',
  'bottom-right': '-bottom-8 right-0 translate-x-2',
}

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

function LiveDot() {
  return (
    <span className="relative flex h-1.5 w-1.5">
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#34D399] opacity-70" />
      <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#34D399]" />
    </span>
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
  const glowBg = useMotionTemplate`radial-gradient(circle at ${glowX}% ${glowY}%, var(--hc-glow), rgba(6,182,212,0.18) 42%, transparent 70%)`
  const spotBg = useMotionTemplate`radial-gradient(420px circle at ${glowX}% ${glowY}%, var(--hc-spot), transparent 60%)`

  const widgetShiftX = useTransform(sx, [-30, 30], reduce ? [0, 0] : [-4, 4])
  const widgetShiftY = useTransform(sy, [-30, 30], reduce ? [0, 0] : [3, -3])

  const [liveBars, setLiveBars] = useState(BARS)
  const [activeNav, setActiveNav] = useState(1)

  useEffect(() => {
    if (reduce) return
    const bars = window.setInterval(() => {
      setLiveBars((prev) =>
        prev.map((v, i) =>
          Math.max(28, Math.min(98, v + ((i % 3) - 1) * 4 + (Math.random() * 8 - 4))),
        ),
      )
    }, 2400)
    const nav = window.setInterval(() => setActiveNav((i) => (i + 1) % NAV.length), 3200)
    return () => {
      clearInterval(bars)
      clearInterval(nav)
    }
  }, [reduce])

  return (
    <div
      ref={ref}
      className="hero-console relative h-full w-full overflow-visible [perspective:1600px]"
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
        className="pointer-events-none absolute inset-x-10 -bottom-8 h-20 rounded-[100%] bg-[rgba(13,148,136,0.28)] blur-3xl"
        animate={reduce ? undefined : { opacity: [0.35, 0.7, 0.35], scaleX: [0.92, 1.04, 0.92] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      />

      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[48px] blur-3xl"
        style={{ background: glowBg }}
        initial={{ opacity: 0 }}
        animate={{ opacity: reduce ? 0.7 : [0.55, 0.9, 0.55] }}
        transition={
          reduce ? { duration: 0.6 } : { duration: 8, repeat: Infinity, ease: 'easeInOut' }
        }
      />

      {/* Orbit rings */}
      {!reduce ? (
        <>
          <motion.div
            aria-hidden
            className="pointer-events-none absolute top-1/2 left-1/2 h-[118%] w-[118%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[rgba(45,212,191,0.16)]"
            animate={{ rotate: 360 }}
            transition={{ duration: 48, repeat: Infinity, ease: 'linear' }}
          >
            <span className="absolute top-0 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-[#5EEAD4] shadow-[0_0_14px_rgba(45,212,191,0.9)]" />
          </motion.div>
          <motion.div
            aria-hidden
            className="pointer-events-none absolute top-1/2 left-1/2 h-[104%] w-[104%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-[rgba(34,211,238,0.1)]"
            animate={{ rotate: -360 }}
            transition={{ duration: 70, repeat: Infinity, ease: 'linear' }}
          >
            <span className="absolute bottom-0 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-[#67E8F9] shadow-[0_0_10px_rgba(34,211,238,0.9)]" />
          </motion.div>
        </>
      ) : null}

      <div className="relative h-full w-full overflow-visible p-4 sm:p-5 md:p-6">
        <motion.div
          style={{
            rotateX: combinedRotateX,
            rotateY,
            y: scrollY,
            transformStyle: 'preserve-3d',
          }}
          className="relative z-10 h-full w-full overflow-visible will-change-transform"
        >
          {/* Aurora border: a rotating conic gradient peeking out 1px around the console */}
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 18, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, ease: EASE }}
            className="absolute inset-5 overflow-hidden rounded-[28px] p-px [box-shadow:var(--hc-shadow)] sm:inset-6 md:inset-7"
          >
            <motion.div
              aria-hidden
              className="pointer-events-none absolute top-1/2 left-1/2 aspect-square w-[160%] -translate-x-1/2 -translate-y-1/2"
              style={{ background: AURORA }}
              animate={reduce ? undefined : { rotate: 360 }}
              transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
            />

            <div className="relative flex h-full w-full flex-col overflow-hidden rounded-[27px] [background:var(--hc-panel)]">
              {/* Faint grid + cursor spotlight */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,#000_30%,transparent_75%)] opacity-40"
                style={{
                  backgroundImage:
                    'linear-gradient(var(--hc-grid) 1px, transparent 1px), linear-gradient(90deg, var(--hc-grid) 1px, transparent 1px)',
                  backgroundSize: '22px 22px',
                }}
              />
              <motion.div
                aria-hidden
                className="pointer-events-none absolute inset-0"
                style={{ background: spotBg }}
              />

              {!reduce ? (
                <>
                  {/* Moving light sheen */}
                  <motion.div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 z-20 bg-[linear-gradient(110deg,transparent_25%,var(--hc-sheen)_45%,transparent_62%)]"
                    animate={{ x: ['-60%', '70%'] }}
                    transition={{
                      duration: 7,
                      repeat: Infinity,
                      ease: 'easeInOut',
                      repeatDelay: 4,
                    }}
                  />
                  {/* Scan line */}
                  <motion.div
                    aria-hidden
                    className="pointer-events-none absolute inset-x-0 top-0 z-20 h-px bg-[linear-gradient(90deg,transparent,rgba(45,212,191,0.75),transparent)] shadow-[0_0_18px_2px_rgba(45,212,191,0.35)]"
                    animate={{ top: ['8%', '96%'], opacity: [0, 1, 1, 0] }}
                    transition={{
                      duration: 5.5,
                      repeat: Infinity,
                      ease: 'easeInOut',
                      repeatDelay: 2.5,
                    }}
                  />
                </>
              ) : null}

              <div className="relative flex shrink-0 items-center gap-2 border-b border-[color:var(--hc-line)] bg-[color:var(--hc-chrome)] px-4 py-3.5">
                <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
                <span className="ml-3 [background-image:var(--hc-title)] bg-clip-text text-[11px] font-semibold tracking-[0.16em] text-transparent uppercase">
                  XELARVIS Control
                </span>
                <span className="ml-auto inline-flex items-center gap-1.5 rounded-full border border-[rgba(52,211,153,0.3)] bg-[rgba(16,185,129,0.12)] px-2.5 py-0.5 text-[10px] font-bold tracking-wide text-[color:var(--hc-live)]">
                  <LiveDot />
                  LIVE
                </span>
              </div>

              <div className="relative grid min-h-0 flex-1 grid-cols-[64px_1fr] grid-rows-[minmax(0,1fr)] sm:grid-cols-[78px_1fr]">
                <aside className="flex flex-col gap-1.5 border-r border-[color:var(--hc-line)] bg-[color:var(--hc-rail)] p-2.5 sm:p-3">
                  {NAV.map((item, i) => (
                    <motion.div
                      key={item}
                      initial={reduce ? false : { opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + i * 0.05, duration: 0.4, ease: EASE }}
                      className="relative flex min-h-[2.25rem] items-center justify-center rounded-xl px-1.5 py-2 text-[9px] font-bold tracking-wide sm:min-h-[2.5rem] sm:text-[10px]"
                    >
                      {i === activeNav ? (
                        <motion.span
                          layoutId="hero-console-nav"
                          className="absolute inset-0 rounded-xl bg-gradient-to-br from-[#0D9488] to-[#0891B2] shadow-[0_8px_24px_rgba(13,148,136,0.5),inset_0_1px_0_rgba(255,255,255,0.25)]"
                          transition={{ type: 'spring', stiffness: 260, damping: 28 }}
                        />
                      ) : (
                        <span className="absolute inset-0 rounded-xl bg-[color:var(--hc-nav-idle)]" />
                      )}
                      <span
                        className={`relative transition-colors duration-300 ${i === activeNav ? 'text-[#F8FAFC]' : 'text-[color:var(--hc-muted)]'}`}
                      >
                        {item}
                      </span>
                    </motion.div>
                  ))}
                </aside>

                <div className="flex min-h-0 flex-col gap-2.5 overflow-hidden p-2.5 sm:gap-3 sm:p-3.5">
                  <div className="grid shrink-0 grid-cols-3 gap-2">
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
                        whileHover={reduce ? undefined : { y: -2 }}
                        className={`${CARD} p-2.5 [box-shadow:var(--hc-card-inset)] transition-colors duration-300 hover:border-[rgba(45,212,191,0.3)] sm:p-3`}
                      >
                        <p className="text-[9px] font-semibold tracking-[0.14em] text-[color:var(--hc-muted)] uppercase sm:text-[10px]">
                          {metric.label}
                        </p>
                        <p className="font-display mt-1 text-base font-bold tracking-tight text-[color:var(--hc-text)] tabular-nums sm:text-xl">
                          <CountUp
                            value={metric.value}
                            delay={0.5 + i * 0.08}
                            suffix={metric.suffix}
                            decimals={metric.decimals}
                          />
                        </p>
                        <div className="relative mt-2 h-1 overflow-hidden rounded-full bg-[color:var(--hc-track)]">
                          <motion.div
                            className="relative h-full overflow-hidden rounded-full bg-gradient-to-r from-[#0D9488] to-[#22D3EE] shadow-[0_0_10px_rgba(34,211,238,0.6)]"
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min(100, metric.value)}%` }}
                            transition={{
                              delay: reduce ? 0 : 0.7 + i * 0.1,
                              duration: 0.9,
                              ease: EASE,
                            }}
                          >
                            {!reduce ? (
                              <motion.span
                                aria-hidden
                                className="absolute inset-y-0 w-1/3 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.7),transparent)]"
                                animate={{ left: ['-35%', '110%'] }}
                                transition={{
                                  duration: 1.8,
                                  repeat: Infinity,
                                  repeatDelay: 2.2 + i * 0.4,
                                  ease: 'easeInOut',
                                }}
                              />
                            ) : null}
                          </motion.div>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  <div className="grid min-h-0 flex-1 grid-cols-[1.15fr_0.85fr] gap-2 sm:gap-2.5">
                    <motion.div
                      initial={reduce ? false : { opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.55, duration: 0.5, ease: EASE }}
                      className={`${CARD} flex min-h-0 flex-col p-2.5 sm:p-3`}
                    >
                      <div className="mb-2 flex items-center justify-between">
                        <p className="text-[10px] font-semibold text-[color:var(--hc-text-soft)] sm:text-xs">
                          Prediction chart
                        </p>
                        <span className="rounded-full border border-[rgba(52,211,153,0.25)] bg-[rgba(16,185,129,0.12)] px-2 py-0.5 text-[9px] font-bold text-[color:var(--hc-live)]">
                          +38% QoQ
                        </span>
                      </div>
                      <div className="flex min-h-12 flex-1 items-end gap-1 sm:gap-1.5">
                        {liveBars.map((v, i) => (
                          <motion.div
                            key={i}
                            className="relative flex-1 origin-bottom rounded-t-md bg-gradient-to-t from-[rgba(13,148,136,0.35)] via-[#14B8A6] to-[#5EEAD4] shadow-[0_0_12px_rgba(45,212,191,0.25)]"
                            initial={reduce ? false : { height: '6%' }}
                            animate={{ height: `${v}%` }}
                            transition={{ duration: 0.9, ease: EASE, delay: reduce ? 0 : 0.02 * i }}
                            style={{ minHeight: 4 }}
                          >
                            <span className="absolute inset-x-0 top-0 h-0.5 rounded-full bg-[#CCFBF1] opacity-80" />
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>

                    <motion.div
                      initial={reduce ? false : { opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.62, duration: 0.5, ease: EASE }}
                      className={`relative flex min-h-0 flex-col overflow-hidden ${CARD} p-2.5 sm:p-3`}
                    >
                      <div className="mb-1.5 flex items-center gap-1.5">
                        <Activity className="h-3 w-3 text-[#2DD4BF]" />
                        <p className="text-[10px] font-semibold text-[color:var(--hc-text-soft)]">
                          Network
                        </p>
                      </div>
                      <div className="min-h-12 flex-1">
                        <ConstellationCanvas className="opacity-95" />
                      </div>
                    </motion.div>
                  </div>

                  <motion.div
                    initial={reduce ? false : { opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7, duration: 0.45, ease: EASE }}
                    className={`${CARD} shrink-0 px-3 py-2`}
                  >
                    <div className="mb-1.5 flex items-center justify-between">
                      <p className="text-[10px] font-semibold text-[color:var(--hc-muted)]">
                        Cloud deployment timeline
                      </p>
                      <motion.span
                        animate={
                          reduce ? undefined : { rotate: [0, 18, -12, 0], scale: [1, 1.15, 1] }
                        }
                        transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
                        className="inline-flex"
                      >
                        <Sparkles className="h-3 w-3 text-[#2DD4BF]" />
                      </motion.span>
                    </div>
                    <svg
                      viewBox={`0 0 ${SPARK_W} 28`}
                      className="h-auto w-full overflow-visible"
                      aria-hidden
                    >
                      <defs>
                        <linearGradient id="hero-spark" x1="0" y1="0" x2="1" y2="0">
                          <stop offset="0%" stopColor="#0D9488" />
                          <stop offset="100%" stopColor="#22D3EE" />
                        </linearGradient>
                        <linearGradient id="hero-spark-fill" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#2DD4BF" stopOpacity="0.28" />
                          <stop offset="100%" stopColor="#2DD4BF" stopOpacity="0" />
                        </linearGradient>
                      </defs>
                      <motion.path
                        d={SPARK_AREA}
                        fill="url(#hero-spark-fill)"
                        initial={reduce ? false : { opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.6, duration: 0.8 }}
                      />
                      <motion.path
                        d={SPARK_LINE}
                        fill="none"
                        stroke="url(#hero-spark)"
                        strokeWidth="2"
                        strokeLinecap="round"
                        initial={reduce ? false : { pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ delay: 0.9, duration: 1.6, ease: EASE }}
                      />
                      {!reduce ? (
                        <circle
                          r="2.6"
                          style={{
                            fill: 'var(--hc-spark-dot)',
                            filter: 'drop-shadow(0 0 4px #22D3EE)',
                          }}
                        >
                          <animateMotion dur="6s" repeatCount="indefinite" path={SPARK_LINE} />
                        </circle>
                      ) : null}
                    </svg>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Floating widgets — symmetric corners, inside 3D panel for aligned parallax */}
          {WIDGETS.map((w) => {
            const Icon = w.icon
            return (
              <motion.div
                key={w.id}
                className={`pointer-events-auto absolute z-30 hidden sm:block ${WIDGET_POSITION[w.position]}`}
                style={{ x: widgetShiftX, y: widgetShiftY }}
                initial={reduce ? false : { opacity: 0, scale: 0.9, filter: 'blur(6px)' }}
                animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                transition={{ delay: w.delay, duration: 0.6, ease: EASE }}
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
                  whileHover={reduce ? undefined : { scale: 1.05 }}
                  className="group relative"
                >
                  <div className="relative w-[156px] overflow-hidden rounded-2xl border border-[color:var(--hc-widget-border)] bg-[color:var(--hc-widget)] px-3 py-2.5 [box-shadow:var(--hc-widget-shadow)] backdrop-blur-xl transition-[box-shadow,border-color] duration-300 group-hover:border-[rgba(45,212,191,0.45)] group-hover:[box-shadow:0_22px_56px_-10px_rgba(13,148,136,0.45)]">
                    <span
                      aria-hidden
                      className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(94,234,212,0.7),transparent)]"
                    />
                    <div className="flex items-start gap-2">
                      <span className="relative grid h-7 w-7 shrink-0 place-items-center rounded-lg [background-image:var(--hc-icon-bg)] text-[color:var(--hc-icon)] ring-1 ring-[color:var(--hc-ring)]">
                        <Icon className="h-3.5 w-3.5" aria-hidden />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="flex items-center gap-1.5 text-[9px] font-bold tracking-[0.12em] whitespace-nowrap text-[color:var(--hc-muted)] uppercase">
                          {w.label}
                          {w.id === 'cloud' ? <LiveDot /> : null}
                        </p>
                        <p className="font-display text-sm leading-tight font-bold text-[color:var(--hc-text)]">
                          {w.value}
                        </p>
                        <p className="mt-0.5 text-[10px] leading-snug text-[color:var(--hc-muted)]">
                          {w.sub}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )
          })}
        </motion.div>

        <motion.div
          className="pointer-events-none absolute top-[42%] right-[2%] z-30 sm:hidden"
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.45 }}
        >
          <div className="rounded-full bg-gradient-to-r from-[#0D9488] to-[#06B6D4] px-3 py-1 text-[10px] font-bold text-[#FFFFFF] shadow-[0_10px_28px_rgba(13,148,136,0.45)]">
            AI live
          </div>
        </motion.div>
      </div>
    </div>
  )
}
