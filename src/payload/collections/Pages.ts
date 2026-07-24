import type { CollectionConfig } from 'payload'

import { authenticatedOrPublished, canManageContent, isAdminOrEditor } from '@/payload/access'
import { pageBlocks } from '@/payload/blocks'
import { slugField } from '@/payload/fields'
import {
  autoSlugFromTitle,
  enforcePublishRole,
  revalidateOnDelete,
  revalidateSlugPath,
} from '@/payload/hooks'

export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', '_status', 'updatedAt'],
    group: 'Content',
    livePreview: {
      url: ({ data }) => {
        const base = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
        if (data?.slug === 'home') return base
        return `${base}/${data?.slug || ''}`
      },
    },
  },
  versions: {
    drafts: {
      autosave: { interval: 400 },
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
    afterChange: [revalidateSlugPath('/', 'pages')],
    afterDelete: [revalidateOnDelete(['/'], ['pages'])],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      maxLength: 120,
    },
    slugField(),
    {
      name: 'layout',
      type: 'blocks',
      required: true,
      blocks: pageBlocks,
    },
  ],
}
