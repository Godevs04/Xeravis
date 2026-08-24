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
      name: 'businessChallenges',
      type: 'array',
      label: 'Business Challenges',
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'description', type: 'textarea' },
      ],
    },
    {
      name: 'useCases',
      type: 'array',
      label: 'Use Cases',
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'description', type: 'textarea' },
      ],
    },
    {
      name: 'outcomes',
      type: 'array',
      label: 'Outcomes',
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'description', type: 'textarea' },
      ],
    },
    {
      name: 'whoIsThisFor',
      type: 'textarea',
      label: 'Who Is This For?',
    },
    {
      name: 'relatedServices',
      type: 'relationship',
      relationTo: 'services',
      hasMany: true,
      label: 'Related Services / Capabilities',
    },
    {
      name: 'relatedIndustries',
      type: 'relationship',
      relationTo: 'industries',
      hasMany: true,
    },
    {
      name: 'technologies',
      type: 'relationship',
      relationTo: 'technologies',
      hasMany: true,
      label: 'Technology Stack',
      admin: {
        description:
          'Technologies specific to this solution — do not inherit the full service stack.',
      },
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
