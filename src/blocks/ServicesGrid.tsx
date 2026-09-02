import Link from 'next/link'

import { ServiceCard } from '@/components/domain/ServiceCard'
import { Container } from '@/components/layout/Container'
import { Section } from '@/components/layout/Section'
import { SectionHeader } from '@/components/layout/SectionHeader'
import { AnimateIn } from '@/components/motion/AnimateIn'
import { Button } from '@/components/ui/button'
import { listPublished } from '@/lib/cms'
import { mergePublishedServices } from '@/lib/services-catalog'
import { cn } from '@/lib/utils'

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

const CHIP_SETS = [
  ['Cloud', 'K8s', 'IaC'],
  ['React', 'Node', 'API'],
  ['AI', 'LLM', 'Data'],
  ['Security', 'SOC2', 'Zero-trust'],
  ['Mobile', 'PWA', 'Edge'],
  ['CMS', 'Search', 'CDN'],
]

export async function ServicesGrid({ heading, subheading }: ServicesGridProps) {
  const services = await listPublished<ServiceDoc>('services', { limit: 6 })
  const items = mergePublishedServices(services)

  return (
    <Section surface>
      <Container>
        <SectionHeader
          eyebrow="Capabilities"
          title={heading}
          description={subheading}
          action={
            <Button asChild variant="outline" className="rounded-full">
              <Link href="/services">View all services</Link>
            </Button>
          }
        />

        <div className="mt-12 grid auto-rows-[minmax(260px,auto)] gap-4 sm:grid-cols-2 lg:grid-cols-6 lg:gap-5">
          {items.map((service, index) => {
            const span =
              index === 0
                ? 'lg:col-span-3 lg:row-span-1'
                : index === 1
                  ? 'lg:col-span-3'
                  : index === 2
                    ? 'lg:col-span-2'
                    : index === 3
                      ? 'lg:col-span-2'
                      : index === 4
                        ? 'lg:col-span-2'
                        : 'lg:col-span-3'

            return (
              <AnimateIn
                key={service.id}
                delay={index * 0.05}
                className={cn('min-w-0', span, index === 5 && 'lg:col-span-3')}
              >
                <ServiceCard
                  title={service.title}
                  summary={service.summary}
                  href={`/services/${service.slug}`}
                  icon={service.icon}
                  chips={CHIP_SETS[index % CHIP_SETS.length]}
                  metric={index < 2 ? 'Flagship' : 'Core'}
                  className="h-full"
                />
              </AnimateIn>
            )
          })}
        </div>
      </Container>
    </Section>
  )
}
