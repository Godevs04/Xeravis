import type { GlobalConfig } from 'payload'

import { anyone, canManageContent } from '@/payload/access'
import { revalidateGlobal } from '@/payload/hooks'

export const ContactDetails: GlobalConfig = {
  slug: 'contact-details',
  label: 'Contact Details',
  admin: {
    group: 'Settings',
    description: 'Public contact channels shown on the Contact page and site footer.',
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
      type: 'ui',
      name: 'contactAside',
      admin: {
        position: 'sidebar',
        components: {
          Field: './payload/admin/components/contact/ContactDetailsAside#ContactDetailsAside',
        },
      },
    },
    {
      type: 'collapsible',
      label: 'General Information',
      admin: { initCollapsed: false },
      fields: [
        {
          name: 'email',
          type: 'email',
          label: 'Email',
        },
        {
          name: 'phone',
          type: 'text',
          label: 'Phone',
        },
        {
          name: 'whatsapp',
          type: 'text',
          label: 'WhatsApp number or link',
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'Business Hours',
      admin: { initCollapsed: false },
      fields: [
        {
          name: 'hours',
          type: 'textarea',
          label: 'Business hours',
          admin: {
            description: 'e.g. Mon–Fri 9:00–18:00 IST',
            rows: 3,
          },
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'Maps',
      admin: { initCollapsed: false },
      fields: [
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
            rows: 4,
          },
        },
      ],
    },
  ],
}
