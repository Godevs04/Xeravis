import type { CollectionConfig } from 'payload'

import { authenticatedOrPublished, canManageContent, isAdminOrEditor } from '@/access'
import { featuredField, orderField } from '@/fields'
import { slugField } from '@/fields/slug'
import { revalidateSlugPath } from '@/payload/hooks'

export const Industries: CollectionConfig = {
  slug: 'industries',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', '_status', 'updatedAt'],
  },
  versions: {
    drafts: {
      autosave: {
        interval: 400,
      },
    },
  },
  access: {
    read: authenticatedOrPublished,
    create: canManageContent,
    update: canManageContent,
    delete: isAdminOrEditor,
  },
  hooks: {
    afterChange: [revalidateSlugPath('/industries', 'industries')],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    slugField(),
    {
      name: 'summary',
      type: 'textarea',
      required: true,
    },
    {
      name: 'challenges',
      type: 'textarea',
      label: 'Industry Challenges',
    },
    {
      name: 'approach',
      type: 'richText',
      label: 'Our Approach',
    },
    {
      name: 'relatedServices',
      type: 'relationship',
      relationTo: 'services',
      hasMany: true,
    },
    featuredField(),
    orderField(),
  ],
}
