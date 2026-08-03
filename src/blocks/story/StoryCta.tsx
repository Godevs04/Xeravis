'use client'

import Link from 'next/link'
import { motion, useReducedMotion } from 'framer-motion'

import { MeshBackdrop } from '@/components/marketing/MeshBackdrop'
import { Container } from '@/components/layout/Container'
import { Button } from '@/components/ui/button'

type StoryCtaProps = {
  heading: string
  subheading?: string | null
  ctaLabel?: string | null
  ctaHref?: string | null
}

export function StoryCta({
  heading,
  subheading,
  ctaLabel = 'Schedule a Consultation',
  ctaHref = '/contact',
}: StoryCtaProps) {
  const reduce = useReducedMotion()

  return (
    <MeshBackdrop className="py-28 lg:py-40" interactive>
      <Container className="relative text-center">
        <motion.p
          className="text-[11px] font-bold tracking-[0.22em] text-[color:var(--color-accent)] uppercase"
          initial={reduce ? false : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          Next chapter
        </motion.p>
        <motion.h2
          className="font-display mx-auto mt-6 max-w-4xl text-[clamp(2.4rem,7vw,5.5rem)] leading-[0.95] font-bold tracking-[-0.05em] text-balance text-[color:var(--hero-text)]"
          initial={reduce ? false : { opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          {heading}
        </motion.h2>
        {subheading ? (
          <p className="mx-auto mt-8 max-w-xl text-lg text-[color:var(--hero-muted)]">
            {subheading}
          </p>
        ) : null}
        <motion.div
          className="mt-12"
          whileHover={reduce ? undefined : { scale: 1.03 }}
          transition={{ type: 'spring', stiffness: 260, damping: 18 }}
        >
          <Button
            asChild
            size="lg"
            className="rounded-full bg-teal-500 px-10 py-6 text-base text-white shadow-[0_0_60px_rgba(13,148,136,0.55)] transition-[box-shadow,background] hover:bg-cyan-400 hover:shadow-[0_0_80px_rgba(6,182,212,0.55)]"
          >
            <Link href={ctaHref || '/contact'}>{ctaLabel}</Link>
          </Button>
        </motion.div>
      </Container>
    </MeshBackdrop>
  )
}
