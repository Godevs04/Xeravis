'use client'

import { useEffect } from 'react'

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const coarsePointer = window.matchMedia('(pointer: coarse)')
    const narrowViewport = window.matchMedia('(max-width: 1023px)')

    // Skip Lenis on reduced-motion, touch-first, and tablet/phone viewports. It is loaded on
    // demand so phones never download it.
    if (reduceMotion.matches || coarsePointer.matches || narrowViewport.matches) return

    let cancelled = false
    let frame = 0
    let destroy: (() => void) | undefined

    void import('lenis').then(({ default: Lenis }) => {
      if (cancelled) return
      const lenis = new Lenis({
        duration: 1.15,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        touchMultiplier: 1,
      })
      const raf = (time: number) => {
        lenis.raf(time)
        frame = requestAnimationFrame(raf)
      }
      frame = requestAnimationFrame(raf)
      destroy = () => lenis.destroy()
    })

    return () => {
      cancelled = true
      cancelAnimationFrame(frame)
      destroy?.()
    }
  }, [])

  return <>{children}</>
}
