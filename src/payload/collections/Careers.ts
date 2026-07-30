import type { CollectionConfig } from 'payload'

import { authenticatedOrPublished, canManageCareers, isAdminOrEditor } from '@/payload/access'
import { slugField } from '@/payload/fields/slug'
import {
  autoSlugFromTitle,
  enforcePublishRole,
  revalidateOnDelete,
  revalidateSlugPath,
} from '@/payload/hooks'
import { trackActivity } from '@/payload/hooks/activity'

export const Careers: CollectionConfig = {
  slug: 'careers',
  admin: {
    group: 'Careers',
    useAsTitle: 'title',
    defaultColumns: [
      'title',
      'departmentRef',
      'location',
      'type',
      'workMode',
      'active',
      'applicationDeadline',
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
    afterChange: [revalidateSlugPath('/careers', 'careers'), trackActivity('careers')],
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
        description: 'Display location (e.g. Hyderabad · Hybrid)',
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
      label: 'Employment type',
      options: [
        { label: 'Full-time', value: 'full-time' },
        { label: 'Part-time', value: 'part-time' },
        { label: 'Contract', value: 'contract' },
        { label: 'Internship', value: 'internship' },
      ],
    },
    {
      name: 'workMode',
      type: 'select',
      defaultValue: 'hybrid',
      options: [
        { label: 'On-site', value: 'onsite' },
        { label: 'Hybrid', value: 'hybrid' },
        { label: 'Remote', value: 'remote' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'experienceRequired',
      type: 'text',
      label: 'Experience required',
      admin: { description: 'e.g. 2–5 Years' },
    },
    {
      name: 'openings',
      type: 'number',
      defaultValue: 1,
      min: 1,
      admin: { position: 'sidebar' },
    },
    {
      name: 'postedAt',
      type: 'date',
      admin: {
        position: 'sidebar',
        date: { pickerAppearance: 'dayOnly' },
      },
    },
    {
      name: 'applicationDeadline',
      type: 'date',
      admin: {
        position: 'sidebar',
        date: { pickerAppearance: 'dayOnly' },
      },
    },
    {
      name: 'aboutRole',
      type: 'textarea',
      label: 'About the role',
    },
    {
      name: 'description',
      type: 'richText',
      required: true,
    },
    {
      name: 'responsibilities',
      type: 'array',
      fields: [{ name: 'item', type: 'text', required: true }],
    },
    {
      name: 'requiredSkills',
      type: 'array',
      fields: [{ name: 'item', type: 'text', required: true }],
    },
    {
      name: 'preferredSkills',
      type: 'array',
      fields: [{ name: 'item', type: 'text', required: true }],
    },
    {
      name: 'qualifications',
      type: 'textarea',
    },
    {
      name: 'benefits',
      type: 'array',
      fields: [{ name: 'item', type: 'text', required: true }],
    },
    {
      name: 'requirements',
      type: 'richText',
      required: true,
      label: 'Requirements (legacy rich text)',
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
