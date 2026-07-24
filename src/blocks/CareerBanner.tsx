import Link from 'next/link'

import { Container } from '@/components/layout/Container'
import { Section } from '@/components/layout/Section'
import { AnimateIn } from '@/components/motion/AnimateIn'
import { Button } from '@/components/ui/button'
import { NewsletterForm } from '@/components/forms/NewsletterForm'

type Cta = { label?: string | null; href?: string | null }

type CareerBannerProps = {
  heading: string
  subheading?: string | null
  cta?: Cta | null
}

export function CareerBanner({ heading, subheading, cta }: CareerBannerProps) {
  const href = cta?.href || '/careers'
  const label = cta?.label || 'Open positions'

  return (
    <Section>
      <Container>
        <AnimateIn>
          <div className="rounded-[var(--radius-hero)] bg-dark px-8 py-14 text-white md:px-14 md:py-20">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/60">Careers</p>
            <h2 className="mt-4 max-w-2xl text-balance text-white">{heading}</h2>
            {subheading ? <p className="mt-4 max-w-xl text-lg text-white/70">{subheading}</p> : null}
            <Button asChild variant="primary" className="mt-8">
              <Link href={href}>{label}</Link>
            </Button>
          </div>
        </AnimateIn>
      </Container>
    </Section>
  )
}

type NewsletterBlockProps = {
  heading: string
  subheading?: string | null
}

export function NewsletterBlock({ heading, subheading }: NewsletterBlockProps) {
  return (
    <Section surface>
      <Container className="max-w-2xl">
        <AnimateIn>
          <h2 className="text-balance">{heading}</h2>
          {subheading ? <p className="mt-4 text-lg text-secondary">{subheading}</p> : null}
          <div className="mt-8">
            <NewsletterForm />
          </div>
        </AnimateIn>
      </Container>
    </Section>
  )
}
