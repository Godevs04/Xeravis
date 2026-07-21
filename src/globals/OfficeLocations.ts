import type { GlobalConfig } from 'payload'

import { anyone, canManageContent } from '@/access'

export const OfficeLocations: GlobalConfig = {
  slug: 'office-locations',
  label: 'Office Locations',
  access: {
    read: anyone,
    update: canManageContent,
  },
  fields: [
    {
      name: 'locations',
      type: 'array',
      fields: [
        { name: 'name', type: 'text', required: true },
        { name: 'address', type: 'textarea', required: true },
        { name: 'city', type: 'text', required: true },
        { name: 'country', type: 'text', required: true },
        { name: 'hours', type: 'text', label: 'Business hours' },
      ],
    },
  ],
}
