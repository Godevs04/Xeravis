import type { Field } from 'payload'

import { slugField as baseSlugField } from './slug'

export { slugField } from './slug'

export const featuredField = (): Field => ({
  name: 'featured',
  type: 'checkbox',
  defaultValue: false,
  admin: {
    position: 'sidebar',
    description: 'Show in featured lists and homepage modules.',
  },
})

export const orderField = (): Field => ({
  name: 'order',
  type: 'number',
  defaultValue: 0,
  admin: {
    position: 'sidebar',
    description: 'Lower numbers appear first.',
  },
})

export const publishedAtField = (): Field => ({
  name: 'publishedAt',
  type: 'date',
  admin: {
    position: 'sidebar',
    date: { pickerAppearance: 'dayAndTime' },
    description: 'Public publish timestamp.',
  },
})

export const ctaField = (name = 'cta'): Field => ({
  name,
  type: 'group',
  label: 'Call to action',
  fields: [
    {
      name: 'label',
      type: 'text',
      maxLength: 48,
      admin: { placeholder: 'e.g. Let\'s Talk' },
    },
    {
      name: 'href',
      type: 'text',
      admin: { placeholder: '/contact?intent=project' },
    },
    {
      name: 'style',
      type: 'select',
      defaultValue: 'primary',
      options: [
        { label: 'Primary', value: 'primary' },
        { label: 'Secondary', value: 'secondary' },
        { label: 'Ghost', value: 'ghost' },
      ],
    },
    {
      name: 'openInNewTab',
      type: 'checkbox',
      defaultValue: false,
    },
  ],
})

export const buttonField = (name = 'button'): Field => ctaField(name)

export const socialLinksField = (name = 'socialLinks'): Field => ({
  name,
  type: 'group',
  fields: [
    { name: 'linkedin', type: 'text' },
    { name: 'twitter', type: 'text' },
    { name: 'github', type: 'text' },
    { name: 'instagram', type: 'text' },
    { name: 'facebook', type: 'text' },
    { name: 'youtube', type: 'text' },
  ],
})

export const addressField = (name = 'address'): Field => ({
  name,
  type: 'group',
  fields: [
    { name: 'line1', type: 'text' },
    { name: 'line2', type: 'text' },
    { name: 'city', type: 'text' },
    { name: 'region', type: 'text' },
    { name: 'postal', type: 'text' },
    { name: 'country', type: 'text' },
  ],
})

export const galleryField = (name = 'gallery'): Field => ({
  name,
  type: 'array',
  labels: { singular: 'Image', plural: 'Gallery' },
  fields: [
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    { name: 'caption', type: 'text', maxLength: 160 },
  ],
})

export const heroField = (name = 'hero'): Field => ({
  name,
  type: 'group',
  fields: [
    { name: 'eyebrow', type: 'text', maxLength: 80 },
    { name: 'heading', type: 'text', required: true, maxLength: 120 },
    { name: 'subheading', type: 'textarea', maxLength: 320 },
    { name: 'image', type: 'upload', relationTo: 'media' },
    ctaField('primaryCta'),
    ctaField('secondaryCta'),
  ],
})

/** Re-export for callers that want explicit naming */
export const createSlugField = baseSlugField
