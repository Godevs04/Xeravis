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

export async function getGlobal<T>(slug: Parameters<Payload['findGlobal']>[0]['slug']): Promise<T | null> {
  return safePayload(async (payload) => {
    const doc = await payload.findGlobal({ slug })
    return doc as T
  })
}

export async function getPublishedDoc<T>(
  collection: Parameters<Payload['findByID']>[0]['collection'],
  id: string,
): Promise<T | null> {
  return safePayload(async (payload) => {
    const doc = await payload.findByID({
      collection,
      id,
      draft: false,
    })
    return doc as T
  })
}

export async function getPublishedBySlug<T>(
  collection: Parameters<Payload['find']>[0]['collection'],
  slug: string,
): Promise<T | null> {
  return safePayload(async (payload) => {
    const result = await payload.find({
      collection,
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
  collection: Parameters<Payload['find']>[0]['collection'],
  options: {
    limit?: number
    sort?: string
    where?: Record<string, unknown>
    /** Set false for collections without draft versions */
    drafts?: boolean
  } = {},
): Promise<T[]> {
  const useDrafts = options.drafts !== false
  const result = await safePayload(async (payload) => {
    return payload.find({
      collection,
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
  collection: Parameters<Payload['find']>[0]['collection'],
  options: {
    limit?: number
    sort?: string
    where?: Record<string, unknown>
  } = {},
): Promise<T[]> {
  return listPublished<T>(collection, { ...options, drafts: false })
}
