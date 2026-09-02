import Link from 'next/link'

import { CTABand } from '@/blocks/CTABand'
import { HubLinkStrip } from '@/components/content/HubLinkStrip'
import { Container } from '@/components/layout/Container'
import { Section } from '@/components/layout/Section'
import { ServicesPageHero } from '@/components/marketing/PageHeroes'
import { ServicesIndexSection } from '@/components/services/ServicesIndexSection'
import { listPublished } from '@/lib/cms'
import { FALLBACK_INDUSTRIES } from '@/lib/fallback-data'
import { mergePublishedServices } from '@/lib/services-catalog'
import { buildMetadata } from '@/lib/seo'

export const revalidate = 60

type ServiceDoc = {
  id: string
  title: string
  slug: string
  summary: string
  icon?: string | null
  order?: number | null
}

type IndustryDoc = {
  id: string
  title: string
  slug: string
  summary: string
  tier?: string | null
}

type TechDoc = {
  id: string
  title?: string | null
  name?: string | null
  slug: string
  category?: string | null
  description?: string | null
}

type CaseDoc = {
  id: string
  title: string
  slug: string
  outcome?: string | null
  client?: string | null
}

type ResearchDoc = {
  id: string
  title: string
  slug: string
  excerpt?: string | null
}

type BlogDoc = {
  id: string
  title: string
  slug: string
  excerpt?: string | null
}

export const metadata = buildMetadata({
  title: 'Artificial Intelligence, Data Science & IT Consulting Services',
  description:
    'Artificial Intelligence, Data Science & Analytics, IT Consulting & Digital Transformation, Data Engineering & Cloud, and Healthcare & Clinical Data Science—engineered for measurable business outcomes.',
  path: '/services',
  keywords: [
    'Artificial Intelligence',
    'Data Science',
    'IT Consulting',
    'Digital Transformation',
    'Data Engineering',
    'Healthcare AI Specialty',
    'Xelarvis Services',
  ],
})

const HOW_TOGETHER = [
  {
    title: 'Services define how we work',
    body: 'Practice areas—AI, Data Science, IT Consulting, Data Engineering, and Healthcare specialty—shape methods, governance, and delivery teams.',
  },
  {
    title: 'Solutions define what we solve',
    body: 'Outcome themes such as Enterprise AI, predictive analytics, or data platforms package services into business-ready programs.',
  },
  {
    title: 'Industries shape context',
    body: 'Sector realities—regulation, scale, and operating models—guide architecture choices and success criteria.',
  },
]

export default async function ServicesPage() {
  const [services, industries, technologies, caseStudies, research, blogs] = await Promise.all([
    listPublished<ServiceDoc>('services', { sort: 'order' }),
    listPublished<IndustryDoc>('industries', { sort: 'order', limit: 12 }),
    listPublished<TechDoc>('technologies', { sort: 'order', limit: 12 }),
    listPublished<CaseDoc>('case-studies', { limit: 3 }),
    listPublished<ResearchDoc>('research', { limit: 3 }),
    listPublished<BlogDoc>('blogs', { limit: 3 }),
  ])

  const items = mergePublishedServices(services)
  const industryItems = (industries.length ? industries : FALLBACK_INDUSTRIES)
    .filter((i) => {
      const tier = 'tier' in i && i.tier ? String(i.tier) : '3'
      return tier === '1' || tier === '2'
    })
    .slice(0, 6)

  return (
    <>
      <ServicesPageHero
        title="Our Capabilities"
        subtitle="Artificial Intelligence, Data Science & Analytics, IT Consulting & Digital Transformation, Data Engineering & Cloud—plus Healthcare & Life Sciences as specialized expertise."
      />
      <ServicesIndexSection services={items} />

      <Section surface>
        <Container>
          <p className="text-xs font-semibold tracking-[0.14em] text-[color:var(--color-accent)] uppercase">
            How capabilities work together
          </p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-[color:var(--color-primary)] md:text-3xl">
            Services, solutions, and industries in one delivery model
          </h2>
          <p className="mt-3 max-w-2xl text-sm text-[color:var(--color-secondary)] sm:text-base">
            Services are how we work. Solutions are what we solve. Industries are where we apply
            them—connected through the XELARVIS Delivery Framework.
          </p>
          <ul className="mt-10 grid gap-6 md:grid-cols-3">
            {HOW_TOGETHER.map((item) => (
              <li
                key={item.title}
                className="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--glass-bg)] p-5"
              >
                <h3 className="font-semibold text-[color:var(--color-primary)]">{item.title}</h3>
                <p className="mt-2 text-sm text-[color:var(--color-secondary)]">{item.body}</p>
              </li>
            ))}
          </ul>
          <div className="mt-8 flex flex-wrap gap-4 text-sm font-semibold">
            <Link href="/solutions" className="text-[color:var(--color-accent)] hover:underline">
              Browse solutions →
            </Link>
            <Link
              href="/about/our-approach"
              className="text-[color:var(--color-accent)] hover:underline"
            >
              Delivery Framework →
            </Link>
          </div>
        </Container>
      </Section>

      <HubLinkStrip
        eyebrow="Industries"
        heading="Where capabilities meet sector context"
        subheading="Primary sectors we support with AI, data science, and IT consulting programs."
        items={industryItems.map((i) => ({
          href: `/industries/${i.slug}`,
          label: i.title,
          description: i.summary,
        }))}
        viewAll={{ href: '/industries', label: 'All industries →' }}
      />

      <HubLinkStrip
        eyebrow="Technology ecosystem"
        heading="Engineering stack behind delivery"
        subheading="Cloud, data, AI, and DevOps tools—shown in capability context, not as a vanity catalog."
        surface
        items={technologies.slice(0, 6).map((t) => ({
          href: `/technologies#${t.slug}`,
          label: t.title || t.name || t.slug,
          description: t.description || t.category || undefined,
        }))}
        viewAll={{ href: '/technologies', label: 'Full stack →' }}
      />

      <HubLinkStrip
        eyebrow="Case studies"
        heading="Evidence from delivery"
        items={caseStudies.map((c) => ({
          href: `/case-studies/${c.slug}`,
          label: c.title,
          description: c.outcome || c.client || undefined,
        }))}
        viewAll={{ href: '/case-studies', label: 'All case studies →' }}
      />

      <HubLinkStrip
        eyebrow="Research"
        heading="Methods that inform practice"
        surface
        items={research.map((r) => ({
          href: `/research/${r.slug}`,
          label: r.title,
          description: r.excerpt || undefined,
        }))}
        viewAll={{ href: '/ai-research-lab', label: 'Research & Innovation →' }}
      />

      <HubLinkStrip
        eyebrow="Insights"
        heading="Perspective from the practice"
        items={blogs.map((b) => ({
          href: `/blog/${b.slug}`,
          label: b.title,
          description: b.excerpt || undefined,
        }))}
        viewAll={{ href: '/insights', label: 'All insights →' }}
      />

      <CTABand
        heading="Map capabilities to your initiative"
        subheading="Tell us the business problem—we will align services, solutions, and a governed delivery path."
        ctaLabel="Talk to XELARVIS"
        ctaHref="/contact?intent=business"
      />
    </>
  )
}
