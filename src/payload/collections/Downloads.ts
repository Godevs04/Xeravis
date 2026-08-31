import type { CollectionConfig } from 'payload'

import { anyone, canManageMarketing, isAdminOrEditor } from '@/payload/access'
import { slugField } from '@/payload/fields'
import { autoSlugFromTitle } from '@/payload/hooks'

export const Downloads: CollectionConfig = {
  slug: 'downloads',
  labels: {
    singular: 'Download',
    plural: 'Downloads',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'gated', 'downloadCount', 'updatedAt'],
    group: 'Website',
  },
  access: {
    read: anyone,
    create: canManageMarketing,
    update: canManageMarketing,
    delete: isAdminOrEditor,
  },
  hooks: {
    beforeValidate: [autoSlugFromTitle('title')],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      maxLength: 140,
      admin: {
        components: {
          Cell: './payload/admin/components/cells/CatalogTitleCell#CatalogTitleCell',
        },
      },
    },
    slugField(),
    {
      name: 'description',
      type: 'textarea',
      maxLength: 400,
    },
    {
      name: 'file',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'relatedBlog',
      type: 'relationship',
      relationTo: 'blogs',
    },
    {
      name: 'relatedResearch',
      type: 'relationship',
      relationTo: 'research',
    },
    {
      name: 'gated',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Require email capture before download (handled on the site).',
      },
    },
    {
      name: 'downloadCount',
      type: 'number',
      defaultValue: 0,
      admin: {
        readOnly: true,
        position: 'sidebar',
      },
    },
  ],
}
