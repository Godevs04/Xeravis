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
  title: 'Data Science, AI & Healthcare Services',
  description:
    'Data science, AI research, Healthcare AI, clinical data science, and cloud platforms from Xelarvis for hospitals and regulated enterprises.',
  path: '/services',
  keywords: [
    'Data Science',
    'AI Research',
    'Healthcare AI',
    'Clinical Data Science',
    'Enterprise AI',
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
        subtitle="Data Science, Artificial Intelligence, Healthcare AI, Clinical Data Science, and Cloud platforms — engineered for measurable outcomes."
      />
      <ServicesIndexSection services={items} />
    </>
  )
}
