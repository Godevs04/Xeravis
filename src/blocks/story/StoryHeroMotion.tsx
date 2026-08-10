'use client'

import { motion, useMotionValue, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import dynamic from 'next/dynamic'
import { useEffect, useRef } from 'react'

import { HeroCinematicBackground } from '@/components/marketing/HeroCinematicBackground'

const HeroProductVisual = dynamic(
  () => import('@/components/marketing/HeroProductVisual').then((m) => m.HeroProductVisual),
  { ssr: false },
)

/** Overlay motion layer — mounted only after interaction via StoryHeroEnhance. */
export function StoryHeroMotion() {
  const reduce = useReducedMotion()
  const sectionRef = useRef<HTMLDivElement>(null)
  const cursorX = useMotionValue(50)
  const cursorY = useMotionValue(40)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  })
  const bgMorph = useTransform(scrollYProgress, [0, 1], [1, reduce ? 1 : 1.06])

  useEffect(() => {
    if (reduce) return
    const node = sectionRef.current
    if (!node) return
    const onMove = (e: PointerEvent) => {
      const rect = node.getBoundingClientRect()
      if (!rect.width || !rect.height) return
      cursorX.set(((e.clientX - rect.left) / rect.width) * 100)
      cursorY.set(((e.clientY - rect.top) / rect.height) * 100)
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [reduce, cursorX, cursorY])

  return (
    <div ref={sectionRef} className="pointer-events-none absolute inset-0 z-[5]" aria-hidden>
      <motion.div className="absolute inset-0" style={{ scale: bgMorph }}>
        <HeroCinematicBackground cursorX={cursorX} cursorY={cursorY} />
      </motion.div>

      <div className="absolute inset-0 z-10">
        <div className="mx-auto flex h-full w-full max-w-[1400px] items-center px-4 sm:px-6 lg:px-8">
          <div className="grid w-full items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8 xl:gap-10">
            <div className="hidden lg:block" />
            <div className="relative mx-auto aspect-[5/4] w-full max-w-2xl overflow-visible lg:max-w-none">
              <div className="pointer-events-auto h-full w-full">
                <HeroProductVisual scrollProgress={scrollYProgress} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {!reduce ? (
        <motion.div
          className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-1 text-[10px] font-semibold tracking-[0.18em] text-[color:var(--hero-muted)] uppercase"
          animate={{ y: [0, 6, 0], opacity: [0.45, 0.9, 0.45] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
        >
          <span>Scroll</span>
          <ChevronDown className="h-3.5 w-3.5" />
        </motion.div>
      ) : null}
    </div>
  )
}
