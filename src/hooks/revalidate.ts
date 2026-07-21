import type { CollectionAfterChangeHook } from 'payload'
import { revalidatePath, revalidateTag } from 'next/cache'

export const revalidateCollection =
  (paths: string[], tags: string[] = []): CollectionAfterChangeHook =>
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
