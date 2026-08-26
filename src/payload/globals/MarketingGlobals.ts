import type { GlobalConfig } from 'payload'

import { anyone, canManageMarketing, isAdmin } from '@/payload/access'
import { revalidateGlobal } from '@/payload/hooks'

export const SocialMedia: GlobalConfig = {
  slug: 'social-media',
  label: 'Social Media',
  admin: {
    group: 'Settings',
  },
  access: {
    read: anyone,
    update: canManageMarketing,
  },
  hooks: {
    afterChange: [revalidateGlobal(['/contact', '/'], ['social'])],
  },
  fields: [
    { name: 'linkedin', type: 'text' },
    { name: 'instagram', type: 'text' },
    { name: 'facebook', type: 'text' },
    { name: 'youtube', type: 'text' },
    { name: 'twitter', type: 'text' },
    { name: 'github', type: 'text' },
  ],
}

export const Analytics: GlobalConfig = {
  slug: 'analytics',
  label: 'Analytics',
  admin: {
    group: 'Settings',
  },
  access: {
    read: anyone,
    update: isAdmin,
  },
  fields: [
    { name: 'googleAnalyticsId', type: 'text', admin: { placeholder: 'G-XXXXXXXX' } },
    { name: 'googleTagManagerId', type: 'text', admin: { placeholder: 'GTM-XXXX' } },
    { name: 'metaPixelId', type: 'text' },
    { name: 'linkedinPixelId', type: 'text' },
    { name: 'microsoftClarityId', type: 'text' },
  ],
}

export const AnnouncementBar: GlobalConfig = {
  slug: 'announcement-bar',
  label: 'Announcement Bar',
  admin: {
    group: 'Settings',
    description: 'Site-wide announcement strip with optional CTA and expiry.',
  },
  access: {
    read: anyone,
    update: canManageMarketing,
  },
  hooks: {
    afterChange: [revalidateGlobal(['/'], ['announcement'])],
  },
  fields: [
    {
      type: 'ui',
      name: 'announcementAside',
      admin: {
        position: 'sidebar',
        components: {
          Field:
            './payload/admin/components/settings/MarketingPreviewAside#AnnouncementPreviewAside',
        },
      },
    },
    {
      type: 'collapsible',
      label: 'Visibility',
      admin: { initCollapsed: false },
      fields: [
        { name: 'enabled', type: 'checkbox', defaultValue: false, label: 'Enable announcement' },
        {
          name: 'expiresAt',
          type: 'date',
          admin: { date: { pickerAppearance: 'dayAndTime' } },
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'Message & CTA',
      admin: { initCollapsed: false },
      fields: [
        { name: 'message', type: 'text', maxLength: 160 },
        { name: 'ctaLabel', type: 'text', maxLength: 40 },
        { name: 'ctaLink', type: 'text' },
      ],
    },
  ],
}

export const CookieBanner: GlobalConfig = {
  slug: 'cookie-banner',
  label: 'Cookie Banner',
  admin: {
    group: 'Settings',
    description: 'Consent banner copy, accept label, and privacy policy link.',
  },
  access: {
    read: anyone,
    update: isAdmin,
  },
  fields: [
    {
      type: 'ui',
      name: 'cookieAside',
      admin: {
        position: 'sidebar',
        components: {
          Field: './payload/admin/components/settings/MarketingPreviewAside#CookiePreviewAside',
        },
      },
    },
    {
      type: 'collapsible',
      label: 'Visibility',
      admin: { initCollapsed: false },
      fields: [
        { name: 'enabled', type: 'checkbox', defaultValue: false, label: 'Enable cookie banner' },
      ],
    },
    {
      type: 'collapsible',
      label: 'Copy & Actions',
      admin: { initCollapsed: false },
      fields: [
        { name: 'message', type: 'textarea', maxLength: 320, admin: { rows: 3 } },
        { name: 'policyHref', type: 'text', defaultValue: '/privacy-policy' },
        { name: 'acceptLabel', type: 'text', defaultValue: 'Accept' },
      ],
    },
  ],
}
