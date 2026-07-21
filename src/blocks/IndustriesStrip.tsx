import Link from 'next/link'

import { IndustryCard } from '@/components/domain/IndustryCard'
import { Container } from '@/components/layout/Container'
import { Section } from '@/components/layout/Section'
import { AnimateIn } from '@/components/motion/AnimateIn'
import { Button } from '@/components/ui/button'
import { listPublished } from '@/lib/cms'
import { FALLBACK_INDUSTRIES } from '@/lib/fallback-data'

type IndustryDoc = {
  id: string
  title: string
  slug: string
  summary: string
}

type IndustriesStripProps = {
  heading: string
  subheading?: string | null
}

export async function IndustriesStrip({ heading, subheading }: IndustriesStripProps) {
  const industries = await listPublished<IndustryDoc>('industries', { limit: 4 })
  const items = industries.length ? industries : FALLBACK_INDUSTRIES

  return (
    <Section>
      <Container>
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <AnimateIn className="max-w-2xl">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{heading}</h2>
            {subheading && <p className="mt-4 text-lg text-secondary">{subheading}</p>}
          </AnimateIn>
          <Button asChild variant="ghost" className="self-start lg:self-auto">
            <Link href="/industries">All industries</Link>
          </Button>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {items.map((industry, index) => (
            <AnimateIn key={industry.id} delay={index * 0.05}>
              <IndustryCard
                title={industry.title}
                summary={industry.summary}
                href={`/industries/${industry.slug}`}
              />
            </AnimateIn>
          ))}
        </div>
      </Container>
    </Section>
  )
}
