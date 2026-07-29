import { ServiceCard } from '@/components/domain/ServiceCard'
import { Container } from '@/components/layout/Container'
import { PageHero } from '@/components/layout/PageHero'
import { Section } from '@/components/layout/Section'
import { AnimateIn } from '@/components/motion/AnimateIn'
import { listPublished } from '@/lib/cms'
import { FALLBACK_SERVICES } from '@/lib/fallback-data'
import { buildMetadata } from '@/lib/seo'

export const revalidate = 60

type ServiceDoc = {
  id: string
  title: string
  slug: string
  summary: string
  icon?: string | null
}

export const metadata = buildMetadata({
  title: 'Services',
  description:
    'AI research, data science, IT consulting, clinical data science, and cloud data platforms from XELARVIS.',
  path: '/services',
})

export default async function ServicesPage() {
  const services = await listPublished<ServiceDoc>('services', { sort: 'order' })
  const items = services.length ? services : FALLBACK_SERVICES

  return (
    <>
      <PageHero
        brand="Xelarvis"
        eyebrow="Services"
        title="Our Core Services"
        subtitle="Artificial Intelligence, Data Science, IT Consulting, Clinical Data Science, and Cloud Data platforms — engineered for measurable outcomes."
        size="compact"
        variant="default"
      />
      <Section>
        <Container>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((service, index) => (
              <AnimateIn key={service.id} delay={index * 0.04}>
                <ServiceCard
                  title={service.title}
                  summary={service.summary}
                  href={`/services/${service.slug}`}
                  icon={service.icon}
                  className="h-full"
                />
              </AnimateIn>
            ))}
          </div>
        </Container>
      </Section>
    </>
  )
}
