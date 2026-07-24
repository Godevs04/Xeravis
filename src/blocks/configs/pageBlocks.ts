import type { Block } from 'payload'

import { ctaField } from '@/fields'

/** GoDevs Enterprise CMS — homepage / page block configs */
export const pageBlocks: Block[] = [
  {
    slug: 'hero',
    labels: { singular: 'Hero', plural: 'Heroes' },
    fields: [
      { name: 'eyebrow', type: 'text', maxLength: 80 },
      { name: 'heading', type: 'text', required: true, maxLength: 120 },
      { name: 'subheading', type: 'textarea', maxLength: 320 },
      { name: 'ctaLabel', type: 'text', label: 'Primary CTA label', maxLength: 48 },
      { name: 'ctaHref', type: 'text', label: 'Primary CTA URL' },
      { name: 'secondaryCtaLabel', type: 'text', maxLength: 48 },
      { name: 'secondaryCtaHref', type: 'text' },
      { name: 'image', type: 'upload', relationTo: 'media' },
    ],
  },
  {
    slug: 'statistics',
    labels: { singular: 'Statistics / Trust Bar', plural: 'Statistics' },
    fields: [
      { name: 'heading', type: 'text' },
      {
        name: 'stats',
        type: 'array',
        minRows: 1,
        fields: [
          { name: 'label', type: 'text', required: true },
          { name: 'value', type: 'text', required: true },
          { name: 'suffix', type: 'text' },
        ],
      },
    ],
  },
  {
    slug: 'aboutPreview',
    labels: { singular: 'About Preview', plural: 'About Previews' },
    fields: [
      { name: 'heading', type: 'text', required: true },
      { name: 'body', type: 'textarea', required: true },
      ctaField('cta'),
    ],
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
    labels: { singular: 'Industries', plural: 'Industries' },
    fields: [
      { name: 'heading', type: 'text', required: true },
      { name: 'subheading', type: 'textarea' },
    ],
  },
  {
    slug: 'whyChooseUs',
    labels: { singular: 'Why Choose Us', plural: 'Why Choose Us' },
    fields: [
      { name: 'heading', type: 'text', required: true },
      { name: 'subheading', type: 'textarea' },
      {
        name: 'items',
        type: 'array',
        minRows: 1,
        maxRows: 6,
        fields: [
          { name: 'title', type: 'text', required: true },
          { name: 'description', type: 'textarea', required: true },
        ],
      },
    ],
  },
  {
    slug: 'caseStudyFeature',
    labels: { singular: 'Featured Projects', plural: 'Featured Projects' },
    fields: [{ name: 'heading', type: 'text', required: true }],
  },
  {
    slug: 'technologyGrid',
    labels: { singular: 'Technology Grid', plural: 'Technology Grids' },
    fields: [
      { name: 'heading', type: 'text', required: true },
      { name: 'subheading', type: 'textarea' },
    ],
  },
  {
    slug: 'processSteps',
    labels: { singular: 'Development Process', plural: 'Process Sections' },
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
  {
    slug: 'testimonials',
    labels: { singular: 'Testimonials', plural: 'Testimonials' },
    fields: [{ name: 'heading', type: 'text', required: true }],
  },
  {
    slug: 'latestBlogs',
    labels: { singular: 'Latest Insights', plural: 'Latest Insights' },
    fields: [
      { name: 'heading', type: 'text', required: true },
      { name: 'subheading', type: 'textarea' },
    ],
  },
  {
    slug: 'careerBanner',
    labels: { singular: 'Career Banner', plural: 'Career Banners' },
    fields: [
      { name: 'heading', type: 'text', required: true },
      { name: 'subheading', type: 'textarea' },
      ctaField('cta'),
    ],
  },
  {
    slug: 'ctaBand',
    labels: { singular: 'Final CTA', plural: 'CTAs' },
    fields: [
      { name: 'heading', type: 'text', required: true },
      { name: 'subheading', type: 'textarea' },
      { name: 'ctaLabel', type: 'text' },
      { name: 'ctaHref', type: 'text' },
    ],
  },
  {
    slug: 'richText',
    labels: { singular: 'Content Section', plural: 'Content Sections' },
    fields: [{ name: 'content', type: 'richText', required: true }],
  },
  {
    slug: 'teamGrid',
    labels: { singular: 'Team', plural: 'Team' },
    fields: [{ name: 'heading', type: 'text', required: true }],
  },
  {
    slug: 'clientLogos',
    labels: { singular: 'Clients', plural: 'Clients' },
    fields: [{ name: 'heading', type: 'text', required: true }],
  },
  {
    slug: 'statsRow',
    labels: { singular: 'Stats Row (legacy)', plural: 'Stats Rows' },
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
    slug: 'faqAccordion',
    labels: { singular: 'FAQ', plural: 'FAQs' },
    fields: [
      { name: 'heading', type: 'text', required: true },
      { name: 'group', type: 'text' },
    ],
  },
  {
    slug: 'featureSplit',
    labels: { singular: 'Feature Split', plural: 'Feature Splits' },
    fields: [
      { name: 'heading', type: 'text', required: true },
      { name: 'body', type: 'richText' },
      { name: 'image', type: 'upload', relationTo: 'media' },
      { name: 'reverse', type: 'checkbox', defaultValue: false },
    ],
  },
  {
    slug: 'newsletter',
    labels: { singular: 'Newsletter', plural: 'Newsletters' },
    fields: [
      { name: 'heading', type: 'text', required: true },
      { name: 'subheading', type: 'textarea' },
    ],
  },
]
