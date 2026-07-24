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
  description: 'Enterprise software, cloud, data, and AI services from Xelarvis Technologies.',
  path: '/services',
})

export default async function ServicesPage() {
  const services = await listPublished<ServiceDoc>('services')
  const items = services.length ? services : FALLBACK_SERVICES

  return (
    <>
      <PageHero
        brand="Xelarvis"
        eyebrow="Services"
        title="Engineering for every stage of the digital lifecycle."
        subtitle="Strategy, build, and operate — with teams that understand enterprise constraints."
        size="compact"
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
