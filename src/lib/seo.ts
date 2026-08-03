import type { Metadata } from 'next'

import { BRAND } from '@/lib/fallback-data'
import { getMediaUrl } from '@/lib/media'
import { absoluteUrl, getSiteURL } from '@/lib/utils'

/** Short brand for title tags (≈50–60 char budgets). */
export const SITE_NAME_SHORT = 'Xelarvis'
export const SITE_NAME = BRAND.name
export const SITE_DOMAIN = BRAND.domain
export const TWITTER_HANDLE = '@xelarvis'

export const DEFAULT_DESCRIPTION =
  'Xelarvis leads with data science, AI, and Healthcare AI—delivering clinical intelligence, advanced analytics, and enterprise platforms for hospitals, life sciences, and regulated enterprises.'

/** Entity phrases for GEO / knowledge-graph consistency. */
export const ENTITY_ALIASES = [
  'Data Science Company',
  'AI Research Company',
  'Healthcare AI Company',
  'Clinical Intelligence Company',
  'Artificial Intelligence Company',
  'Clinical Data Science Company',
  'IT Consulting Company',
  'Enterprise AI Consulting Company',
  'Healthcare Technology Consulting Company',
  'Cloud Engineering Company',
] as const

export const KNOWNS_FOR = [
  'Data Science',
  'AI Research',
  'Healthcare AI',
  'Clinical Data Science',
  'Clinical Intelligence',
  'Machine Learning',
  'Advanced Analytics',
  'Healthcare Analytics',
  'Enterprise AI',
  'IT Consulting',
  'Healthcare Technology Consulting',
  'Cloud Engineering',
  'Data Engineering',
  'Enterprise Software Platforms',
] as const

export const SOCIAL_PROFILES = [
  'https://www.linkedin.com/company/xelarvis',
  'https://x.com/xelarvis',
] as const

type MetaInput = {
  title?: string | null
  description?: string | null
  image?: unknown
  path?: string
  noIndex?: boolean
  /** Open Graph type */
  type?: 'website' | 'article'
  publishedTime?: string | null
  modifiedTime?: string | null
  authors?: string[]
  keywords?: string[]
}

function clampDescription(text: string, max = 158) {
  const clean = text.replace(/\s+/g, ' ').trim()
  if (clean.length <= max) return clean
  const cut = clean.slice(0, max - 1)
  const lastSpace = cut.lastIndexOf(' ')
  return `${(lastSpace > 100 ? cut.slice(0, lastSpace) : cut).trimEnd()}…`
}

/** Prefer CMS titles that already include brand; otherwise append `| Xelarvis`. */
export function formatPageTitle(title?: string | null) {
  if (!title?.trim()) {
    return `${SITE_NAME_SHORT} | Data Science, AI & Healthcare`
  }
  const t = title.trim()
  if (/xelarvis/i.test(t)) return t
  return `${t} | ${SITE_NAME_SHORT}`
}

export function buildMetadata({
  title,
  description,
  image,
  path = '',
  noIndex = false,
  type = 'website',
  publishedTime,
  modifiedTime,
  authors,
  keywords,
}: MetaInput): Metadata {
  const pageTitle = formatPageTitle(title)
  const pageDescription = clampDescription(description || DEFAULT_DESCRIPTION)
  const imageUrl = getMediaUrl(image as Parameters<typeof getMediaUrl>[0])
  const url = absoluteUrl(path)
  const defaultKeywords = [
    'Healthcare AI',
    'Enterprise AI',
    'Clinical Intelligence',
    'Cloud Engineering',
    'Data Engineering',
    'Xelarvis',
    ...ENTITY_ALIASES.slice(0, 4),
  ]

  return {
    metadataBase: new URL(getSiteURL()),
    title: pageTitle,
    description: pageDescription,
    applicationName: SITE_NAME_SHORT,
    keywords: keywords?.length ? keywords : defaultKeywords,
    authors: authors?.map((name) => ({ name })) ?? [{ name: SITE_NAME }],
    creator: SITE_NAME,
    publisher: SITE_NAME,
    category: 'Technology',
    appleWebApp: {
      capable: true,
      statusBarStyle: 'default',
      title: SITE_NAME_SHORT,
    },
    formatDetection: {
      telephone: false,
    },
    icons: {
      icon: [
        { url: '/icons/favicon-16.png', sizes: '16x16', type: 'image/png' },
        { url: '/icons/favicon-32.png', sizes: '32x32', type: 'image/png' },
        { url: '/icons/icon.svg', type: 'image/svg+xml' },
        { url: '/icons/site-192.png', sizes: '192x192', type: 'image/png' },
        { url: '/icons/site-512.png', sizes: '512x512', type: 'image/png' },
      ],
      apple: [{ url: '/icons/apple-touch-180.png', sizes: '180x180', type: 'image/png' }],
      shortcut: ['/icons/favicon-32.png'],
    },
    manifest: '/manifest.webmanifest',
    other: {
      'mobile-web-app-capable': 'yes',
      'apple-mobile-web-app-capable': 'yes',
    },
    alternates: {
      canonical: url,
      types: {
        'application/rss+xml': absoluteUrl('/blog'),
      },
    },
    openGraph: {
      type,
      url,
      siteName: SITE_NAME,
      locale: 'en_IN',
      title: pageTitle,
      description: pageDescription,
      ...(imageUrl
        ? {
            images: [
              {
                url: imageUrl,
                width: 1200,
                height: 630,
                alt: pageTitle,
              },
            ],
          }
        : {}),
      ...(type === 'article'
        ? {
            publishedTime: publishedTime || undefined,
            modifiedTime: modifiedTime || publishedTime || undefined,
            authors: authors?.length ? authors : [SITE_NAME],
          }
        : {}),
    },
    twitter: {
      card: imageUrl ? 'summary_large_image' : 'summary',
      site: TWITTER_HANDLE,
      creator: TWITTER_HANDLE,
      title: pageTitle,
      description: pageDescription,
      ...(imageUrl ? { images: [imageUrl] } : {}),
    },
    robots: noIndex
      ? { index: false, follow: false, googleBot: { index: false, follow: false } }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            'max-image-preview': 'large',
            'max-snippet': -1,
            'max-video-preview': -1,
          },
        },
  }
}

export type JsonLd = Record<string, unknown>

export function organizationJsonLd(): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': ['Organization', 'ProfessionalService'],
    '@id': absoluteUrl('/#organization'),
    name: SITE_NAME,
    legalName: 'XELARVIS PRIVATE LIMITED',
    alternateName: ['Xelarvis', 'XELARVIS', ...ENTITY_ALIASES],
    url: absoluteUrl('/'),
    logo: {
      '@type': 'ImageObject',
      url: absoluteUrl('/icons/site-192.png'),
      width: 192,
      height: 192,
    },
    image: absoluteUrl('/icons/site-192.png'),
    description: DEFAULT_DESCRIPTION,
    slogan: BRAND.tagline,
    foundingDate: '2012',
    knowsAbout: [...KNOWNS_FOR],
    areaServed: ['IN', 'Global'],
    sameAs: [...SOCIAL_PROFILES],
    contactPoint: [
      {
        '@type': 'ContactPoint',
        contactType: 'sales',
        url: absoluteUrl('/contact'),
        availableLanguage: ['English', 'Hindi'],
      },
      {
        '@type': 'ContactPoint',
        contactType: 'careers',
        url: absoluteUrl('/careers'),
        availableLanguage: ['English'],
      },
    ],
  }
}

export function websiteJsonLd(): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': absoluteUrl('/#website'),
    name: SITE_NAME,
    url: absoluteUrl('/'),
    description: DEFAULT_DESCRIPTION,
    publisher: { '@id': absoluteUrl('/#organization') },
    inLanguage: 'en-IN',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${absoluteUrl('/search')}?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  }
}

export function breadcrumbJsonLd(items: { name: string; path?: string }[]): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      ...(item.path ? { item: absoluteUrl(item.path) } : {}),
    })),
  }
}

export function faqPageJsonLd(faqs: { question: string; answer: string }[]): JsonLd | null {
  if (!faqs.length) return null
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }
}

export function serviceJsonLd(input: {
  name: string
  description: string
  path: string
  image?: unknown
  serviceType?: string
}): JsonLd {
  const imageUrl = getMediaUrl(input.image as Parameters<typeof getMediaUrl>[0])
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: input.name,
    description: input.description,
    url: absoluteUrl(input.path),
    serviceType: input.serviceType || input.name,
    provider: { '@id': absoluteUrl('/#organization') },
    areaServed: ['IN', 'Global'],
    audience: {
      '@type': 'Audience',
      audienceType:
        'Healthcare executives, CTOs, CIOs, Healthcare IT leaders, enterprise buyers, research organizations',
    },
    ...(imageUrl
      ? {
          image: {
            '@type': 'ImageObject',
            url: imageUrl,
          },
        }
      : {}),
  }
}

export function articleJsonLd(input: {
  title: string
  description: string
  path: string
  datePublished?: string
  dateModified?: string
  image?: unknown
  authorName?: string
  speakable?: boolean
}): JsonLd {
  const imageUrl = getMediaUrl(input.image as Parameters<typeof getMediaUrl>[0])
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: input.title,
    description: input.description,
    url: absoluteUrl(input.path),
    mainEntityOfPage: absoluteUrl(input.path),
    datePublished: input.datePublished,
    dateModified: input.dateModified || input.datePublished,
    author: {
      '@type': 'Organization',
      name: input.authorName || SITE_NAME,
      url: absoluteUrl('/'),
    },
    publisher: { '@id': absoluteUrl('/#organization') },
    ...(imageUrl
      ? {
          image: {
            '@type': 'ImageObject',
            url: imageUrl,
          },
        }
      : {}),
    ...(input.speakable !== false
      ? {
          speakable: {
            '@type': 'SpeakableSpecification',
            cssSelector: ['h1', 'article p:first-of-type'],
          },
        }
      : {}),
  }
}

export function caseStudyJsonLd(input: {
  title: string
  description: string
  path: string
  client?: string
  image?: unknown
}): JsonLd {
  const imageUrl = getMediaUrl(input.image as Parameters<typeof getMediaUrl>[0])
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: input.title,
    description: input.description,
    url: absoluteUrl(input.path),
    about: input.client ? { '@type': 'Organization', name: input.client } : undefined,
    author: { '@id': absoluteUrl('/#organization') },
    publisher: { '@id': absoluteUrl('/#organization') },
    ...(imageUrl ? { image: imageUrl } : {}),
  }
}

export function jobPostingJsonLd(input: {
  title: string
  description: string
  path: string
  datePosted?: string
  validThrough?: string
  employmentType?: string
  workMode?: string | null
  location?: string
  experienceRequirements?: string | null
  skills?: string[]
}): JsonLd {
  const isRemote = /remote|hybrid/i.test(input.workMode || '')
  return {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    title: input.title,
    description: input.description,
    url: absoluteUrl(input.path),
    datePosted: input.datePosted || new Date().toISOString().slice(0, 10),
    ...(input.validThrough ? { validThrough: input.validThrough } : {}),
    employmentType: mapEmploymentType(input.employmentType),
    hiringOrganization: {
      '@type': 'Organization',
      name: SITE_NAME,
      sameAs: absoluteUrl('/'),
      logo: absoluteUrl('/brand/xel-mark.png'),
    },
    jobLocation: {
      '@type': 'Place',
      address: {
        '@type': 'PostalAddress',
        addressLocality: input.location || 'India',
        addressCountry: 'IN',
      },
    },
    ...(isRemote
      ? {
          jobLocationType: 'TELECOMMUTE',
          applicantLocationRequirements: {
            '@type': 'Country',
            name: 'IN',
          },
        }
      : {}),
    ...(input.experienceRequirements
      ? { experienceRequirements: input.experienceRequirements }
      : {}),
    ...(input.skills?.length ? { skills: input.skills.join(', ') } : {}),
  }
}

function mapEmploymentType(type?: string) {
  const t = (type || '').toLowerCase()
  if (t.includes('intern')) return 'INTERN'
  if (t.includes('contract')) return 'CONTRACTOR'
  if (t.includes('part')) return 'PART_TIME'
  return 'FULL_TIME'
}

export function personJsonLd(input: {
  name: string
  jobTitle?: string
  path?: string
  image?: unknown
  sameAs?: string[]
}): JsonLd {
  const imageUrl = getMediaUrl(input.image as Parameters<typeof getMediaUrl>[0])
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: input.name,
    ...(input.jobTitle ? { jobTitle: input.jobTitle } : {}),
    worksFor: { '@id': absoluteUrl('/#organization') },
    ...(input.path ? { url: absoluteUrl(input.path) } : {}),
    ...(imageUrl ? { image: imageUrl } : {}),
    ...(input.sameAs?.length ? { sameAs: input.sameAs } : {}),
  }
}

export function graphJsonLd(...nodes: (JsonLd | null | undefined)[]): JsonLd {
  const clean = nodes.filter(Boolean) as JsonLd[]
  return {
    '@context': 'https://schema.org',
    '@graph': clean.map((node) => {
      const copy = { ...node }
      delete copy['@context']
      return copy
    }),
  }
}
