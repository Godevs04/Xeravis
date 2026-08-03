import type { Where } from 'payload'

import { safePayload } from '@/lib/cms'
import {
  FALLBACK_BLOG_POSTS,
  FALLBACK_INDUSTRIES,
  FALLBACK_JOBS,
  FALLBACK_SERVICES,
  FALLBACK_SOLUTIONS,
} from '@/lib/fallback-data'
import { ABOUT_MEGA, INSIGHTS_MEGA } from '@/lib/site-ia'

export type SiteSearchResult = {
  id: string
  title: string
  href: string
  kind: string
  excerpt?: string
}

type IndexedSearchDoc = {
  id: string
  title?: string | null
  slug?: string | null
  doc?: {
    relationTo?: string
    value?: { slug?: string } | string
  }
}

const STATIC_PAGES: SiteSearchResult[] = [
  {
    id: 'page-home',
    title: 'Home',
    href: '/',
    kind: 'pages',
    excerpt: 'Xelarvis Technologies homepage.',
  },
  {
    id: 'page-about',
    title: 'About XELARVIS',
    href: '/about',
    kind: 'pages',
    excerpt: 'Company overview, mission, and leadership.',
  },
  {
    id: 'page-services',
    title: 'Services',
    href: '/services',
    kind: 'pages',
    excerpt: 'AI, data science, consulting, clinical, and cloud services.',
  },
  {
    id: 'page-solutions',
    title: 'Solutions',
    href: '/solutions',
    kind: 'pages',
    excerpt: 'Outcome-oriented solution themes.',
  },
  {
    id: 'page-industries',
    title: 'Industries',
    href: '/industries',
    kind: 'pages',
    excerpt: 'Sector expertise across regulated and high-scale markets.',
  },
  {
    id: 'page-technologies',
    title: 'Technologies',
    href: '/technologies',
    kind: 'pages',
    excerpt: 'AI, clinical, cloud, and data technology stack.',
  },
  {
    id: 'page-research',
    title: 'Research & Innovation',
    href: '/ai-research-lab',
    kind: 'pages',
    excerpt: 'AI Research Lab, publications, collaborations, and innovation projects.',
  },
  {
    id: 'page-careers',
    title: 'Careers',
    href: '/careers',
    kind: 'pages',
    excerpt: 'Open roles, hiring process, and why join XELARVIS.',
  },
  {
    id: 'page-contact',
    title: 'Contact',
    href: '/contact',
    kind: 'pages',
    excerpt: 'Talk to our team about a project or partnership.',
  },
  {
    id: 'page-api-docs',
    title: 'API documentation',
    href: '/docs/api',
    kind: 'pages',
    excerpt: 'OpenAPI / Swagger docs for website and admin helper APIs.',
  },
  {
    id: 'page-insights',
    title: 'Insights',
    href: '/insights',
    kind: 'pages',
    excerpt: 'Blogs, white papers, news, and resources.',
  },
  {
    id: 'page-case-studies',
    title: 'Case Studies',
    href: '/case-studies',
    kind: 'pages',
    excerpt: 'Selected delivery outcomes and client work.',
  },
  ...ABOUT_MEGA.map((item) => ({
    id: `about-${item.href}`,
    title: item.label,
    href: item.href,
    kind: 'pages',
    excerpt: item.description,
  })),
  ...INSIGHTS_MEGA.filter((i) => i.href !== '/insights').map((item) => ({
    id: `insights-${item.href}`,
    title: item.label,
    href: item.href,
    kind: 'pages',
    excerpt: item.description,
  })),
]

type CollectionTarget = {
  collection: string
  kind: string
  pathPrefix: string
  titleField: string
  excerptField?: string
}

const COLLECTION_TARGETS: CollectionTarget[] = [
  {
    collection: 'careers',
    kind: 'careers',
    pathPrefix: '/careers',
    titleField: 'title',
    excerptField: 'aboutRole',
  },
  {
    collection: 'services',
    kind: 'services',
    pathPrefix: '/services',
    titleField: 'title',
    excerptField: 'summary',
  },
  {
    collection: 'solutions',
    kind: 'solutions',
    pathPrefix: '/solutions',
    titleField: 'title',
    excerptField: 'summary',
  },
  {
    collection: 'industries',
    kind: 'industries',
    pathPrefix: '/industries',
    titleField: 'title',
    excerptField: 'summary',
  },
  {
    collection: 'blogs',
    kind: 'blogs',
    pathPrefix: '/blog',
    titleField: 'title',
    excerptField: 'excerpt',
  },
  {
    collection: 'case-studies',
    kind: 'case-studies',
    pathPrefix: '/case-studies',
    titleField: 'title',
    excerptField: 'summary',
  },
  {
    collection: 'pages',
    kind: 'pages',
    pathPrefix: '',
    titleField: 'title',
  },
]

function matchesQuery(haystack: string, query: string) {
  return haystack.toLowerCase().includes(query.toLowerCase())
}

function scoreTitle(title: string, query: string) {
  const t = title.toLowerCase()
  const q = query.toLowerCase()
  if (t === q) return 100
  if (t.startsWith(q)) return 80
  if (t.includes(q)) return 60
  return 20
}

function staticMatches(query: string): SiteSearchResult[] {
  const fallbackCatalog: SiteSearchResult[] = [
    ...STATIC_PAGES,
    ...FALLBACK_SERVICES.map((s) => ({
      id: `fallback-service-${s.id}`,
      title: s.title,
      href: `/services/${s.slug}`,
      kind: 'services',
      excerpt: s.summary,
    })),
    ...FALLBACK_SOLUTIONS.map((s) => ({
      id: `fallback-solution-${s.id}`,
      title: s.title,
      href: `/solutions/${s.slug}`,
      kind: 'solutions',
      excerpt: s.summary,
    })),
    ...FALLBACK_INDUSTRIES.map((s) => ({
      id: `fallback-industry-${s.id}`,
      title: s.title,
      href: `/industries/${s.slug}`,
      kind: 'industries',
      excerpt: s.summary,
    })),
    ...FALLBACK_JOBS.map((j) => ({
      id: `fallback-job-${j.id}`,
      title: j.title,
      href: `/careers/${j.slug}`,
      kind: 'careers',
      excerpt: `${j.department || 'Careers'} · ${j.location}`,
    })),
    ...FALLBACK_BLOG_POSTS.map((p) => ({
      id: `fallback-blog-${p.id}`,
      title: p.title,
      href: `/blog/${p.slug}`,
      kind: 'blogs',
      excerpt: p.excerpt,
    })),
  ]

  return fallbackCatalog
    .filter(
      (item) =>
        matchesQuery(item.title, query) ||
        (item.excerpt ? matchesQuery(item.excerpt, query) : false) ||
        matchesQuery(item.href, query) ||
        matchesQuery(item.kind, query),
    )
    .sort((a, b) => scoreTitle(b.title, query) - scoreTitle(a.title, query))
}

function resolveIndexedHref(doc: IndexedSearchDoc): string | null {
  const relationTo = doc.doc?.relationTo
  const value = doc.doc?.value
  const slug = typeof value === 'object' && value ? value.slug : doc.slug
  if (!slug) return null

  switch (relationTo) {
    case 'services':
      return `/services/${slug}`
    case 'industries':
      return `/industries/${slug}`
    case 'solutions':
      return `/solutions/${slug}`
    case 'case-studies':
      return `/case-studies/${slug}`
    case 'blogs':
      return `/blog/${slug}`
    case 'careers':
      return `/careers/${slug}`
    case 'pages':
      return slug === 'home' ? '/' : `/${slug}`
    default:
      return `/${slug}`
  }
}

async function searchIndexed(query: string): Promise<SiteSearchResult[]> {
  const response = await safePayload((payload) =>
    payload.find({
      collection: 'search',
      where: {
        title: { like: query },
      },
      limit: 24,
      depth: 1,
    }),
  )

  if (!response?.docs?.length) return []

  return (response.docs as IndexedSearchDoc[])
    .map((doc) => {
      const href = resolveIndexedHref(doc)
      if (!href || !doc.title) return null
      return {
        id: `search-${doc.id}`,
        title: doc.title,
        href,
        kind: doc.doc?.relationTo || 'pages',
      } satisfies SiteSearchResult
    })
    .filter((item): item is SiteSearchResult => Boolean(item))
}

async function searchCollections(query: string): Promise<SiteSearchResult[]> {
  const batches = await Promise.all(
    COLLECTION_TARGETS.map(async (target) => {
      const orFilters = [
        { [target.titleField]: { like: query } },
        { slug: { like: query } },
        ...(target.excerptField ? [{ [target.excerptField]: { like: query } }] : []),
      ] as Where[]

      const result = await safePayload((payload) =>
        payload.find({
          collection: target.collection as 'pages',
          depth: 0,
          limit: 8,
          draft: false,
          overrideAccess: true,
          where: { or: orFilters },
        }),
      )

      if (!result?.docs?.length) return [] as SiteSearchResult[]

      const mapped: SiteSearchResult[] = []
      for (const raw of result.docs) {
        const doc = raw as unknown as Record<string, unknown>
        const title = typeof doc.title === 'string' ? doc.title : null
        const slug = typeof doc.slug === 'string' ? doc.slug : null
        if (!title || !slug) continue
        if (doc._status && doc._status !== 'published') continue

        const excerpt =
          target.excerptField && typeof doc[target.excerptField] === 'string'
            ? (doc[target.excerptField] as string)
            : undefined

        const href =
          target.collection === 'pages'
            ? slug === 'home'
              ? '/'
              : `/${slug}`
            : `${target.pathPrefix}/${slug}`

        mapped.push({
          id: `${target.collection}-${String(doc.id)}`,
          title,
          href,
          kind: target.kind,
          excerpt,
        })
      }
      return mapped
    }),
  )

  return batches.flat()
}

function dedupeResults(items: SiteSearchResult[]) {
  const seen = new Set<string>()
  const out: SiteSearchResult[] = []
  for (const item of items) {
    const key = item.href.toLowerCase()
    if (seen.has(key)) continue
    seen.add(key)
    out.push(item)
  }
  return out
}

export async function siteSearch(query: string): Promise<SiteSearchResult[]> {
  const q = query.trim()
  if (q.length < 2) return []

  // Prefer the search index first; only fan out to live collections when the index is thin.
  const indexed = await searchIndexed(q)
  const collections = indexed.length >= 8 ? [] : await searchCollections(q)
  const merged = dedupeResults([...indexed, ...collections, ...staticMatches(q)])

  return merged.sort((a, b) => scoreTitle(b.title, q) - scoreTitle(a.title, q)).slice(0, 24)
}
