import type { MetadataRoute } from 'next'

import { listPublished } from '@/lib/cms'
import { absoluteUrl } from '@/lib/utils'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = absoluteUrl()
  const now = new Date()

  const staticRoutes: MetadataRoute.Sitemap = [
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
  ].map((path) => ({
    url: `${base}${path}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: path === '' ? 1 : 0.7,
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
      priority: 0.6,
    })),
    ...industries.map((item) => ({
      url: absoluteUrl(`/industries/${item.slug}`),
      lastModified: item.updatedAt ? new Date(item.updatedAt) : now,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),
    ...solutions.map((item) => ({
      url: absoluteUrl(`/solutions/${item.slug}`),
      lastModified: item.updatedAt ? new Date(item.updatedAt) : now,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),
    ...caseStudies.map((item) => ({
      url: absoluteUrl(`/case-studies/${item.slug}`),
      lastModified: item.updatedAt ? new Date(item.updatedAt) : now,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),
    ...blogs.map((item) => ({
      url: absoluteUrl(`/blog/${item.slug}`),
      lastModified: item.updatedAt ? new Date(item.updatedAt) : now,
      changeFrequency: 'weekly' as const,
      priority: 0.5,
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
