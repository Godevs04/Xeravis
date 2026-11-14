'use client'

import { LazyMotion } from 'framer-motion'
import type { ReactNode } from 'react'

import features from '@/lib/motion-features'

/**
 * Features load with the provider (not as a deferred chunk) so elements rendered at their
 * `initial` state never wait on a late download before becoming visible.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return <LazyMotion features={features}>{children}</LazyMotion>
}
