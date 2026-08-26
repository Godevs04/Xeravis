import type { GlobalConfig } from 'payload'

import { anyone, canManageContent } from '@/payload/access'
import { revalidateGlobal } from '@/payload/hooks'

export const Footer: GlobalConfig = {
  slug: 'footer',
  label: 'Footer',
  admin: {
    group: 'Settings',
    description: 'Footer link columns, newsletter toggle, and copyright.',
  },
  access: {
    read: anyone,
    update: canManageContent,
  },
  hooks: {
    afterChange: [revalidateGlobal(['/'], ['footer'])],
  },
  fields: [
    {
      type: 'collapsible',
      label: 'Footer Columns',
      admin: { initCollapsed: false },
      fields: [
        {
          name: 'columns',
          type: 'array',
          labels: { singular: 'Column', plural: 'Columns' },
          admin: {
            description: 'Each column is a group (Company, Services, …) with nested links.',
          },
          fields: [
            { name: 'title', type: 'text', required: true },
            {
              name: 'links',
              type: 'array',
              fields: [
                { name: 'label', type: 'text', required: true },
                { name: 'href', type: 'text', required: true },
              ],
            },
          ],
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'Newsletter & Legal',
      admin: { initCollapsed: false },
      fields: [
        {
          name: 'showNewsletter',
          type: 'checkbox',
          defaultValue: true,
          label: 'Show newsletter signup',
        },
        {
          name: 'copyright',
          type: 'text',
        },
      ],
    },
  ],
}
