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
    <Section>
      <Container>
        <AnimateIn className="max-w-2xl">
          <p className="text-accent mb-3 text-sm font-semibold tracking-[0.16em] uppercase">
            Capabilities
          </p>
          <h2 className="font-display text-[length:var(--text-h2)] font-bold tracking-tight">
            {heading}
          </h2>
          {subheading ? <p className="text-secondary mt-4 text-lg">{subheading}</p> : null}
        </AnimateIn>

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
          {items.map((service, index) => (
            <AnimateIn key={service.id} delay={index * 0.06}>
              <ServiceCard
                title={service.title}
                summary={service.summary}
                href={`/services/${service.slug}`}
                icon={service.icon}
                className="h-full"
              />
            </AnimateIn>
          ))}
        </div>

        <AnimateIn className="mt-12">
          <Button asChild variant="outline" className="rounded-full">
            <Link href="/services">View all services</Link>
          </Button>
        </AnimateIn>
      </Container>
    </Section>
  )
}
