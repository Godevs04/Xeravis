import type { CollectionConfig } from 'payload'

import { canManageMarketing, isAdmin, staffRead } from '@/payload/access'

export const NewsletterSubscribers: CollectionConfig = {
  slug: 'newsletter-subscribers',
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'status', 'createdAt'],
    group: 'Inbox',
  },
  access: {
    read: staffRead,
    create: () => false,
    update: canManageMarketing,
    delete: isAdmin,
  },
  fields: [
    { name: 'email', type: 'email', required: true, unique: true },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'active',
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Unsubscribed', value: 'unsubscribed' },
      ],
    },
  ],
}
