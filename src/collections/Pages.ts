import type { CollectionConfig } from 'payload'

import { authenticatedOrPublished, canManageContent, isAdminOrEditor } from '@/access'
import { slugField } from '@/fields/slug'

export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', '_status', 'updatedAt'],
  },
  versions: {
    drafts: {
      autosave: {
        interval: 400,
      },
    },
  },
  access: {
    read: authenticatedOrPublished,
    create: canManageContent,
    update: canManageContent,
    delete: isAdminOrEditor,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    slugField(),
    {
      name: 'layout',
      type: 'blocks',
      required: true,
      blocks: [
        {
          slug: 'hero',
          labels: { singular: 'Hero', plural: 'Heroes' },
          fields: [
            { name: 'eyebrow', type: 'text' },
            { name: 'heading', type: 'text', required: true },
            { name: 'subheading', type: 'textarea' },
            { name: 'ctaLabel', type: 'text', label: 'CTA Label' },
            { name: 'ctaHref', type: 'text', label: 'CTA URL' },
            { name: 'image', type: 'upload', relationTo: 'media' },
          ],
        },
        {
          slug: 'richText',
          labels: { singular: 'Rich Text', plural: 'Rich Text Blocks' },
          fields: [{ name: 'content', type: 'richText', required: true }],
        },
        {
          slug: 'servicesGrid',
          labels: { singular: 'Services Grid', plural: 'Services Grids' },
          fields: [
            { name: 'heading', type: 'text', required: true },
            { name: 'subheading', type: 'textarea' },
          ],
        },
        {
          slug: 'industriesStrip',
          labels: { singular: 'Industries Strip', plural: 'Industries Strips' },
          fields: [
            { name: 'heading', type: 'text', required: true },
            { name: 'subheading', type: 'textarea' },
          ],
        },
        {
          slug: 'caseStudyFeature',
          labels: { singular: 'Case Study Feature', plural: 'Case Study Features' },
          fields: [{ name: 'heading', type: 'text', required: true }],
        },
        {
          slug: 'testimonials',
          labels: { singular: 'Testimonials', plural: 'Testimonials' },
          fields: [{ name: 'heading', type: 'text', required: true }],
        },
        {
          slug: 'teamGrid',
          labels: { singular: 'Team Grid', plural: 'Team Grids' },
          fields: [{ name: 'heading', type: 'text', required: true }],
        },
        {
          slug: 'clientLogos',
          labels: { singular: 'Client Logos', plural: 'Client Logos' },
          fields: [{ name: 'heading', type: 'text', required: true }],
        },
        {
          slug: 'statsRow',
          labels: { singular: 'Stats Row', plural: 'Stats Rows' },
          fields: [
            { name: 'heading', type: 'text', required: true },
            {
              name: 'stats',
              type: 'array',
              fields: [
                { name: 'label', type: 'text', required: true },
                { name: 'value', type: 'text', required: true },
              ],
            },
          ],
        },
        {
          slug: 'ctaBand',
          labels: { singular: 'CTA Band', plural: 'CTA Bands' },
          fields: [
            { name: 'heading', type: 'text', required: true },
            { name: 'subheading', type: 'textarea' },
            { name: 'ctaLabel', type: 'text', label: 'CTA Label', required: true },
            { name: 'ctaHref', type: 'text', label: 'CTA URL', required: true },
          ],
        },
        {
          slug: 'faqAccordion',
          labels: { singular: 'FAQ Accordion', plural: 'FAQ Accordions' },
          fields: [
            { name: 'heading', type: 'text', required: true },
            {
              name: 'group',
              type: 'text',
              admin: {
                description: 'Optional FAQ group filter from the FAQs collection',
              },
            },
          ],
        },
        {
          slug: 'featureSplit',
          labels: { singular: 'Feature Split', plural: 'Feature Splits' },
          fields: [
            { name: 'heading', type: 'text', required: true },
            { name: 'body', type: 'richText', required: true },
            { name: 'image', type: 'upload', relationTo: 'media' },
            {
              name: 'reverse',
              type: 'checkbox',
              label: 'Reverse layout',
              defaultValue: false,
            },
          ],
        },
        {
          slug: 'processSteps',
          labels: { singular: 'Process Steps', plural: 'Process Steps' },
          fields: [
            { name: 'heading', type: 'text', required: true },
            {
              name: 'steps',
              type: 'array',
              fields: [
                { name: 'title', type: 'text', required: true },
                { name: 'description', type: 'textarea', required: true },
              ],
            },
          ],
        },
      ],
    },
  ],
}
