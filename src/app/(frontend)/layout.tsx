import { Inter, Plus_Jakarta_Sans, Space_Grotesk } from 'next/font/google'
import type { Metadata, Viewport } from 'next'

import { TrackingScripts } from '@/components/analytics/TrackingScripts'
import { AmbientBackground } from '@/components/layout/AmbientBackground'
import { SkipLink } from '@/components/layout/SkipLink'
import { SiteFooter } from '@/components/layout/SiteFooter'
import { SiteHeader } from '@/components/layout/SiteHeader'
import { PageviewBeacon } from '@/components/analytics/PageviewBeacon'
import { JsonLd } from '@/components/seo/JsonLd'
import { buildMetadata, graphJsonLd, organizationJsonLd, websiteJsonLd } from '@/lib/seo'
import { AppProviders } from '@/providers'

import './globals.css'

const display = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
  weight: ['500', '600', '700'],
  preload: true,
})

const body = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
  preload: true,
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
  preload: false,
})

export const metadata: Metadata = {
  ...buildMetadata({
    title: 'Healthcare AI & Enterprise Engineering',
    description:
      'Xelarvis delivers Healthcare AI, clinical intelligence, enterprise AI, cloud engineering, and data platforms for hospitals, life sciences, and regulated enterprises.',
    path: '/',
  }),
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || undefined,
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#0D9488' },
    { media: '(prefers-color-scheme: dark)', color: '#020617' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  viewportFit: 'cover',
  colorScheme: 'light dark',
}

export default function FrontendLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = graphJsonLd(organizationJsonLd(), websiteJsonLd())

  return (
    <html
      lang="en"
      className={`${display.variable} ${body.variable} ${inter.variable}`}
      suppressHydrationWarning
    >
      <head>
        <link rel="preconnect" href="https://res.cloudinary.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
        <link rel="preconnect" href="https://www.googletagmanager.com" crossOrigin="anonymous" />
      </head>
      <body className="text-primary relative min-h-screen bg-transparent font-sans antialiased">
        <AppProviders>
          <AmbientBackground />
          <SkipLink />
          <SiteHeader />
          <main id="main" className="relative">
            {children}
          </main>
          <SiteFooter />
          <PageviewBeacon />
          <TrackingScripts />
          <JsonLd id="site-graph-jsonld" data={jsonLd} />
        </AppProviders>
      </body>
    </html>
  )
}
