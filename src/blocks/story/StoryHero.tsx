'use client'

import Link from 'next/link'
import { motion, useReducedMotion } from 'framer-motion'

import { FloatingGlassDashboard } from '@/components/marketing/FloatingGlassDashboard'
import { MeshBackdrop } from '@/components/marketing/MeshBackdrop'
import { Container } from '@/components/layout/Container'
import { Button } from '@/components/ui/button'

type StoryHeroProps = {
  eyebrow?: string | null
  heading: string
  subheading?: string | null
  ctaLabel?: string | null
  ctaHref?: string | null
  secondaryCtaLabel?: string | null
  secondaryCtaHref?: string | null
  brand?: string | null
}

const EASE = [0.22, 1, 0.36, 1] as const

export function StoryHero({
  eyebrow,
  heading,
  subheading,
  ctaLabel = "Let's Talk",
  ctaHref = '/contact',
  secondaryCtaLabel = 'Explore solutions',
  secondaryCtaHref = '/solutions',
  brand = 'Xelarvis',
}: StoryHeroProps) {
  const reduce = useReducedMotion()

  return (
    <MeshBackdrop className="min-h-[100svh]">
      <Container className="relative flex min-h-[100svh] flex-col justify-center py-28 lg:py-32">
        <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10">
          <div>
            <motion.p
              className="font-display text-3xl font-bold tracking-[-0.04em] text-teal-300 sm:text-4xl"
              initial={reduce ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: EASE }}
            >
              {brand}
            </motion.p>
            {eyebrow ? (
              <motion.p
                className="mt-5 text-[11px] font-semibold tracking-[0.22em] text-cyan-300/80 uppercase"
                initial={reduce ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.15, duration: 0.6 }}
              >
                {eyebrow}
              </motion.p>
            ) : null}
            <motion.h1
              className="font-display mt-4 max-w-2xl text-[clamp(2.4rem,5.5vw,4.6rem)] leading-[1.02] font-bold tracking-[-0.045em] text-balance text-white"
              initial={reduce ? false : { opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.85, ease: EASE }}
            >
              {heading}
            </motion.h1>
            {subheading ? (
              <motion.p
                className="mt-6 max-w-xl text-base leading-relaxed text-slate-300 sm:text-lg"
                initial={reduce ? false : { opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.22, duration: 0.7, ease: EASE }}
              >
                {subheading}
              </motion.p>
            ) : null}
            <motion.div
              className="mt-10 flex flex-wrap gap-3"
              initial={reduce ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.32, duration: 0.6 }}
            >
              {ctaLabel && ctaHref ? (
                <Button
                  asChild
                  size="lg"
                  className="rounded-full bg-teal-500 px-8 text-white shadow-[0_0_40px_rgba(13,148,136,0.45)] transition-[box-shadow,background] hover:bg-cyan-400 hover:shadow-[0_0_56px_rgba(6,182,212,0.5)]"
                >
                  <Link href={ctaHref}>{ctaLabel}</Link>
                </Button>
              ) : null}
              {secondaryCtaLabel && secondaryCtaHref ? (
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="rounded-full border-white/25 bg-white/5 text-white backdrop-blur hover:bg-white/10"
                >
                  <Link href={secondaryCtaHref}>{secondaryCtaLabel}</Link>
                </Button>
              ) : null}
            </motion.div>
          </div>

          <FloatingGlassDashboard />
        </div>
      </Container>
    </MeshBackdrop>
  )
}
