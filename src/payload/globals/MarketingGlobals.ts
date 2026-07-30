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
  },
  access: {
    read: anyone,
    update: canManageMarketing,
  },
  hooks: {
    afterChange: [revalidateGlobal(['/'], ['announcement'])],
  },
  fields: [
    { name: 'enabled', type: 'checkbox', defaultValue: false },
    { name: 'message', type: 'text', maxLength: 160 },
    { name: 'ctaLabel', type: 'text', maxLength: 40 },
    { name: 'ctaLink', type: 'text' },
    {
      name: 'expiresAt',
      type: 'date',
      admin: { date: { pickerAppearance: 'dayAndTime' } },
    },
  ],
}

export const CookieBanner: GlobalConfig = {
  slug: 'cookie-banner',
  label: 'Cookie Banner',
  admin: {
    group: 'Settings',
  },
  access: {
    read: anyone,
    update: isAdmin,
  },
  fields: [
    { name: 'enabled', type: 'checkbox', defaultValue: false },
    { name: 'message', type: 'textarea', maxLength: 320 },
    { name: 'policyHref', type: 'text', defaultValue: '/privacy-policy' },
    { name: 'acceptLabel', type: 'text', defaultValue: 'Accept' },
  ],
}
