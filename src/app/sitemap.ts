import type { MetadataRoute } from 'next'

import { authorSlug, listAuthors } from '@/lib/authors'
import { listPublished } from '@/lib/cms'
import { isPastDeadline } from '@/lib/date'
import { CANONICAL_SOLUTION_SLUGS } from '@/seed/relations'
import { EXTRA_STATIC_ROUTES } from '@/lib/seo-content'
import { absoluteUrl } from '@/lib/utils'

type SitemapDoc = { slug: string; updatedAt?: string }

/** `noindex` pages stay out of the sitemap. */
const EXCLUDED_ROUTES = new Set(['/docs/api', '/search'])

const SITEMAP_LIMIT = 1000

const modified = (item?: { updatedAt?: string }) =>
  item?.updatedAt ? new Date(item.updatedAt) : undefined

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const coreStatic = [
    '',
    '/about',
    '/about/domain-expertise',
    '/services',
    '/industries',
    '/solutions',
    '/ai-readiness',
    '/case-studies',
    '/insights',
    '/insights/blogs',
    '/careers',
    '/contact',
    '/privacy-policy',
    '/terms',
  ]

  // Static pages carry no lastModified: claiming "now" on every request misleads crawlers.
  const staticRoutes: MetadataRoute.Sitemap = [...coreStatic, ...EXTRA_STATIC_ROUTES]
    .filter((path, index, arr) => arr.indexOf(path) === index && !EXCLUDED_ROUTES.has(path))
    .map((path) => ({
      url: absoluteUrl(path || '/'),
      changeFrequency: path === '' || path === '/' ? ('daily' as const) : ('weekly' as const),
      priority:
        path === '' || path === '/'
          ? 1
          : path.startsWith('/services') || path.startsWith('/solutions')
            ? 0.8
            : path.includes('privacy') || path.includes('terms')
              ? 0.3
              : 0.7,
    }))

  const list = (collection: string) =>
    listPublished<SitemapDoc>(collection, { limit: SITEMAP_LIMIT, depth: 0 })

  const [services, industries, solutions, caseStudies, blogs, research, careers, authors] =
    await Promise.all([
      list('services'),
      list('industries'),
      list('solutions'),
      list('case-studies'),
      listPublished<SitemapDoc & { author?: string | { id: string } | null }>('blogs', {
        limit: SITEMAP_LIMIT,
        depth: 0,
      }),
      list('research'),
      listPublished<SitemapDoc & { applicationDeadline?: string | null }>('careers', {
        limit: SITEMAP_LIMIT,
        depth: 0,
        where: { active: { equals: true } },
      }),
      listAuthors(),
    ])

  const blogAuthorIds = new Set(
    blogs
      .map((b) => (typeof b.author === 'object' && b.author ? b.author.id : b.author))
      .filter(Boolean)
      .map(String),
  )

  const dynamicRoutes: MetadataRoute.Sitemap = [
    ...services.map((item) => ({
      url: absoluteUrl(`/services/${item.slug}`),
      lastModified: modified(item),
      changeFrequency: 'monthly' as const,
      priority: 0.75,
    })),
    ...industries.map((item) => ({
      url: absoluteUrl(`/industries/${item.slug}`),
      lastModified: modified(item),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
    ...CANONICAL_SOLUTION_SLUGS.map((slug) => ({
      url: absoluteUrl(`/solutions/${slug}`),
      lastModified: modified(solutions.find((s) => s.slug === slug)),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
    ...caseStudies.map((item) => ({
      url: absoluteUrl(`/case-studies/${item.slug}`),
      lastModified: modified(item),
      changeFrequency: 'monthly' as const,
      priority: 0.65,
    })),
    ...blogs.map((item) => ({
      url: absoluteUrl(`/blog/${item.slug}`),
      lastModified: modified(item),
      changeFrequency: 'weekly' as const,
      priority: 0.55,
    })),
    ...research.map((item) => ({
      url: absoluteUrl(`/research/${item.slug}`),
      lastModified: modified(item),
      changeFrequency: 'monthly' as const,
      priority: 0.55,
    })),
    ...authors
      .filter((author) => blogAuthorIds.has(String(author.id)))
      .map((author) => ({
        url: absoluteUrl(`/authors/${authorSlug(author)}`),
        changeFrequency: 'monthly' as const,
        priority: 0.4,
      })),
    ...careers
      .filter((item) => !isPastDeadline(item.applicationDeadline))
      .map((item) => ({
        url: absoluteUrl(`/careers/${item.slug}`),
        lastModified: modified(item),
        changeFrequency: 'weekly' as const,
        priority: 0.5,
      })),
  ]

  return [...staticRoutes, ...dynamicRoutes]
}
