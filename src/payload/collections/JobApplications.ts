import type { CollectionConfig } from 'payload'

import { canManageCareers, isAdmin } from '@/payload/access'

export const JobApplications: CollectionConfig = {
  slug: 'job-applications',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'email', 'career', 'status', 'createdAt'],
    group: 'Inbox',
  },
  access: {
    read: canManageCareers,
    create: () => false,
    update: canManageCareers,
    delete: isAdmin,
  },
  fields: [
    {
      name: 'career',
      type: 'relationship',
      relationTo: 'careers',
      required: true,
    },
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'email',
      type: 'email',
      required: true,
    },
    {
      name: 'phone',
      type: 'text',
    },
    {
      name: 'resume',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'coverLetter',
      type: 'textarea',
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'new',
      options: [
        { label: 'New', value: 'new' },
        { label: 'Reviewed', value: 'reviewed' },
        { label: 'Shortlisted', value: 'shortlisted' },
        { label: 'Rejected', value: 'rejected' },
        { label: 'Hired', value: 'hired' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
  ],
}
