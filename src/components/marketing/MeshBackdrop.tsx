'use client'

import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from 'framer-motion'
import { useTheme } from 'next-themes'
import { useEffect, useState, type ReactNode } from 'react'

import { cn } from '@/lib/utils'

type MeshBackdropProps = {
  className?: string
  children?: ReactNode
  interactive?: boolean
  /** auto follows site theme; navy/light force a surface */
  tone?: 'navy' | 'light' | 'auto'
}

export function MeshBackdrop({
  className,
  children,
  interactive = true,
  tone = 'auto',
}: MeshBackdropProps) {
  const reduce = useReducedMotion()
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const mx = useMotionValue(50)
  const my = useMotionValue(40)
  const sx = useSpring(mx, { stiffness: 40, damping: 22 })
  const sy = useSpring(my, { stiffness: 40, damping: 22 })
  const cursorGlow = useMotionTemplate`radial-gradient(ellipse 55% 45% at ${sx}% ${sy}%, var(--hero-glow), transparent 62%)`

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!interactive || reduce) return
    const onMove = (e: PointerEvent) => {
      mx.set((e.clientX / window.innerWidth) * 100)
      my.set((e.clientY / window.innerHeight) * 100)
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [interactive, reduce, mx, my])

  const preferNavy = tone === 'navy' || (tone === 'auto' && mounted && resolvedTheme === 'dark')

  return (
    <div
      className={cn(
        'relative overflow-hidden',
        'surface-navy relative overflow-hidden bg-[color:var(--hero-bg)] text-[color:var(--hero-text)]',
        className,
      )}
    >
      <div
        aria-hidden
        className={cn(
          'pointer-events-none absolute inset-0',
          preferNavy
            ? 'bg-[radial-gradient(ellipse_80%_60%_at_10%_20%,var(--hero-glow),transparent_55%),radial-gradient(ellipse_70%_50%_at_90%_80%,var(--hero-glow-2),transparent_50%),radial-gradient(ellipse_50%_40%_at_50%_100%,var(--hero-vignette),transparent)]'
            : 'bg-[radial-gradient(ellipse_70%_50%_at_15%_10%,var(--hero-glow),transparent_55%),radial-gradient(ellipse_60%_45%_at_85%_70%,var(--hero-glow-2),transparent_50%)]',
        )}
      />

      {!reduce ? (
        <>
          {interactive ? (
            <motion.div
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-90"
              style={{ backgroundImage: cursorGlow }}
            />
          ) : null}
          <motion.div
            aria-hidden
            className="pointer-events-none absolute -top-24 -left-16 h-[42rem] w-[42rem] rounded-full bg-[radial-gradient(circle,var(--hero-glow),transparent_68%)] blur-3xl"
            animate={{ x: [0, 40, 0], y: [0, 28, 0], opacity: [0.45, 0.7, 0.45] }}
            transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            aria-hidden
            className="pointer-events-none absolute -right-20 bottom-0 h-[36rem] w-[36rem] rounded-full bg-[radial-gradient(circle,var(--hero-glow-2),transparent_70%)] blur-3xl"
            animate={{ x: [0, -32, 0], y: [0, -24, 0], opacity: [0.35, 0.6, 0.35] }}
            transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
          />
        </>
      ) : null}

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.5]"
        style={{
          backgroundImage:
            'linear-gradient(var(--hero-grid) 1px, transparent 1px), linear-gradient(90deg, var(--hero-grid) 1px, transparent 1px)',
          backgroundSize: '72px 72px',
          maskImage: 'radial-gradient(ellipse at center, black 20%, transparent 75%)',
        }}
      />

      <div className="relative z-10">{children}</div>
    </div>
  )
}
