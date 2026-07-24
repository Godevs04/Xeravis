import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
  GlobalAfterChangeHook,
} from 'payload'
import { revalidatePath, revalidateTag } from 'next/cache'

export { revalidateCollection } from '@/hooks/revalidate'

function safeRevalidatePath(path: string) {
  try {
    revalidatePath(path)
  } catch {
    // Outside Next.js request context (e.g. seed scripts)
  }
}

function safeRevalidateTag(tag: string) {
  try {
    revalidateTag(tag)
  } catch {
    // Outside Next.js request context (e.g. seed scripts)
  }
}

export const revalidateGlobal =
  (paths: string[], tags: string[] = []): GlobalAfterChangeHook =>
  ({ doc, req: { context } }) => {
    if (context?.disableRevalidate) return doc
    for (const path of paths) {
      safeRevalidatePath(path)
    }
    for (const tag of tags) {
      safeRevalidateTag(tag)
    }
    return doc
  }

export const revalidateSlugPath =
  (basePath: string, tag?: string): CollectionAfterChangeHook =>
  ({ doc, req: { context } }) => {
    if (context?.disableRevalidate) return doc
    const slug = typeof doc?.slug === 'string' ? doc.slug : null
    safeRevalidatePath(basePath)
    if (slug) safeRevalidatePath(`${basePath}/${slug}`)
    if (tag) safeRevalidateTag(tag)
    return doc
  }

export const revalidateOnDelete =
  (paths: string[], tags: string[] = []): CollectionAfterDeleteHook =>
  ({ doc, req: { context } }) => {
    if (context?.disableRevalidate) return doc
    for (const path of paths) {
      safeRevalidatePath(path)
    }
    for (const tag of tags) {
      safeRevalidateTag(tag)
    }
    return doc
  }
