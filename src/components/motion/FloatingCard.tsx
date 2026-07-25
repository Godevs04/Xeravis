'use client'

import { motion, useReducedMotion } from 'framer-motion'
import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

type FloatingCardProps = {
  children: ReactNode
  className?: string
  delay?: number
  float?: boolean
  lift?: boolean
}

/** Glass surface with optional float + hover lift */
export function FloatingCard({
  children,
  className,
  delay = 0,
  float = false,
  lift = true,
}: FloatingCardProps) {
  const reduce = useReducedMotion()

  return (
    <motion.div
      className={cn('glass-card relative isolate overflow-hidden will-change-transform', className)}
      initial={reduce ? false : { opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-8% 0px' }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay }}
      animate={
        float && !reduce
          ? {
              y: [0, -5, 0],
              transition: {
                duration: 8,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: delay + 0.9,
              },
            }
          : undefined
      }
      whileHover={
        lift && !reduce
          ? { y: float ? -9 : -6, transition: { duration: 0.28, ease: [0.22, 1, 0.36, 1] } }
          : undefined
      }
    >
      {children}
    </motion.div>
  )
}
