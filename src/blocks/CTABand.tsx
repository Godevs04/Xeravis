import Link from 'next/link'

import { Container } from '@/components/layout/Container'
import { Section } from '@/components/layout/Section'
import { AnimateIn } from '@/components/motion/AnimateIn'
import { Button } from '@/components/ui/button'

type CTABandProps = {
  heading: string
  subheading?: string | null
  ctaLabel: string
  ctaHref: string
}

export function CTABand({ heading, subheading, ctaLabel, ctaHref }: CTABandProps) {
  return (
    <Section>
      <Container>
        <AnimateIn>
          <div className="relative overflow-hidden rounded-[32px] border border-[color:var(--glass-border-soft)] bg-[color:var(--card-bg)] px-8 py-14 text-center shadow-[var(--shadow-floating)] backdrop-blur-2xl sm:px-12 lg:px-16 lg:py-20">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_80%_at_50%_0%,var(--color-accent-soft),transparent_60%)]"
            />
            <div
              aria-hidden
              className="bg-accent/20 pointer-events-none absolute top-1/2 -left-20 h-56 w-56 -translate-y-1/2 rounded-full blur-3xl"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute -right-16 bottom-0 h-48 w-48 rounded-full bg-[#a18cff]/20 blur-3xl"
            />

            <div className="relative mx-auto max-w-3xl">
              <p className="text-accent mb-4 text-sm font-semibold tracking-[0.18em] uppercase">
                Next step
              </p>
              <h2 className="font-display text-[length:var(--text-h2)] font-bold tracking-tight text-balance">
                {heading}
              </h2>
              {subheading ? (
                <p className="text-secondary mx-auto mt-5 max-w-xl text-lg">{subheading}</p>
              ) : null}
              <div className="mt-10 flex justify-center">
                <Button
                  asChild
                  variant="primary"
                  size="lg"
                  className="rounded-full px-8 shadow-[0_0_48px_rgba(109,94,249,0.45)]"
                >
                  <Link href={ctaHref}>{ctaLabel}</Link>
                </Button>
              </div>
            </div>
          </div>
        </AnimateIn>
      </Container>
    </Section>
  )
}
