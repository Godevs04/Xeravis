import type { CollectionConfig } from 'payload'

import { canManageMarketing, isAdmin, staffRead } from '@/payload/access'

export const NewsletterCampaigns: CollectionConfig = {
  slug: 'newsletter-campaigns',
  labels: {
    singular: 'Campaign',
    plural: 'Campaigns',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'subject', 'sentAt', 'updatedAt'],
    group: 'Marketing',
  },
  access: {
    read: staffRead,
    create: canManageMarketing,
    update: canManageMarketing,
    delete: isAdmin,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'subject',
      type: 'text',
      required: true,
    },
    {
      name: 'sentAt',
      type: 'date',
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'audienceFilter',
      type: 'select',
      defaultValue: 'active',
      options: [
        { label: 'Active subscribers', value: 'active' },
        { label: 'All subscribers', value: 'all' },
        { label: 'Unsubscribed (audit)', value: 'unsubscribed' },
      ],
    },
    {
      name: 'notes',
      type: 'textarea',
    },
  ],
}
