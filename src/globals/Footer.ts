import type { GlobalConfig } from 'payload'

import { anyone, canManageContent } from '@/access'

export const Footer: GlobalConfig = {
  slug: 'footer',
  label: 'Footer',
  access: {
    read: anyone,
    update: canManageContent,
  },
  fields: [
    {
      name: 'columns',
      type: 'array',
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
}
