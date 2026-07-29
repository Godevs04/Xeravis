import type { GlobalConfig } from 'payload'

import { anyone, canManageContent } from '@/payload/access'
import { ctaField } from '@/payload/fields'
import { revalidateGlobal } from '@/payload/hooks'

export const Navigation: GlobalConfig = {
  slug: 'navigation',
  label: 'Navigation',
  access: {
    read: anyone,
    update: canManageContent,
  },
  hooks: {
    afterChange: [revalidateGlobal(['/'], ['navigation'])],
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
            { label: 'About', value: 'about' },
            { label: 'Company', value: 'company' },
            { label: 'Solutions', value: 'solutions' },
            { label: 'Services', value: 'services' },
            { label: 'Industries', value: 'industries' },
            { label: 'Insights', value: 'insights' },
            { label: 'AI Research Lab', value: 'research' },
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
