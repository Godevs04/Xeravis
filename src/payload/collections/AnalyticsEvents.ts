import type { CollectionConfig } from 'payload'

import { isAdmin, staffRead } from '@/payload/access'

export const AnalyticsEvents: CollectionConfig = {
  slug: 'analytics-events',
  labels: {
    singular: 'Analytics event',
    plural: 'Analytics events',
  },
  admin: {
    useAsTitle: 'path',
    defaultColumns: ['type', 'path', 'createdAt'],
    group: 'System',
  },
  access: {
    read: staffRead,
    create: () => false,
    update: () => false,
    delete: isAdmin,
  },
  fields: [
    {
      name: 'type',
      type: 'select',
      required: true,
      options: [
        { label: 'Pageview', value: 'pageview' },
        { label: 'Lead', value: 'lead' },
        { label: 'Application', value: 'application' },
        { label: 'Download', value: 'download' },
        { label: 'Newsletter', value: 'newsletter' },
      ],
    },
    {
      name: 'path',
      type: 'text',
    },
    {
      name: 'referrer',
      type: 'text',
    },
    {
      name: 'meta',
      type: 'json',
    },
  ],
}
