import type { CollectionConfig } from 'payload'

import { anyone, canManageContent, isAdminOrEditor } from '@/payload/access'

export const Authors: CollectionConfig = {
  slug: 'authors',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'role', 'updatedAt'],
  },
  access: {
    read: anyone,
    create: canManageContent,
    update: canManageContent,
    delete: isAdminOrEditor,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'role',
      type: 'text',
    },
    {
      name: 'bio',
      type: 'textarea',
    },
    {
      name: 'avatar',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'linkedIn',
      type: 'text',
      label: 'LinkedIn URL',
    },
  ],
}
