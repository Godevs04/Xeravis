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
      className={cn('glass-card relative overflow-hidden will-change-transform', className)}
      initial={reduce ? false : { opacity: 0, y: 20, scale: 0.98 }}
      whileInView={
        float && !reduce ? { opacity: 1, y: [0, -6, 0], scale: 1 } : { opacity: 1, y: 0, scale: 1 }
      }
      viewport={{ once: true, margin: '-8% 0px' }}
      transition={
        float && !reduce
          ? {
              opacity: { duration: 0.65, ease: [0.22, 1, 0.36, 1], delay },
              scale: { duration: 0.65, ease: [0.22, 1, 0.36, 1], delay },
              y: {
                duration: 7,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: delay + 0.8,
                times: [0, 0.5, 1],
              },
            }
          : { duration: 0.65, ease: [0.22, 1, 0.36, 1], delay }
      }
      whileHover={
        lift && !reduce
          ? { y: -8, transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] } }
          : undefined
      }
    >
      {children}
    </motion.div>
  )
}
