import { IndustryCard } from '@/components/domain/IndustryCard'
import { Container } from '@/components/layout/Container'
import { PageHero } from '@/components/layout/PageHero'
import { Section } from '@/components/layout/Section'
import { AnimateIn } from '@/components/motion/AnimateIn'
import { listPublished } from '@/lib/cms'
import { FALLBACK_INDUSTRIES, UNSPLASH } from '@/lib/fallback-data'
import { buildMetadata } from '@/lib/seo'

export const revalidate = 60

type IndustryDoc = {
  id: string
  title: string
  slug: string
  summary: string
}

export const metadata = buildMetadata({
  title: 'Industries',
  description: 'Industry-specific engineering solutions from Xelarvis Technologies.',
  path: '/industries',
})

export default async function IndustriesPage() {
  const industries = await listPublished<IndustryDoc>('industries')
  const items = industries.length ? industries : FALLBACK_INDUSTRIES

  return (
    <>
      <PageHero
        eyebrow="Industries"
        title="Domain expertise where regulation, scale, and reliability intersect."
        subtitle="We adapt platform patterns to the realities of your sector."
        image={UNSPLASH.office}
        size="compact"
      />
      <Section>
        <Container>
          <div className="grid gap-6 sm:grid-cols-2">
            {items.map((industry, index) => (
              <AnimateIn key={industry.id} delay={index * 0.03}>
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
    </>
  )
}
