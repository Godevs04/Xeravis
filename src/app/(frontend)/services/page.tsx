import Link from 'next/link'

import { ServicesPageHero } from '@/components/marketing/PageHeroes'
import { Container } from '@/components/layout/Container'
import { Section } from '@/components/layout/Section'
import { AnimateIn } from '@/components/motion/AnimateIn'
import { listPublished } from '@/lib/cms'
import { FALLBACK_SERVICES } from '@/lib/fallback-data'
import { buildMetadata } from '@/lib/seo'

export const revalidate = 60

type ServiceDoc = {
  id: string
  title: string
  slug: string
  summary: string
  icon?: string | null
}

export const metadata = buildMetadata({
  title: 'Services',
  description:
    'AI research, data science, IT consulting, clinical data science, and cloud data platforms from XELARVIS.',
  path: '/services',
})

export default async function ServicesPage() {
  const services = await listPublished<ServiceDoc>('services', { sort: 'order' })
  const items = services.length ? services : FALLBACK_SERVICES

  return (
    <>
      <ServicesPageHero
        title="Our Core Services"
        subtitle="Artificial Intelligence, Data Science, IT Consulting, Clinical Data Science, and Cloud Data platforms — engineered for measurable outcomes."
      />
      <Section>
        <Container>
          <ul className="divide-y divide-[color:var(--color-navy)]/10 border-t border-[color:var(--color-navy)]/10">
            {items.map((service, index) => (
              <AnimateIn key={service.id} delay={index * 0.04}>
                <li>
                  <Link
                    href={`/services/${service.slug}`}
                    className="group grid gap-3 py-10 transition-[padding] hover:pl-2 lg:grid-cols-[4rem_1fr_1.2fr]"
                  >
                    <span className="font-display text-sm tracking-[0.14em] text-teal-600">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <h2 className="font-display text-2xl font-semibold tracking-[-0.03em] text-[color:var(--color-navy)] group-hover:text-teal-700 sm:text-3xl">
                      {service.title}
                    </h2>
                    <p className="max-w-xl text-sm leading-relaxed text-slate-600 lg:justify-self-end">
                      {service.summary}
                    </p>
                  </Link>
                </li>
              </AnimateIn>
            ))}
          </ul>
        </Container>
      </Section>
    </>
  )
}
