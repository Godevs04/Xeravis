import type { CollectionConfig } from 'payload'

import { isAdmin, staffRead } from '@/payload/access'

export const ActivityLogs: CollectionConfig = {
  slug: 'activity-logs',
  labels: {
    singular: 'Activity',
    plural: 'Activity',
  },
  admin: {
    useAsTitle: 'summary',
    defaultColumns: ['summary', 'action', 'collection', 'createdAt'],
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
      name: 'summary',
      type: 'text',
      required: true,
    },
    {
      name: 'action',
      type: 'select',
      required: true,
      options: [
        { label: 'Created', value: 'created' },
        { label: 'Updated', value: 'updated' },
        { label: 'Published', value: 'published' },
        { label: 'Deleted', value: 'deleted' },
        { label: 'Status change', value: 'status-change' },
        { label: 'Upload', value: 'upload' },
      ],
    },
    {
      name: 'collection',
      type: 'text',
      required: true,
    },
    {
      name: 'documentId',
      type: 'text',
    },
    {
      name: 'actor',
      type: 'relationship',
      relationTo: 'users',
    },
    {
      name: 'meta',
      type: 'json',
    },
  ],
}
