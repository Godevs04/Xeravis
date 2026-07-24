import type { CollectionConfig } from 'payload'

import { anyone, canManageContent, isAdminOrEditor } from '@/payload/access'

export const Media: CollectionConfig = {
  slug: 'media',
  upload: {
    staticDir: 'media',
    mimeTypes: [
      'image/*',
      'image/svg+xml',
      'application/pdf',
      'video/mp4',
      'video/webm',
      'video/quicktime',
    ],
    imageSizes: [
      {
        name: 'thumbnail',
        width: 400,
        height: 300,
        position: 'centre',
        formatOptions: { format: 'webp', options: { quality: 80 } },
      },
      {
        name: 'tablet',
        width: 1024,
        height: undefined,
        position: 'centre',
        formatOptions: { format: 'webp', options: { quality: 82 } },
      },
      {
        name: 'desktop',
        width: 1920,
        height: undefined,
        position: 'centre',
        formatOptions: { format: 'webp', options: { quality: 85 } },
      },
      {
        name: 'og',
        width: 1200,
        height: 630,
        position: 'centre',
        formatOptions: { format: 'webp', options: { quality: 85 } },
      },
      {
        name: 'avifDesktop',
        width: 1920,
        height: undefined,
        position: 'centre',
        formatOptions: { format: 'avif', options: { quality: 65 } },
      },
    ],
    formatOptions: {
      format: 'webp',
      options: { quality: 82 },
    },
  },
  admin: {
    useAsTitle: 'filename',
    defaultColumns: ['filename', 'folder', 'alt', 'mimeType', 'updatedAt'],
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
      admin: {
        description: 'Required for accessibility and SEO.',
        placeholder: 'Describe the image',
      },
    },
    {
      name: 'caption',
      type: 'text',
      maxLength: 200,
      admin: { placeholder: 'Optional caption' },
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
        { label: 'Videos', value: 'videos' },
        { label: 'OG Images', value: 'og' },
      ],
      admin: { position: 'sidebar' },
    },
  ],
}
