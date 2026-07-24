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
      <Container>
        <div className="border-border grid items-start gap-10 border-y py-16 lg:grid-cols-12 lg:gap-16 lg:py-24">
          <AnimateIn className="lg:col-span-5">
            <p className="text-accent text-sm font-semibold tracking-[0.16em] uppercase">
              Who we are
            </p>
            <h2 className="font-display mt-4 text-[length:var(--text-h2)] font-bold tracking-tight text-balance">
              {heading}
            </h2>
          </AnimateIn>
          <AnimateIn className="lg:col-span-7" delay={0.08}>
            <p className="text-secondary max-w-xl text-lg leading-relaxed">{body}</p>
            {cta?.label && cta?.href ? (
              <Button asChild variant="outline" className="mt-8 rounded-full">
                <Link href={cta.href}>{cta.label}</Link>
              </Button>
            ) : null}
          </AnimateIn>
        </div>
      </Container>
    </Section>
  )
}
