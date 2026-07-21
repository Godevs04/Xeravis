import type { MetadataRoute } from 'next'

import { listPublished } from '@/lib/cms'
import {
  FALLBACK_BLOG_POSTS,
  FALLBACK_CASE_STUDIES,
  FALLBACK_INDUSTRIES,
  FALLBACK_JOBS,
  FALLBACK_SERVICES,
  FALLBACK_SOLUTIONS,
} from '@/lib/fallback-data'
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

  const serviceSlugs = services.length ? services : FALLBACK_SERVICES
  const industrySlugs = industries.length ? industries : FALLBACK_INDUSTRIES
  const solutionSlugs = solutions.length ? solutions : FALLBACK_SOLUTIONS
  const caseStudySlugs = caseStudies.length ? caseStudies : FALLBACK_CASE_STUDIES
  const blogSlugs = blogs.length ? blogs : FALLBACK_BLOG_POSTS
  const careerSlugs = careers.length ? careers : FALLBACK_JOBS

  const dynamicRoutes: MetadataRoute.Sitemap = [
    ...serviceSlugs.map((item) => ({
      url: absoluteUrl(`/services/${item.slug}`),
      lastModified: 'updatedAt' in item && item.updatedAt ? new Date(item.updatedAt) : now,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),
    ...industrySlugs.map((item) => ({
      url: absoluteUrl(`/industries/${item.slug}`),
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),
    ...solutionSlugs.map((item) => ({
      url: absoluteUrl(`/solutions/${item.slug}`),
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),
    ...caseStudySlugs.map((item) => ({
      url: absoluteUrl(`/case-studies/${item.slug}`),
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),
    ...blogSlugs.map((item) => ({
      url: absoluteUrl(`/blog/${item.slug}`),
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.5,
    })),
    ...careerSlugs.map((item) => ({
      url: absoluteUrl(`/careers/${item.slug}`),
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.5,
    })),
  ]

  return [...staticRoutes, ...dynamicRoutes]
}
