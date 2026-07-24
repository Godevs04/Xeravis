import type { CollectionConfig } from 'payload'

import { anyone, canManageCareers, isAdminOrEditor } from '@/access'
import { orderField, slugField } from '@/fields'

export const Departments: CollectionConfig = {
  slug: 'departments',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'updatedAt'],
    group: 'Taxonomy',
  },
  access: {
    read: anyone,
    create: canManageCareers,
    update: canManageCareers,
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
      name: 'description',
      type: 'textarea',
      maxLength: 240,
    },
    orderField(),
  ],
}
