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
  min: 0,
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
      admin: { placeholder: "e.g. Let's Talk" },
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
  label: 'Social links',
  fields: [
    { name: 'linkedin', type: 'text', admin: { placeholder: 'https://linkedin.com/company/...' } },
    { name: 'twitter', type: 'text', admin: { placeholder: 'https://x.com/...' } },
    { name: 'github', type: 'text' },
    { name: 'instagram', type: 'text' },
    { name: 'facebook', type: 'text' },
    { name: 'youtube', type: 'text' },
  ],
})

export const addressField = (name = 'address'): Field => ({
  name,
  type: 'group',
  label: 'Address',
  fields: [
    { name: 'line1', type: 'text', maxLength: 120 },
    { name: 'line2', type: 'text', maxLength: 120 },
    { name: 'city', type: 'text', maxLength: 80 },
    { name: 'region', type: 'text', maxLength: 80 },
    { name: 'postal', type: 'text', maxLength: 24 },
    { name: 'country', type: 'text', maxLength: 80 },
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
    { name: 'alt', type: 'text', maxLength: 160 },
  ],
})

export const heroField = (name = 'hero'): Field => ({
  name,
  type: 'group',
  label: 'Hero',
  fields: [
    { name: 'eyebrow', type: 'text', maxLength: 80 },
    { name: 'heading', type: 'text', required: true, maxLength: 120 },
    { name: 'subheading', type: 'textarea', maxLength: 320 },
    { name: 'image', type: 'upload', relationTo: 'media' },
    ctaField('primaryCta'),
    ctaField('secondaryCta'),
  ],
})

export const seoField = (name = 'seo'): Field => ({
  name,
  type: 'group',
  label: 'SEO overrides',
  admin: {
    description: 'Optional overrides. Prefer the SEO plugin meta panel when available.',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      maxLength: 70,
      admin: { placeholder: 'SEO title (≤70 chars)' },
    },
    {
      name: 'description',
      type: 'textarea',
      maxLength: 160,
      admin: { placeholder: 'Meta description (≤160 chars)' },
    },
    {
      name: 'canonicalUrl',
      type: 'text',
      admin: { placeholder: 'https://xelarvis.in/...' },
    },
    {
      name: 'noIndex',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'ogImage',
      type: 'upload',
      relationTo: 'media',
    },
  ],
})

export const richContentField = (name = 'content'): Field => ({
  name,
  type: 'richText',
  required: true,
  label: 'Rich content',
})

export const createSlugField = baseSlugField
