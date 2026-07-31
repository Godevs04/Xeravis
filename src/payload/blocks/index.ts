import type { Block } from 'payload'

import { ctaField, galleryField } from '@/payload/fields'

export const pageBlocks: Block[] = [
  {
    slug: 'hero',
    labels: { singular: 'Hero', plural: 'Heroes' },
    fields: [
      { name: 'eyebrow', type: 'text', maxLength: 80, admin: { placeholder: 'Eyebrow label' } },
      { name: 'heading', type: 'text', required: true, maxLength: 120 },
      { name: 'subheading', type: 'textarea', maxLength: 320 },
      { name: 'ctaLabel', type: 'text', maxLength: 48, admin: { placeholder: "Let's Talk" } },
      { name: 'ctaHref', type: 'text', admin: { placeholder: '/contact?intent=project' } },
      { name: 'secondaryCtaLabel', type: 'text', maxLength: 48 },
      { name: 'secondaryCtaHref', type: 'text' },
      { name: 'image', type: 'upload', relationTo: 'media' },
    ],
  },
  {
    slug: 'richText',
    labels: { singular: 'Content Section', plural: 'Content Sections' },
    fields: [{ name: 'content', type: 'richText', required: true }],
  },
  {
    slug: 'statistics',
    labels: { singular: 'Statistics', plural: 'Statistics' },
    fields: [
      { name: 'heading', type: 'text', maxLength: 120 },
      {
        name: 'stats',
        type: 'array',
        minRows: 1,
        maxRows: 8,
        fields: [
          { name: 'label', type: 'text', required: true, maxLength: 60 },
          { name: 'value', type: 'text', required: true, maxLength: 24 },
          { name: 'suffix', type: 'text', maxLength: 12 },
        ],
      },
    ],
  },
  {
    slug: 'statsRow',
    labels: { singular: 'Stats Row (legacy)', plural: 'Stats Rows' },
    fields: [
      { name: 'heading', type: 'text', required: true, maxLength: 120 },
      {
        name: 'stats',
        type: 'array',
        fields: [
          { name: 'label', type: 'text', required: true, maxLength: 60 },
          { name: 'value', type: 'text', required: true, maxLength: 24 },
        ],
      },
    ],
  },
  {
    slug: 'servicesGrid',
    labels: { singular: 'Services Grid', plural: 'Services Grids' },
    fields: [
      { name: 'heading', type: 'text', required: true, maxLength: 120 },
      { name: 'subheading', type: 'textarea', maxLength: 240 },
    ],
  },
  {
    slug: 'technologyGrid',
    labels: { singular: 'Technology Grid', plural: 'Technology Grids' },
    fields: [
      { name: 'heading', type: 'text', required: true, maxLength: 120 },
      { name: 'subheading', type: 'textarea', maxLength: 240 },
    ],
  },
  {
    slug: 'timeline',
    labels: { singular: 'Timeline', plural: 'Timelines' },
    fields: [
      { name: 'heading', type: 'text', required: true, maxLength: 120 },
      { name: 'subheading', type: 'textarea', maxLength: 240 },
      {
        name: 'items',
        type: 'array',
        minRows: 1,
        fields: [
          { name: 'date', type: 'text', maxLength: 40 },
          { name: 'title', type: 'text', required: true, maxLength: 120 },
          { name: 'description', type: 'textarea', maxLength: 320 },
        ],
      },
    ],
  },
  {
    slug: 'testimonials',
    labels: { singular: 'Testimonials', plural: 'Testimonials' },
    fields: [{ name: 'heading', type: 'text', required: true, maxLength: 120 }],
  },
  {
    slug: 'faqAccordion',
    labels: { singular: 'FAQ', plural: 'FAQs' },
    fields: [
      { name: 'heading', type: 'text', required: true, maxLength: 120 },
      { name: 'group', type: 'text', maxLength: 60, admin: { placeholder: 'Careers' } },
    ],
  },
  {
    slug: 'ctaBand',
    labels: { singular: 'CTA', plural: 'CTAs' },
    fields: [
      { name: 'heading', type: 'text', required: true, maxLength: 120 },
      { name: 'subheading', type: 'textarea', maxLength: 240 },
      { name: 'ctaLabel', type: 'text', maxLength: 48 },
      { name: 'ctaHref', type: 'text' },
    ],
  },
  {
    slug: 'contactCta',
    labels: { singular: 'Contact CTA', plural: 'Contact CTAs' },
    fields: [
      { name: 'heading', type: 'text', required: true, maxLength: 120 },
      { name: 'subheading', type: 'textarea', maxLength: 240 },
      ctaField('cta'),
    ],
  },
  {
    slug: 'imageGallery',
    labels: { singular: 'Image Gallery', plural: 'Image Galleries' },
    fields: [
      { name: 'heading', type: 'text', maxLength: 120 },
      { name: 'subheading', type: 'textarea', maxLength: 240 },
      galleryField('images'),
    ],
  },
  {
    slug: 'videoSection',
    labels: { singular: 'Video Section', plural: 'Video Sections' },
    fields: [
      { name: 'heading', type: 'text', required: true, maxLength: 120 },
      { name: 'subheading', type: 'textarea', maxLength: 240 },
      {
        name: 'video',
        type: 'upload',
        relationTo: 'media',
        admin: { description: 'Upload MP4/WebM or paste an embed URL below.' },
      },
      {
        name: 'embedUrl',
        type: 'text',
        admin: { placeholder: 'https://www.youtube.com/embed/...' },
      },
      { name: 'poster', type: 'upload', relationTo: 'media' },
    ],
  },
  {
    slug: 'latestBlogs',
    labels: { singular: 'Latest Blogs', plural: 'Latest Blogs' },
    fields: [
      { name: 'heading', type: 'text', required: true, maxLength: 120 },
      { name: 'subheading', type: 'textarea', maxLength: 240 },
    ],
  },
  {
    slug: 'careerBanner',
    labels: { singular: 'Career Banner', plural: 'Career Banners' },
    fields: [
      { name: 'heading', type: 'text', required: true, maxLength: 120 },
      { name: 'subheading', type: 'textarea', maxLength: 240 },
      ctaField('cta'),
    ],
  },
  {
    slug: 'newsletter',
    labels: { singular: 'Newsletter', plural: 'Newsletters' },
    fields: [
      { name: 'heading', type: 'text', required: true, maxLength: 120 },
      { name: 'subheading', type: 'textarea', maxLength: 240 },
    ],
  },
  {
    slug: 'aboutPreview',
    labels: { singular: 'About Preview', plural: 'About Previews' },
    fields: [
      { name: 'heading', type: 'text', required: true, maxLength: 120 },
      { name: 'body', type: 'textarea', required: true, maxLength: 600 },
      ctaField('cta'),
    ],
  },
  {
    slug: 'industriesStrip',
    labels: { singular: 'Industries', plural: 'Industries' },
    fields: [
      { name: 'heading', type: 'text', required: true, maxLength: 120 },
      { name: 'subheading', type: 'textarea', maxLength: 240 },
    ],
  },
  {
    slug: 'whyChooseUs',
    labels: { singular: 'Why Choose Us', plural: 'Why Choose Us' },
    fields: [
      { name: 'heading', type: 'text', required: true, maxLength: 120 },
      { name: 'subheading', type: 'textarea', maxLength: 240 },
      {
        name: 'items',
        type: 'array',
        minRows: 1,
        maxRows: 6,
        fields: [
          { name: 'title', type: 'text', required: true, maxLength: 80 },
          { name: 'description', type: 'textarea', required: true, maxLength: 240 },
        ],
      },
    ],
  },
  {
    slug: 'caseStudyFeature',
    labels: { singular: 'Featured Projects', plural: 'Featured Projects' },
    fields: [{ name: 'heading', type: 'text', required: true, maxLength: 120 }],
  },
  {
    slug: 'processSteps',
    labels: { singular: 'Process', plural: 'Process Sections' },
    fields: [
      { name: 'heading', type: 'text', required: true, maxLength: 120 },
      {
        name: 'steps',
        type: 'array',
        fields: [
          { name: 'title', type: 'text', required: true, maxLength: 80 },
          { name: 'description', type: 'textarea', required: true, maxLength: 240 },
        ],
      },
    ],
  },
  {
    slug: 'teamGrid',
    labels: { singular: 'Team', plural: 'Team' },
    fields: [{ name: 'heading', type: 'text', required: true, maxLength: 120 }],
  },
  {
    slug: 'clientLogos',
    labels: { singular: 'Clients', plural: 'Clients' },
    fields: [{ name: 'heading', type: 'text', required: true, maxLength: 120 }],
  },
  {
    slug: 'featureSplit',
    labels: { singular: 'Feature Split', plural: 'Feature Splits' },
    fields: [
      { name: 'heading', type: 'text', required: true, maxLength: 120 },
      { name: 'body', type: 'richText' },
      { name: 'image', type: 'upload', relationTo: 'media' },
      { name: 'reverse', type: 'checkbox', defaultValue: false },
    ],
  },
  {
    slug: 'missionVision',
    labels: { singular: 'Mission & Vision', plural: 'Mission & Vision' },
    fields: [
      { name: 'heading', type: 'text', required: true, maxLength: 120 },
      { name: 'missionTitle', type: 'text', defaultValue: 'Mission', maxLength: 40 },
      { name: 'missionBody', type: 'textarea', required: true, maxLength: 480 },
      { name: 'visionTitle', type: 'text', defaultValue: 'Vision', maxLength: 40 },
      { name: 'visionBody', type: 'textarea', required: true, maxLength: 480 },
    ],
  },
  {
    slug: 'valuesGrid',
    labels: { singular: 'Values', plural: 'Values' },
    fields: [
      { name: 'heading', type: 'text', required: true, maxLength: 120 },
      { name: 'subheading', type: 'textarea', maxLength: 240 },
      {
        name: 'values',
        type: 'array',
        minRows: 1,
        fields: [
          { name: 'title', type: 'text', required: true, maxLength: 60 },
          { name: 'description', type: 'textarea', required: true, maxLength: 240 },
        ],
      },
    ],
  },
  // ——— V5 Storytelling blocks ———
  {
    slug: 'storyHero',
    labels: { singular: 'Story Hero', plural: 'Story Heroes' },
    fields: [
      { name: 'brand', type: 'text', maxLength: 40, defaultValue: 'Xelarvis' },
      { name: 'eyebrow', type: 'text', maxLength: 80 },
      { name: 'heading', type: 'text', required: true, maxLength: 160 },
      { name: 'subheading', type: 'textarea', maxLength: 360 },
      { name: 'ctaLabel', type: 'text', maxLength: 48 },
      { name: 'ctaHref', type: 'text' },
      { name: 'secondaryCtaLabel', type: 'text', maxLength: 48 },
      { name: 'secondaryCtaHref', type: 'text' },
    ],
  },
  {
    slug: 'storyChallenge',
    labels: { singular: 'Story Challenge', plural: 'Story Challenges' },
    fields: [
      { name: 'eyebrow', type: 'text', maxLength: 60 },
      { name: 'heading', type: 'text', required: true, maxLength: 200 },
      {
        name: 'items',
        type: 'array',
        fields: [
          { name: 'title', type: 'text', required: true, maxLength: 120 },
          { name: 'body', type: 'textarea', maxLength: 240 },
        ],
      },
    ],
  },
  {
    slug: 'storySolution',
    labels: { singular: 'Story Solution', plural: 'Story Solutions' },
    fields: [
      { name: 'eyebrow', type: 'text', maxLength: 60 },
      { name: 'heading', type: 'text', required: true, maxLength: 160 },
      {
        name: 'chapters',
        type: 'array',
        fields: [
          { name: 'title', type: 'text', required: true, maxLength: 120 },
          { name: 'body', type: 'textarea', required: true, maxLength: 400 },
        ],
      },
    ],
  },
  {
    slug: 'storyCapabilities',
    labels: { singular: 'Story Capabilities', plural: 'Story Capabilities' },
    fields: [
      { name: 'eyebrow', type: 'text', maxLength: 60 },
      { name: 'heading', type: 'text', required: true, maxLength: 120 },
      { name: 'subheading', type: 'textarea', maxLength: 240 },
    ],
  },
  {
    slug: 'storyTechOrbit',
    labels: { singular: 'Story Tech Orbit', plural: 'Story Tech Orbits' },
    fields: [
      { name: 'eyebrow', type: 'text', maxLength: 60 },
      { name: 'heading', type: 'text', required: true, maxLength: 120 },
      { name: 'subheading', type: 'textarea', maxLength: 240 },
    ],
  },
  {
    slug: 'storyProof',
    labels: { singular: 'Story Proof', plural: 'Story Proof' },
    fields: [
      { name: 'eyebrow', type: 'text', maxLength: 60 },
      { name: 'heading', type: 'text', required: true, maxLength: 160 },
      {
        name: 'stats',
        type: 'array',
        fields: [
          { name: 'label', type: 'text', required: true, maxLength: 60 },
          { name: 'value', type: 'text', required: true, maxLength: 24 },
          { name: 'suffix', type: 'text', maxLength: 24 },
        ],
      },
    ],
  },
  {
    slug: 'storyCases',
    labels: { singular: 'Story Cases', plural: 'Story Cases' },
    fields: [
      { name: 'eyebrow', type: 'text', maxLength: 60 },
      { name: 'heading', type: 'text', required: true, maxLength: 120 },
    ],
  },
  {
    slug: 'storyProcess',
    labels: { singular: 'Story Process', plural: 'Story Processes' },
    fields: [
      { name: 'eyebrow', type: 'text', maxLength: 60 },
      { name: 'heading', type: 'text', required: true, maxLength: 120 },
      {
        name: 'steps',
        type: 'array',
        fields: [
          { name: 'title', type: 'text', required: true, maxLength: 80 },
          { name: 'description', type: 'textarea', required: true, maxLength: 280 },
        ],
      },
    ],
  },
  {
    slug: 'storyPresence',
    labels: { singular: 'Story Presence', plural: 'Story Presence' },
    fields: [
      { name: 'eyebrow', type: 'text', maxLength: 60 },
      { name: 'heading', type: 'text', required: true, maxLength: 120 },
    ],
  },
  {
    slug: 'storyCta',
    labels: { singular: 'Story CTA', plural: 'Story CTAs' },
    fields: [
      { name: 'heading', type: 'text', required: true, maxLength: 160 },
      { name: 'subheading', type: 'textarea', maxLength: 280 },
      { name: 'ctaLabel', type: 'text', maxLength: 48 },
      { name: 'ctaHref', type: 'text' },
    ],
  },
]

export default pageBlocks
