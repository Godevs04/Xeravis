'use client'

import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from 'framer-motion'
import { useEffect, useState } from 'react'

/** Soft mesh + a few orbs — kept light for main-thread / LCP. */
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
    // Defer motion orbs until after first paint / interaction — cuts main-thread work for LCP.
    const enable = () => setMounted(true)
    const opts: AddEventListenerOptions = { once: true, passive: true }
    window.addEventListener('pointerdown', enable, opts)
    window.addEventListener('scroll', enable, opts)
    const ric = window.requestIdleCallback?.bind(window)
    let idleId: number | undefined
    let timeoutId: number | undefined
    if (ric) {
      idleId = ric(enable, { timeout: 2500 })
    } else {
      timeoutId = window.setTimeout(enable, 1500)
    }
    return () => {
      window.removeEventListener('pointerdown', enable)
      window.removeEventListener('scroll', enable)
      if (idleId !== undefined) window.cancelIdleCallback?.(idleId)
      if (timeoutId !== undefined) window.clearTimeout(timeoutId)
    }
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

      <div className="noise-overlay" />
    </div>
  )
}
