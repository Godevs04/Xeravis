import { FALLBACK_SERVICES } from '@/lib/fallback-data'
import { CANONICAL_SERVICE_SLUGS } from '@/seed/relations'

/** Merge CMS services with the canonical five-capability catalog (CMS wins per slug). */
export function mergePublishedServices<
  T extends { slug: string; title?: string; summary?: string; id?: string },
>(cms: T[], fallback: T[] = FALLBACK_SERVICES as unknown as T[]): T[] {
  const bySlug = new Map<string, T>()
  for (const item of fallback) {
    bySlug.set(item.slug, { ...item })
  }
  for (const item of cms) {
    const base = bySlug.get(item.slug)
    bySlug.set(item.slug, base ? { ...base, ...item } : item)
  }
  return CANONICAL_SERVICE_SLUGS.map((slug) => bySlug.get(slug)).filter((item): item is T =>
    Boolean(item),
  )
}
