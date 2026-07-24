import type { CollectionConfig } from 'payload'

import { authenticatedOrPublished, canManageContent, isAdminOrEditor } from '@/access'
import { featuredField, publishedAtField, slugField } from '@/fields'

export const Blogs: CollectionConfig = {
  slug: 'blogs',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'publishedAt', '_status', 'updatedAt'],
    group: 'Content',
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
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      maxLength: 140,
    },
    slugField(),
    {
      name: 'excerpt',
      type: 'textarea',
      required: true,
      maxLength: 300,
    },
    {
      name: 'content',
      type: 'richText',
      required: true,
    },
    {
      name: 'cover',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'authors',
    },
    {
      name: 'categories',
      type: 'relationship',
      relationTo: 'categories',
      hasMany: true,
    },
    {
      name: 'tags',
      type: 'relationship',
      relationTo: 'tags',
      hasMany: true,
    },
    {
      name: 'readingTime',
      type: 'number',
      admin: {
        position: 'sidebar',
        description: 'Minutes. Auto-estimated on save if empty.',
        readOnly: false,
      },
      hooks: {
        beforeChange: [
          ({ value, data }) => {
            if (typeof value === 'number' && value > 0) return value
            const text = JSON.stringify(data?.content || '')
            const words = text.split(/\s+/).length
            return Math.max(1, Math.round(words / 200))
          },
        ],
      },
    },
    featuredField(),
    publishedAtField(),
  ],
}
