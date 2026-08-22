import { Manrope, Plus_Jakarta_Sans } from 'next/font/google'
import type { Metadata, Viewport } from 'next'
import type { ReactNode } from 'react'

import { PageviewBeacon } from '@/components/analytics/PageviewBeacon'
import { TrackingScripts } from '@/components/analytics/TrackingScripts'
import { AmbientBackground } from '@/components/layout/AmbientBackground'
import { SiteFooter } from '@/components/layout/SiteFooter'
import { SiteHeader } from '@/components/layout/SiteHeader'
import { SkipLink } from '@/components/layout/SkipLink'
import { JsonLd } from '@/components/seo/JsonLd'
import {
  buildMetadata,
  DEFAULT_DESCRIPTION,
  graphJsonLd,
  organizationJsonLd,
  websiteJsonLd,
} from '@/lib/seo'
import { AppProviders } from '@/providers'

import './globals.css'

/** Display — Manrope (enterprise tech) */
const display = Manrope({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
  weight: ['600', '700'],
  preload: true,
})

/** Body — Plus Jakarta Sans */
const body = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
  weight: ['400', '500', '600'],
  preload: true,
})

export const metadata: Metadata = {
  ...buildMetadata({
    title: '',
    description: DEFAULT_DESCRIPTION,
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
  // Keep single scheme — Payload Critical-CH is stripped in next.config; avoid dual scheme re-negotiation.
  colorScheme: 'light',
}

export default function FrontendLayout({ children }: { children: ReactNode }) {
  const jsonLd = graphJsonLd(organizationJsonLd(), websiteJsonLd())

  return (
    <html lang="en" className={`${display.variable} ${body.variable}`} suppressHydrationWarning>
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
