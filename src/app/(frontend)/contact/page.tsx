import { Suspense } from 'react'
import { ExternalLink } from 'lucide-react'

import { ContactForm } from '@/components/forms/ContactForm'
import { Container } from '@/components/layout/Container'
import { PageHero } from '@/components/layout/PageHero'
import { Section } from '@/components/layout/Section'
import { getGlobal } from '@/lib/cms'
import { CONTACT_INTENTS } from '@/lib/site-ia'
import { buildMetadata } from '@/lib/seo'

export const revalidate = 60

type OfficeGlobal = {
  locations?: {
    name: string
    address: string
    city: string
    country: string
    hours?: string | null
  }[]
}

type ContactGlobal = {
  email?: string | null
  phone?: string | null
  whatsapp?: string | null
  hours?: string | null
  mapEmbedUrl?: string | null
  mapEmbed?: string | null
}

type SocialGlobal = {
  linkedin?: string | null
  instagram?: string | null
  facebook?: string | null
  youtube?: string | null
  twitter?: string | null
  github?: string | null
}

export const metadata = buildMetadata({
  title: 'Contact XELARVIS',
  description:
    "Let's solve your next data, AI or technology challenge. Talk with XELARVIS about Artificial Intelligence, Data Science, IT Consulting, data platforms or Healthcare specialty programs.",
  path: '/contact',
})

function extractIframeSrc(html: string | null | undefined): string | null {
  if (!html) return null
  const match = html.match(/src=["']([^"']+)["']/i)
  return match?.[1] ?? null
}

export default async function ContactPage() {
  const [offices, contact, social] = await Promise.all([
    getGlobal<OfficeGlobal>('office-locations'),
    getGlobal<ContactGlobal>('contact-details'),
    getGlobal<SocialGlobal>('social-media'),
  ])

  const locations = offices?.locations ?? []
  const details = contact ?? {}
  const mapSrc = details.mapEmbedUrl || extractIframeSrc(details.mapEmbed)

  const socialLinks = [
    { label: 'LinkedIn', href: social?.linkedin },
    { label: 'X / Twitter', href: social?.twitter },
    { label: 'Instagram', href: social?.instagram },
    { label: 'Facebook', href: social?.facebook },
    { label: 'YouTube', href: social?.youtube },
    { label: 'GitHub', href: social?.github },
  ].filter((item): item is { label: string; href: string } => Boolean(item.href))

  return (
    <>
      <PageHero
        brand="Xelarvis"
        eyebrow="Contact"
        title="Let's solve your next data, AI or technology challenge."
        subtitle="Tell us about your challenge across AI, data science, IT consulting, digital transformation, data engineering, healthcare specialty work, research or partnership."
        size="compact"
      />
      <Section>
        <Container className="grid gap-10 lg:grid-cols-[1fr_22rem] lg:gap-12">
          <Suspense
            fallback={
              <div className="h-64 animate-pulse rounded-[28px] border border-[color:var(--glass-border-soft)] bg-[color:var(--card-bg)]" />
            }
          >
            <div className="rounded-[32px] border border-[color:var(--glass-border-soft)] bg-[color:var(--card-bg)] p-6 shadow-[var(--shadow-floating)] backdrop-blur-2xl sm:p-8 lg:p-10">
              <ContactForm />
            </div>
          </Suspense>
          <aside className="space-y-6">
            <div className="rounded-[28px] border border-[color:var(--glass-border-soft)] bg-[color:var(--card-bg)] p-6 shadow-[var(--shadow-medium)] backdrop-blur-xl">
              <h2 className="text-lg font-semibold">Enquiry types</h2>
              <ul className="mt-4 space-y-3">
                {CONTACT_INTENTS.map((item) => (
                  <li key={item.value}>
                    <a
                      href={`/contact?intent=${item.value}`}
                      className="text-secondary hover:text-accent block text-sm transition-colors"
                    >
                      <span className="text-primary font-medium">{item.label}</span>
                      <span className="text-muted mt-0.5 block text-xs">{item.description}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-[28px] border border-[color:var(--glass-border-soft)] bg-[color:var(--card-bg)] p-6 shadow-[var(--shadow-medium)] backdrop-blur-xl">
              <h2 className="text-lg font-semibold">Direct</h2>
              <ul className="text-secondary mt-4 space-y-2 text-sm">
                {details.email ? (
                  <li>
                    <a href={`mailto:${details.email}`} className="hover:text-accent">
                      {details.email}
                    </a>
                  </li>
                ) : null}
                {details.phone ? <li>{details.phone}</li> : null}
                {details.whatsapp ? (
                  <li>
                    <a
                      href={
                        details.whatsapp.startsWith('http')
                          ? details.whatsapp
                          : `https://wa.me/${details.whatsapp}`
                      }
                      className="hover:text-accent"
                    >
                      WhatsApp
                    </a>
                  </li>
                ) : null}
                {details.hours ? <li className="text-muted">{details.hours}</li> : null}
              </ul>
            </div>
            {locations.length > 0 ? (
              <div className="rounded-[28px] border border-[color:var(--glass-border-soft)] bg-[color:var(--card-bg)] p-6 shadow-[var(--shadow-medium)] backdrop-blur-xl">
                <h2 className="text-lg font-semibold">Offices</h2>
                <ul className="mt-4 space-y-6">
                  {locations.map((office) => (
                    <li key={office.name} className="text-secondary text-sm">
                      <p className="text-primary font-semibold">{office.name}</p>
                      <p className="mt-1 whitespace-pre-line">{office.address}</p>
                      <p>
                        {office.city}, {office.country}
                      </p>
                      {office.hours ? <p className="text-muted mt-1">{office.hours}</p> : null}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
            {socialLinks.length > 0 ? (
              <div className="rounded-[28px] border border-[color:var(--glass-border-soft)] bg-[color:var(--card-bg)] p-6 shadow-[var(--shadow-medium)] backdrop-blur-xl">
                <h2 className="text-lg font-semibold">Social</h2>
                <ul className="mt-4 space-y-2 text-sm">
                  {socialLinks.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noreferrer"
                        className="text-secondary hover:text-accent inline-flex items-center gap-1.5 transition-colors"
                      >
                        {link.label}
                        <ExternalLink className="h-3.5 w-3.5" aria-hidden />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </aside>
        </Container>
      </Section>
      {mapSrc ? (
        <Section surface>
          <Container>
            <h2 className="mb-6 text-lg font-semibold">Location</h2>
            <div className="overflow-hidden rounded-[28px] border border-[color:var(--glass-border-soft)] shadow-[var(--shadow-medium)]">
              <iframe
                title="Office location map"
                src={mapSrc}
                className="h-80 w-full border-0 md:h-[28rem]"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
          </Container>
        </Section>
      ) : null}
    </>
  )
}
