import type { GlobalConfig } from 'payload'

import { anyone, canManageContent } from '@/payload/access'
import { revalidateGlobal } from '@/payload/hooks'

export const ContactDetails: GlobalConfig = {
  slug: 'contact-details',
  label: 'Contact Details',
  admin: {
    group: 'Settings',
  },
  access: {
    read: anyone,
    update: canManageContent,
  },
  hooks: {
    afterChange: [revalidateGlobal(['/contact'], ['contact'])],
  },
  fields: [
    {
      name: 'email',
      type: 'email',
    },
    {
      name: 'phone',
      type: 'text',
    },
    {
      name: 'whatsapp',
      type: 'text',
      label: 'WhatsApp number or link',
    },
    {
      name: 'hours',
      type: 'textarea',
      label: 'Business hours',
      admin: {
        description: 'e.g. Mon–Fri 9:00–18:00 IST',
      },
    },
    {
      name: 'mapEmbedUrl',
      type: 'text',
      label: 'Map embed URL',
      admin: {
        description: 'Google Maps embed src URL (preferred over raw HTML)',
      },
    },
    {
      name: 'mapEmbed',
      type: 'textarea',
      label: 'Map embed code (legacy)',
      admin: {
        description: 'Paste Google Maps iframe embed HTML if URL is unavailable',
      },
    },
  ],
}
