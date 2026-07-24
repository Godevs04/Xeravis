'use client'

import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from 'framer-motion'
import { useEffect, useRef, useState } from 'react'

const EASE = [0.22, 1, 0.36, 1] as const

const METRICS = [
  { label: 'Uptime', value: 99, suffix: '.9%' },
  { label: 'Delivery', value: 94, suffix: '%' },
  { label: 'NPS', value: 72, suffix: '' },
]

const BARS = [42, 58, 36, 74, 52, 88, 64, 92, 70, 80, 55, 96]

function CountUp({
  value,
  delay = 0,
  suffix = '%',
}: {
  value: number
  delay?: number
  suffix?: string
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
      const duration = 1000
      const start = performance.now()
      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / duration)
        const eased = 1 - Math.pow(1 - t, 3)
        setN(Math.round(value * eased))
        if (t < 1) frame = requestAnimationFrame(tick)
      }
      frame = requestAnimationFrame(tick)
    }, delay * 1000)

    return () => {
      clearTimeout(timeout)
      cancelAnimationFrame(frame)
    }
  }, [value, delay, reduce])

  return (
    <>
      {n}
      {suffix}
    </>
  )
}

/** High-contrast floating product canvas for the hero */
export function HeroProductVisual() {
  const reduce = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const sx = useSpring(mx, { stiffness: 90, damping: 20, mass: 0.55 })
  const sy = useSpring(my, { stiffness: 90, damping: 20, mass: 0.55 })
  const rotateX = useTransform(sy, [-30, 30], reduce ? [0, 0] : [5, -5])
  const rotateY = useTransform(sx, [-30, 30], reduce ? [0, 0] : [-6, 6])
  const glowX = useTransform(sx, [-30, 30], [38, 62])
  const glowY = useTransform(sy, [-30, 30], [28, 52])
  const glowBg = useMotionTemplate`radial-gradient(circle at ${glowX}% ${glowY}%, rgba(109,94,249,0.65), rgba(161,140,255,0.25) 42%, transparent 68%)`

  return (
    <div
      ref={ref}
      className="relative mx-auto aspect-[5/4] w-full max-w-2xl overflow-visible [perspective:1400px] lg:max-w-none"
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
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[48px] blur-3xl"
        style={{ background: glowBg }}
        initial={{ opacity: 0 }}
        animate={{ opacity: reduce ? 0.7 : [0.55, 0.85, 0.55] }}
        transition={
          reduce ? { duration: 0.6 } : { duration: 7, repeat: Infinity, ease: 'easeInOut' }
        }
      />

      <motion.div
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
        initial={reduce ? false : { opacity: 0, y: 32, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.85, ease: EASE, delay: 0.12 }}
        className="relative h-full w-full overflow-visible will-change-transform"
      >
        <div className="absolute inset-x-3 inset-y-2 overflow-hidden rounded-[28px] border border-[#6d5ef9]/25 bg-white shadow-[0_28px_80px_rgba(79,70,180,0.28)] sm:inset-x-5 sm:inset-y-3 dark:border-white/15 dark:bg-[#12101f] dark:shadow-[0_28px_80px_rgba(0,0,0,0.55)]">
          <div className="flex items-center gap-2 border-b border-[#6d5ef9]/12 bg-gradient-to-r from-[#f7f4ff] to-white px-4 py-3.5 dark:border-white/10 dark:from-[#1a1630] dark:to-[#12101f]">
            <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
            <span className="ml-3 text-[11px] font-semibold tracking-[0.12em] text-[#5c5c66] uppercase dark:text-[#a8a2c4]">
              Xelarvis Control
            </span>
            <span className="ml-auto rounded-full bg-[#6d5ef9]/12 px-2.5 py-0.5 text-[10px] font-bold tracking-wide text-[#6d5ef9]">
              LIVE
            </span>
          </div>

          <div className="grid h-[calc(100%-50px)] grid-cols-[72px_1fr] sm:grid-cols-[84px_1fr]">
            <aside className="space-y-2 border-r border-[#6d5ef9]/10 bg-[#f7f4ff] p-3 dark:border-white/10 dark:bg-[#16122a]">
              {['Ops', 'Build', 'Ship', 'Data', 'AI'].map((item, i) => (
                <motion.div
                  key={item}
                  initial={reduce ? false : { opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.05, duration: 0.4, ease: EASE }}
                  className={`rounded-xl px-2 py-2 text-center text-[10px] font-bold tracking-wide ${
                    i === 0
                      ? 'bg-[#6d5ef9] text-white shadow-[0_8px_20px_rgba(109,94,249,0.45)]'
                      : 'bg-white text-[#5c5c66] dark:bg-white/5 dark:text-[#a8a2c4]'
                  }`}
                >
                  {item}
                </motion.div>
              ))}
            </aside>

            <div className="space-y-3 bg-gradient-to-br from-white via-[#fbf9ff] to-[#f0ebff] p-3 sm:p-4 dark:from-[#12101f] dark:via-[#16122a] dark:to-[#1a1630]">
              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                {METRICS.map((metric, i) => (
                  <motion.div
                    key={metric.label}
                    initial={reduce ? false : { opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.38 + i * 0.08, duration: 0.5, ease: EASE }}
                    className="rounded-2xl border border-[#6d5ef9]/15 bg-white p-3 shadow-[0_10px_28px_rgba(109,94,249,0.12)] dark:border-white/10 dark:bg-[#1c1830]"
                  >
                    <p className="text-[10px] font-semibold tracking-[0.12em] text-[#8b8b96] uppercase">
                      {metric.label}
                    </p>
                    <p className="font-display mt-1.5 text-xl font-bold tracking-tight text-[#1f1f21] tabular-nums sm:text-2xl dark:text-white">
                      <CountUp value={metric.value} delay={0.5 + i * 0.08} suffix={metric.suffix} />
                    </p>
                    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#efeaff]">
                      <motion.div
                        className="h-full rounded-full bg-gradient-to-r from-[#6d5ef9] to-[#a18cff]"
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

              <motion.div
                initial={reduce ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55, duration: 0.5, ease: EASE }}
                className="rounded-2xl border border-[#6d5ef9]/15 bg-white p-3 shadow-[0_12px_32px_rgba(109,94,249,0.14)] dark:border-white/10 dark:bg-[#1c1830]"
              >
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-xs font-semibold text-[#1f1f21] dark:text-white">
                    Release velocity
                  </p>
                  <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-bold text-emerald-600">
                    +38% QoQ
                  </span>
                </div>
                <div className="flex h-24 items-end gap-1.5 sm:h-28">
                  {BARS.map((v, i) => (
                    <motion.div
                      key={i}
                      className="flex-1 origin-bottom rounded-t-md bg-gradient-to-t from-[#6d5ef9] to-[#c4b5fd]"
                      initial={{ scaleY: 0, opacity: 0.35 }}
                      animate={{ scaleY: 1, opacity: 1 }}
                      transition={{
                        delay: reduce ? 0 : 0.72 + i * 0.03,
                        duration: 0.65,
                        ease: EASE,
                      }}
                      style={{ height: `${v}%` }}
                    />
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        <motion.div
          className="pointer-events-none absolute top-[16%] -left-1 z-20 hidden sm:block"
          initial={reduce ? false : { opacity: 0, y: 10 }}
          animate={reduce ? { opacity: 1, y: 0 } : { opacity: 1, y: [0, -8, 0] }}
          transition={
            reduce
              ? { delay: 0.8, duration: 0.5 }
              : {
                  opacity: { delay: 0.85, duration: 0.5, ease: EASE },
                  y: { delay: 1.3, duration: 6.5, repeat: Infinity, ease: 'easeInOut' },
                }
          }
        >
          <div className="rounded-2xl border border-[#6d5ef9]/20 bg-white px-3.5 py-2.5 shadow-[0_16px_40px_rgba(109,94,249,0.22)] dark:border-white/10 dark:bg-[#1a1630]">
            <p className="text-[10px] font-bold tracking-[0.14em] text-[#8b8b96] uppercase">
              Latency
            </p>
            <p className="font-display text-sm font-bold text-emerald-600">12ms p99</p>
          </div>
        </motion.div>

        <motion.div
          className="pointer-events-none absolute right-0 bottom-[18%] z-20 hidden sm:block"
          initial={reduce ? false : { opacity: 0, y: 10 }}
          animate={reduce ? { opacity: 1, y: 0 } : { opacity: 1, y: [0, 7, 0] }}
          transition={
            reduce
              ? { delay: 1, duration: 0.5 }
              : {
                  opacity: { delay: 1, duration: 0.5, ease: EASE },
                  y: { delay: 1.6, duration: 7.5, repeat: Infinity, ease: 'easeInOut' },
                }
          }
        >
          <div className="rounded-2xl border border-[#6d5ef9]/20 bg-white px-3.5 py-2.5 shadow-[0_16px_40px_rgba(109,94,249,0.22)] dark:border-white/10 dark:bg-[#1a1630]">
            <p className="text-[10px] font-bold tracking-[0.14em] text-[#8b8b96] uppercase">
              Active builds
            </p>
            <p className="font-display text-sm font-bold text-[#6d5ef9]">24 pipelines</p>
          </div>
        </motion.div>

        <motion.div
          className="pointer-events-none absolute top-[6%] right-[4%] z-20"
          initial={reduce ? false : { opacity: 0, scale: 0.9 }}
          animate={reduce ? { opacity: 1, scale: 1 } : { opacity: 1, scale: [1, 1.05, 1] }}
          transition={
            reduce
              ? { delay: 1.05, duration: 0.45 }
              : {
                  opacity: { delay: 1.05, duration: 0.45 },
                  scale: { delay: 1.5, duration: 4.5, repeat: Infinity, ease: 'easeInOut' },
                }
          }
        >
          <div className="rounded-full bg-gradient-to-r from-[#6d5ef9] to-[#a18cff] px-3.5 py-1.5 text-[11px] font-bold text-white shadow-[0_12px_32px_rgba(109,94,249,0.5)]">
            Deploy live
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}
