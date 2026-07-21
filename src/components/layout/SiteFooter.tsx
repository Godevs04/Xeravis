import Link from 'next/link'

import { Container } from '@/components/layout/Container'
import { NewsletterForm } from '@/components/forms/NewsletterForm'
import { Separator } from '@/components/ui/separator'
import { getGlobal } from '@/lib/cms'
import { BRAND, DEFAULT_FOOTER } from '@/lib/fallback-data'

type FooterGlobal = {
  columns?: { title: string; links: { label: string; href: string }[] }[]
  showNewsletter?: boolean
  copyright?: string
}

type SiteSettingsGlobal = {
  siteName?: string
  tagline?: string
  social?: {
    linkedin?: string
    twitter?: string
    github?: string
    youtube?: string
  }
}

export async function SiteFooter() {
  const [footer, settings] = await Promise.all([
    getGlobal<FooterGlobal>('footer'),
    getGlobal<SiteSettingsGlobal>('site-settings'),
  ])

  const columns = footer?.columns?.length ? footer.columns : DEFAULT_FOOTER.columns
  const showNewsletter = footer?.showNewsletter ?? DEFAULT_FOOTER.showNewsletter
  const copyright = footer?.copyright || DEFAULT_FOOTER.copyright
  const tagline = settings?.tagline || BRAND.tagline

  return (
    <footer className="border-t border-border bg-dark text-white">
      <Container className="py-16 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_2fr]">
          <div className="space-y-4">
            <Link href="/" className="text-xl font-bold tracking-tight">
              Xelarvis
            </Link>
            <p className="max-w-sm text-sm leading-relaxed text-white/70">{tagline}</p>
            {showNewsletter && (
              <div className="pt-4">
                <p className="mb-3 text-sm font-semibold">Stay informed</p>
                <NewsletterForm variant="dark" />
              </div>
            )}
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {columns.map((column) => (
              <div key={column.title}>
                <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-white/90">{column.title}</h3>
                <ul className="space-y-3">
                  {column.links.map((link) => (
                    <li key={link.href}>
                      <Link href={link.href} className="text-sm text-white/65 transition-colors hover:text-white">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <Separator className="my-10 bg-white/10" />
        <div className="flex flex-col gap-4 text-sm text-white/60 sm:flex-row sm:items-center sm:justify-between">
          <p>{copyright}</p>
          <div className="flex gap-6">
            <Link href="/privacy-policy" className="hover:text-white">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-white">
              Terms
            </Link>
            <Link href="/contact" className="hover:text-white">
              Contact
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  )
}
