import type { CollectionConfig } from 'payload'

import { anyone, canManageContent, isAdminOrEditor } from '@/payload/access'

export const Testimonials: CollectionConfig = {
  slug: 'testimonials',
  admin: {
    group: 'Website',
    useAsTitle: 'authorName',
    defaultColumns: ['authorName', 'company', 'authorRole', 'featured', 'updatedAt'],
  },
  access: {
    read: anyone,
    create: canManageContent,
    update: canManageContent,
    delete: isAdminOrEditor,
  },
  fields: [
    {
      name: 'quote',
      type: 'textarea',
      required: true,
    },
    {
      name: 'authorName',
      type: 'text',
      required: true,
      admin: {
        components: {
          Cell: './payload/admin/components/cells/CatalogTitleCell#CatalogTitleCell',
        },
      },
    },
    {
      name: 'authorRole',
      type: 'text',
    },
    {
      name: 'company',
      type: 'text',
    },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
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
