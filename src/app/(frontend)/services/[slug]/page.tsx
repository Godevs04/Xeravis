import Link from 'next/link'
import { notFound } from 'next/navigation'

import { CTABand } from '@/blocks/CTABand'
import { FAQAccordion } from '@/blocks/FAQAccordion'
import { TechnologyCard } from '@/components/domain/TechnologyCard'
import { Breadcrumb } from '@/components/layout/Breadcrumb'
import { Container } from '@/components/layout/Container'
import { PageHero } from '@/components/layout/PageHero'
import { Section } from '@/components/layout/Section'
import { RelatedLinks } from '@/components/seo/RelatedLinks'
import { ServiceAnswerBlock } from '@/components/seo/ServiceAnswerBlock'
import { JsonLd } from '@/components/seo/JsonLd'
import { ServiceDetailNarrative } from '@/components/services/ServiceDetailNarrative'
import { RichText } from '@/components/RichText'
import { getMediaUrl } from '@/lib/media'
import { getPublishedBySlug, listPublished } from '@/lib/cms'
import { SERVICE_CAPABILITIES } from '@/lib/site-ia'
import { breadcrumbJsonLd, buildMetadata, graphJsonLd, serviceJsonLd } from '@/lib/seo'
import { relatedLinksForService, serviceFaqsFor } from '@/lib/seo-content'

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

  const title = service.meta?.title || service.title
  const description =
    service.meta?.description ||
    `${service.summary} Delivered by Xelarvis for healthcare and enterprise teams.`

  return buildMetadata({
    title,
    description,
    image: service.meta?.image || service.heroImage,
    path: `/services/${slug}`,
    keywords: [
      service.title,
      'Healthcare AI',
      'Enterprise AI',
      'Xelarvis',
      'Clinical Intelligence',
      'Cloud Engineering',
    ],
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
  const hasCmsFaqs = asRelatedDocs(service.relatedFaqs).length > 0
  const capabilities = SERVICE_CAPABILITIES[service.slug] ?? []
  const seedFaqs = serviceFaqsFor(service.title, service.summary)

  const jsonLd = graphJsonLd(
    serviceJsonLd({
      name: service.title,
      description: service.summary,
      path: `/services/${slug}`,
      image: service.meta?.image || service.heroImage,
      serviceType: service.title,
    }),
    breadcrumbJsonLd([
      { name: 'Home', path: '/' },
      { name: 'Services', path: '/services' },
      { name: service.title, path: `/services/${slug}` },
    ]),
  )

  return (
    <>
      <JsonLd id="service-jsonld" data={jsonLd} />
      <PageHero
        eyebrow="Service"
        title={service.title}
        subtitle={service.summary}
        image={heroUrl || undefined}
        size="compact"
        ctas={[
          { label: 'Discuss this service', href: '/contact?intent=business', variant: 'accent' },
        ]}
      />
      <Container className="pt-4">
        <Breadcrumb
          items={[
            { label: 'Home', href: '/' },
            { label: 'Services', href: '/services' },
            { label: service.title },
          ]}
        />
      </Container>

      <ServiceAnswerBlock title={service.title} summary={service.summary} />

      {capabilities.length > 0 ? (
        <Section>
          <Container>
            <h2 className="text-2xl font-bold">Capabilities</h2>
            <ul className="mt-6 flex flex-wrap gap-2">
              {capabilities.map((cap) => (
                <li
                  key={cap}
                  className="rounded-full border border-[color:var(--glass-border)] bg-[color:var(--glass-bg)] px-3.5 py-1.5 text-sm text-[color:var(--color-primary)]"
                >
                  {cap}
                </li>
              ))}
            </ul>
          </Container>
        </Section>
      ) : null}

      <ServiceDetailNarrative challenges={service.challenges} benefits={service.benefits}>
        {service.body ? (
          <RichText content={service.body as Parameters<typeof RichText>[0]['content']} />
        ) : null}
      </ServiceDetailNarrative>

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
            <h2 className="text-2xl font-bold">Technology stack</h2>
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

      <FAQAccordion
        heading="Frequently asked questions"
        seedFaqs={hasCmsFaqs ? seedFaqs.slice(0, 3) : seedFaqs}
      />

      <RelatedLinks links={relatedLinksForService(service.slug)} />

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
