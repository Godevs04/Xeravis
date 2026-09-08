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
import {
  ABOUT_CAPABILITY_ORDER,
  CAREERS_CTA,
  COMPANY_FACTS_STATIC,
  CONNECTED_HUBS,
  DIFFERENTIATORS,
  FEATURED_SOLUTION_LABELS,
  FEATURED_SOLUTION_SLUGS,
  FINAL_CTA,
  HEALTHCARE_SPECIALTY,
  HOW_WE_THINK,
  MISSION,
  RESEARCH,
  VISION,
  WHO_WE_ARE,
} from '@/lib/about-content'
import { listPublished } from '@/lib/cms'
import { mergePublishedServices } from '@/lib/services-catalog'
import { mergePublishedSolutions } from '@/lib/solutions-catalog'
import { CANONICAL_SOLUTION_SLUGS } from '@/seed/relations'

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
    { label: 'Company', value: COMPANY_FACTS_STATIC.company },
    { label: 'Headquarters', value: COMPANY_FACTS_STATIC.headquarters },
    { label: 'Focus', value: COMPANY_FACTS_STATIC.focus },
    { label: 'Core Services', value: String(capabilityItems.length) },
    { label: 'Solution Areas', value: String(CANONICAL_SOLUTION_SLUGS.length) },
    { label: 'Industries', value: String(industryCount) },
  ]

  return (
    <>
      <Section>
        <Container>
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-16">
            <AnimateIn>
              <SectionHeader
                eyebrow="About"
                title={WHO_WE_ARE.title}
                description={WHO_WE_ARE.intro}
              />
              <p className="text-secondary mt-6 max-w-xl text-base leading-relaxed">
                {WHO_WE_ARE.span}
              </p>
              <div className="mt-8">
                <TextLink href={WHO_WE_ARE.cta.href}>{WHO_WE_ARE.cta.label}</TextLink>
              </div>
            </AnimateIn>
            <ul className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
              {WHO_WE_ARE.pillars.map((pillar, index) => (
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

      <Section surface>
        <Container className="max-w-3xl">
          <AnimateIn>
            <p className="text-accent text-[11px] font-bold tracking-[0.16em] uppercase">
              {MISSION.title}
            </p>
            <h2 className="font-display mt-4 text-2xl font-bold tracking-tight sm:text-3xl">
              {MISSION.statement}
            </h2>
            <p className="text-secondary mt-5 text-base leading-relaxed">{MISSION.detail}</p>
            <p className="text-accent mt-6 text-sm font-semibold tracking-wide">
              {MISSION.positioning}
            </p>
          </AnimateIn>
        </Container>
      </Section>

      <Section>
        <Container className="max-w-3xl">
          <AnimateIn>
            <p className="text-accent text-[11px] font-bold tracking-[0.16em] uppercase">
              {VISION.title}
            </p>
            <h2 className="font-display mt-4 text-2xl font-bold tracking-tight sm:text-3xl">
              {VISION.statement}
            </h2>
          </AnimateIn>
        </Container>
      </Section>

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

      <Section surface>
        <Container className="max-w-3xl">
          <AnimateIn>
            <SectionHeader eyebrow="Research" title={RESEARCH.title} description={RESEARCH.body} />
            <div className="mt-6">
              <TextLink href={RESEARCH.cta.href}>{RESEARCH.cta.label}</TextLink>
            </div>
          </AnimateIn>
        </Container>
      </Section>

      <Section>
        <Container className="max-w-3xl">
          <AnimateIn>
            <SectionHeader
              eyebrow="Specialty"
              title={HEALTHCARE_SPECIALTY.title}
              description={HEALTHCARE_SPECIALTY.body}
            />
            <div className="mt-6">
              <TextLink href={HEALTHCARE_SPECIALTY.cta.href}>
                {HEALTHCARE_SPECIALTY.cta.label}
              </TextLink>
            </div>
          </AnimateIn>
        </Container>
      </Section>

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

      <TeamGrid heading="Leadership" />

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

      <Section>
        <Container>
          <AnimateIn>
            <div className="bg-dark rounded-[var(--radius-hero)] px-8 py-14 text-white md:px-14 md:py-16">
              <p className="text-sm font-semibold tracking-[0.2em] text-white/60 uppercase">
                Careers
              </p>
              <h2 className="font-display mt-4 max-w-2xl text-2xl font-bold tracking-tight sm:text-3xl">
                {CAREERS_CTA.title}
              </h2>
              <p className="mt-4 max-w-xl text-base leading-relaxed text-white/70">
                {CAREERS_CTA.body}
              </p>
              <Button asChild variant="primary" className="mt-8 rounded-full">
                <Link href={CAREERS_CTA.cta.href}>{CAREERS_CTA.cta.label}</Link>
              </Button>
            </div>
          </AnimateIn>
        </Container>
      </Section>

      <CTABand
        heading={FINAL_CTA.title}
        subheading={FINAL_CTA.body}
        ctaLabel={FINAL_CTA.cta.label}
        ctaHref={FINAL_CTA.cta.href}
      />
    </>
  )
}
