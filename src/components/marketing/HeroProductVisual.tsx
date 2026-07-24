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
const METRICS = [72, 58, 84]
const BARS = [40, 55, 35, 70, 48, 82, 60, 90, 65, 78, 52, 88]

function CountUp({ value, delay = 0 }: { value: number; delay?: number }) {
  const reduce = useReducedMotion()
  const [n, setN] = useState(reduce ? value : 0)

  useEffect(() => {
    if (reduce) {
      setN(value)
      return
    }

    let frame = 0
    const timeout = window.setTimeout(() => {
      const duration = 900
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

  return <>{n}%</>
}

/** Floating glass product visualization */
export function HeroProductVisual() {
  const reduce = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const sx = useSpring(mx, { stiffness: 80, damping: 22, mass: 0.6 })
  const sy = useSpring(my, { stiffness: 80, damping: 22, mass: 0.6 })
  const rotateX = useTransform(sy, [-30, 30], reduce ? [0, 0] : [3.5, -3.5])
  const rotateY = useTransform(sx, [-30, 30], reduce ? [0, 0] : [-4.5, 4.5])
  const glowX = useTransform(sx, [-30, 30], [42, 58])
  const glowY = useTransform(sy, [-30, 30], [32, 48])
  const glowBg = useMotionTemplate`radial-gradient(circle at ${glowX}% ${glowY}%, rgba(109,94,249,0.45), transparent 62%)`

  return (
    <div
      ref={ref}
      className="relative mx-auto aspect-[4/3] w-full max-w-xl overflow-visible [perspective:1200px] lg:max-w-none"
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
        className="pointer-events-none absolute inset-4 rounded-[40px] blur-3xl sm:inset-6"
        style={{ background: glowBg }}
        initial={{ opacity: 0 }}
        animate={{ opacity: reduce ? 0.45 : [0.35, 0.6, 0.35] }}
        transition={
          reduce ? { duration: 0.6 } : { duration: 8, repeat: Infinity, ease: 'easeInOut' }
        }
      />

      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        }}
        initial={reduce ? false : { opacity: 0, y: 28, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.9, ease: EASE, delay: 0.15 }}
        className="relative h-full w-full overflow-visible will-change-transform"
      >
        <div className="absolute inset-x-5 inset-y-3 overflow-hidden rounded-[28px] border border-white/70 bg-white/70 shadow-[var(--shadow-floating)] backdrop-blur-2xl sm:inset-x-8 sm:inset-y-4 dark:border-white/10 dark:bg-[#16122a]/80">
          <div className="flex items-center gap-2 border-b border-[color:var(--glass-border-soft)] px-4 py-3">
            <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]/90" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]/90" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]/90" />
            <span className="text-secondary ml-3 text-[11px] font-medium tracking-wide">
              xelarvis · platform
            </span>
          </div>

          <div className="grid h-[calc(100%-44px)] grid-cols-[64px_1fr] sm:grid-cols-[72px_1fr]">
            <aside className="border-r border-[color:var(--glass-border-soft)] bg-white/40 p-2.5 sm:p-3 dark:bg-white/[0.03]">
              {[1, 2, 3, 4, 5].map((i) => (
                <motion.div
                  key={i}
                  initial={reduce ? false : { opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.35 + i * 0.05, duration: 0.4, ease: EASE }}
                  className={`mb-2 h-7 rounded-xl sm:h-8 ${i === 1 ? 'bg-accent/25 shadow-[0_0_16px_var(--color-accent-soft)]' : 'bg-[color:var(--color-hover)]'}`}
                />
              ))}
            </aside>

            <div className="space-y-3 p-3 sm:p-4">
              <div className="flex gap-2 sm:gap-3">
                {METRICS.map((h, i) => (
                  <motion.div
                    key={i}
                    initial={reduce ? false : { opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + i * 0.08, duration: 0.5, ease: EASE }}
                    className="flex-1 rounded-2xl border border-white/80 bg-white/75 p-2.5 shadow-[var(--shadow-light)] sm:p-3 dark:border-white/10 dark:bg-white/[0.04]"
                  >
                    <div className="bg-accent/20 mb-2 h-2 w-8 rounded-full sm:w-10" />
                    <div className="font-display text-primary text-lg font-bold tracking-tight tabular-nums sm:text-xl">
                      <CountUp value={h} delay={0.55 + i * 0.08} />
                    </div>
                    <div className="mt-2 flex h-7 items-end overflow-hidden rounded-lg bg-[color:var(--color-accent-soft)] sm:h-8">
                      <motion.div
                        className="from-accent/55 w-full origin-bottom rounded-lg bg-gradient-to-t to-[#a18cff]/25"
                        initial={{ scaleY: 0 }}
                        animate={{ scaleY: h / 100 }}
                        transition={{
                          delay: reduce ? 0 : 0.65 + i * 0.1,
                          duration: 0.85,
                          ease: EASE,
                        }}
                        style={{ height: '100%' }}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>

              <motion.div
                initial={reduce ? false : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55, duration: 0.5, ease: EASE }}
                className="rounded-2xl border border-white/80 bg-white/75 p-3 shadow-[var(--shadow-light)] dark:border-white/10 dark:bg-white/[0.04]"
              >
                <div className="mb-3 flex items-center justify-between">
                  <div className="bg-accent/20 h-2.5 w-20 rounded-full sm:w-24" />
                  <div className="bg-accent/40 h-2.5 w-10 rounded-full sm:w-12" />
                </div>
                <div className="flex h-20 items-end gap-1.5 sm:h-24">
                  {BARS.map((v, i) => (
                    <motion.div
                      key={i}
                      className="from-accent/55 flex-1 origin-bottom rounded-t-md bg-gradient-to-t to-[#a18cff]/20"
                      initial={{ scaleY: 0, opacity: 0.4 }}
                      animate={{ scaleY: 1, opacity: 1 }}
                      transition={{
                        delay: reduce ? 0 : 0.7 + i * 0.035,
                        duration: 0.7,
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
          className="pointer-events-none absolute top-[18%] left-0 z-20 hidden sm:block"
          initial={reduce ? false : { opacity: 0, y: 8 }}
          animate={reduce ? { opacity: 1, y: 0 } : { opacity: 1, y: [0, -6, 0] }}
          transition={
            reduce
              ? { delay: 0.8, duration: 0.5 }
              : {
                  opacity: { delay: 0.85, duration: 0.55, ease: EASE },
                  y: { delay: 1.4, duration: 7, repeat: Infinity, ease: 'easeInOut' },
                }
          }
        >
          <div className="rounded-2xl border border-white/80 bg-white/80 px-3.5 py-2.5 shadow-[var(--shadow-medium)] backdrop-blur-xl dark:border-white/10 dark:bg-[#1a1630]/90">
            <p className="text-muted text-[10px] font-medium tracking-[0.14em] uppercase">
              Latency
            </p>
            <p className="font-display text-sm font-semibold text-emerald-600 dark:text-emerald-400">
              12ms p99
            </p>
          </div>
        </motion.div>

        <motion.div
          className="pointer-events-none absolute right-0 bottom-[22%] z-20 hidden sm:block"
          initial={reduce ? false : { opacity: 0, y: 8 }}
          animate={reduce ? { opacity: 1, y: 0 } : { opacity: 1, y: [0, 6, 0] }}
          transition={
            reduce
              ? { delay: 1, duration: 0.5 }
              : {
                  opacity: { delay: 1, duration: 0.55, ease: EASE },
                  y: { delay: 1.7, duration: 8.5, repeat: Infinity, ease: 'easeInOut' },
                }
          }
        >
          <div className="rounded-2xl border border-white/80 bg-white/80 px-3.5 py-2.5 shadow-[var(--shadow-medium)] backdrop-blur-xl dark:border-white/10 dark:bg-[#1a1630]/90">
            <p className="text-muted text-[10px] font-medium tracking-[0.14em] uppercase">
              Ship velocity
            </p>
            <p className="font-display text-accent text-sm font-semibold">+38% QoQ</p>
          </div>
        </motion.div>

        <motion.div
          className="pointer-events-none absolute top-[8%] right-[8%] z-20 hidden lg:block"
          initial={reduce ? false : { opacity: 0, scale: 0.9 }}
          animate={reduce ? { opacity: 1, scale: 1 } : { opacity: 1, scale: [1, 1.04, 1] }}
          transition={
            reduce
              ? { delay: 1.1, duration: 0.5 }
              : {
                  opacity: { delay: 1.1, duration: 0.5 },
                  scale: { delay: 1.6, duration: 5, repeat: Infinity, ease: 'easeInOut' },
                }
          }
        >
          <div className="rounded-full border border-white/80 bg-gradient-to-r from-[#6d5ef9] to-[#a18cff] px-3 py-1.5 text-[11px] font-semibold text-white shadow-[0_8px_24px_var(--color-accent-glow)]">
            Deploy live
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}
