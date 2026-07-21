import Link from 'next/link'

import { CaseStudyCard } from '@/components/domain/CaseStudyCard'
import { Container } from '@/components/layout/Container'
import { Section } from '@/components/layout/Section'
import { AnimateIn } from '@/components/motion/AnimateIn'
import { listPublished } from '@/lib/cms'
import { FALLBACK_CASE_STUDIES } from '@/lib/fallback-data'

type CaseStudyDoc = {
  id: string
  title: string
  slug: string
  client: string
  outcome: string
}

type CaseStudyFeatureProps = {
  heading: string
}

export async function CaseStudyFeature({ heading }: CaseStudyFeatureProps) {
  const studies = await listPublished<CaseStudyDoc>('case-studies', { limit: 2 })
  const items = studies.length ? studies : FALLBACK_CASE_STUDIES

  return (
    <Section surface>
      <Container>
        <AnimateIn className="max-w-2xl">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{heading}</h2>
          <p className="mt-4 text-lg text-secondary">
            Outcomes from programs where engineering discipline met business urgency.
          </p>
        </AnimateIn>
        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          {items.map((study, index) => (
            <AnimateIn key={study.id} delay={index * 0.05}>
              <CaseStudyCard
                title={study.title}
                client={study.client}
                outcome={study.outcome}
                href={`/case-studies/${study.slug}`}
              />
            </AnimateIn>
          ))}
        </div>
        <p className="mt-10">
          <Link href="/case-studies" className="text-sm font-semibold text-accent hover:underline">
            View all case studies
          </Link>
        </p>
      </Container>
    </Section>
  )
}
