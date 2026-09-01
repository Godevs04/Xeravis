import { SOLUTION_TECHNOLOGY_MAP } from '@/seed/relations'

export type TechnologyLinkDoc = {
  id: string
  slug: string
  title: string
  category?: string | null
  description?: string | null
}

const TECH_TITLE_ALIASES: Record<string, string> = {
  'Google Cloud': 'Google Cloud Platform',
  GCP: 'Google Cloud Platform',
  Azure: 'Microsoft Azure',
  Spark: 'Apache Spark',
  Kafka: 'Apache Kafka',
}

export function normalizeTechnologyTitle(label: string): string {
  return TECH_TITLE_ALIASES[label] ?? label
}

function catalogByTitle(catalog: TechnologyLinkDoc[]): Map<string, TechnologyLinkDoc> {
  const map = new Map<string, TechnologyLinkDoc>()
  for (const tech of catalog) {
    map.set(tech.title, tech)
  }
  return map
}

/**
 * Solution-specific technology stack from the canonical matrix.
 * Does not inherit technologies from linked services.
 */
export function resolveSolutionTechnologies(
  solutionSlug: string,
  catalog: TechnologyLinkDoc[],
): TechnologyLinkDoc[] {
  const labels = SOLUTION_TECHNOLOGY_MAP[solutionSlug]
  if (!labels?.length) return []

  const byTitle = catalogByTitle(catalog)
  const seen = new Set<string>()
  const resolved: TechnologyLinkDoc[] = []

  for (const raw of labels) {
    const title = normalizeTechnologyTitle(raw)
    const tech = byTitle.get(title) ?? byTitle.get(raw)
    if (!tech || seen.has(tech.slug)) continue
    resolved.push(tech)
    seen.add(tech.slug)
  }

  return resolved
}
