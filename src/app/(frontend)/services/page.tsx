import { ServicesPageHero } from '@/components/marketing/PageHeroes'
import { ServicesIndexSection } from '@/components/services/ServicesIndexSection'
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
  title: 'Artificial Intelligence, Data Science & IT Consulting Services',
  description:
    'Artificial Intelligence, Data Science & Analytics, IT Consulting & Digital Transformation, Data Engineering & Cloud, and Healthcare & Clinical Data Science—engineered for measurable business outcomes.',
  path: '/services',
  keywords: [
    'Artificial Intelligence',
    'Data Science',
    'IT Consulting',
    'Digital Transformation',
    'Data Engineering',
    'Healthcare AI Specialty',
    'Xelarvis Services',
  ],
})

export default async function ServicesPage() {
  const services = await listPublished<ServiceDoc>('services', { sort: 'order' })
  const items = services.length ? services : FALLBACK_SERVICES

  return (
    <>
      <ServicesPageHero
        title="Our Core Services"
        subtitle="Artificial Intelligence, Data Science & Analytics, IT Consulting & Digital Transformation, Data Engineering & Cloud—plus Healthcare & Life Sciences as a specialty."
      />
      <ServicesIndexSection services={items} />
    </>
  )
}
