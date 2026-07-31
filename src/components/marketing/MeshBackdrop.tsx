'use client'

import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from 'framer-motion'
import { useEffect, type ReactNode } from 'react'

import { cn } from '@/lib/utils'

type MeshBackdropProps = {
  className?: string
  children?: ReactNode
  interactive?: boolean
  tone?: 'navy' | 'light'
}

export function MeshBackdrop({
  className,
  children,
  interactive = true,
  tone = 'navy',
}: MeshBackdropProps) {
  const reduce = useReducedMotion()
  const mx = useMotionValue(50)
  const my = useMotionValue(40)
  const sx = useSpring(mx, { stiffness: 40, damping: 22 })
  const sy = useSpring(my, { stiffness: 40, damping: 22 })
  const cursorGlow = useMotionTemplate`radial-gradient(ellipse 55% 45% at ${sx}% ${sy}%, rgba(13,148,136,0.4), transparent 62%)`

  useEffect(() => {
    if (!interactive || reduce) return
    const onMove = (e: PointerEvent) => {
      mx.set((e.clientX / window.innerWidth) * 100)
      my.set((e.clientY / window.innerHeight) * 100)
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [interactive, reduce, mx, my])

  const isNavy = tone === 'navy'

  return (
    <div
      className={cn(
        'relative overflow-hidden',
        isNavy
          ? 'surface-navy bg-[color:var(--color-navy)] text-white'
          : 'bg-[color:var(--color-neutral)]',
        className,
      )}
    >
      <div
        aria-hidden
        className={cn(
          'pointer-events-none absolute inset-0',
          isNavy
            ? 'bg-[radial-gradient(ellipse_80%_60%_at_10%_20%,rgba(13,148,136,0.28),transparent_55%),radial-gradient(ellipse_70%_50%_at_90%_80%,rgba(6,182,212,0.22),transparent_50%),radial-gradient(ellipse_50%_40%_at_50%_100%,rgba(15,23,42,0.9),transparent)]'
            : 'bg-[radial-gradient(ellipse_70%_50%_at_15%_10%,rgba(13,148,136,0.12),transparent_55%),radial-gradient(ellipse_60%_45%_at_85%_70%,rgba(6,182,212,0.1),transparent_50%)]',
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
            className="pointer-events-none absolute -top-24 -left-16 h-[42rem] w-[42rem] rounded-full bg-[radial-gradient(circle,rgba(13,148,136,0.35),transparent_68%)] blur-3xl"
            animate={{ x: [0, 40, 0], y: [0, 28, 0], opacity: [0.45, 0.7, 0.45] }}
            transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            aria-hidden
            className="pointer-events-none absolute -right-20 bottom-0 h-[36rem] w-[36rem] rounded-full bg-[radial-gradient(circle,rgba(6,182,212,0.3),transparent_70%)] blur-3xl"
            animate={{ x: [0, -32, 0], y: [0, -24, 0], opacity: [0.35, 0.6, 0.35] }}
            transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
          />
        </>
      ) : null}

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
          backgroundSize: '72px 72px',
          maskImage: 'radial-gradient(ellipse at center, black 20%, transparent 75%)',
        }}
      />

      <div className="relative z-10">{children}</div>
    </div>
  )
}
