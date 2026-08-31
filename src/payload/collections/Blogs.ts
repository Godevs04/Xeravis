import type { CollectionConfig } from 'payload'

import { authenticatedOrPublished, canManageContent, isAdminOrEditor } from '@/payload/access'
import { featuredField, publishedAtField, slugField } from '@/payload/fields'
import {
  autoSlugFromTitle,
  enforcePublishRole,
  revalidateOnDelete,
  revalidateSlugPath,
} from '@/payload/hooks'
import { trackActivity } from '@/payload/hooks/activity'

export const Blogs: CollectionConfig = {
  slug: 'blogs',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'author', 'publishedAt', '_status', 'updatedAt'],
    group: 'Website',
  },
  defaultPopulate: {
    title: true,
    slug: true,
    author: true,
    cover: true,
    publishedAt: true,
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
    afterChange: [revalidateSlugPath('/blog', 'blogs'), trackActivity('blogs')],
    afterDelete: [revalidateOnDelete(['/blog'], ['blogs'])],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      maxLength: 140,
      admin: {
        components: {
          Cell: './payload/admin/components/cells/CatalogTitleCell#CatalogTitleCell',
        },
      },
    },
    slugField(),
    {
      name: 'insightType',
      type: 'select',
      defaultValue: 'blog',
      options: [
        { label: 'Blog', value: 'blog' },
        { label: 'White Paper', value: 'white-paper' },
        { label: 'News', value: 'news' },
        { label: 'Resource', value: 'resource' },
      ],
      admin: {
        position: 'sidebar',
        description: 'Used by Insights hub filters.',
      },
    },
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
      admin: {
        components: {
          Cell: './payload/admin/components/cells/BlogAuthorCell#BlogAuthorCell',
        },
      },
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
      name: 'relatedServices',
      type: 'relationship',
      relationTo: 'services',
      hasMany: true,
    },
    {
      name: 'relatedSolutions',
      type: 'relationship',
      relationTo: 'solutions',
      hasMany: true,
    },
    {
      name: 'relatedIndustries',
      type: 'relationship',
      relationTo: 'industries',
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
