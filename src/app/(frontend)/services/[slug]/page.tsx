import Link from 'next/link'
import { notFound } from 'next/navigation'

import { CTABand } from '@/blocks/CTABand'
import { FAQAccordion } from '@/blocks/FAQAccordion'
import { RelatedContent } from '@/components/content/RelatedContent'
import { TechnologyCard } from '@/components/domain/TechnologyCard'
import { Breadcrumb } from '@/components/layout/Breadcrumb'
import { Container } from '@/components/layout/Container'
import { PageHero } from '@/components/layout/PageHero'
import { Section } from '@/components/layout/Section'
import { ServiceAnswerBlock } from '@/components/seo/ServiceAnswerBlock'
import { JsonLd } from '@/components/seo/JsonLd'
import { ServiceDetailNarrative } from '@/components/services/ServiceDetailNarrative'
import { RichText } from '@/components/RichText'
import { getMediaUrl } from '@/lib/media'
import { getPublishedBySlug, listPublished } from '@/lib/cms'
import { buildRelatedGroups } from '@/lib/related-content'
import { SERVICE_CAPABILITIES, SERVICE_PAGE_EXTRAS } from '@/lib/site-ia'
import { breadcrumbJsonLd, buildMetadata, graphJsonLd, serviceJsonLd } from '@/lib/seo'
import { serviceFaqsFor } from '@/lib/seo-content'

export const revalidate = 60

type RelatedDoc = {
  id: string
  title?: string
  name?: string
  slug?: string
  category?: string | null
  description?: string | null
  summary?: string | null
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
  relatedSolutions?: RelatedDoc[] | (string | number)[]
  relatedIndustries?: RelatedDoc[] | (string | number)[]
  relatedCaseStudies?: RelatedDoc[] | (string | number)[]
  relatedResearch?: RelatedDoc[] | (string | number)[]
  relatedInsights?: RelatedDoc[] | (string | number)[]
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
    `${service.summary} Delivered by XELARVIS across AI, data science and IT consulting programs.`

  return buildMetadata({
    title,
    description,
    image: service.meta?.image || service.heroImage,
    path: `/services/${slug}`,
    keywords: [
      service.title,
      'Artificial Intelligence',
      'Data Science',
      'IT Consulting',
      'Xelarvis',
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
  const extras = SERVICE_PAGE_EXTRAS[service.slug]
  const seedFaqs = serviceFaqsFor(service.title, service.summary)
  const relatedGroups = buildRelatedGroups(service as unknown as Record<string, unknown>)

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
          { label: 'Our Approach', href: '/about/our-approach', variant: 'outline' },
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

      <ServiceDetailNarrative challenges={service.challenges} benefits={service.benefits}>
        {service.body ? (
          <RichText content={service.body as Parameters<typeof RichText>[0]['content']} />
        ) : null}
      </ServiceDetailNarrative>

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

      {service.process && service.process.length > 0 ? (
        <Section surface>
          <Container>
            <h2 className="text-2xl font-bold">Approach</h2>
            <p className="text-secondary mt-3 max-w-2xl text-sm sm:text-base">
              How we move from business problem to governed delivery for this service.
            </p>
            <ol className="mt-8 grid gap-6 md:grid-cols-2">
              {service.process.map((step, index) => (
                <li key={step.title} className="border-border border-l pl-5">
                  <p className="text-muted text-xs font-semibold tracking-[0.12em] uppercase">
                    {String(index + 1).padStart(2, '0')}
                  </p>
                  <h3 className="text-primary mt-2 font-semibold">{step.title}</h3>
                  <p className="text-secondary mt-2 text-sm">{step.description}</p>
                </li>
              ))}
            </ol>
          </Container>
        </Section>
      ) : null}

      {extras?.deliverables?.length ? (
        <Section>
          <Container>
            <h2 className="text-2xl font-bold">Deliverables</h2>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {extras.deliverables.map((item) => (
                <li
                  key={item}
                  className="text-primary flex gap-3 rounded-2xl border border-[color:var(--glass-border)] bg-[color:var(--glass-bg)] px-4 py-3 text-sm"
                >
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#0D9488]" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Container>
        </Section>
      ) : null}

      {extras?.outcomes?.length ? (
        <Section surface>
          <Container>
            <h2 className="text-2xl font-bold">Outcomes</h2>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {extras.outcomes.map((item) => (
                <li
                  key={item}
                  className="text-primary flex gap-3 rounded-2xl border border-[color:var(--glass-border)] bg-[color:var(--card-bg)] px-4 py-3 text-sm shadow-[var(--shadow-light)]"
                >
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#0891B2]" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Container>
        </Section>
      ) : null}

      {technologies.length > 0 ? (
        <Section>
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

      <RelatedContent heading="Explore related capabilities" groups={relatedGroups} />

      <FAQAccordion
        heading="Frequently asked questions"
        seedFaqs={hasCmsFaqs ? seedFaqs.slice(0, 3) : seedFaqs}
      />

      <CTABand
        heading="Plan your next initiative"
        subheading="Tell us about the business problem—our team will map services, solutions and a delivery path."
        ctaLabel="Talk to XELARVIS"
        ctaHref="/contact?intent=business"
      />
      <div className="container-x pb-12">
        <Link href="/services" className="text-accent text-sm font-semibold hover:underline">
          ← All services
        </Link>
      </div>
    </>
  )
}
