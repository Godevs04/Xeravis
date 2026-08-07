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
  title: 'AI Research, Consulting, Data Science & Healthcare Services',
  description:
    'AI research & innovation, enterprise technology consulting, data science, clinical data science, and cloud platforms—engineered for measurable business outcomes.',
  path: '/services',
  keywords: [
    'AI Research',
    'Enterprise Technology Consulting',
    'Data Science',
    'Healthcare AI',
    'IT Consulting',
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
        subtitle="AI Research & Innovation, Data Science, Enterprise Technology Consulting, Clinical Data Science, and Cloud—focused on measurable business outcomes."
      />
      <ServicesIndexSection services={items} />
    </>
  )
}
