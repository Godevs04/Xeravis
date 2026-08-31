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

export const Services: CollectionConfig = {
  slug: 'services',
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
    afterChange: [revalidateSlugPath('/services', 'services')],
    afterDelete: [revalidateOnDelete(['/services'], ['services'])],
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
      name: 'icon',
      type: 'text',
      admin: {
        description: 'Lucide icon name (e.g. cloud, code, shield)',
      },
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
      label: 'Challenges we solve',
    },
    {
      name: 'body',
      type: 'richText',
      required: true,
    },
    {
      name: 'benefits',
      type: 'array',
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'description', type: 'textarea', required: true },
      ],
    },
    {
      name: 'process',
      type: 'array',
      label: 'Process steps',
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'description', type: 'textarea', required: true },
      ],
    },
    {
      name: 'technologies',
      type: 'relationship',
      relationTo: 'technologies',
      hasMany: true,
      label: 'Technologies',
      admin: {
        description: 'Engineering stack for this capability (not clinical standards).',
      },
    },
    {
      name: 'relatedSolutions',
      type: 'relationship',
      relationTo: 'solutions',
      hasMany: true,
      label: 'Related Solutions',
      admin: {
        description: 'Business problems this capability helps solve.',
      },
    },
    {
      name: 'relatedIndustries',
      type: 'relationship',
      relationTo: 'industries',
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
      name: 'relatedFaqs',
      type: 'relationship',
      relationTo: 'faqs',
      hasMany: true,
    },
    featuredField(),
    orderField(),
  ],
}
