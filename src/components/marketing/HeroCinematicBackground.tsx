'use client'

import {
  motion,
  useMotionTemplate,
  useReducedMotion,
  useSpring,
  type MotionValue,
} from 'framer-motion'
import { useId } from 'react'

type HeroCinematicBackgroundProps = {
  cursorX: MotionValue<number>
  cursorY: MotionValue<number>
}

const PARTICLES = Array.from({ length: 16 }, (_, i) => ({
  id: i,
  left: `${6 + ((i * 17) % 88)}%`,
  top: `${10 + ((i * 23) % 78)}%`,
  size: 1.5 + (i % 4) * 0.7,
  delay: (i % 7) * 0.8,
  duration: 10 + (i % 5) * 2.4,
}))

const PATHS = [
  'M 40 360 C 180 240, 280 300, 420 180',
  'M 80 120 C 220 80, 320 200, 520 110',
  'M 360 420 C 460 320, 540 360, 640 240',
]

export function HeroCinematicBackground({ cursorX, cursorY }: HeroCinematicBackgroundProps) {
  const reduce = useReducedMotion()
  const uid = useId()
  const sx = useSpring(cursorX, { stiffness: 36, damping: 24, mass: 0.7 })
  const sy = useSpring(cursorY, { stiffness: 36, damping: 24, mass: 0.7 })
  const cursorGlow = useMotionTemplate`radial-gradient(ellipse 42% 36% at ${sx}% ${sy}%, rgba(6,182,212,0.22), transparent 62%)`
  const gridX = useSpring(cursorX, { stiffness: 28, damping: 28 })
  const gridY = useSpring(cursorY, { stiffness: 28, damping: 28 })
  const gridTransform = useMotionTemplate`translate3d(calc((${gridX} - 50) * 0.18px), calc((${gridY} - 40) * 0.14px), 0)`

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-[#0F172A]" />

      <div
        className="aurora-mesh absolute inset-0 opacity-90"
        style={{
          backgroundImage: `
            radial-gradient(ellipse 55% 45% at 12% 18%, rgba(13,148,136,0.38), transparent 58%),
            radial-gradient(ellipse 48% 42% at 88% 22%, rgba(6,182,212,0.28), transparent 55%),
            radial-gradient(ellipse 40% 36% at 62% 78%, rgba(13,148,136,0.18), transparent 60%),
            radial-gradient(ellipse 70% 50% at 40% 110%, rgba(2,6,23,0.95), transparent 55%),
            linear-gradient(165deg, #0F172A 0%, #0B1224 42%, #07101f 100%)
          `,
        }}
      />

      {!reduce ? (
        <>
          <motion.div
            className="absolute top-[-12%] left-[-8%] h-[34rem] w-[34rem] rounded-full bg-[radial-gradient(circle,rgba(13,148,136,0.4),transparent_68%)] blur-3xl"
            animate={{ x: [0, 48, 0], y: [0, 32, 0], opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute right-[-10%] bottom-[-8%] h-[30rem] w-[30rem] rounded-full bg-[radial-gradient(circle,rgba(6,182,212,0.32),transparent_70%)] blur-3xl"
            animate={{ x: [0, -40, 0], y: [0, -28, 0], opacity: [0.3, 0.58, 0.3] }}
            transition={{ duration: 26, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute top-[38%] left-[42%] h-64 w-64 rounded-full bg-[radial-gradient(circle,rgba(6,182,212,0.22),transparent_70%)] blur-2xl"
            animate={{ scale: [1, 1.18, 1], opacity: [0.25, 0.5, 0.25] }}
            transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute inset-y-[8%] left-[16%] w-px bg-gradient-to-b from-transparent via-cyan-300/30 to-transparent"
            animate={{ opacity: [0.12, 0.42, 0.12], x: [0, 22, 0] }}
            transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
          />
        </>
      ) : (
        <div className="absolute top-[-10%] left-[-6%] h-[28rem] w-[28rem] rounded-full bg-[radial-gradient(circle,rgba(13,148,136,0.28),transparent_68%)] blur-3xl" />
      )}

      <motion.div
        className="absolute inset-[-8%] opacity-[0.13]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(148,163,184,0.35) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.35) 1px, transparent 1px)',
          backgroundSize: '68px 68px',
          maskImage: 'radial-gradient(ellipse 72% 62% at 50% 42%, black, transparent)',
          transform: reduce ? undefined : gridTransform,
        }}
      />

      <svg
        className="absolute inset-0 h-full w-full opacity-50"
        viewBox="0 0 720 480"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <linearGradient id={`${uid}-line`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#0D9488" stopOpacity="0" />
            <stop offset="50%" stopColor="#06B6D4" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#0D9488" stopOpacity="0" />
          </linearGradient>
        </defs>
        {PATHS.map((d, i) => (
          <motion.path
            key={d}
            d={d}
            fill="none"
            stroke={`url(#${uid}-line)`}
            strokeWidth="1.1"
            initial={reduce ? false : { pathLength: 0.2, opacity: 0.2 }}
            animate={
              reduce
                ? { pathLength: 1, opacity: 0.35 }
                : { pathLength: [0.2, 1, 0.2], opacity: [0.12, 0.55, 0.12] }
            }
            transition={{
              duration: 14 + i * 3,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: i * 1.2,
            }}
          />
        ))}
      </svg>

      {!reduce
        ? PARTICLES.map((p) => (
            <motion.span
              key={p.id}
              className="absolute rounded-full bg-cyan-300/70 shadow-[0_0_10px_rgba(6,182,212,0.45)]"
              style={{ left: p.left, top: p.top, width: p.size, height: p.size }}
              animate={{ y: [0, -14, 0], opacity: [0.15, 0.7, 0.15], scale: [1, 1.3, 1] }}
              transition={{
                duration: p.duration,
                delay: p.delay,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          ))
        : null}

      {!reduce ? (
        <motion.div
          className="absolute inset-0 opacity-90"
          style={{ backgroundImage: cursorGlow }}
        />
      ) : null}

      <div className="absolute inset-0 bg-[radial-gradient(ellipse_75%_70%_at_50%_40%,transparent_35%,rgba(2,6,23,0.72)_100%)]" />
      <div className="noise-overlay opacity-[0.045]" />
    </div>
  )
}
