import type { CollectionConfig } from 'payload'

import { authenticatedOrPublished, canManageContent, isAdminOrEditor } from '@/payload/access'
import { slugField } from '@/payload/fields/slug'
import {
  autoSlugFromTitle,
  enforcePublishRole,
  revalidateOnDelete,
  revalidateSlugPath,
} from '@/payload/hooks'

export const CaseStudies: CollectionConfig = {
  slug: 'case-studies',
  admin: {
    group: 'Website',
    useAsTitle: 'title',
    defaultColumns: ['title', 'clientRef', 'slug', '_status', 'updatedAt'],
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
    afterChange: [revalidateSlugPath('/case-studies', 'case-studies')],
    afterDelete: [revalidateOnDelete(['/case-studies'], ['case-studies'])],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    slugField(),
    {
      name: 'clientRef',
      type: 'relationship',
      relationTo: 'clients',
      label: 'Client',
    },
    {
      name: 'client',
      type: 'text',
      required: true,
      label: 'Client name',
      admin: {
        description: 'Display name. Prefer Client relationship when available.',
      },
    },
    {
      name: 'industry',
      type: 'relationship',
      relationTo: 'industries',
    },
    {
      name: 'challenge',
      type: 'textarea',
      required: true,
    },
    {
      name: 'outcome',
      type: 'textarea',
      required: true,
    },
    {
      name: 'metrics',
      type: 'array',
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'value', type: 'text', required: true },
      ],
    },
    {
      name: 'services',
      type: 'relationship',
      relationTo: 'services',
      hasMany: true,
      label: 'Related Services',
    },
    {
      name: 'relatedSolutions',
      type: 'relationship',
      relationTo: 'solutions',
      hasMany: true,
      label: 'Related Solutions',
    },
    {
      name: 'technologies',
      type: 'relationship',
      relationTo: 'technologies',
      hasMany: true,
    },
    {
      name: 'featuredImage',
      type: 'upload',
      relationTo: 'media',
    },
  ],
}
