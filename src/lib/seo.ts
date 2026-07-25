import type { Metadata } from 'next'

import { absoluteUrl, getSiteURL } from '@/lib/utils'
import { getMediaUrl } from '@/lib/media'

const SITE_NAME = 'Xelarvis Technologies'
const DEFAULT_DESCRIPTION =
  'Engineering Digital Excellence. Enterprise software, cloud, and AI solutions from Xelarvis Technologies.'

type MetaInput = {
  title?: string | null
  description?: string | null
  image?: unknown
  path?: string
  noIndex?: boolean
}

export function buildMetadata({
  title,
  description,
  image,
  path = '',
  noIndex = false,
}: MetaInput): Metadata {
  const pageTitle = title
    ? `${title} · ${SITE_NAME}`
    : `${SITE_NAME} · Engineering Digital Excellence`
  const pageDescription = description || DEFAULT_DESCRIPTION
  const imageUrl = getMediaUrl(image as Parameters<typeof getMediaUrl>[0])
  const url = absoluteUrl(path)

  return {
    metadataBase: new URL(getSiteURL()),
    title: pageTitle,
    description: pageDescription,
    applicationName: 'Xelarvis',
    appleWebApp: {
      capable: true,
      statusBarStyle: 'default',
      title: 'Xelarvis',
    },
    formatDetection: {
      telephone: false,
    },
    icons: {
      icon: [
        { url: '/icons/favicon-16.png', sizes: '16x16', type: 'image/png' },
        { url: '/icons/favicon-32.png', sizes: '32x32', type: 'image/png' },
        { url: '/icons/icon.svg', type: 'image/svg+xml' },
      ],
      apple: [{ url: '/icons/site-192.png', sizes: '192x192', type: 'image/png' }],
      shortcut: ['/icons/site-192.png'],
    },
    manifest: '/manifest.webmanifest',
    other: {
      'mobile-web-app-capable': 'yes',
    },
    alternates: { canonical: url },
    openGraph: {
      type: 'website',
      url,
      siteName: SITE_NAME,
      title: pageTitle,
      description: pageDescription,
      ...(imageUrl ? { images: [{ url: imageUrl }] } : {}),
    },
    twitter: {
      card: imageUrl ? 'summary_large_image' : 'summary',
      title: pageTitle,
      description: pageDescription,
      ...(imageUrl ? { images: [imageUrl] } : {}),
    },
    robots: noIndex ? { index: false, follow: false } : { index: true, follow: true },
  }
}

export function organizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: absoluteUrl('/'),
    logo: absoluteUrl('/favicon.ico'),
    description: DEFAULT_DESCRIPTION,
    sameAs: [],
  }
}

export function articleJsonLd(input: {
  title: string
  description: string
  path: string
  datePublished?: string
  image?: unknown
}) {
  const imageUrl = getMediaUrl(input.image as Parameters<typeof getMediaUrl>[0])
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: input.title,
    description: input.description,
    url: absoluteUrl(input.path),
    datePublished: input.datePublished,
    publisher: organizationJsonLd(),
    ...(imageUrl ? { image: [imageUrl] } : {}),
  }
}
