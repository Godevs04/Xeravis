import type { GlobalConfig } from 'payload'

import { anyone, canManageContent } from '@/access'

export const ContactDetails: GlobalConfig = {
  slug: 'contact-details',
  label: 'Contact Details',
  access: {
    read: anyone,
    update: canManageContent,
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
      name: 'mapEmbed',
      type: 'textarea',
      label: 'Map embed code',
      admin: {
        description: 'Paste Google Maps iframe embed HTML',
      },
    },
  ],
}
