import { SolutionsPageHero } from '@/components/marketing/PageHeroes'
import { SolutionsChallengeSelector } from '@/components/solutions/SolutionsChallengeSelector'
import { listPublished } from '@/lib/cms'
import { FALLBACK_SOLUTIONS } from '@/lib/fallback-data'
import { buildMetadata } from '@/lib/seo'

export const revalidate = 60

type SolutionDoc = {
  id: string
  title: string
  slug: string
  summary: string
  businessChallenges?: { title?: string; description?: string }[] | null
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

export default async function SolutionsPage() {
  const solutions = await listPublished<SolutionDoc>('solutions', { sort: 'order' })
  const items = (solutions.length ? solutions : FALLBACK_SOLUTIONS).map((s) => {
    const challenges =
      'businessChallenges' in s && Array.isArray(s.businessChallenges) ? s.businessChallenges : null
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
    }
  })

  return (
    <>
      <SolutionsPageHero
        title="Solutions for measurable business outcomes."
        subtitle="Packaged approaches that combine services, accelerators, and delivery playbooks—choose the challenge you need to solve."
      />
      <SolutionsChallengeSelector solutions={items} />
    </>
  )
}
