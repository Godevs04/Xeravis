import Link from 'next/link'

import { BrandLogo } from '@/components/brand/BrandLogo'
import { Container } from '@/components/layout/Container'
import { NewsletterForm } from '@/components/forms/NewsletterForm'
import { getGlobal } from '@/lib/cms'
import { BRAND, DEFAULT_FOOTER } from '@/lib/fallback-data'
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

const FALLBACK_SOCIAL = {
  linkedin: SOCIAL_PROFILES.find((url) => url.includes('linkedin.com')) || '',
  twitter: SOCIAL_PROFILES.find((url) => url.includes('x.com')) || 'https://x.com/xelarvis_ai',
} as const

export async function SiteFooter() {
  const [footer, settings] = await Promise.all([
    getGlobal<FooterGlobal>('footer'),
    getGlobal<SiteSettingsGlobal>('site-settings'),
  ])

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
      <Container className="relative py-20 lg:py-28">
        <div className="mb-16 grid gap-10 lg:grid-cols-[1.3fr_1fr] lg:items-end">
          <div>
            <p className="font-display text-primary text-[clamp(2.5rem,6vw,4.5rem)] leading-[0.95] font-bold tracking-[-0.05em]">
              Build what
              <br />
              <span className="text-gradient">matters.</span>
            </p>
            <p className="text-secondary mt-6 max-w-md text-base">{tagline}</p>
            <Link
              href="/contact"
              className="bg-accent mt-8 inline-flex h-12 items-center rounded-full px-7 text-sm font-semibold text-white shadow-[0_12px_32px_var(--color-accent-glow)] transition-transform hover:-translate-y-0.5"
            >
              Start a project
            </Link>
          </div>
          {showNewsletter ? (
            <div className="glass-strong rounded-[28px] p-6 sm:p-8">
              <p className="font-display mb-1 text-lg font-semibold">Stay ahead</p>
              <p className="text-secondary mb-4 text-sm">
                Product notes, architecture essays, and shipping updates.
              </p>
              <NewsletterForm />
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
                <h3 className="text-muted mb-4 text-xs font-semibold tracking-[0.14em] uppercase">
                  {column.title}
                </h3>
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
            <Link href="/admin" className="hover:text-accent font-medium">
              CMS Login
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  )
}
