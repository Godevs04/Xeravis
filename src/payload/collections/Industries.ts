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

export const Industries: CollectionConfig = {
  slug: 'industries',
  admin: {
    group: 'Website',
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
    afterChange: [revalidateSlugPath('/industries', 'industries')],
    afterDelete: [revalidateOnDelete(['/industries'], ['industries'])],
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
      name: 'heroImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Cover / Hero image',
    },
    {
      name: 'challenges',
      type: 'textarea',
      label: 'Industry Challenges (legacy)',
      admin: {
        description: 'Prefer structured Problems below. Kept for compatibility.',
      },
    },
    {
      name: 'problems',
      type: 'array',
      label: 'Problems',
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'description', type: 'textarea', required: true },
      ],
    },
    {
      name: 'solutions',
      type: 'array',
      label: 'Solutions (legacy inline)',
      admin: {
        description: 'Prefer Related Solutions relationship below.',
      },
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'description', type: 'textarea', required: true },
      ],
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
      label: 'Related Services / Capabilities',
    },
    {
      name: 'relatedSolutions',
      type: 'relationship',
      relationTo: 'solutions',
      hasMany: true,
      label: 'Related Solutions',
    },
    {
      name: 'relatedTechnologies',
      type: 'relationship',
      relationTo: 'technologies',
      hasMany: true,
    },
    {
      name: 'relatedCaseStudies',
      type: 'relationship',
      relationTo: 'case-studies',
      hasMany: true,
    },
    {
      name: 'relatedResearch',
      type: 'relationship',
      relationTo: 'research',
      hasMany: true,
    },
    {
      name: 'relatedInsights',
      type: 'relationship',
      relationTo: 'blogs',
      hasMany: true,
      label: 'Related Insights',
    },
    {
      name: 'tier',
      type: 'select',
      defaultValue: '3',
      options: [
        { label: 'Tier 1 — Primary', value: '1' },
        { label: 'Tier 2 — Secondary', value: '2' },
        { label: 'Tier 3 — Emerging', value: '3' },
      ],
      admin: {
        description:
          'Controls nav prominence. Tier 3 stays out of primary mega until content-ready.',
        position: 'sidebar',
      },
    },
    featuredField(),
    orderField(),
  ],
}
