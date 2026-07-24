import type { CollectionConfig } from 'payload'

import { authenticatedOrPublished, canManageCareers, isAdminOrEditor } from '@/payload/access'
import { slugField } from '@/payload/fields/slug'
import {
  autoSlugFromTitle,
  enforcePublishRole,
  revalidateOnDelete,
  revalidateSlugPath,
} from '@/payload/hooks'

export const Careers: CollectionConfig = {
  slug: 'careers',
  admin: {
    useAsTitle: 'title',
    defaultColumns: [
      'title',
      'departmentRef',
      'location',
      'type',
      'active',
      '_status',
      'updatedAt',
    ],
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
    create: canManageCareers,
    update: canManageCareers,
    delete: isAdminOrEditor,
  },
  hooks: {
    beforeValidate: [autoSlugFromTitle('title')],
    beforeChange: [enforcePublishRole],
    afterChange: [revalidateSlugPath('/careers', 'careers')],
    afterDelete: [revalidateOnDelete(['/careers'], ['careers'])],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    slugField(),
    {
      name: 'departmentRef',
      type: 'relationship',
      relationTo: 'departments',
      label: 'Department',
    },
    {
      name: 'department',
      type: 'text',
      label: 'Department (legacy text)',
      admin: {
        description: 'Prefer Department relationship. Kept for compatibility.',
      },
    },
    {
      name: 'office',
      type: 'text',
      label: 'Office / Location label',
      admin: {
        description: 'Display location (e.g. Chennai · Hybrid)',
      },
    },
    {
      name: 'location',
      type: 'text',
      required: true,
    },
    {
      name: 'type',
      type: 'select',
      required: true,
      options: [
        { label: 'Full-time', value: 'full-time' },
        { label: 'Part-time', value: 'part-time' },
        { label: 'Contract', value: 'contract' },
        { label: 'Internship', value: 'internship' },
      ],
    },
    {
      name: 'description',
      type: 'richText',
      required: true,
    },
    {
      name: 'requirements',
      type: 'richText',
      required: true,
    },
    {
      name: 'active',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        position: 'sidebar',
      },
    },
  ],
}
