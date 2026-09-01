import Link from 'next/link'
import { notFound } from 'next/navigation'

import { CTABand } from '@/blocks/CTABand'
import { FAQAccordion } from '@/blocks/FAQAccordion'
import { HubLinkStrip } from '@/components/content/HubLinkStrip'
import { RelatedContent } from '@/components/content/RelatedContent'
import { TechnologyCard } from '@/components/domain/TechnologyCard'
import { Container } from '@/components/layout/Container'
import { PageHero } from '@/components/layout/PageHero'
import { Section } from '@/components/layout/Section'
import { RichText } from '@/components/RichText'
import { getPublishedBySlug, listPublished } from '@/lib/cms'
import { FALLBACK_SERVICES, FALLBACK_SOLUTIONS } from '@/lib/fallback-data'
import { buildRelatedGroups } from '@/lib/related-content'
import { resolveLinkedServices } from '@/lib/solution-service-links'
import { buildMetadata, breadcrumbJsonLd, graphJsonLd } from '@/lib/seo'
import { JsonLd } from '@/components/seo/JsonLd'

export const revalidate = 60

type RelatedTech = {
  id: string
  title?: string
  name?: string
  slug?: string
  category?: string | null
  description?: string | null
}

type SolutionDoc = {
  id: string
  title: string
  slug: string
  summary: string
  body?: unknown
  businessChallenges?: { title?: string; description?: string }[] | null
  useCases?: { title?: string; description?: string }[] | null
  outcomes?: { title?: string; description?: string }[] | null
  whoIsThisFor?: string | null
  technologies?: RelatedTech[] | (string | number)[]
  relatedServices?: unknown
  relatedIndustries?: unknown
  relatedCaseStudies?: unknown
  relatedResearch?: unknown
  relatedInsights?: unknown
  relatedFaqs?: unknown
  meta?: { title?: string; description?: string; image?: unknown }
}

type Props = { params: Promise<{ slug: string }> }

function asRelatedTechs(value: SolutionDoc['technologies']): RelatedTech[] {
  if (!Array.isArray(value)) return []
  return value.filter((item): item is RelatedTech => typeof item === 'object' && item !== null)
}

export async function generateStaticParams() {
  const solutions = await listPublished<SolutionDoc>('solutions')
  const slugs = solutions.length ? solutions : FALLBACK_SOLUTIONS
  return slugs.map((s) => ({ slug: s.slug }))
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const solution = await getPublishedBySlug<SolutionDoc>('solutions', slug)
  const fallback = FALLBACK_SOLUTIONS.find((s) => s.slug === slug)

  return buildMetadata({
    title: solution?.meta?.title || solution?.title || fallback?.title,
    description: solution?.meta?.description || solution?.summary || fallback?.summary,
    image: solution?.meta?.image,
    path: `/solutions/${slug}`,
  })
}

export default async function SolutionDetailPage({ params }: Props) {
  const { slug } = await params
  const [solution, services] = await Promise.all([
    getPublishedBySlug<SolutionDoc>('solutions', slug),
    listPublished<{ id: string; title: string; slug: string; summary: string }>('services', {
      sort: 'order',
    }),
  ])
  const fallback = FALLBACK_SOLUTIONS.find((s) => s.slug === slug)

  if (!solution && !fallback) notFound()

  const doc = solution || {
    ...fallback!,
    body: {
      root: {
        children: [{ type: 'paragraph', children: [{ type: 'text', text: fallback!.summary }] }],
      },
    },
  }

  const serviceCatalog = services.length ? services : FALLBACK_SERVICES
  const linkedServices = resolveLinkedServices(slug, doc.relatedServices, serviceCatalog)
  const docForRelated = {
    ...(doc as unknown as Record<string, unknown>),
    relatedServices: linkedServices,
  }

  const technologies = asRelatedTechs(doc.technologies)
  const relatedGroups = buildRelatedGroups(
    docForRelated,
    { services: 6 },
    { omitTitles: ['Services'] },
  )
  const serviceNames = linkedServices.map((s) => s.title).join(', ')
  const seedFaqs = [
    {
      question: `Who is ${doc.title} for?`,
      answer:
        doc.whoIsThisFor ||
        'Organizations that need a governed path from business problem to production outcomes across AI, data, and IT consulting.',
    },
    {
      question: 'Which XELARVIS services deliver this solution?',
      answer: serviceNames
        ? `${doc.title} is delivered through our ${serviceNames} practice areas—combining the capabilities needed for discovery, build, and production operations.`
        : 'This solution combines AI, Data Science, IT Consulting, and engineering services from the XELARVIS catalog.',
    },
    {
      question: 'What is the typical starting point?',
      answer:
        'We begin with Discover in the XELARVIS Delivery Framework—aligning problem, data readiness, and success criteria before architecture and build.',
    },
  ]

  const jsonLd = graphJsonLd(
    breadcrumbJsonLd([
      { name: 'Home', path: '/' },
      { name: 'Solutions', path: '/solutions' },
      { name: doc.title, path: `/solutions/${slug}` },
    ]),
  )

  return (
    <>
      <JsonLd id="solution-jsonld" data={jsonLd} />
      <PageHero eyebrow="Solution" title={doc.title} subtitle={doc.summary} size="compact" />

      {doc.businessChallenges && doc.businessChallenges.length > 0 ? (
        <Section>
          <Container>
            <h2 className="text-2xl font-bold">Problem</h2>
            <ul className="mt-8 grid gap-6 md:grid-cols-2">
              {doc.businessChallenges.map((item, i) => (
                <li key={item.title || i} className="border-border border-b pb-6">
                  <h3 className="text-primary font-semibold">{item.title}</h3>
                  {item.description ? (
                    <p className="text-secondary mt-2 text-sm">{item.description}</p>
                  ) : null}
                </li>
              ))}
            </ul>
          </Container>
        </Section>
      ) : null}

      <Section surface={Boolean(doc.businessChallenges?.length)}>
        <Container className="max-w-3xl">
          <h2 className="text-2xl font-bold">Solution</h2>
          <div className="mt-6">
            <RichText content={doc.body as Parameters<typeof RichText>[0]['content']} />
          </div>
        </Container>
      </Section>

      {linkedServices.length > 0 ? (
        <HubLinkStrip
          eyebrow="Practice areas"
          heading="Delivered through our services"
          subheading="This solution combines the following XELARVIS service capabilities—each links to how we staff, engineer, and govern delivery."
          surface
          items={linkedServices.map((s) => ({
            href: `/services/${s.slug}`,
            label: s.title,
            description: s.summary || undefined,
          }))}
          viewAll={{ href: '/services', label: 'All services →' }}
        />
      ) : null}

      {doc.useCases && doc.useCases.length > 0 ? (
        <Section>
          <Container>
            <h2 className="text-2xl font-bold">Use cases</h2>
            <ul className="mt-8 grid gap-6 md:grid-cols-2">
              {doc.useCases.map((item, i) => (
                <li key={item.title || i} className="border-border border-b pb-6">
                  <h3 className="text-primary font-semibold">{item.title}</h3>
                  {item.description ? (
                    <p className="text-secondary mt-2 text-sm">{item.description}</p>
                  ) : null}
                </li>
              ))}
            </ul>
          </Container>
        </Section>
      ) : null}

      {doc.outcomes && doc.outcomes.length > 0 ? (
        <Section surface>
          <Container>
            <h2 className="text-2xl font-bold">Outcomes</h2>
            <ul className="mt-8 grid gap-6 md:grid-cols-2">
              {doc.outcomes.map((item, i) => (
                <li key={item.title || i} className="border-border border-b pb-6">
                  <h3 className="text-primary font-semibold">{item.title}</h3>
                  {item.description ? (
                    <p className="text-secondary mt-2 text-sm">{item.description}</p>
                  ) : null}
                </li>
              ))}
            </ul>
          </Container>
        </Section>
      ) : null}

      {technologies.length > 0 ? (
        <Section>
          <Container>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-muted text-xs font-semibold tracking-[0.12em] uppercase">
                  Technology stack
                </p>
                <h2 className="text-primary mt-2 text-2xl font-bold">Built for this solution</h2>
              </div>
              <Link
                href="/technologies"
                className="text-accent text-sm font-semibold hover:underline"
              >
                All technologies →
              </Link>
            </div>
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

      {doc.whoIsThisFor ? (
        <Section surface>
          <Container className="max-w-3xl">
            <h2 className="text-2xl font-bold">Who is this for?</h2>
            <p className="text-secondary mt-4 leading-relaxed whitespace-pre-line">
              {doc.whoIsThisFor}
            </p>
          </Container>
        </Section>
      ) : null}

      <RelatedContent heading="Industries, evidence & insights" groups={relatedGroups} />

      <FAQAccordion heading="Frequently asked questions" seedFaqs={seedFaqs} />

      <CTABand
        heading="Start a solution assessment"
        subheading="We will map capabilities, timeline, and team structure for your context."
        ctaLabel="Contact us"
        ctaHref="/contact?intent=business"
      />
      <div className="container-x pb-12">
        <Link href="/solutions" className="text-accent text-sm font-semibold hover:underline">
          ← All solutions
        </Link>
      </div>
    </>
  )
}
