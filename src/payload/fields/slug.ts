import type { Field } from 'payload'

import { toSlug } from '@/payload/utilities'

export const slugField = (fieldToUse = 'title'): Field => ({
  name: 'slug',
  type: 'text',
  required: true,
  unique: true,
  index: true,
  maxLength: 120,
  admin: {
    position: 'sidebar',
    description: 'URL slug. Auto-generated from title when empty.',
  },
  hooks: {
    beforeValidate: [
      ({ value, data }) => {
        if (typeof value === 'string' && value.length > 0) {
          return toSlug(value)
        }
        const source = data?.[fieldToUse]
        if (typeof source === 'string') {
          return toSlug(source)
        }
        return value
      },
    ],
  },
})
