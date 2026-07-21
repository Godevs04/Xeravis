import Link from 'next/link'

import { ServiceCard } from '@/components/domain/ServiceCard'
import { Container } from '@/components/layout/Container'
import { Section } from '@/components/layout/Section'
import { AnimateIn } from '@/components/motion/AnimateIn'
import { Button } from '@/components/ui/button'
import { listPublished } from '@/lib/cms'
import { FALLBACK_SERVICES } from '@/lib/fallback-data'

type ServiceDoc = {
  id: string
  title: string
  slug: string
  summary: string
  icon?: string | null
}

type ServicesGridProps = {
  heading: string
  subheading?: string | null
}

export async function ServicesGrid({ heading, subheading }: ServicesGridProps) {
  const services = await listPublished<ServiceDoc>('services', { limit: 6 })
  const items = services.length ? services : FALLBACK_SERVICES

  return (
    <Section surface>
      <Container>
        <AnimateIn className="max-w-2xl">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{heading}</h2>
          {subheading && <p className="mt-4 text-lg text-secondary">{subheading}</p>}
        </AnimateIn>
        <div className="mt-12 divide-y divide-border border-t border-border">
          {items.map((service, index) => (
            <AnimateIn key={service.id} delay={index * 0.05}>
              <ServiceCard
                title={service.title}
                summary={service.summary}
                href={`/services/${service.slug}`}
                icon={service.icon}
              />
            </AnimateIn>
          ))}
        </div>
        <div className="mt-10">
          <Button asChild variant="outline">
            <Link href="/services">View all services</Link>
          </Button>
        </div>
      </Container>
    </Section>
  )
}
