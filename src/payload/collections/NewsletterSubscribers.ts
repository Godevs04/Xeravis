import type { CollectionConfig } from 'payload'

import { canManageMarketing, isAdmin, staffRead } from '@/payload/access'
import { createToken } from '@/lib/tokens'

export const NewsletterSubscribers: CollectionConfig = {
  slug: 'newsletter-subscribers',
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'status', 'topics', 'createdAt'],
    group: 'Marketing',
  },
  access: {
    read: staffRead,
    create: () => false,
    update: canManageMarketing,
    delete: isAdmin,
  },
  hooks: {
    beforeChange: [
      ({ data, originalDoc }) => {
        if (!data.token && !originalDoc?.token) data.token = createToken()
        return data
      },
    ],
  },
  fields: [
    { name: 'email', type: 'email', required: true, unique: true },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'pending',
      options: [
        { label: 'Pending confirmation', value: 'pending' },
        { label: 'Active', value: 'active' },
        { label: 'Unsubscribed', value: 'unsubscribed' },
      ],
    },
    {
      name: 'topics',
      type: 'select',
      hasMany: true,
      defaultValue: ['insights'],
      options: [
        { label: 'Insights newsletter', value: 'insights' },
        { label: 'Job alerts', value: 'careers' },
      ],
    },
    {
      name: 'source',
      type: 'text',
      admin: { readOnly: true, position: 'sidebar' },
    },
    {
      name: 'confirmedAt',
      type: 'date',
      admin: { readOnly: true, position: 'sidebar' },
    },
    {
      name: 'unsubscribedAt',
      type: 'date',
      admin: { readOnly: true, position: 'sidebar' },
    },
    {
      name: 'token',
      type: 'text',
      index: true,
      access: { read: () => false },
      admin: { hidden: true },
    },
  ],
}
