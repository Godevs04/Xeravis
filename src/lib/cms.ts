import type { Payload, Where } from 'payload'

import { getPayload, resetPayloadCache } from '@/lib/payload'
import { logger } from '@/lib/logger'

const log = logger.child('cms')

function isTransientDbError(error: unknown): boolean {
  const name = error instanceof Error ? error.name : ''
  const message = error instanceof Error ? error.message : String(error)
  return (
    name === 'MongoExpiredSessionError' ||
    name === 'MongoServerSelectionError' ||
    name === 'MongoNetworkError' ||
    message.includes('session that has ended') ||
    message.includes('MongoExpiredSessionError') ||
    message.includes('topology was destroyed') ||
    message.includes('connection timed out')
  )
}

export async function safePayload<T>(fn: (payload: Payload) => Promise<T>): Promise<T | null> {
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const payload = await getPayload()
      return await fn(payload)
    } catch (error) {
      if (attempt === 0 && isTransientDbError(error)) {
        log.warn('Transient DB/session error — resetting Payload client and retrying')
        resetPayloadCache()
        continue
      }
      log.error('Payload query failed:', error)
      return null
    }
  }
  return null
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
    const doc = result.docs[0] as unknown as (T & { _status?: string }) | undefined
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
    where?: Where
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
  const docs = (result?.docs as unknown as (T & { _status?: string })[]) ?? []
  if (!useDrafts) return docs as T[]
  return docs.filter((doc) => !doc._status || doc._status === 'published') as T[]
}

export async function listDocs<T>(
  collection: string,
  options: {
    limit?: number
    sort?: string
    where?: Where
  } = {},
): Promise<T[]> {
  return listPublished<T>(collection, { ...options, drafts: false })
}
