import Link from 'next/link'

import { Container } from '@/components/layout/Container'
import { Section } from '@/components/layout/Section'
import { AnimateIn } from '@/components/motion/AnimateIn'
import { Button } from '@/components/ui/button'
import { SpotlightCard } from '@/components/ui/SpotlightCard'

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

const MILESTONES = [
  { year: '2014', label: 'Founded' },
  { year: '2018', label: 'Enterprise scale' },
  { year: '2022', label: 'AI platforms' },
  { year: '2026', label: 'Global delivery' },
]

const PRINCIPLES = [
  { title: 'Clarity first', detail: 'Architecture you can explain in one slide.' },
  { title: 'Ship durable', detail: 'Code and platforms that age gracefully.' },
  { title: 'Own outcomes', detail: 'Senior leads from discovery to production.' },
]

export function AboutPreview({ heading, body, cta }: AboutPreviewProps) {
  return (
    <Section>
      <Container>
        <div className="grid items-start gap-10 lg:grid-cols-12 lg:gap-12">
          <AnimateIn className="lg:col-span-5">
            <p className="text-accent text-[11px] font-bold tracking-[0.18em] uppercase">
              Who we are
            </p>
            <h2 className="font-display mt-4 text-[length:var(--text-h2)] font-bold tracking-[-0.04em] text-balance">
              {heading}
            </h2>
            <p className="text-secondary mt-5 max-w-xl text-lg leading-relaxed">{body}</p>
            {cta?.label && cta?.href ? (
              <Button asChild variant="outline" className="mt-8 rounded-full">
                <Link href={cta.href}>{cta.label}</Link>
              </Button>
            ) : null}
          </AnimateIn>

          <div className="grid gap-4 sm:grid-cols-2 lg:col-span-7">
            <AnimateIn delay={0.06} className="sm:col-span-2">
              <SpotlightCard className="p-5 sm:p-6">
                <p className="text-muted text-[11px] font-bold tracking-[0.16em] uppercase">
                  Journey
                </p>
                <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {MILESTONES.map((m) => (
                    <div
                      key={m.year}
                      className="rounded-2xl border border-[color:var(--glass-border-soft)] bg-white/55 px-3 py-3 dark:bg-white/5"
                    >
                      <p className="font-display text-accent text-lg font-bold">{m.year}</p>
                      <p className="text-secondary mt-1 text-xs font-medium">{m.label}</p>
                    </div>
                  ))}
                </div>
              </SpotlightCard>
            </AnimateIn>

            {PRINCIPLES.map((p, i) => (
              <AnimateIn key={p.title} delay={0.1 + i * 0.05}>
                <SpotlightCard className="h-full p-5">
                  <p className="font-display text-primary text-base font-semibold">{p.title}</p>
                  <p className="text-secondary mt-2 text-sm leading-relaxed">{p.detail}</p>
                </SpotlightCard>
              </AnimateIn>
            ))}
          </div>
        </div>
      </Container>
    </Section>
  )
}
