import Link from 'next/link'

import { Container } from '@/components/layout/Container'
import { Section } from '@/components/layout/Section'
import { AnimateIn } from '@/components/motion/AnimateIn'
import { Button } from '@/components/ui/button'

type Cta = {
  label?: string | null
  href?: string | null
  style?: string | null
}

type AboutPreviewProps = {
  heading: string
  body: string
  cta?: Cta | null
}

export function AboutPreview({ heading, body, cta }: AboutPreviewProps) {
  return (
    <Section>
      <Container className="grid gap-10 lg:grid-cols-12 lg:gap-16">
        <AnimateIn className="lg:col-span-5">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted">Who we are</p>
          <h2 className="mt-4 text-balance">{heading}</h2>
        </AnimateIn>
        <AnimateIn className="lg:col-span-7" delay={0.05}>
          <p className="prose-measure text-lg leading-relaxed text-secondary">{body}</p>
          {cta?.label && cta?.href ? (
            <Button asChild variant="outline" className="mt-8">
              <Link href={cta.href}>{cta.label}</Link>
            </Button>
          ) : null}
        </AnimateIn>
      </Container>
    </Section>
  )
}
