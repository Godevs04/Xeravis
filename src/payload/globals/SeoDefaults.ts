import type { GlobalConfig } from 'payload'

import { anyone, canManageContent } from '@/payload/access'

export const SeoDefaults: GlobalConfig = {
  slug: 'seo-defaults',
  label: 'SEO Defaults',
  admin: {
    group: 'Settings',
    description: 'Default meta, Open Graph, and social sharing for public pages.',
  },
  access: {
    read: anyone,
    update: canManageContent,
  },
  fields: [
    {
      type: 'collapsible',
      label: 'General SEO',
      admin: { initCollapsed: false },
      fields: [
        {
          name: 'titleTemplate',
          type: 'text',
          admin: {
            description: 'Use %s as page title placeholder (e.g. "%s | Xelarvis")',
          },
        },
        {
          name: 'defaultDescription',
          type: 'textarea',
          admin: { rows: 3 },
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'Social Sharing',
      admin: { initCollapsed: false },
      fields: [
        {
          name: 'ogImage',
          type: 'upload',
          relationTo: 'media',
          label: 'Default OG Image',
        },
        {
          name: 'twitterHandle',
          type: 'text',
          label: 'Twitter / X handle',
        },
      ],
    },
  ],
}
