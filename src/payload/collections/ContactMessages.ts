import type { CollectionConfig } from 'payload'

import { isAdmin, isAdminOrEditor, staffRead } from '@/payload/access'

export const ContactMessages: CollectionConfig = {
  slug: 'contact-messages',
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['name', 'email', 'subject', 'status', 'createdAt'],
    group: 'Inbox',
  },
  access: {
    read: staffRead,
    create: () => false,
    update: isAdminOrEditor,
    delete: isAdmin,
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'company', type: 'text' },
    { name: 'email', type: 'email', required: true },
    { name: 'phone', type: 'text' },
    { name: 'subject', type: 'text' },
    { name: 'message', type: 'textarea', required: true },
    {
      name: 'intent',
      type: 'select',
      options: [
        { label: 'Project', value: 'project' },
        { label: 'General', value: 'general' },
        { label: 'Partnership', value: 'partnership' },
      ],
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'new',
      options: [
        { label: 'New', value: 'new' },
        { label: 'In progress', value: 'in-progress' },
        { label: 'Closed', value: 'closed' },
      ],
    },
    { name: 'notes', type: 'textarea' },
  ],
}
