import type { CollectionBeforeValidateHook } from 'payload'

import { toSlug } from '@/payload/utilities'

export const autoSlugFromTitle =
  (sourceField = 'title'): CollectionBeforeValidateHook =>
  ({ data, operation }) => {
    if (!data) return data
    if (operation !== 'create' && operation !== 'update') return data

    const existingSlug = typeof data.slug === 'string' ? data.slug.trim() : ''
    if (existingSlug) {
      data.slug = toSlug(existingSlug)
      return data
    }

    const source = data[sourceField]
    if (typeof source === 'string' && source.trim()) {
      data.slug = toSlug(source)
    }

    return data
  }
