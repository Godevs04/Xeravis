import { StoryCases } from '@/blocks/story/StoryCases'
import { listPublished } from '@/lib/cms'
import { FALLBACK_CASE_STUDIES } from '@/lib/fallback-data'

type CaseStudyDoc = {
  id: string
  title: string
  slug: string
  client: string
  outcome: string
}

type StoryCasesBlockProps = {
  eyebrow?: string | null
  heading: string
}

export async function StoryCasesBlock({ eyebrow, heading }: StoryCasesBlockProps) {
  const studies = await listPublished<CaseStudyDoc>('case-studies', { limit: 5 })
  const source = studies.length ? studies : FALLBACK_CASE_STUDIES
  const items = source.map((s) => ({
    id: s.id,
    title: s.title,
    client: s.client,
    outcome: s.outcome,
    href: `/case-studies/${s.slug}`,
  }))

  return <StoryCases eyebrow={eyebrow} heading={heading} items={items} />
}
