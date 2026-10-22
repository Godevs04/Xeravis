import { config as loadEnv } from 'dotenv'
import { getPayload, type CollectionSlug, type GlobalSlug, type Payload, type Where } from 'payload'

loadEnv({ path: '.env' })
loadEnv({ path: '.env.local', override: true })

/** Every record created during QA carries at least one of these markers. */
export const TEST_TITLE_PREFIX = '[TEST]'
export const TEST_SLUG_PREFIX = 'test-qa-'
export const TEST_EMAIL_DOMAIN = '@xelarvis.test'
export const TEST_TEXT_TAG = 'TEST-QA'
export const TEST_USER_PASSWORD = 'TestQa!2026'

export const TEST_ROLES = [
  'administrator',
  'editor',
  'content-manager',
  'marketing',
  'recruiter',
  'viewer',
] as const

export const testUserEmail = (role: string) => `${TEST_SLUG_PREFIX}${role}${TEST_EMAIL_DOMAIN}`

export const GLOBAL_SLUGS: GlobalSlug[] = [
  'site-settings',
  'navigation',
  'footer',
  'contact-details',
  'office-locations',
  'seo-defaults',
  'social-media',
  'analytics',
  'announcement-bar',
  'cookie-banner',
]

export const SNAPSHOT_DIR = 'docs/testing/snapshots'

export async function bootPayload(): Promise<Payload> {
  if (!process.env.DATABASE_URI || !process.env.PAYLOAD_SECRET) {
    throw new Error('DATABASE_URI and PAYLOAD_SECRET must be set (.env.local)')
  }
  const { default: config } = await import('../../src/payload.config')
  return getPayload({ config })
}

const contains = (field: string, value: string): Where => ({ [field]: { contains: value } })
const startsWith = (field: string, value: string): Where => ({ [field]: { like: `${value}%` } })

/**
 * How TEST data is detected per collection. `like` with a trailing % is a prefix match;
 * `contains` catches markers inside summaries and notification bodies.
 */
export const TEST_MATCHERS: Partial<Record<CollectionSlug, Where>> = {
  pages: { or: [startsWith('slug', TEST_SLUG_PREFIX), contains('title', TEST_TITLE_PREFIX)] },
  services: { or: [startsWith('slug', TEST_SLUG_PREFIX), contains('title', TEST_TITLE_PREFIX)] },
  solutions: { or: [startsWith('slug', TEST_SLUG_PREFIX), contains('title', TEST_TITLE_PREFIX)] },
  industries: { or: [startsWith('slug', TEST_SLUG_PREFIX), contains('title', TEST_TITLE_PREFIX)] },
  technologies: {
    or: [startsWith('slug', TEST_SLUG_PREFIX), contains('title', TEST_TITLE_PREFIX)],
  },
  'case-studies': {
    or: [startsWith('slug', TEST_SLUG_PREFIX), contains('title', TEST_TITLE_PREFIX)],
  },
  blogs: { or: [startsWith('slug', TEST_SLUG_PREFIX), contains('title', TEST_TITLE_PREFIX)] },
  research: { or: [startsWith('slug', TEST_SLUG_PREFIX), contains('title', TEST_TITLE_PREFIX)] },
  categories: {
    or: [startsWith('slug', TEST_SLUG_PREFIX), contains('title', TEST_TITLE_PREFIX)],
  },
  tags: { or: [startsWith('slug', TEST_SLUG_PREFIX), contains('title', TEST_TITLE_PREFIX)] },
  downloads: { or: [startsWith('slug', TEST_SLUG_PREFIX), contains('title', TEST_TITLE_PREFIX)] },
  careers: { or: [startsWith('slug', TEST_SLUG_PREFIX), contains('title', TEST_TITLE_PREFIX)] },
  departments: {
    or: [startsWith('slug', TEST_SLUG_PREFIX), contains('title', TEST_TITLE_PREFIX)],
  },
  authors: contains('name', TEST_TITLE_PREFIX),
  clients: contains('name', TEST_TITLE_PREFIX),
  'team-members': contains('name', TEST_TITLE_PREFIX),
  faqs: contains('question', TEST_TITLE_PREFIX),
  testimonials: contains('authorName', TEST_TITLE_PREFIX),
  'newsletter-campaigns': contains('title', TEST_TITLE_PREFIX),
  'newsletter-subscribers': contains('email', TEST_EMAIL_DOMAIN),
  'contact-messages': {
    or: [contains('email', TEST_EMAIL_DOMAIN), contains('name', TEST_TITLE_PREFIX)],
  },
  'job-applications': {
    or: [contains('email', TEST_EMAIL_DOMAIN), contains('name', TEST_TITLE_PREFIX)],
  },
  interviews: contains('title', TEST_TITLE_PREFIX),
  media: { or: [startsWith('filename', TEST_SLUG_PREFIX), contains('alt', TEST_TITLE_PREFIX)] },
  'activity-logs': {
    or: [
      contains('summary', TEST_TITLE_PREFIX),
      contains('summary', TEST_SLUG_PREFIX),
      contains('summary', TEST_EMAIL_DOMAIN),
    ],
  },
  notifications: {
    or: [
      contains('title', TEST_TITLE_PREFIX),
      contains('body', TEST_TITLE_PREFIX),
      contains('body', TEST_SLUG_PREFIX),
      contains('body', TEST_EMAIL_DOMAIN),
    ],
  },
  users: contains('email', TEST_EMAIL_DOMAIN),
}

/** JSON-shaped collections can't be queried by text, so these are scanned for any marker. */
export const SCANNED_COLLECTIONS: CollectionSlug[] = ['form-submissions', 'analytics-events']

export const hasTestMarker = (doc: unknown) => {
  const text = JSON.stringify(doc)
  return [TEST_TITLE_PREFIX, TEST_SLUG_PREFIX, TEST_EMAIL_DOMAIN, TEST_TEXT_TAG].some((m) =>
    text.includes(m),
  )
}

export const richParagraph = (text: string) => ({
  root: {
    type: 'root',
    children: [
      {
        type: 'paragraph',
        children: [{ type: 'text', text, version: 1 }],
        direction: 'ltr',
        format: '',
        indent: 0,
        version: 1,
      },
    ],
    direction: 'ltr',
    format: '',
    indent: 0,
    version: 1,
  },
})
