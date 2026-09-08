import type { CollectionConfig } from 'payload'

import { anyone, canManageContent, isAdminOrEditor } from '@/payload/access'
import { orderField } from '@/payload/fields'

export const TeamMembers: CollectionConfig = {
  slug: 'team-members',
  admin: {
    group: 'Website',
    useAsTitle: 'name',
    defaultColumns: ['name', 'role', 'department', 'order', 'updatedAt'],
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
      name: 'role',
      type: 'text',
      required: true,
    },
    {
      name: 'department',
      type: 'relationship',
      relationTo: 'departments',
    },
    {
      name: 'bio',
      type: 'textarea',
    },
    {
      name: 'photo',
      type: 'upload',
      relationTo: 'media',
    },
    orderField(),
    {
      name: 'linkedIn',
      type: 'text',
      label: 'LinkedIn URL',
    },
    {
      name: 'expertise',
      type: 'text',
      label: 'Expertise',
      admin: { description: 'Short expertise areas (e.g. AI strategy, clinical data).' },
    },
    {
      name: 'researchInterests',
      type: 'textarea',
      label: 'Research interests',
      admin: { description: 'Optional — relevant for research-facing leadership profiles.' },
    },
  ],
}
