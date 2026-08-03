import type { MetadataRoute } from 'next'

import { listPublished } from '@/lib/cms'
import { EXTRA_STATIC_ROUTES } from '@/lib/seo-content'
import { absoluteUrl } from '@/lib/utils'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()

  const coreStatic = [
    '',
    '/about',
    '/services',
    '/industries',
    '/solutions',
    '/case-studies',
    '/insights',
    '/blog',
    '/careers',
    '/contact',
    '/privacy-policy',
    '/terms',
  ]

  const staticRoutes: MetadataRoute.Sitemap = [...coreStatic, ...EXTRA_STATIC_ROUTES]
    .filter((path, index, arr) => arr.indexOf(path) === index)
    .map((path) => ({
      url: absoluteUrl(path || '/'),
      lastModified: now,
      changeFrequency: path === '' || path === '/' ? ('daily' as const) : ('weekly' as const),
      priority:
        path === '' || path === '/'
          ? 1
          : path.startsWith('/services') || path.startsWith('/solutions')
            ? 0.8
            : path.includes('privacy') || path.includes('terms') || path === '/search'
              ? 0.3
              : 0.7,
    }))

  const [services, industries, solutions, caseStudies, blogs, careers] = await Promise.all([
    listPublished<{ slug: string; updatedAt?: string }>('services'),
    listPublished<{ slug: string; updatedAt?: string }>('industries'),
    listPublished<{ slug: string; updatedAt?: string }>('solutions'),
    listPublished<{ slug: string; updatedAt?: string }>('case-studies'),
    listPublished<{ slug: string; updatedAt?: string }>('blogs'),
    listPublished<{ slug: string; updatedAt?: string }>('careers'),
  ])

  const dynamicRoutes: MetadataRoute.Sitemap = [
    ...services.map((item) => ({
      url: absoluteUrl(`/services/${item.slug}`),
      lastModified: item.updatedAt ? new Date(item.updatedAt) : now,
      changeFrequency: 'monthly' as const,
      priority: 0.75,
    })),
    ...industries.map((item) => ({
      url: absoluteUrl(`/industries/${item.slug}`),
      lastModified: item.updatedAt ? new Date(item.updatedAt) : now,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
    ...solutions.map((item) => ({
      url: absoluteUrl(`/solutions/${item.slug}`),
      lastModified: item.updatedAt ? new Date(item.updatedAt) : now,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
    ...caseStudies.map((item) => ({
      url: absoluteUrl(`/case-studies/${item.slug}`),
      lastModified: item.updatedAt ? new Date(item.updatedAt) : now,
      changeFrequency: 'monthly' as const,
      priority: 0.65,
    })),
    ...blogs.map((item) => ({
      url: absoluteUrl(`/blog/${item.slug}`),
      lastModified: item.updatedAt ? new Date(item.updatedAt) : now,
      changeFrequency: 'weekly' as const,
      priority: 0.55,
    })),
    ...careers.map((item) => ({
      url: absoluteUrl(`/careers/${item.slug}`),
      lastModified: item.updatedAt ? new Date(item.updatedAt) : now,
      changeFrequency: 'weekly' as const,
      priority: 0.5,
    })),
  ]

  return [...staticRoutes, ...dynamicRoutes]
}
