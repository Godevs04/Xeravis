import { StoryCases } from '@/blocks/story/StoryCases'
import { listPublished } from '@/lib/cms'
import { FALLBACK_CASE_STUDIES } from '@/lib/fallback-data'

type CaseStudyDoc = {
  id: string
  title: string
  slug: string
  client: string
  outcome: string
  challenge?: string | null
  industry?: { title?: string | null } | string | null
  metrics?: { label: string; value: string }[] | null
  services?: { title?: string | null }[] | (string | number)[] | null
}

type StoryCasesBlockProps = {
  eyebrow?: string | null
  heading: string
}

function industryLabel(industry: CaseStudyDoc['industry']) {
  if (!industry) return null
  if (typeof industry === 'string') return industry
  return industry.title || null
}

function serviceTitles(services: CaseStudyDoc['services']) {
  if (!Array.isArray(services)) return null
  const titles = services
    .map((s) => (typeof s === 'object' && s && 'title' in s ? s.title : null))
    .filter((t): t is string => Boolean(t))
  return titles.length ? titles : null
}

export async function StoryCasesBlock({ eyebrow, heading }: StoryCasesBlockProps) {
  const studies = await listPublished<CaseStudyDoc>('case-studies', { limit: 5 })
  const source = studies.length ? studies : FALLBACK_CASE_STUDIES
  const items = source.map((s) => ({
    id: s.id,
    title: s.title,
    client: s.client,
    outcome: s.outcome,
    challenge: 'challenge' in s ? s.challenge : undefined,
    industry: 'industry' in s ? industryLabel(s.industry) : undefined,
    metrics: 'metrics' in s ? s.metrics : undefined,
    technologies: 'services' in s ? serviceTitles(s.services) : undefined,
    href: `/case-studies/${s.slug}`,
  }))

  return <StoryCases eyebrow={eyebrow} heading={heading} items={items} />
}
