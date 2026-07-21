import type { GlobalConfig } from 'payload'

import { anyone, canManageContent } from '@/access'

export const Navigation: GlobalConfig = {
  slug: 'navigation',
  label: 'Navigation',
  access: {
    read: anyone,
    update: canManageContent,
  },
  fields: [
    {
      name: 'primaryLinks',
      type: 'array',
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'href', type: 'text', required: true },
      ],
    },
    {
      name: 'ctaLabel',
      type: 'text',
      label: 'CTA Label',
    },
    {
      name: 'ctaHref',
      type: 'text',
      label: 'CTA URL',
    },
  ],
}
