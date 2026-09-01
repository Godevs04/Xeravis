import type { RelatedContentGroup, RelatedContentItem } from '@/components/content/RelatedContent'

type RelDoc = {
  id?: string | number
  title?: string | null
  slug?: string | null
  summary?: string | null
  excerpt?: string | null
}

function asDocs(value: unknown): RelDoc[] {
  if (!Array.isArray(value)) return []
  return value.filter((item): item is RelDoc => typeof item === 'object' && item !== null)
}

function toItem(
  doc: RelDoc,
  basePath: string,
  descriptionKey: 'summary' | 'excerpt' = 'summary',
  opts?: { hashOnly?: boolean },
): RelatedContentItem | null {
  if (!doc.slug || !doc.title) return null
  const href = opts?.hashOnly ? `${basePath}#${doc.slug}` : `${basePath}/${doc.slug}`
  return {
    href,
    label: doc.title,
    description: (doc[descriptionKey] || undefined) ?? undefined,
  }
}

function mapGroup(
  title: string,
  value: unknown,
  basePath: string,
  limit: number,
  descriptionKey: 'summary' | 'excerpt' = 'summary',
  opts?: { hashOnly?: boolean },
): RelatedContentGroup {
  const items = asDocs(value)
    .map((d) => toItem(d, basePath, descriptionKey, opts))
    .filter((x): x is RelatedContentItem => Boolean(x))
    .slice(0, limit)
  return { title, items }
}

export type RelatedCaps = {
  solutions?: number
  services?: number
  industries?: number
  technologies?: number
  caseStudies?: number
  research?: number
  insights?: number
}

const DEFAULT_CAPS: Required<RelatedCaps> = {
  solutions: 5,
  services: 4,
  industries: 5,
  technologies: 6,
  caseStudies: 3,
  research: 3,
  insights: 3,
}

/**
 * Build RelatedContent groups from a CMS document's relationship fields.
 * Caps keep pages focused (plan: relevance filtering, not dump-everything).
 */
export function buildRelatedGroups(
  doc: Record<string, unknown>,
  caps: RelatedCaps = {},
  options?: { omitTitles?: string[]; servicesFirst?: boolean },
): RelatedContentGroup[] {
  const c = { ...DEFAULT_CAPS, ...caps }

  const groups = [
    mapGroup('Solutions', doc.relatedSolutions, '/solutions', c.solutions),
    mapGroup('Services', doc.relatedServices ?? doc.services, '/services', c.services),
    mapGroup(
      'Industries',
      Array.isArray(doc.relatedIndustries)
        ? doc.relatedIndustries
        : normalizeIndustryRelation(doc.relatedIndustries ?? doc.industry),
      '/industries',
      c.industries,
    ),
    mapGroup(
      'Technologies',
      doc.technologies ?? doc.relatedTechnologies,
      '/technologies',
      c.technologies,
      'summary',
      { hashOnly: true },
    ),
    mapGroup('Case Studies', doc.relatedCaseStudies, '/case-studies', c.caseStudies),
    mapGroup('Research', doc.relatedResearch, '/research', c.research, 'excerpt'),
    mapGroup('Insights', doc.relatedInsights, '/blog', c.insights, 'excerpt'),
  ].filter((g) => g.items.length > 0)

  let visible = groups
  if (options?.omitTitles?.length) {
    const omit = new Set(options.omitTitles)
    visible = visible.filter((g) => !omit.has(g.title))
  }
  if (options?.servicesFirst) {
    const services = visible.find((g) => g.title === 'Services')
    const rest = visible.filter((g) => g.title !== 'Services')
    visible = services ? [services, ...rest] : rest
  }
  return visible
}

/** Normalize a single industry relation that may be an object or id. */
export function normalizeIndustryRelation(value: unknown): RelDoc[] {
  if (!value) return []
  if (Array.isArray(value)) return asDocs(value)
  if (typeof value === 'object' && value !== null) return [value as RelDoc]
  return []
}
