import { SERVICE_SOLUTION_MAP } from '@/seed/relations'

export type ServiceLinkDoc = {
  id: string
  slug: string
  title: string
  summary?: string | null
}

function asServiceDocs(value: unknown): ServiceLinkDoc[] {
  if (!Array.isArray(value)) return []
  return value
    .filter((item): item is Record<string, unknown> => typeof item === 'object' && item !== null)
    .map((item) => ({
      id: String(item.id ?? item.slug ?? ''),
      slug: String(item.slug ?? ''),
      title: String(item.title ?? ''),
      summary: typeof item.summary === 'string' ? item.summary : null,
    }))
    .filter((s) => s.slug && s.title)
}

/** Service slugs that deliver a given solution (canonical matrix from seed). */
export function getServiceSlugsForSolution(solutionSlug: string): string[] {
  return Object.entries(SERVICE_SOLUTION_MAP)
    .filter(([, solutionSlugs]) => solutionSlugs.includes(solutionSlug))
    .map(([serviceSlug]) => serviceSlug)
}

/**
 * Merge CMS `relatedServices` with the canonical service↔solution matrix
 * so pages always interlink even when CMS relations are empty.
 */
export function resolveLinkedServices(
  solutionSlug: string,
  cmsRelated: unknown,
  catalog: ServiceLinkDoc[],
): ServiceLinkDoc[] {
  const fromCms = asServiceDocs(cmsRelated)
  const seen = new Set(fromCms.map((s) => s.slug))
  const merged = [...fromCms]

  for (const slug of getServiceSlugsForSolution(solutionSlug)) {
    if (seen.has(slug)) continue
    const match = catalog.find((s) => s.slug === slug)
    if (match) {
      merged.push(match)
      seen.add(slug)
    }
  }

  return merged
}
