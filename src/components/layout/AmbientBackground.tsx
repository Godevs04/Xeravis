'use client'

import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from 'framer-motion'
import { useEffect, useState } from 'react'

/** Aurora field — soft mesh, drifting orbs, mouse parallax */
export function AmbientBackground() {
  const reduce = useReducedMotion()
  const [mounted, setMounted] = useState(false)
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const sx = useSpring(mx, { stiffness: 40, damping: 22, mass: 0.6 })
  const sy = useSpring(my, { stiffness: 40, damping: 22, mass: 0.6 })
  const layerA = useMotionTemplate`translate3d(${sx}px, ${sy}px, 0)`
  const layerB = useMotionTemplate`translate3d(calc(${sx}px * -0.55), calc(${sy}px * -0.4), 0)`
  const live = mounted && !reduce

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!live) return
    const onMove = (e: PointerEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 36
      const y = (e.clientY / window.innerHeight - 0.5) * 28
      mx.set(x)
      my.set(y)
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [live, mx, my])

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="bg-mesh aurora-mesh absolute inset-0" />

      <motion.div
        className="absolute top-[-18%] -left-[18%] h-[62vh] w-[62vh]"
        style={live ? { transform: layerA } : undefined}
      >
        <div
          className={`h-full w-full rounded-full bg-[radial-gradient(circle,var(--mesh-glow),transparent_68%)] blur-3xl ${live ? 'animate-blob' : ''}`}
        />
      </motion.div>

      <motion.div
        className="absolute top-[8%] -right-[16%] h-[58vh] w-[58vh]"
        style={live ? { transform: layerB } : undefined}
      >
        <div
          className={`h-full w-full rounded-full bg-[radial-gradient(circle,var(--mesh-glow-2),transparent_68%)] blur-3xl ${live ? 'animate-blob-slow' : ''}`}
        />
      </motion.div>

      <motion.div
        className="absolute bottom-[-14%] left-[18%] h-[50vh] w-[58vh]"
        style={live ? { transform: layerA } : undefined}
      >
        <div
          className={`h-full w-full rounded-full bg-[radial-gradient(circle,var(--mesh-glow-3),transparent_70%)] blur-3xl ${live ? 'animate-blob' : ''}`}
        />
      </motion.div>

      {live ? (
        <>
          <motion.div
            className="absolute top-[36%] left-[42%] h-80 w-80 rounded-full bg-[radial-gradient(circle,var(--mesh-glow-4),transparent_70%)] blur-2xl"
            animate={{ opacity: [0.35, 0.8, 0.35], scale: [1, 1.14, 1], x: [0, 28, 0] }}
            transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
          />
          {Array.from({ length: 16 }).map((_, i) => (
            <motion.span
              key={i}
              className="absolute h-1 w-1 rounded-full bg-[color:var(--color-accent)]/45"
              style={{
                left: `${8 + ((i * 17) % 84)}%`,
                top: `${12 + ((i * 23) % 76)}%`,
              }}
              animate={{ opacity: [0.12, 0.65, 0.12], y: [0, -20, 0] }}
              transition={{
                duration: 5.5 + (i % 5),
                delay: i * 0.32,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          ))}
        </>
      ) : null}
      <div className="noise-overlay" />
    </div>
  )
}
