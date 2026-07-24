import type { CollectionAfterChangeHook, CollectionAfterDeleteHook, GlobalAfterChangeHook } from 'payload'
import { revalidatePath, revalidateTag } from 'next/cache'

export { revalidateCollection } from '@/hooks/revalidate'

export const revalidateGlobal =
  (paths: string[], tags: string[] = []): GlobalAfterChangeHook =>
  ({ doc, req: { context } }) => {
    if (context?.disableRevalidate) return doc
    for (const path of paths) {
      revalidatePath(path)
    }
    for (const tag of tags) {
      revalidateTag(tag)
    }
    return doc
  }

export const revalidateSlugPath =
  (basePath: string, tag?: string): CollectionAfterChangeHook =>
  ({ doc, req: { context } }) => {
    if (context?.disableRevalidate) return doc
    const slug = typeof doc?.slug === 'string' ? doc.slug : null
    revalidatePath(basePath)
    if (slug) revalidatePath(`${basePath}/${slug}`)
    if (tag) revalidateTag(tag)
    return doc
  }

export const revalidateOnDelete =
  (paths: string[], tags: string[] = []): CollectionAfterDeleteHook =>
  ({ doc, req: { context } }) => {
    if (context?.disableRevalidate) return doc
    for (const path of paths) {
      revalidatePath(path)
    }
    for (const tag of tags) {
      revalidateTag(tag)
    }
    return doc
  }
