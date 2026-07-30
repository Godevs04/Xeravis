import type { CollectionConfig } from 'payload'

import { canManageCareers, isAdmin, staffRead } from '@/payload/access'
import { trackActivity } from '@/payload/hooks/activity'

export const Interviews: CollectionConfig = {
  slug: 'interviews',
  labels: {
    singular: 'Interview',
    plural: 'Interviews',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'scheduledAt', 'mode', 'outcome', 'updatedAt'],
    group: 'Careers',
  },
  access: {
    read: staffRead,
    create: canManageCareers,
    update: canManageCareers,
    delete: isAdmin,
  },
  hooks: {
    afterChange: [trackActivity('interviews')],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      admin: {
        description: 'e.g. Technical screen — Jane Doe',
      },
    },
    {
      name: 'application',
      type: 'relationship',
      relationTo: 'job-applications',
      required: true,
    },
    {
      name: 'job',
      type: 'relationship',
      relationTo: 'careers',
    },
    {
      name: 'interviewers',
      type: 'relationship',
      relationTo: 'users',
      hasMany: true,
    },
    {
      name: 'scheduledAt',
      type: 'date',
      required: true,
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'mode',
      type: 'select',
      required: true,
      defaultValue: 'video',
      options: [
        { label: 'Video', value: 'video' },
        { label: 'Onsite', value: 'onsite' },
        { label: 'Phone', value: 'phone' },
      ],
    },
    {
      name: 'meetingLink',
      type: 'text',
      admin: {
        placeholder: 'https://meet.google.com/...',
      },
    },
    {
      name: 'outcome',
      type: 'select',
      defaultValue: 'scheduled',
      options: [
        { label: 'Scheduled', value: 'scheduled' },
        { label: 'Completed', value: 'completed' },
        { label: 'No-show', value: 'no-show' },
        { label: 'Cancelled', value: 'cancelled' },
        { label: 'Advance', value: 'advance' },
        { label: 'Reject', value: 'reject' },
      ],
    },
    {
      name: 'notes',
      type: 'textarea',
    },
  ],
}
