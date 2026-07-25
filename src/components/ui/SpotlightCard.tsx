'use client'

import { motion, useMotionTemplate, useMotionValue, useReducedMotion } from 'framer-motion'
import type { ReactNode, MouseEvent } from 'react'

import { cn } from '@/lib/utils'

type SpotlightCardProps = {
  children: ReactNode
  className?: string
  href?: string
  as?: 'div' | 'article'
}

/** Premium glass card with mouse-follow spotlight + soft tilt */
export function SpotlightCard({ children, className, as: Tag = 'article' }: SpotlightCardProps) {
  const reduce = useReducedMotion()
  const mx = useMotionValue(50)
  const my = useMotionValue(20)
  const spotlight = useMotionTemplate`radial-gradient(520px circle at ${mx}% ${my}%, rgba(109,94,249,0.18), transparent 42%)`

  const onMove = (e: MouseEvent<HTMLElement>) => {
    if (reduce) return
    const rect = e.currentTarget.getBoundingClientRect()
    mx.set(((e.clientX - rect.left) / rect.width) * 100)
    my.set(((e.clientY - rect.top) / rect.height) * 100)
  }

  return (
    <Tag
      onMouseMove={onMove}
      className={cn(
        'group relative isolate overflow-hidden rounded-[28px] border border-[color:var(--glass-border-soft)]',
        'bg-[color:var(--glass-bg)] shadow-[var(--shadow-medium)] backdrop-blur-2xl',
        'transition-[transform,border-color,box-shadow] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]',
        'hover:-translate-y-1.5 hover:border-[color:var(--color-border-strong)] hover:shadow-[var(--shadow-hover)]',
        className,
      )}
    >
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-400 group-hover:opacity-100"
        style={{ background: spotlight }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-16 -right-12 h-40 w-40 rounded-full bg-[radial-gradient(circle,rgba(109,94,249,0.28),transparent_70%)] opacity-70 blur-2xl transition-opacity duration-500 group-hover:opacity-100"
      />
      <div className="relative z-10 h-full">{children}</div>
    </Tag>
  )
}
