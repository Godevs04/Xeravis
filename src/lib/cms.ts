import type { Payload } from 'payload'

import { getPayload } from '@/lib/payload'

export async function safePayload<T>(fn: (payload: Payload) => Promise<T>): Promise<T | null> {
  try {
    const payload = await getPayload()
    return await fn(payload)
  } catch (error) {
    console.error('[cms] Payload query failed:', error)
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
      },
      limit: 1,
      depth: 2,
      draft: false,
      overrideAccess: true,
    })
    const doc = result.docs[0] as (T & { _status?: string }) | undefined
    if (!doc) return null
    if (doc._status && doc._status !== 'published') return null
    return doc
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
      where: options.where ?? {},
      limit: options.limit ?? 100,
      sort: options.sort ?? '-updatedAt',
      depth: 2,
      draft: useDrafts ? false : undefined,
      overrideAccess: true,
    })
  })
  const docs = (result?.docs as (T & { _status?: string })[]) ?? []
  if (!useDrafts) return docs as T[]
  return docs.filter((doc) => !doc._status || doc._status === 'published') as T[]
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
