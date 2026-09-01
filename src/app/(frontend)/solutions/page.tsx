import { SolutionsPageHero } from '@/components/marketing/PageHeroes'
import { HubLinkStrip } from '@/components/content/HubLinkStrip'
import { SolutionsChallengeSelector } from '@/components/solutions/SolutionsChallengeSelector'
import { listPublished } from '@/lib/cms'
import { FALLBACK_SERVICES } from '@/lib/fallback-data'
import { resolveLinkedServices } from '@/lib/solution-service-links'
import { mergePublishedSolutions } from '@/lib/solutions-catalog'
import { buildMetadata } from '@/lib/seo'

export const revalidate = 60

type SolutionDoc = {
  id: string
  title: string
  slug: string
  summary: string
  businessChallenges?: { title?: string; description?: string }[] | null
  relatedServices?: unknown
  order?: number | null
}

export const metadata = buildMetadata({
  title: 'Enterprise AI, Analytics & Digital Solutions',
  description:
    'Outcome-oriented solution themes spanning Enterprise AI, intelligent automation, predictive analytics, data platforms, application modernization, and healthcare clinical intelligence.',
  path: '/solutions',
  keywords: [
    'Enterprise AI Solutions',
    'Predictive Analytics',
    'Data Platforms',
    'Intelligent Automation',
    'Application Modernization',
    'Xelarvis Solutions',
  ],
})

type ServiceDoc = {
  id: string
  title: string
  slug: string
  summary: string
}

export default async function SolutionsPage() {
  const [solutions, services] = await Promise.all([
    listPublished<SolutionDoc>('solutions', { sort: 'order' }),
    listPublished<ServiceDoc>('services', { sort: 'order' }),
  ])
  const serviceCatalog = services.length ? services : FALLBACK_SERVICES
  const merged = mergePublishedSolutions(solutions)
  const items = merged.map((s) => {
    const challenges =
      'businessChallenges' in s && Array.isArray(s.businessChallenges) ? s.businessChallenges : null
    const linkedServices = resolveLinkedServices(
      s.slug,
      'relatedServices' in s ? s.relatedServices : undefined,
      serviceCatalog,
    )
    return {
      id: s.id,
      title: s.title,
      slug: s.slug,
      summary: s.summary,
      challenge: challenges?.length
        ? challenges
            .map((c: { title?: string }) => c.title)
            .filter(Boolean)
            .join(' · ')
        : null,
      services: linkedServices.map((svc) => ({
        href: `/services/${svc.slug}`,
        label: svc.title,
      })),
    }
  })

  return (
    <>
      <SolutionsPageHero
        title="Solutions for measurable business outcomes."
        subtitle="Outcome-oriented programs built from our AI, Data Science, IT Consulting, and engineering services—each solution links to the practice areas that deliver it."
      />
      <HubLinkStrip
        eyebrow="Practice areas"
        heading="Every solution is delivered through our services"
        subheading="Solutions describe the business outcome. Services are the capabilities, teams, and delivery methods we combine to get there."
        items={serviceCatalog.map((s) => ({
          href: `/services/${s.slug}`,
          label: s.title,
          description: s.summary,
        }))}
        viewAll={{ href: '/services', label: 'All services →' }}
      />
      <SolutionsChallengeSelector solutions={items} />
    </>
  )
}
