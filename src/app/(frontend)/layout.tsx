import { Manrope, Plus_Jakarta_Sans } from 'next/font/google'
import type { Metadata, Viewport } from 'next'
import type { ReactNode } from 'react'

import { PageviewBeacon } from '@/components/analytics/PageviewBeacon'
import { TrackingScripts } from '@/components/analytics/TrackingScripts'
import { AmbientBackground } from '@/components/layout/AmbientBackground'
import { CookieBanner } from '@/components/layout/CookieBanner'
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
import { getGlobal } from '@/lib/cms'
import type {
  CookieBanner as CookieBannerGlobal,
  SeoDefault,
} from '@/payload/generated-types/payload-types'
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

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getGlobal<SeoDefault>('seo-defaults')
  const base = buildMetadata({
    title: '',
    description: seo?.defaultDescription?.trim() || DEFAULT_DESCRIPTION,
    path: '/',
  })
  const handle = seo?.twitterHandle?.trim()
  return {
    ...base,
    twitter: handle ? { ...base.twitter, site: handle, creator: handle } : base.twitter,
    verification: {
      google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || undefined,
    },
  }
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

export default async function FrontendLayout({ children }: { children: ReactNode }) {
  const jsonLd = graphJsonLd(organizationJsonLd(), websiteJsonLd())
  const cookieBanner = await getGlobal<CookieBannerGlobal>('cookie-banner')
  const cookieMessage = cookieBanner?.enabled ? cookieBanner.message?.trim() : undefined

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
          {cookieMessage ? (
            <CookieBanner
              message={cookieMessage}
              policyHref={cookieBanner?.policyHref}
              acceptLabel={cookieBanner?.acceptLabel}
            />
          ) : null}
          <JsonLd id="site-graph-jsonld" data={jsonLd} />
        </AppProviders>
      </body>
    </html>
  )
}
