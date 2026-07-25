import { Inter, Plus_Jakarta_Sans, Space_Grotesk } from 'next/font/google'
import type { Metadata, Viewport } from 'next'

import { AmbientBackground } from '@/components/layout/AmbientBackground'
import { SkipLink } from '@/components/layout/SkipLink'
import { SiteFooter } from '@/components/layout/SiteFooter'
import { SiteHeader } from '@/components/layout/SiteHeader'
import { buildMetadata, organizationJsonLd } from '@/lib/seo'
import { AppProviders } from '@/providers'

import './globals.css'

const display = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
  weight: ['500', '600', '700'],
})

const body = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
})

export const metadata: Metadata = buildMetadata({})

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#6d5ef9' },
    { media: '(prefers-color-scheme: dark)', color: '#0c0a14' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  viewportFit: 'cover',
  colorScheme: 'light dark',
}

export default function FrontendLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = organizationJsonLd()

  return (
    <html
      lang="en"
      className={`${display.variable} ${body.variable} ${inter.variable}`}
      suppressHydrationWarning
    >
      <body className="text-primary relative min-h-screen bg-transparent font-sans antialiased">
        <AppProviders>
          <AmbientBackground />
          <SkipLink />
          <SiteHeader />
          <main id="main" className="relative">
            {children}
          </main>
          <SiteFooter />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          />
        </AppProviders>
      </body>
    </html>
  )
}
