import type { CollectionConfig } from 'payload'

import { isAdmin, isAdminOrEditor, staffRead } from '@/access'

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
    update: isAdminOrEditor,
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
