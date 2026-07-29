import type { CollectionConfig } from 'payload'

import { anyone, canManageContent, isAdminOrEditor } from '@/payload/access'
import { orderField } from '@/payload/fields'

export const Faqs: CollectionConfig = {
  slug: 'faqs',
  admin: {
    group: 'Brand',
    useAsTitle: 'question',
    defaultColumns: ['question', 'group', 'updatedAt'],
  },
  access: {
    read: anyone,
    create: canManageContent,
    update: canManageContent,
    delete: isAdminOrEditor,
  },
  fields: [
    {
      name: 'question',
      type: 'text',
      required: true,
    },
    {
      name: 'answer',
      type: 'textarea',
      required: true,
    },
    {
      name: 'group',
      type: 'text',
      admin: {
        description: 'Optional grouping label (e.g. Services, Careers)',
      },
    },
    {
      name: 'relatedServices',
      type: 'relationship',
      relationTo: 'services',
      hasMany: true,
    },
    {
      name: 'relatedPages',
      type: 'relationship',
      relationTo: 'pages',
      hasMany: true,
    },
    orderField(),
  ],
}
