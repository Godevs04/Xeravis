import type { Payload } from 'payload'

import { getPayload } from '@/lib/payload'

export async function safePayload<T>(fn: (payload: Payload) => Promise<T>): Promise<T | null> {
  try {
    const payload = await getPayload()
    return await fn(payload)
  } catch {
    return null
  }
}

export async function getGlobal<T>(slug: string): Promise<T | null> {
  return safePayload(async (payload) => {
    const doc = await payload.findGlobal({ slug: slug as 'site-settings' })
    return doc as T
  })
}

export async function getPublishedDoc<T>(collection: string, id: string): Promise<T | null> {
  return safePayload(async (payload) => {
    const doc = await payload.findByID({
      collection: collection as 'pages',
      id,
      draft: false,
    })
    return doc as T
  })
}

export async function getPublishedBySlug<T>(collection: string, slug: string): Promise<T | null> {
  return safePayload(async (payload) => {
    const result = await payload.find({
      collection: collection as 'pages',
      where: {
        slug: { equals: slug },
        _status: { equals: 'published' },
      },
      limit: 1,
      depth: 2,
    })
    return (result.docs[0] as T) ?? null
  })
}

export async function listPublished<T>(
  collection: string,
  options: {
    limit?: number
    sort?: string
    where?: Record<string, unknown>
    drafts?: boolean
  } = {},
): Promise<T[]> {
  const useDrafts = options.drafts !== false
  const result = await safePayload(async (payload) => {
    return payload.find({
      collection: collection as 'pages',
      where: {
        ...(useDrafts ? { _status: { equals: 'published' } } : {}),
        ...options.where,
      },
      limit: options.limit ?? 100,
      sort: options.sort ?? '-updatedAt',
      depth: 2,
    })
  })
  return (result?.docs as T[]) ?? []
}

export async function listDocs<T>(
  collection: string,
  options: {
    limit?: number
    sort?: string
    where?: Record<string, unknown>
  } = {},
): Promise<T[]> {
  return listPublished<T>(collection, { ...options, drafts: false })
}
