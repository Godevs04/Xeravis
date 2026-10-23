import { listDocs } from '@/lib/cms'
import { toSlug } from '@/payload/utilities'

export type AuthorDoc = {
  id: string
  name: string
  slug?: string | null
  role?: string | null
  bio?: string | null
  linkedIn?: string | null
}

export function authorSlug(author: Pick<AuthorDoc, 'name' | 'slug'>): string {
  return author.slug?.trim() || toSlug(author.name || '')
}

export function listAuthors() {
  return listDocs<AuthorDoc>('authors', { limit: 200, sort: 'name', depth: 0 })
}

/** Matches the stored slug, or the name-derived slug for authors saved before slugs existed. */
export async function findAuthorBySlug(slug: string): Promise<AuthorDoc | null> {
  const authors = await listAuthors()
  return authors.find((author) => authorSlug(author) === slug) ?? null
}

export function asAuthor(value: unknown): AuthorDoc | null {
  if (!value || typeof value !== 'object') return null
  const author = value as AuthorDoc
  return typeof author.name === 'string' && author.name.trim() ? author : null
}
