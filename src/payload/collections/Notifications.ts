import type { Access, CollectionConfig } from 'payload'

import { isAdmin } from '@/payload/access'

const ownNotifications: Access = ({ req: { user } }) => {
  if (!user) return false
  const roles = (user as { roles?: string[] }).roles || []
  if (roles.includes('super-admin') || roles.includes('administrator')) return true
  return {
    user: {
      equals: user.id,
    },
  }
}

export const Notifications: CollectionConfig = {
  slug: 'notifications',
  labels: {
    singular: 'Notification',
    plural: 'Notifications',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'type', 'read', 'createdAt'],
    group: 'System',
  },
  access: {
    read: ownNotifications,
    create: () => false,
    update: ownNotifications,
    delete: isAdmin,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'body',
      type: 'textarea',
    },
    {
      name: 'type',
      type: 'select',
      required: true,
      defaultValue: 'info',
      options: [
        { label: 'Lead', value: 'lead' },
        { label: 'Application', value: 'application' },
        { label: 'Interview', value: 'interview' },
        { label: 'Publish', value: 'publish' },
        { label: 'Media', value: 'media' },
        { label: 'Info', value: 'info' },
      ],
    },
    {
      name: 'href',
      type: 'text',
    },
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
    },
    {
      name: 'read',
      type: 'checkbox',
      defaultValue: false,
    },
  ],
}
