import type { ReactNode } from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

import { CTABand } from '@/blocks/CTABand'
import { TeamGrid } from '@/blocks/TeamGrid'
import { Container } from '@/components/layout/Container'
import { Section } from '@/components/layout/Section'
import { SectionHeader } from '@/components/layout/SectionHeader'
import { AnimateIn } from '@/components/motion/AnimateIn'
import { Button } from '@/components/ui/button'
import { SpotlightCard } from '@/components/ui/SpotlightCard'
import { listPublished } from '@/lib/cms'
import { mergePublishedServices } from '@/lib/services-catalog'
import { mergePublishedSolutions } from '@/lib/solutions-catalog'
import { CANONICAL_SOLUTION_SLUGS } from '@/seed/relations'

const WHO_WE_ARE_PILLARS = [
  {
    title: 'AI & Intelligence',
    description: 'Building intelligent systems that turn data into actionable insight.',
  },
  {
    title: 'Data & Analytics',
    description: 'Creating trusted data foundations and advanced analytical capabilities.',
  },
  {
    title: 'Technology & Transformation',
    description: 'Modernizing technology environments and translating strategy into execution.',
  },
]

const DIFFERENTIATORS = [
  {
    title: 'Research-to-Production',
    description:
      'We connect experimentation and research with practical technology implementation.',
  },
  {
    title: 'Outcome-Focused',
    description:
      'We focus on measurable business and operational outcomes rather than technology for its own sake.',
  },
  {
    title: 'Cross-Disciplinary',
    description:
      'AI, data engineering, analytics and technology consulting work together rather than as isolated capabilities.',
  },
  {
    title: 'Domain-Aware',
    description:
      'We apply specialized expertise where domain requirements matter, particularly across healthcare and clinical data.',
  },
]

const HOW_WE_THINK = [
  {
    title: 'Start With the Problem',
    description: 'Technology comes after understanding the business challenge.',
  },
  {
    title: 'Build on Trusted Data',
    description: 'Reliable intelligence starts with reliable data.',
  },
  {
    title: 'Use AI Where It Creates Value',
    description:
      'AI should solve a meaningful problem, not simply be added because it is fashionable.',
  },
  {
    title: 'Engineer for Production',
    description: 'Solutions should be scalable, secure and maintainable.',
  },
  {
    title: 'Measure the Outcome',
    description: 'Success should be evaluated through measurable impact.',
  },
]

/** Display order for About → Capabilities cards (doc §13). */
const ABOUT_CAPABILITY_ORDER = [
  'artificial-intelligence-ai-research',
  'data-science-advanced-analytics',
  'data-engineering-cloud-solutions',
  'it-consulting-digital-transformation',
  'clinical-data-science-healthcare-ai',
] as const

const FEATURED_SOLUTION_SLUGS = [
  'enterprise-ai-solutions',
  'predictive-analytics-solutions',
  'intelligent-automation',
  'healthcare-clinical-intelligence',
] as const

const FEATURED_SOLUTION_LABELS: Record<string, string> = {
  'enterprise-ai-solutions': 'Enterprise AI',
  'predictive-analytics-solutions': 'Predictive Analytics',
  'intelligent-automation': 'Intelligent Automation',
  'healthcare-clinical-intelligence': 'Healthcare & Clinical Intelligence',
}

const CONNECTED_HUBS = [
  { label: 'Capabilities', href: '/services' },
  { label: 'Solutions', href: '/solutions' },
  { label: 'Industries', href: '/industries' },
  { label: 'Research', href: '/ai-research-lab' },
  { label: 'Careers', href: '/careers' },
] as const

type ServiceDoc = {
  id: string
  title: string
  slug: string
  summary: string
  icon?: string | null
}

type SolutionDoc = {
  id: string
  title: string
  slug: string
  summary: string
}

type IndustryDoc = {
  id: string
}

function TextLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-2 text-sm font-semibold text-[color:var(--color-accent)] hover:underline"
    >
      {children}
      <ArrowRight className="h-4 w-4" />
    </Link>
  )
}

export async function AboutPageContent() {
  const [services, solutions, industries] = await Promise.all([
    listPublished<ServiceDoc>('services', { sort: 'order' }),
    listPublished<SolutionDoc>('solutions', { sort: 'order' }),
    listPublished<IndustryDoc>('industries', { sort: 'order', limit: 50 }),
  ])

  const mergedServices = mergePublishedServices(services)
  const bySlug = new Map(mergedServices.map((s) => [s.slug, s]))
  const capabilityItems = ABOUT_CAPABILITY_ORDER.map((slug) => bySlug.get(slug)).filter(
    (s): s is ServiceDoc => Boolean(s),
  )

  const solutionItems = mergePublishedSolutions(solutions)
  const featuredSolutions = FEATURED_SOLUTION_SLUGS.map((slug) =>
    solutionItems.find((s) => s.slug === slug),
  ).filter((s): s is SolutionDoc => Boolean(s))

  const industryCount = industries.length || 11

  const companyFacts = [
    { label: 'Company', value: 'XELARVIS Private Limited' },
    { label: 'Headquarters', value: 'Hyderabad, India' },
    { label: 'Focus', value: 'AI • Data • Technology • Healthcare' },
    { label: 'Core Services', value: String(capabilityItems.length) },
    { label: 'Solution Areas', value: String(CANONICAL_SOLUTION_SLUGS.length) },
    { label: 'Industries', value: String(industryCount) },
  ]

  return (
    <>
      {/* 02 Who We Are */}
      <Section>
        <Container>
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-16">
            <AnimateIn>
              <SectionHeader
                eyebrow="About"
                title="Who we are"
                description="XELARVIS brings together artificial intelligence, data science, data engineering and technology consulting to help organizations build smarter, more scalable and data-driven operations."
              />
              <p className="text-secondary mt-6 max-w-xl text-base leading-relaxed">
                Our work spans AI solutions, advanced analytics, modern data platforms, digital
                transformation and healthcare & clinical data science.
              </p>
              <div className="mt-8">
                <TextLink href="/services">Explore What We Do</TextLink>
              </div>
            </AnimateIn>
            <ul className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
              {WHO_WE_ARE_PILLARS.map((pillar, index) => (
                <AnimateIn key={pillar.title} delay={index * 0.05}>
                  <SpotlightCard className="h-full p-5">
                    <h3 className="font-display text-primary text-base font-semibold">
                      {pillar.title}
                    </h3>
                    <p className="text-secondary mt-2 text-sm leading-relaxed">
                      {pillar.description}
                    </p>
                  </SpotlightCard>
                </AnimateIn>
              ))}
            </ul>
          </div>
        </Container>
      </Section>

      {/* 03 Our Mission */}
      <Section surface>
        <Container className="max-w-3xl">
          <AnimateIn>
            <p className="text-accent text-[11px] font-bold tracking-[0.16em] uppercase">
              Our Mission
            </p>
            <h2 className="font-display mt-4 text-2xl font-bold tracking-tight sm:text-3xl">
              To make advanced technology practical, intelligent and measurable for organizations
              solving complex real-world problems.
            </h2>
            <p className="text-secondary mt-5 text-base leading-relaxed">
              We combine research, engineering and domain expertise to create solutions that move
              beyond experimentation and deliver meaningful business outcomes.
            </p>
            <p className="text-accent mt-6 text-sm font-semibold tracking-wide">
              Research → Technology → Business Outcome
            </p>
          </AnimateIn>
        </Container>
      </Section>

      {/* 04 Our Vision */}
      <Section>
        <Container className="max-w-3xl">
          <AnimateIn>
            <p className="text-accent text-[11px] font-bold tracking-[0.16em] uppercase">
              Our Vision
            </p>
            <h2 className="font-display mt-4 text-2xl font-bold tracking-tight sm:text-3xl">
              To build a technology ecosystem where intelligence, data and innovation create
              measurable progress for organizations and society.
            </h2>
          </AnimateIn>
        </Container>
      </Section>

      {/* 05 What Makes XELARVIS Different */}
      <Section surface>
        <Container>
          <SectionHeader eyebrow="Differentiators" title="What makes XELARVIS different" />
          <ul className="mt-10 grid gap-5 sm:grid-cols-2">
            {DIFFERENTIATORS.map((item, index) => (
              <li key={item.title} className="list-none">
                <AnimateIn delay={index * 0.04}>
                  <SpotlightCard className="h-full p-6">
                    <h3 className="font-display text-primary text-lg font-semibold">
                      {item.title}
                    </h3>
                    <p className="text-secondary mt-3 text-sm leading-relaxed">
                      {item.description}
                    </p>
                  </SpotlightCard>
                </AnimateIn>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      {/* 06 How We Think */}
      <Section>
        <Container>
          <SectionHeader eyebrow="Philosophy" title="How we think" />
          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {HOW_WE_THINK.map((item, index) => (
              <li key={item.title} className="list-none">
                <AnimateIn delay={index * 0.04}>
                  <SpotlightCard className="h-full p-5">
                    <p className="text-muted text-[10px] font-bold tracking-[0.14em] uppercase">
                      {String(index + 1).padStart(2, '0')}
                    </p>
                    <h3 className="font-display text-primary mt-2 text-base font-semibold">
                      {item.title}
                    </h3>
                    <p className="text-secondary mt-2 text-sm leading-relaxed">
                      {item.description}
                    </p>
                  </SpotlightCard>
                </AnimateIn>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      {/* 07 Research Meets Engineering */}
      <Section surface>
        <Container className="max-w-3xl">
          <AnimateIn>
            <SectionHeader
              eyebrow="Research"
              title="Research meets engineering"
              description="XELARVIS explores emerging technologies in artificial intelligence, machine learning, healthcare AI and data science while focusing on their practical application."
            />
            <div className="mt-6">
              <TextLink href="/ai-research-lab">Explore Research & Innovation</TextLink>
            </div>
          </AnimateIn>
        </Container>
      </Section>

      {/* 08 Domain Expertise */}
      <Section>
        <Container className="max-w-3xl">
          <AnimateIn>
            <SectionHeader
              eyebrow="Specialty"
              title="Domain expertise where it matters"
              description="Our healthcare and clinical data capabilities combine data science, statistical programming and clinical data standards to support data-driven healthcare and life-sciences workflows."
            />
            <div className="mt-6">
              <TextLink href="/services/clinical-data-science-healthcare-ai">
                Explore Healthcare & Clinical Data Science
              </TextLink>
            </div>
          </AnimateIn>
        </Container>
      </Section>

      {/* 09 Verified Company Facts */}
      <Section surface>
        <Container>
          <SectionHeader
            eyebrow="Company"
            title="Verified company facts"
            description="Only substantiated information — no placeholder counters or inflated claims."
          />
          <dl className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {companyFacts.map((fact, index) => (
              <AnimateIn key={fact.label} delay={index * 0.03}>
                <div className="rounded-2xl border border-[color:var(--glass-border)] bg-[color:var(--glass-bg)] px-5 py-4">
                  <dt className="text-muted text-[10px] font-bold tracking-[0.14em] uppercase">
                    {fact.label}
                  </dt>
                  <dd className="font-display text-primary mt-2 text-lg font-semibold">
                    {fact.value}
                  </dd>
                </div>
              </AnimateIn>
            ))}
          </dl>
        </Container>
      </Section>

      {/* 10 Leadership */}
      <TeamGrid heading="Leadership" />

      {/* 12 Explore Capabilities — titles only, Learn More links */}
      <Section surface>
        <Container>
          <SectionHeader eyebrow="Capabilities" title="Explore our capabilities" />
          <ul className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {capabilityItems.map((service, index) => (
              <li key={service.slug} className="list-none">
                <AnimateIn delay={index * 0.04}>
                  <Link href={`/services/${service.slug}`} className="block h-full">
                    <SpotlightCard className="flex h-full items-center justify-between gap-4 p-5 transition hover:border-[color:var(--color-accent)]">
                      <h3 className="font-display text-primary text-base font-semibold">
                        {service.title}
                      </h3>
                      <span className="text-accent shrink-0 text-sm font-semibold">Learn more</span>
                    </SpotlightCard>
                  </Link>
                </AnimateIn>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      {/* 13 Explore Solutions */}
      <Section>
        <Container>
          <SectionHeader eyebrow="Solutions" title="Solutions built around business challenges" />
          <ul className="mt-10 grid gap-3 sm:grid-cols-2">
            {featuredSolutions.map((solution, index) => (
              <li key={solution.slug} className="list-none">
                <AnimateIn delay={index * 0.04}>
                  <Link href={`/solutions/${solution.slug}`} className="block h-full">
                    <SpotlightCard className="flex h-full items-center justify-between gap-4 p-5 transition hover:border-[color:var(--color-accent)]">
                      <h3 className="font-display text-primary text-lg font-semibold">
                        {FEATURED_SOLUTION_LABELS[solution.slug] ?? solution.title}
                      </h3>
                      <span className="text-accent shrink-0 text-sm font-semibold">Learn more</span>
                    </SpotlightCard>
                  </Link>
                </AnimateIn>
              </li>
            ))}
          </ul>
          <div className="mt-8">
            <TextLink href="/solutions">Explore All Solutions</TextLink>
          </div>
        </Container>
      </Section>

      {/* CMS connections — Services, Solutions, Industries, Research, Careers */}
      <Section surface>
        <Container>
          <SectionHeader
            eyebrow="Explore"
            title="Connected pathways"
            description="About connects to the hubs where XELARVIS capabilities, solutions and sector context come together."
          />
          <ul className="mt-8 flex flex-wrap gap-3">
            {CONNECTED_HUBS.map((hub) => (
              <li key={hub.href} className="list-none">
                <Link
                  href={hub.href}
                  className="inline-flex rounded-full border border-[color:var(--glass-border)] bg-[color:var(--glass-bg)] px-4 py-2 text-sm font-semibold text-[color:var(--color-primary)] transition hover:border-[color:var(--color-accent)] hover:text-[color:var(--color-accent)]"
                >
                  {hub.label}
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      {/* 14 Careers */}
      <Section>
        <Container>
          <AnimateIn>
            <div className="bg-dark rounded-[var(--radius-hero)] px-8 py-14 text-white md:px-14 md:py-16">
              <p className="text-sm font-semibold tracking-[0.2em] text-white/60 uppercase">
                Careers
              </p>
              <h2 className="font-display mt-4 max-w-2xl text-2xl font-bold tracking-tight sm:text-3xl">
                Build the Future With Us
              </h2>
              <p className="mt-4 max-w-xl text-base leading-relaxed text-white/70">
                We are building a team across AI, data science, engineering, consulting and
                healthcare technology.
              </p>
              <Button asChild variant="primary" className="mt-8 rounded-full">
                <Link href="/careers">Explore Careers</Link>
              </Button>
            </div>
          </AnimateIn>
        </Container>
      </Section>

      {/* 15 Final CTA */}
      <CTABand
        heading="Have a Complex Technology Challenge?"
        subheading="Let's explore how AI, data and technology can create measurable value for your organization."
        ctaLabel="Start a Conversation"
        ctaHref="/contact?intent=business"
      />
    </>
  )
}
