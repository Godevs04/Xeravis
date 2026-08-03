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
  title: 'AI & Healthcare Technology Services',
  description:
    'Healthcare AI, clinical data science, enterprise AI, cloud engineering, and data platforms from Xelarvis for hospitals and regulated enterprises.',
  path: '/services',
  keywords: [
    'Healthcare AI',
    'Enterprise AI',
    'Clinical Data Science',
    'Cloud Engineering',
    'Data Engineering',
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
        subtitle="Artificial Intelligence, Data Science, IT Consulting, Clinical Data Science, and Cloud Data platforms — engineered for measurable outcomes."
      />
      <ServicesIndexSection services={items} />
    </>
  )
}
