import Link from 'next/link'
import { notFound } from 'next/navigation'

import { CTABand } from '@/blocks/CTABand'
import { FAQAccordion } from '@/blocks/FAQAccordion'
import { TechnologyCard } from '@/components/domain/TechnologyCard'
import { Container } from '@/components/layout/Container'
import { PageHero } from '@/components/layout/PageHero'
import { Section } from '@/components/layout/Section'
import { RichText } from '@/components/RichText'
import { getMediaUrl } from '@/lib/media'
import { getPublishedBySlug, listPublished } from '@/lib/cms'
import { buildMetadata } from '@/lib/seo'

export const revalidate = 60

type RelatedDoc = {
  id: string
  title?: string
  name?: string
  slug?: string
  category?: string | null
  description?: string | null
}

type ServiceDoc = {
  id: string
  title: string
  slug: string
  summary: string
  challenges?: string | null
  body?: unknown
  benefits?: { title: string; description: string }[]
  process?: { title: string; description: string }[]
  technologies?: RelatedDoc[] | (string | number)[]
  relatedFaqs?: RelatedDoc[] | (string | number)[]
  heroImage?: unknown
  meta?: { title?: string; description?: string; image?: unknown }
}

type Props = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  const services = await listPublished<ServiceDoc>('services')
  return services.map((s) => ({ slug: s.slug }))
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const service = await getPublishedBySlug<ServiceDoc>('services', slug)

  if (!service) return buildMetadata({ title: 'Service', path: `/services/${slug}` })

  return buildMetadata({
    title: service.meta?.title || service.title,
    description: service.meta?.description || service.summary,
    image: service.meta?.image || service.heroImage,
    path: `/services/${slug}`,
  })
}

function asRelatedDocs(value: ServiceDoc['technologies']): RelatedDoc[] {
  if (!Array.isArray(value)) return []
  return value.filter((item): item is RelatedDoc => typeof item === 'object' && item !== null)
}

export default async function ServiceDetailPage({ params }: Props) {
  const { slug } = await params
  const service = await getPublishedBySlug<ServiceDoc>('services', slug)

  if (!service) notFound()

  const heroUrl = getMediaUrl(service.heroImage as Parameters<typeof getMediaUrl>[0])
  const technologies = asRelatedDocs(service.technologies)
  const hasFaqs = asRelatedDocs(service.relatedFaqs).length > 0

  return (
    <>
      <PageHero
        eyebrow="Service"
        title={service.title}
        subtitle={service.summary}
        image={heroUrl || undefined}
        size="compact"
        ctas={[{ label: 'Discuss this service', href: '/contact', variant: 'accent' }]}
      />
      {service.challenges ? (
        <Section>
          <Container className="max-w-3xl">
            <h2 className="text-2xl font-bold">Challenges we solve</h2>
            <p className="text-secondary mt-4 leading-relaxed">{service.challenges}</p>
          </Container>
        </Section>
      ) : null}
      <Section surface={!service.challenges}>
        <Container className="max-w-3xl">
          <RichText content={service.body as Parameters<typeof RichText>[0]['content']} />
        </Container>
      </Section>
      {service.benefits && service.benefits.length > 0 ? (
        <Section surface>
          <Container>
            <h2 className="text-2xl font-bold">Key benefits</h2>
            <ul className="mt-8 space-y-6">
              {service.benefits.map((benefit) => (
                <li key={benefit.title} className="border-border border-b pb-6">
                  <h3 className="text-primary font-semibold">{benefit.title}</h3>
                  <p className="text-secondary mt-2">{benefit.description}</p>
                </li>
              ))}
            </ul>
          </Container>
        </Section>
      ) : null}
      {service.process && service.process.length > 0 ? (
        <Section>
          <Container>
            <h2 className="text-2xl font-bold">How we deliver</h2>
            <ol className="mt-8 grid gap-6 md:grid-cols-2">
              {service.process.map((step, index) => (
                <li key={step.title} className="border-border border-l pl-5">
                  <p className="text-muted text-xs font-semibold tracking-[0.12em] uppercase">
                    Step {index + 1}
                  </p>
                  <h3 className="text-primary mt-2 font-semibold">{step.title}</h3>
                  <p className="text-secondary mt-2 text-sm">{step.description}</p>
                </li>
              ))}
            </ol>
          </Container>
        </Section>
      ) : null}
      {technologies.length > 0 ? (
        <Section surface>
          <Container>
            <h2 className="text-2xl font-bold">Technologies</h2>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {technologies.map((tech) => (
                <TechnologyCard
                  key={tech.id}
                  name={tech.title || tech.name || 'Technology'}
                  category={tech.category}
                  description={tech.description}
                />
              ))}
            </div>
          </Container>
        </Section>
      ) : null}
      {hasFaqs ? <FAQAccordion heading="Frequently asked questions" /> : null}
      <CTABand
        heading="Plan your next initiative"
        subheading="Our architects can assess fit, scope, and delivery approach in an introductory session."
        ctaLabel="Talk to us"
        ctaHref="/contact"
      />
      <div className="container-x pb-12">
        <Link href="/services" className="text-accent text-sm font-semibold hover:underline">
          ← All services
        </Link>
      </div>
    </>
  )
}
