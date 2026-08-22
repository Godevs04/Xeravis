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

const PARTICLES = Array.from({ length: 6 }, (_, i) => ({
  id: i,
  left: `${10 + ((i * 29) % 80)}%`,
  top: `${14 + ((i * 37) % 70)}%`,
  size: 1.5 + (i % 3) * 0.7,
  delay: (i % 5) * 0.9,
  duration: 12 + (i % 4) * 2.2,
}))

export function HeroCinematicBackground({ cursorX, cursorY }: HeroCinematicBackgroundProps) {
  const reduce = useReducedMotion()
  const uid = useId()
  const sx = useSpring(cursorX, { stiffness: 36, damping: 24, mass: 0.7 })
  const sy = useSpring(cursorY, { stiffness: 36, damping: 24, mass: 0.7 })
  const cursorGlow = useMotionTemplate`radial-gradient(ellipse 42% 36% at ${sx}% ${sy}%, var(--hero-glow-2), transparent 62%)`
  const gridX = useSpring(cursorX, { stiffness: 28, damping: 28 })
  const gridY = useSpring(cursorY, { stiffness: 28, damping: 28 })
  const gridTransform = useMotionTemplate`translate3d(calc((${gridX} - 50) * 0.18px), calc((${gridY} - 40) * 0.14px), 0)`

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-[color:var(--hero-bg)]" />

      <div
        className="aurora-mesh absolute inset-0 opacity-90"
        style={{
          backgroundImage: `
            radial-gradient(ellipse 55% 45% at 12% 18%, var(--hero-glow), transparent 58%),
            radial-gradient(ellipse 48% 42% at 88% 22%, var(--hero-glow-2), transparent 55%),
            radial-gradient(ellipse 40% 36% at 62% 78%, var(--hero-glow), transparent 60%),
            radial-gradient(ellipse 70% 50% at 40% 110%, var(--hero-vignette), transparent 55%),
            linear-gradient(165deg, var(--hero-bg) 0%, var(--color-neutral) 42%, var(--hero-bg) 100%)
          `,
        }}
      />

      {!reduce ? (
        <>
          <motion.div
            className="absolute top-[-12%] left-[-8%] h-[34rem] w-[34rem] rounded-full bg-[radial-gradient(circle,var(--hero-glow),transparent_68%)] blur-3xl"
            animate={{ x: [0, 48, 0], y: [0, 32, 0], opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute right-[-10%] bottom-[-8%] h-[30rem] w-[30rem] rounded-full bg-[radial-gradient(circle,var(--hero-glow-2),transparent_70%)] blur-3xl"
            animate={{ x: [0, -40, 0], y: [0, -28, 0], opacity: [0.3, 0.58, 0.3] }}
            transition={{ duration: 26, repeat: Infinity, ease: 'easeInOut' }}
          />
        </>
      ) : null}

      <motion.div
        className="absolute inset-[-8%] opacity-40"
        style={{
          backgroundImage:
            'linear-gradient(var(--hero-grid) 1px, transparent 1px), linear-gradient(90deg, var(--hero-grid) 1px, transparent 1px)',
          backgroundSize: '68px 68px',
          maskImage: 'radial-gradient(ellipse 72% 62% at 50% 42%, black, transparent)',
          transform: reduce ? undefined : gridTransform,
        }}
      />

      <svg
        className="absolute inset-0 h-full w-full opacity-40"
        viewBox="0 0 720 480"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <linearGradient id={`${uid}-line`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#0D9488" stopOpacity="0" />
            <stop offset="50%" stopColor="#06B6D4" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#0D9488" stopOpacity="0" />
          </linearGradient>
        </defs>
        <motion.path
          d="M 40 360 C 180 240, 280 300, 420 180"
          fill="none"
          stroke={`url(#${uid}-line)`}
          strokeWidth="1.1"
          initial={reduce ? false : { pathLength: 0.25, opacity: 0.2 }}
          animate={
            reduce
              ? { pathLength: 1, opacity: 0.35 }
              : { pathLength: [0.25, 1, 0.25], opacity: [0.12, 0.5, 0.12] }
          }
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
        />
      </svg>

      {!reduce
        ? PARTICLES.map((p) => (
            <motion.span
              key={p.id}
              className="absolute rounded-full bg-[color:var(--color-cyan)]/70 shadow-[0_0_10px_rgba(6,182,212,0.45)]"
              style={{ left: p.left, top: p.top, width: p.size, height: p.size }}
              animate={{ y: [0, -14, 0], opacity: [0.15, 0.7, 0.15] }}
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

      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse 75% 70% at 50% 40%, transparent 35%, var(--hero-vignette) 100%)`,
        }}
      />
      <div className="noise-overlay opacity-[0.045]" />
    </div>
  )
}
