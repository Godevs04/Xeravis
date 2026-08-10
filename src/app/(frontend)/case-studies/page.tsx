import { CaseStudyCard } from '@/components/domain/CaseStudyCard'
import { Container } from '@/components/layout/Container'
import { PageHero } from '@/components/layout/PageHero'
import { Section } from '@/components/layout/Section'
import { AnimateIn } from '@/components/motion/AnimateIn'
import { listPublished } from '@/lib/cms'
import { FALLBACK_CASE_STUDIES } from '@/lib/fallback-data'
import { buildMetadata } from '@/lib/seo'

export const revalidate = 60

type CaseStudyDoc = {
  id: string
  title: string
  slug: string
  client: string
  outcome: string
}

export const metadata = buildMetadata({
  title: 'Case Studies',
  description:
    'Representative engagements and delivery patterns from XELARVIS across AI, data science and IT consulting.',
  path: '/case-studies',
})

export default async function CaseStudiesPage() {
  const studies = await listPublished<CaseStudyDoc>('case-studies')
  const items = studies.length ? studies : FALLBACK_CASE_STUDIES

  return (
    <>
      <PageHero
        brand="Xelarvis"
        eyebrow="Evidence"
        title="Representative engagements."
        subtitle="Anonymized delivery patterns that show how XELARVIS moves from business problem to governed outcomes—without inflated claims."
        size="compact"
      />
      <Section>
        <Container>
          <div className="grid gap-6 lg:grid-cols-2">
            {items.map((study, index) => (
              <AnimateIn key={study.id} delay={index * 0.03}>
                <CaseStudyCard
                  title={study.title}
                  client={study.client}
                  outcome={study.outcome}
                  href={`/case-studies/${study.slug}`}
                />
              </AnimateIn>
            ))}
          </div>
        </Container>
      </Section>
    </>
  )
}
