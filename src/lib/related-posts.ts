import type { Where } from 'payload'

import { listPublished } from '@/lib/cms'

export type RelatedPost = {
  id: string
  title: string
  slug: string
  excerpt: string
  publishedAt?: string | null
}

function ids(value: unknown): string[] {
  if (!Array.isArray(value)) return []
  return value
    .map((item) =>
      typeof item === 'object' && item && 'id' in item ? String(item.id) : String(item ?? ''),
    )
    .filter(Boolean)
}

/** Posts sharing a tag or category with `post`, topped up with the latest posts. */
export async function relatedPosts(
  post: { id?: string; tags?: unknown; categories?: unknown },
  limit = 3,
): Promise<RelatedPost[]> {
  const tagIds = ids(post.tags)
  const categoryIds = ids(post.categories)
  const notSelf: Where = post.id ? { id: { not_equals: post.id } } : {}

  const shared =
    tagIds.length || categoryIds.length
      ? await listPublished<RelatedPost>('blogs', {
          sort: '-publishedAt',
          limit,
          depth: 0,
          where: {
            and: [
              notSelf,
              {
                or: [
                  ...(tagIds.length ? [{ tags: { in: tagIds } }] : []),
                  ...(categoryIds.length ? [{ categories: { in: categoryIds } }] : []),
                ],
              },
            ],
          },
        })
      : []
  if (shared.length >= limit) return shared

  const exclude = [post.id, ...shared.map((p) => p.id)].filter(Boolean) as string[]
  const latest = await listPublished<RelatedPost>('blogs', {
    sort: '-publishedAt',
    limit: limit - shared.length,
    depth: 0,
    where: exclude.length ? { id: { not_in: exclude } } : {},
  })
  return [...shared, ...latest]
}
