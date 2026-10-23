import type { CollectionConfig } from 'payload'

import { isAdminOrEditor } from '@/payload/access'
import { attributionField } from '@/payload/fields'

export const FormSubmissions: CollectionConfig = {
  slug: 'form-submissions',
  admin: {
    group: 'Marketing',
    useAsTitle: 'type',
    defaultColumns: ['type', 'status', 'createdAt'],
  },
  access: {
    read: isAdminOrEditor,
    create: isAdminOrEditor,
    update: isAdminOrEditor,
    delete: isAdminOrEditor,
  },
  fields: [
    {
      name: 'type',
      type: 'select',
      required: true,
      options: [
        { label: 'Contact', value: 'contact' },
        { label: 'Newsletter', value: 'newsletter' },
        { label: 'Gated download', value: 'download' },
        { label: 'AI readiness assessment', value: 'assessment' },
      ],
    },
    {
      name: 'data',
      type: 'json',
      required: true,
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'new',
      options: [
        { label: 'New', value: 'new' },
        { label: 'Reviewed', value: 'reviewed' },
        { label: 'Archived', value: 'archived' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    attributionField(),
  ],
}
