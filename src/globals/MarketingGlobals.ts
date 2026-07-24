import type { GlobalConfig } from 'payload'

import { anyone, canManageContent, isAdmin } from '@/access'

export const SocialMedia: GlobalConfig = {
  slug: 'social-media',
  label: 'Social Media',
  access: {
    read: anyone,
    update: canManageContent,
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
  access: {
    read: anyone,
    update: canManageContent,
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
