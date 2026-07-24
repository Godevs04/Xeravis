'use client'

import { motion, useReducedMotion } from 'framer-motion'
import * as React from 'react'

import { cn } from '@/lib/utils'

type AnimateInProps = {
  children: React.ReactNode
  className?: string
  delay?: number
}

export function AnimateIn({ children, className, delay = 0 }: AnimateInProps) {
  const shouldReduceMotion = useReducedMotion()

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      className={cn(className)}
      initial={{ opacity: 0, y: 22, filter: 'blur(6px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-12% 0px' }}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1], delay }}
    >
      {children}
    </motion.div>
  )
}
