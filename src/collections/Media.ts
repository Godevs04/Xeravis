import type { CollectionConfig } from 'payload'

import { anyone, canManageContent, isAdminOrEditor } from '@/access'

export const Media: CollectionConfig = {
  slug: 'media',
  upload: {
    staticDir: 'media',
    mimeTypes: ['image/*', 'image/svg+xml', 'application/pdf', 'video/*'],
    imageSizes: [
      { name: 'thumbnail', width: 400, height: 300, position: 'centre' },
      { name: 'tablet', width: 1024, height: undefined, position: 'centre' },
      { name: 'desktop', width: 1920, height: undefined, position: 'centre' },
    ],
    formatOptions: {
      format: 'webp',
    },
  },
  admin: {
    useAsTitle: 'filename',
    defaultColumns: ['filename', 'folder', 'alt', 'updatedAt'],
    group: 'System',
  },
  access: {
    read: anyone,
    create: canManageContent,
    update: canManageContent,
    delete: isAdminOrEditor,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
      maxLength: 160,
      admin: { description: 'Required for accessibility and SEO.' },
    },
    {
      name: 'caption',
      type: 'text',
      maxLength: 200,
    },
    {
      name: 'folder',
      type: 'select',
      defaultValue: 'general',
      options: [
        { label: 'General', value: 'general' },
        { label: 'Hero', value: 'hero' },
        { label: 'Blogs', value: 'blogs' },
        { label: 'Services', value: 'services' },
        { label: 'Industries', value: 'industries' },
        { label: 'Team', value: 'team' },
        { label: 'Clients', value: 'clients' },
        { label: 'Logos', value: 'logos' },
        { label: 'Icons', value: 'icons' },
        { label: 'Documents', value: 'documents' },
        { label: 'OG Images', value: 'og' },
      ],
      admin: { position: 'sidebar' },
    },
  ],
}
