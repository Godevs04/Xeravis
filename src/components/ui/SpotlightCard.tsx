'use client'

import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from 'framer-motion'
import type { CSSProperties, ReactNode, MouseEvent } from 'react'

import { cn } from '@/lib/utils'

type SpotlightCardProps = {
  children: ReactNode
  className?: string
  href?: string
  as?: 'div' | 'article'
}

/** Aurora glass card — mouse spotlight + soft 3D tilt */
export function SpotlightCard({ children, className, as: Tag = 'article' }: SpotlightCardProps) {
  const reduce = useReducedMotion()
  const mx = useMotionValue(50)
  const my = useMotionValue(20)
  const rx = useSpring(useTransform(my, [0, 100], [5, -5]), { stiffness: 180, damping: 22 })
  const ry = useSpring(useTransform(mx, [0, 100], [-6, 6]), { stiffness: 180, damping: 22 })
  const spotlight = useMotionTemplate`radial-gradient(560px circle at ${mx}% ${my}%, var(--aurora-spot), transparent 44%)`

  const onMove = (e: MouseEvent<HTMLElement>) => {
    if (reduce) return
    const rect = e.currentTarget.getBoundingClientRect()
    mx.set(((e.clientX - rect.left) / rect.width) * 100)
    my.set(((e.clientY - rect.top) / rect.height) * 100)
  }

  const onLeave = () => {
    if (reduce) return
    mx.set(50)
    my.set(20)
  }

  return (
    <Tag
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={cn(
        'group relative isolate overflow-hidden rounded-[28px] border border-[color:var(--glass-border-soft)]',
        'bg-[color:var(--glass-bg)] shadow-[var(--shadow-inset-glass),var(--shadow-medium)] backdrop-blur-2xl',
        'transition-[border-color,box-shadow] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]',
        'hover:border-[color:var(--color-border-strong)] hover:shadow-[var(--shadow-inset-glass),var(--shadow-hover)]',
        className,
      )}
      style={{ perspective: 1000 } as CSSProperties}
    >
      <motion.div
        className="relative z-10 h-full will-change-transform"
        style={reduce ? undefined : { rotateX: rx, rotateY: ry }}
      >
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-400 group-hover:opacity-100"
          style={{ background: spotlight }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -top-16 -right-12 h-40 w-40 rounded-full bg-[radial-gradient(circle,var(--mesh-glow),transparent_70%)] opacity-70 blur-2xl transition-opacity duration-500 group-hover:opacity-100"
        />
        <div className="relative z-10 h-full">{children}</div>
      </motion.div>
    </Tag>
  )
}
