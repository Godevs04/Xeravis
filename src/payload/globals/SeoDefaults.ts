import type { GlobalConfig } from 'payload'

import { anyone, canManageContent } from '@/payload/access'

export const SeoDefaults: GlobalConfig = {
  slug: 'seo-defaults',
  label: 'SEO Defaults',
  admin: {
    group: 'Settings',
  },
  access: {
    read: anyone,
    update: canManageContent,
  },
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
    },
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
}
