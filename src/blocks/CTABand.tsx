'use client'

import Link from 'next/link'
import { motion, useReducedMotion } from 'framer-motion'

import { Container } from '@/components/layout/Container'
import { Section } from '@/components/layout/Section'
import { Button } from '@/components/ui/button'

type CTABandProps = {
  heading: string
  subheading?: string | null
  ctaLabel: string
  ctaHref: string
}

export function CTABand({ heading, subheading, ctaLabel, ctaHref }: CTABandProps) {
  const reduce = useReducedMotion()

  return (
    <Section>
      <Container>
        <div className="relative overflow-hidden rounded-[36px] border border-[color:var(--glass-border)] px-8 py-16 shadow-[var(--shadow-floating)] sm:px-12 lg:px-16 lg:py-24">
          <div
            aria-hidden
            className="absolute inset-0 bg-[linear-gradient(135deg,#1a1630_0%,#2a2348_45%,#6d5ef9_140%)]"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_80%_at_20%_20%,rgba(161,140,255,0.45),transparent_55%)]"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_50%_60%_at_90%_80%,rgba(109,94,249,0.5),transparent_50%)]"
          />
          {!reduce ? (
            <motion.div
              aria-hidden
              className="pointer-events-none absolute top-10 right-16 h-40 w-40 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.25),transparent_70%)] blur-2xl"
              animate={{ opacity: [0.35, 0.7, 0.35], y: [0, -16, 0] }}
              transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
            />
          ) : null}

          <div className="relative mx-auto max-w-3xl text-center">
            <p className="mb-4 text-[11px] font-bold tracking-[0.2em] text-[#c4b5fd] uppercase">
              Next step
            </p>
            <h2 className="font-display text-[clamp(2rem,4.5vw,3.5rem)] font-bold tracking-[-0.04em] text-balance text-white">
              {heading}
            </h2>
            {subheading ? (
              <p className="mx-auto mt-5 max-w-xl text-lg text-[#d4c8ff]/90">{subheading}</p>
            ) : null}
            <div className="mt-10 flex flex-wrap justify-center gap-3">
              <Button
                asChild
                variant="primary"
                size="lg"
                className="rounded-full bg-white px-8 text-[#1f1f21] shadow-[0_0_48px_rgba(255,255,255,0.25)] hover:bg-[#f7f4ff]"
              >
                <Link href={ctaHref}>{ctaLabel}</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="rounded-full border-white/25 bg-white/5 text-white backdrop-blur-md hover:bg-white/10"
              >
                <Link href="/services">Browse capabilities</Link>
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  )
}
