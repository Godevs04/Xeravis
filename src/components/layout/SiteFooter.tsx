import Link from '@/components/ui/link'
import { ArrowRight, Rss } from 'lucide-react'

import { BrandLogo } from '@/components/brand/BrandLogo'
import { Container } from '@/components/layout/Container'
import { NewsletterForm } from '@/components/forms/NewsletterForm'
import { getGlobal } from '@/lib/cms'
import { BRAND, DEFAULT_FOOTER, FALLBACK_CONTACT } from '@/lib/fallback-data'
import { SOCIAL_PROFILES } from '@/lib/seo'

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

type ContactGlobal = {
  email?: string | null
  phone?: string | null
}

const FALLBACK_SOCIAL = {
  linkedin: SOCIAL_PROFILES.find((url) => url.includes('linkedin.com')) || '',
  twitter: SOCIAL_PROFILES.find((url) => url.includes('x.com')) || 'https://x.com/xelarvis_ai',
} as const

export async function SiteFooter() {
  const [footer, settings, contact] = await Promise.all([
    getGlobal<FooterGlobal>('footer'),
    getGlobal<SiteSettingsGlobal>('site-settings'),
    getGlobal<ContactGlobal>('contact-details'),
  ])
  const email = contact?.email || FALLBACK_CONTACT.email
  const phone = contact?.phone || FALLBACK_CONTACT.phone

  const columns = footer?.columns?.length ? footer.columns : DEFAULT_FOOTER.columns
  const showNewsletter = footer?.showNewsletter ?? DEFAULT_FOOTER.showNewsletter
  const copyright = footer?.copyright || DEFAULT_FOOTER.copyright
  const tagline = settings?.tagline || BRAND.tagline
  const social = {
    linkedin: settings?.social?.linkedin || FALLBACK_SOCIAL.linkedin,
    twitter: settings?.social?.twitter || FALLBACK_SOCIAL.twitter,
    github: settings?.social?.github || '',
    youtube: settings?.social?.youtube || '',
  }

  return (
    <footer className="relative overflow-hidden border-t border-[color:var(--glass-border-soft)]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(13,148,136,0.12),transparent_55%)]"
      />
      <div
        aria-hidden
        className="via-accent/40 pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent to-transparent"
      />
      <Container className="relative py-16 lg:py-20">
        <div className="mb-14 grid gap-10 lg:grid-cols-[1.3fr_1fr] lg:items-end">
          <div>
            <p className="font-display text-primary text-2xl font-semibold tracking-[-0.03em] sm:text-3xl">
              Talk to XELARVIS
            </p>
            <p className="text-secondary mt-3 max-w-md text-base">{tagline}</p>
            <div className="text-secondary mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
              <a href={`mailto:${email}`} className="hover:text-accent">
                {email}
              </a>
              <a href={`tel:${phone.replace(/[^\d+]/g, '')}`} className="hover:text-accent">
                {phone}
              </a>
              <Link
                href="/contact"
                className="text-accent inline-flex items-center gap-1.5 font-semibold underline-offset-4 hover:underline"
              >
                Contact us
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </div>
          </div>
          {showNewsletter ? (
            <div className="glass-strong rounded-[28px] p-6 sm:p-8">
              <p className="font-display mb-1 text-lg font-semibold">Insights by email</p>
              <p className="text-secondary mb-4 text-sm">
                Occasional notes on applied AI, data science and IT modernization.
              </p>
              <NewsletterForm />
              <a
                href="/feed.xml"
                className="text-muted hover:text-accent mt-4 inline-flex items-center gap-1.5 text-xs font-medium"
              >
                <Rss className="h-3.5 w-3.5" aria-hidden />
                Subscribe via RSS
              </a>
            </div>
          ) : null}
        </div>

        <div className="grid gap-12 border-t border-[color:var(--glass-border-soft)] pt-14 lg:grid-cols-[1fr_2fr]">
          <div>
            <BrandLogo
              variant="footer"
              wordmark="Xelarvis Technologies"
              size={48}
              wordmarkClassName="text-[1.15rem] sm:text-xl"
            />
            <div className="mt-6 flex flex-wrap gap-3">
              {social?.linkedin ? (
                <a
                  href={social.linkedin}
                  className="text-secondary hover:border-accent/30 hover:text-primary rounded-full border border-[color:var(--glass-border-soft)] bg-[color:var(--glass-bg)] px-3.5 py-1.5 text-sm backdrop-blur-md transition-colors"
                  target="_blank"
                  rel="noreferrer"
                >
                  LinkedIn
                </a>
              ) : null}
              {social?.twitter ? (
                <a
                  href={social.twitter}
                  className="text-secondary hover:border-accent/30 hover:text-primary rounded-full border border-[color:var(--glass-border-soft)] bg-[color:var(--glass-bg)] px-3.5 py-1.5 text-sm backdrop-blur-md transition-colors"
                  target="_blank"
                  rel="noreferrer"
                >
                  X
                </a>
              ) : null}
              {social?.github ? (
                <a
                  href={social.github}
                  className="text-secondary hover:border-accent/30 hover:text-primary rounded-full border border-[color:var(--glass-border-soft)] bg-[color:var(--glass-bg)] px-3.5 py-1.5 text-sm backdrop-blur-md transition-colors"
                  target="_blank"
                  rel="noreferrer"
                >
                  GitHub
                </a>
              ) : null}
              {social?.youtube ? (
                <a
                  href={social.youtube}
                  className="text-secondary hover:border-accent/30 hover:text-primary rounded-full border border-[color:var(--glass-border-soft)] bg-[color:var(--glass-bg)] px-3.5 py-1.5 text-sm backdrop-blur-md transition-colors"
                  target="_blank"
                  rel="noreferrer"
                >
                  YouTube
                </a>
              ) : null}
            </div>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {columns.map((column) => (
              <div key={column.title}>
                <h2 className="text-muted mb-4 text-xs font-semibold tracking-[0.14em] uppercase">
                  {column.title}
                </h2>
                <ul className="space-y-3">
                  {column.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-secondary hover:text-accent text-sm transition-colors"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="text-muted mt-16 flex flex-col gap-4 border-t border-[color:var(--glass-border-soft)] pt-8 text-sm sm:flex-row sm:items-center sm:justify-between">
          <p>{copyright}</p>
          <div className="flex flex-wrap gap-6">
            <Link href="/privacy-policy" className="hover:text-primary">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-primary">
              Terms
            </Link>
            <Link href="/contact" className="hover:text-primary">
              Contact
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  )
}
