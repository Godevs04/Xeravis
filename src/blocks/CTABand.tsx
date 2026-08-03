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
        <div className="surface-navy relative overflow-hidden rounded-[36px] border border-[color:var(--hero-panel-border)] px-8 py-16 text-[color:var(--hero-text)] shadow-[var(--shadow-floating)] sm:px-12 lg:px-16 lg:py-24">
          <div
            aria-hidden
            className="absolute inset-0 bg-[linear-gradient(135deg,var(--hero-bg)_0%,var(--color-neutral)_45%,var(--hero-bg)_100%)] dark:bg-[linear-gradient(135deg,#0F172A_0%,#0B1224_45%,#0F172A_100%)]"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_80%_at_20%_20%,var(--hero-glow),transparent_55%)]"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_50%_60%_at_90%_80%,var(--hero-glow-2),transparent_50%)]"
          />
          {!reduce ? (
            <motion.div
              aria-hidden
              className="pointer-events-none absolute top-10 right-16 h-40 w-40 rounded-full bg-[radial-gradient(circle,var(--hero-glow-2),transparent_70%)] blur-2xl"
              animate={{ opacity: [0.35, 0.7, 0.35], y: [0, -16, 0] }}
              transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
            />
          ) : null}

          <div className="relative mx-auto max-w-3xl text-center">
            <p className="mb-4 text-[11px] font-bold tracking-[0.2em] text-[color:var(--color-accent)] uppercase">
              Next step
            </p>
            <h2 className="font-display text-[clamp(2rem,4.5vw,3.5rem)] font-bold tracking-[-0.04em] text-balance text-[color:var(--hero-text)]">
              {heading}
            </h2>
            {subheading ? (
              <p className="mx-auto mt-5 max-w-xl text-lg text-[color:var(--hero-muted)]">
                {subheading}
              </p>
            ) : null}
            <div className="mt-10 flex flex-wrap justify-center gap-3">
              <Button
                asChild
                variant="primary"
                size="lg"
                className="rounded-full bg-[color:var(--color-teal)] px-8 text-white shadow-[0_0_48px_rgba(13,148,136,0.35)] hover:bg-[color:var(--color-cyan)]"
              >
                <Link href={ctaHref}>{ctaLabel}</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="rounded-full border-[color:var(--hero-panel-border)] bg-[color:var(--hero-panel)] text-[color:var(--hero-text)] backdrop-blur-md hover:bg-[color:var(--color-hover)]"
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
