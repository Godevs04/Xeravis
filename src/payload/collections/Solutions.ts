import type { CollectionConfig } from 'payload'

import { authenticatedOrPublished, canManageContent, isAdminOrEditor } from '@/payload/access'
import { featuredField, orderField } from '@/payload/fields'
import { slugField } from '@/payload/fields/slug'
import {
  autoSlugFromTitle,
  enforcePublishRole,
  revalidateOnDelete,
  revalidateSlugPath,
} from '@/payload/hooks'

export const Solutions: CollectionConfig = {
  slug: 'solutions',
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
    beforeValidate: [autoSlugFromTitle('title')],
    beforeChange: [enforcePublishRole],
    afterChange: [revalidateSlugPath('/solutions', 'solutions')],
    afterDelete: [revalidateOnDelete(['/solutions'], ['solutions'])],
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
      name: 'body',
      type: 'richText',
      required: true,
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
