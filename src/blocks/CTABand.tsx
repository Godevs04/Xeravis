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
    <Section surface>
      <Container>
        <AnimateIn className="flex flex-col items-start justify-between gap-8 border border-border bg-background p-10 lg:flex-row lg:items-center lg:p-14">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{heading}</h2>
            {subheading && <p className="mt-4 text-lg text-secondary">{subheading}</p>}
          </div>
          <Button asChild variant="accent" size="lg">
            <Link href={ctaHref}>{ctaLabel}</Link>
          </Button>
        </AnimateIn>
      </Container>
    </Section>
  )
}
