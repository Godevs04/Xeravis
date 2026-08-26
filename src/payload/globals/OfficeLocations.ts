import type { GlobalConfig } from 'payload'

import { anyone, canManageContent } from '@/payload/access'

export const OfficeLocations: GlobalConfig = {
  slug: 'office-locations',
  label: 'Office Locations',
  admin: {
    group: 'Settings',
    description: 'Physical offices shown on Contact and About pages.',
  },
  access: {
    read: anyone,
    update: canManageContent,
  },
  fields: [
    {
      type: 'collapsible',
      label: 'Locations',
      admin: { initCollapsed: false },
      fields: [
        {
          name: 'locations',
          type: 'array',
          labels: { singular: 'Office', plural: 'Offices' },
          admin: {
            description: 'Each office appears as a card on the public Contact page.',
            initCollapsed: false,
          },
          fields: [
            {
              type: 'row',
              fields: [
                { name: 'name', type: 'text', required: true, admin: { width: '50%' } },
                { name: 'city', type: 'text', required: true, admin: { width: '25%' } },
                { name: 'country', type: 'text', required: true, admin: { width: '25%' } },
              ],
            },
            { name: 'address', type: 'textarea', required: true, admin: { rows: 3 } },
            { name: 'hours', type: 'text', label: 'Business hours' },
          ],
        },
      ],
    },
  ],
}
