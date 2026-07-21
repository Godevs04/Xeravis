import { ContactForm } from '@/components/forms/ContactForm'
import { Container } from '@/components/layout/Container'
import { PageHero } from '@/components/layout/PageHero'
import { Section } from '@/components/layout/Section'
import { getGlobal } from '@/lib/cms'
import { FALLBACK_CONTACT, FALLBACK_OFFICES } from '@/lib/fallback-data'
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
}

export const metadata = buildMetadata({
  title: 'Contact',
  description: 'Get in touch with Xelarvis Technologies for enterprise engineering enquiries.',
  path: '/contact',
})

export default async function ContactPage() {
  const [offices, contact] = await Promise.all([
    getGlobal<OfficeGlobal>('office-locations'),
    getGlobal<ContactGlobal>('contact-details'),
  ])

  const locations = offices?.locations?.length ? offices.locations : FALLBACK_OFFICES.locations
  const details = { ...FALLBACK_CONTACT, ...contact }

  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Let's discuss your next initiative."
        subtitle="Share your goals and we will connect you with the right specialists."
        size="compact"
      />
      <Section>
        <Container className="grid gap-16 lg:grid-cols-[1fr_22rem]">
          <ContactForm />
          <aside className="space-y-10">
            <div>
              <h2 className="text-lg font-semibold">Direct</h2>
              <ul className="mt-4 space-y-2 text-sm text-secondary">
                {details.email && (
                  <li>
                    <a href={`mailto:${details.email}`} className="hover:text-accent">
                      {details.email}
                    </a>
                  </li>
                )}
                {details.phone && <li>{details.phone}</li>}
                {details.whatsapp && (
                  <li>
                    <a href={details.whatsapp.startsWith('http') ? details.whatsapp : `https://wa.me/${details.whatsapp}`} className="hover:text-accent">
                      WhatsApp
                    </a>
                  </li>
                )}
              </ul>
            </div>
            <div>
              <h2 className="text-lg font-semibold">Offices</h2>
              <ul className="mt-4 space-y-6">
                {locations.map((office) => (
                  <li key={office.name} className="text-sm text-secondary">
                    <p className="font-semibold text-primary">{office.name}</p>
                    <p className="mt-1 whitespace-pre-line">{office.address}</p>
                    <p>
                      {office.city}, {office.country}
                    </p>
                    {office.hours && <p className="mt-1 text-muted">{office.hours}</p>}
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </Container>
      </Section>
    </>
  )
}
