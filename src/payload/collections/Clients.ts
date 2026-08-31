import type { CollectionConfig } from 'payload'

import { anyone, canManageContent, isAdminOrEditor } from '@/payload/access'

export const Clients: CollectionConfig = {
  slug: 'clients',
  admin: {
    group: 'Website',
    useAsTitle: 'name',
    defaultColumns: ['name', 'url', 'featured', 'updatedAt'],
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
      admin: {
        components: {
          Cell: './payload/admin/components/cells/ClientLogoCell#ClientLogoCell',
        },
      },
    },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'url',
      type: 'text',
      label: 'Website URL',
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
      },
    },
  ],
}
