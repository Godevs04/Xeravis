import type { GlobalConfig } from 'payload'

import { anyone, canManageContent } from '@/access'
import { ctaField } from '@/fields'

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
      labels: { singular: 'Link', plural: 'Desktop menu' },
      fields: [
        { name: 'label', type: 'text', required: true, maxLength: 40 },
        { name: 'href', type: 'text', required: true },
        {
          name: 'mega',
          type: 'select',
          options: [
            { label: 'None', value: 'none' },
            { label: 'Solutions', value: 'solutions' },
            { label: 'Services', value: 'services' },
            { label: 'Industries', value: 'industries' },
          ],
          defaultValue: 'none',
        },
      ],
    },
    ctaField('cta'),
    {
      name: 'ctaLabel',
      type: 'text',
      label: 'CTA Label (legacy)',
      admin: { description: 'Prefer CTA group above. Kept for compatibility.' },
    },
    {
      name: 'ctaHref',
      type: 'text',
      label: 'CTA URL (legacy)',
    },
    {
      name: 'stickyHeader',
      type: 'checkbox',
      defaultValue: true,
    },
  ],
}
