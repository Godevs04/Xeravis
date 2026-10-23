import type { CollectionConfig } from 'payload'

import { anyone, canManageContent, isAdminOrEditor } from '@/payload/access'
import { toSlug } from '@/payload/utilities'

export const Authors: CollectionConfig = {
  slug: 'authors',
  admin: {
    group: 'Website',
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
      admin: {
        components: {
          Cell: './payload/admin/components/cells/CatalogTitleCell#CatalogTitleCell',
        },
      },
    },
    {
      name: 'slug',
      type: 'text',
      index: true,
      maxLength: 120,
      admin: {
        position: 'sidebar',
        description: 'Author page URL (/authors/<slug>). Auto-generated from the name when empty.',
      },
      hooks: {
        beforeValidate: [
          ({ value, data }) => {
            if (typeof value === 'string' && value.trim()) return toSlug(value)
            return typeof data?.name === 'string' ? toSlug(data.name) : value
          },
        ],
      },
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
