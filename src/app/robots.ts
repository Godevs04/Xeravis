import type { MetadataRoute } from 'next'

import { absoluteUrl } from '@/lib/utils'

const AI_CRAWLERS = [
  'GPTBot',
  'ChatGPT-User',
  'Google-Extended',
  'PerplexityBot',
  'ClaudeBot',
  'anthropic-ai',
]

// CMS images are served from /api/media/file/, so that path stays crawlable for image search.
const allow = ['/', '/api/media/file/']
const disallow = ['/admin/', '/api/', '/offline', '/search', '/docs/']

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow, disallow },
      ...AI_CRAWLERS.map((userAgent) => ({ userAgent, allow, disallow })),
    ],
    sitemap: absoluteUrl('/sitemap.xml'),
  }
}
