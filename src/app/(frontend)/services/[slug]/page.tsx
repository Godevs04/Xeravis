import Link from 'next/link'
import { notFound } from 'next/navigation'

import { CTABand } from '@/blocks/CTABand'
import { FAQAccordion } from '@/blocks/FAQAccordion'
import { RelatedContent } from '@/components/content/RelatedContent'
import { JobCard } from '@/components/domain/JobCard'
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
import { SERVICE_FAQS, SERVICE_OVERVIEW } from '@/lib/service-page-content'
import { SERVICE_CAPABILITIES, SERVICE_PAGE_EXTRAS } from '@/lib/site-ia'
import { breadcrumbJsonLd, buildMetadata, graphJsonLd, serviceJsonLd } from '@/lib/seo'
import { SEED_INDUSTRIES } from '@/seed/content'
import { SERVICE_INDUSTRY_MAP } from '@/seed/relations'

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

type CareerDoc = {
  id: string
  title: string
  slug: string
  department?: string | null
  departmentRef?: { title?: string } | string | null
  location: string
  type: string
  workMode?: string | null
  experienceRequired?: string | null
  openings?: number | null
  postedAt?: string | null
  applicationDeadline?: string | null
  active?: boolean | null
  relatedServices?: RelatedDoc[] | (string | number)[] | null
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

  const overview = SERVICE_OVERVIEW[service.slug]
  const title = service.meta?.title || service.title
  const description =
    service.meta?.description ||
    `${overview?.heroHeadline || service.summary} Delivered by XELARVIS across AI, data science and IT consulting programs.`

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

function industryLabelsFor(serviceSlug: string): string {
  const titles = new Map<string, string>(SEED_INDUSTRIES.map((i) => [i.slug, i.title]))
  const labels = (SERVICE_INDUSTRY_MAP[serviceSlug] || [])
    .map((slug) => titles.get(slug) || slug)
    .filter(Boolean)
  return labels.length ? labels.join(', ') : 'Selected industries based on delivery context'
}

function departmentLabel(job: CareerDoc) {
  if (typeof job.departmentRef === 'object' && job.departmentRef?.title) {
    return job.departmentRef.title
  }
  return job.department || 'General'
}

function careerLinkedToService(job: CareerDoc, serviceId: string, serviceSlug: string): boolean {
  const related = job.relatedServices
  if (!Array.isArray(related) || related.length === 0) return false
  return related.some((item) => {
    if (typeof item === 'string' || typeof item === 'number') {
      return String(item) === serviceId
    }
    if (item && typeof item === 'object') {
      return item.id === serviceId || item.slug === serviceSlug
    }
    return false
  })
}

export default async function ServiceDetailPage({ params }: Props) {
  const { slug } = await params
  const [service, careers] = await Promise.all([
    getPublishedBySlug<ServiceDoc>('services', slug),
    listPublished<CareerDoc>('careers', { sort: '-postedAt', limit: 48, depth: 1 }),
  ])

  if (!service) notFound()

  const overview = SERVICE_OVERVIEW[service.slug]
  const heroUrl = getMediaUrl(service.heroImage as Parameters<typeof getMediaUrl>[0])
  const technologies = asRelatedDocs(service.technologies)
  const capabilities = SERVICE_CAPABILITIES[service.slug] ?? []
  const extras = SERVICE_PAGE_EXTRAS[service.slug]
  const seedFaqs = SERVICE_FAQS[service.slug] ?? []
  const relatedGroups = buildRelatedGroups(service as unknown as Record<string, unknown>)
  const relatedJobs = careers
    .filter((job) => job.active !== false)
    .filter((job) => careerLinkedToService(job, service.id, service.slug))
    .slice(0, 4)

  const jsonLd = graphJsonLd(
    serviceJsonLd({
      name: service.title,
      description: overview?.heroHeadline || service.summary,
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
        subtitle={overview?.heroHeadline || service.summary}
        image={heroUrl || undefined}
        size="compact"
        variant="default"
        ctas={[
          { label: 'Discuss this service', href: '/contact?intent=business', variant: 'accent' },
          { label: 'How We Think', href: '/about/our-approach', variant: 'outline' },
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

      <ServiceAnswerBlock
        title={service.title}
        summary={service.summary}
        whoFor={
          overview?.whoFor ||
          'Technology and business leaders seeking production outcomes from AI, data, and IT consulting.'
        }
        whyChoose={
          overview?.whyChoose ||
          'XELARVIS combines Artificial Intelligence, Data Science, and IT Consulting for production systems.'
        }
        howDeliver={overview?.howDeliver || 'Discover → Design → Build → Deploy → Optimize'}
        industries={extras?.industries?.join(', ') || industryLabelsFor(service.slug)}
        outcomes={
          overview?.outcomes ||
          'Governed delivery, clearer decisions, scalable platforms, and measurable operational outcomes'
        }
      />

      {overview?.helpItems?.length ? (
        <Section surface>
          <Container>
            <h2 className="text-2xl font-bold">What we help organizations do</h2>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {overview.helpItems.map((item) => (
                <li
                  key={item}
                  className="text-primary flex gap-3 rounded-2xl border border-[color:var(--glass-border)] bg-[color:var(--card-bg)] px-4 py-3 text-sm shadow-[var(--shadow-light)]"
                >
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#0D9488]" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            {overview.businessOutcome ? (
              <p className="text-secondary mt-8 max-w-3xl text-sm leading-relaxed sm:text-base">
                <span className="text-primary font-semibold">Business outcome. </span>
                {overview.businessOutcome}
              </p>
            ) : null}
          </Container>
        </Section>
      ) : null}

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
            <h2 className="text-2xl font-bold">How we deliver</h2>
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

      {relatedJobs.length > 0 ? (
        <Section surface>
          <Container>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-muted text-xs font-semibold tracking-[0.12em] uppercase">
                  Careers
                </p>
                <h2 className="text-primary mt-2 text-2xl font-bold">Join the team</h2>
                <p className="text-secondary mt-2 max-w-2xl text-sm">
                  Explore current opportunities related to {service.title}.
                </p>
              </div>
              <Link href="/careers" className="text-accent text-sm font-semibold hover:underline">
                All careers →
              </Link>
            </div>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {relatedJobs.map((job) => (
                <JobCard
                  key={job.id}
                  title={job.title}
                  href={`/careers/${job.slug}`}
                  department={departmentLabel(job)}
                  location={job.location}
                  type={job.type}
                  workMode={job.workMode}
                  experienceRequired={job.experienceRequired}
                  openings={job.openings}
                  postedAt={job.postedAt}
                />
              ))}
            </div>
          </Container>
        </Section>
      ) : null}

      <FAQAccordion heading="Frequently asked questions" seedFaqs={seedFaqs} />

      <CTABand
        heading="Have a business or technology challenge?"
        subheading="Tell us what you are trying to solve. We can help identify the right capabilities, solution approach, technology foundation, and delivery path."
        ctaLabel="Discuss your challenge"
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
