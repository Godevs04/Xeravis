import { Inter } from 'next/font/google'
import type { Metadata } from 'next'

import { SkipLink } from '@/components/layout/SkipLink'
import { SiteFooter } from '@/components/layout/SiteFooter'
import { SiteHeader } from '@/components/layout/SiteHeader'
import { buildMetadata, organizationJsonLd } from '@/lib/seo'

import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = buildMetadata({})

export default function FrontendLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = organizationJsonLd()

  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen bg-background font-sans antialiased">
        <SkipLink />
        <SiteHeader />
        <main id="main">{children}</main>
        <SiteFooter />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </body>
    </html>
  )
}
