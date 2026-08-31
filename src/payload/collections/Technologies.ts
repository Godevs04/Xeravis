import type { CollectionConfig } from 'payload'

import { anyone, canManageContent, isAdminOrEditor } from '@/payload/access'
import { featuredField, orderField, slugField } from '@/payload/fields'

export const Technologies: CollectionConfig = {
  slug: 'technologies',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'featured', 'updatedAt'],
    group: 'Website',
  },
  access: {
    read: anyone,
    create: canManageContent,
    update: canManageContent,
    delete: isAdminOrEditor,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      maxLength: 80,
    },
    slugField(),
    {
      name: 'category',
      type: 'select',
      required: true,
      options: [
        { label: 'Frontend', value: 'frontend' },
        { label: 'Backend', value: 'backend' },
        { label: 'Cloud', value: 'cloud' },
        { label: 'DevOps', value: 'devops' },
        { label: 'AI', value: 'ai' },
        { label: 'Database', value: 'database' },
        { label: 'Data', value: 'data' },
        { label: 'Business Intelligence', value: 'bi' },
        { label: 'CMS', value: 'cms' },
        { label: 'Other', value: 'other' },
      ],
      admin: {
        description:
          'Engineering stack categories only. Clinical standards (SAS/SDTM/CDISC) belong in Healthcare service capability content—not this catalog.',
      },
    },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'description',
      type: 'textarea',
      maxLength: 320,
    },
    featuredField(),
    orderField(),
  ],
}
