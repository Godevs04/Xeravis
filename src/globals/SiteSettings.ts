import type { GlobalConfig } from 'payload'

import { anyone, canManageContent } from '@/access'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Site Settings',
  access: {
    read: anyone,
    update: canManageContent,
  },
  fields: [
    {
      name: 'siteName',
      type: 'text',
      required: true,
    },
    {
      name: 'tagline',
      type: 'text',
    },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'favicon',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'social',
      type: 'group',
      fields: [
        { name: 'linkedin', type: 'text', label: 'LinkedIn URL' },
        { name: 'twitter', type: 'text', label: 'Twitter / X URL' },
        { name: 'github', type: 'text', label: 'GitHub URL' },
        { name: 'youtube', type: 'text', label: 'YouTube URL' },
      ],
    },
  ],
}
