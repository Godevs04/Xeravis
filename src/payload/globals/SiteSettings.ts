import type { GlobalConfig } from 'payload'

import { anyone, isAdmin } from '@/payload/access'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Site Settings',
  admin: {
    group: 'Settings',
    description: 'Brand identity, theme tokens, and legacy social links.',
  },
  access: {
    read: anyone,
    update: isAdmin,
  },
  fields: [
    {
      type: 'collapsible',
      label: 'General',
      admin: { initCollapsed: false },
      fields: [
        { name: 'siteName', type: 'text', required: true, maxLength: 80 },
        { name: 'tagline', type: 'text', maxLength: 160 },
        { name: 'footerCopyright', type: 'text' },
      ],
    },
    {
      type: 'collapsible',
      label: 'Brand',
      admin: { initCollapsed: false },
      fields: [
        { name: 'logo', type: 'upload', relationTo: 'media' },
        { name: 'logoDark', type: 'upload', relationTo: 'media' },
        { name: 'favicon', type: 'upload', relationTo: 'media' },
      ],
    },
    {
      type: 'collapsible',
      label: 'Theme',
      admin: { initCollapsed: false },
      fields: [
        {
          name: 'theme',
          type: 'group',
          label: 'Theme tokens (optional overrides)',
          fields: [
            { name: 'primaryColor', type: 'text', admin: { placeholder: '#0F172A' } },
            { name: 'secondaryColor', type: 'text', admin: { placeholder: '#334155' } },
            { name: 'accentColor', type: 'text', admin: { placeholder: '#2563EB' } },
          ],
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'Social (legacy)',
      admin: { initCollapsed: true },
      fields: [
        {
          name: 'social',
          type: 'group',
          admin: { description: 'Prefer Social Media global for new projects.' },
          fields: [
            { name: 'linkedin', type: 'text' },
            { name: 'twitter', type: 'text' },
            { name: 'github', type: 'text' },
            { name: 'youtube', type: 'text' },
          ],
        },
      ],
    },
  ],
}
