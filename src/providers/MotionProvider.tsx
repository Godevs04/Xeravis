'use client'

import { LazyMotion } from 'framer-motion'
import type { ReactNode } from 'react'

const loadFeatures = () => import('@/lib/motion-features').then((mod) => mod.default)

/**
 * Site components import `m as motion`, so animation features (including `layoutId`) load in a
 * separate chunk after hydration instead of with every page.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return <LazyMotion features={loadFeatures}>{children}</LazyMotion>
}
