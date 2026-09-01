import { FALLBACK_SOLUTIONS } from '@/lib/fallback-data'
import { CANONICAL_SOLUTION_SLUGS } from '@/seed/relations'

/** Merge CMS solutions with the canonical 9-program catalog (CMS wins per slug). */
export function mergePublishedSolutions<
  T extends { slug: string; title?: string; summary?: string; id?: string },
>(cms: T[], fallback: T[] = FALLBACK_SOLUTIONS as T[]): T[] {
  const bySlug = new Map<string, T>()
  for (const item of fallback) {
    bySlug.set(item.slug, { ...item })
  }
  for (const item of cms) {
    const base = bySlug.get(item.slug)
    bySlug.set(item.slug, base ? { ...base, ...item } : item)
  }
  return CANONICAL_SOLUTION_SLUGS.map((slug) => bySlug.get(slug)).filter((item): item is T =>
    Boolean(item),
  )
}
