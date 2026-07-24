import type { CollectionAfterChangeHook } from 'payload'
import { revalidatePath, revalidateTag } from 'next/cache'

function safeRevalidatePath(path: string) {
  try {
    revalidatePath(path)
  } catch {
    // Outside Next.js request context
  }
}

function safeRevalidateTag(tag: string) {
  try {
    revalidateTag(tag)
  } catch {
    // Outside Next.js request context
  }
}

export const revalidateCollection =
  (paths: string[], tags: string[] = []): CollectionAfterChangeHook =>
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
