import Link from 'next/link'

import { WhyJoinSection } from '@/components/careers/WhyJoinSection'
import { HiringProcessSection } from '@/components/careers/HiringProcessSection'
import { JobCard } from '@/components/domain/JobCard'
import { CareersPageHero } from '@/components/marketing/PageHeroes'
import { Container } from '@/components/layout/Container'
import { Section } from '@/components/layout/Section'
import { AnimateIn } from '@/components/motion/AnimateIn'
import { Button } from '@/components/ui/button'
import { listPublished } from '@/lib/cms'
import { FALLBACK_JOBS } from '@/lib/fallback-data'
import { HIRING_STEPS, WHY_JOIN } from '@/lib/site-ia'
import { buildMetadata } from '@/lib/seo'

export const revalidate = 60

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
  active?: boolean | null
}

function departmentLabel(job: CareerDoc) {
  if (typeof job.departmentRef === 'object' && job.departmentRef?.title) {
    return job.departmentRef.title
  }
  return job.department || 'General'
}

export const metadata = buildMetadata({
  title: 'Careers',
  description:
    'Build the future with AI, Healthcare, and Technology at XELARVIS. View open positions and join our talent network.',
  path: '/careers',
})

export default async function CareersPage() {
  const careers = await listPublished<CareerDoc>('careers', {
    where: { active: { equals: true } },
  })
  const items = careers.length ? careers : FALLBACK_JOBS

  return (
    <>
      <CareersPageHero
        title="Build the Future with AI, Healthcare, and Technology"
        subtitle="Join XELARVIS and work on innovative projects in Artificial Intelligence, Clinical Data Science, Healthcare Analytics, Enterprise Software, and Cloud Technologies."
      />

      <WhyJoinSection benefits={WHY_JOIN} />

      <HiringProcessSection steps={HIRING_STEPS} />

      <Section id="open-roles">
        <Container>
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="font-display text-3xl font-bold tracking-tight text-[color:var(--color-primary)]">
                Open Positions
              </h2>
              <p className="mt-2 text-[color:var(--color-secondary)]">
                Roles managed by HR from the admin dashboard.
              </p>
            </div>
            <Button
              asChild
              className="rounded-full bg-[color:var(--color-accent)] text-white hover:bg-[color:var(--color-accent-hover)]"
            >
              <Link href="/contact?intent=careers">Apply Now</Link>
            </Button>
          </div>
          {items.length === 0 ? (
            <p className="text-[color:var(--color-secondary)]">
              No open roles at the moment. Check back soon.
            </p>
          ) : (
            <div className="grid gap-3">
              {items.map((job, index) => (
                <AnimateIn key={job.id} delay={index * 0.04}>
                  <JobCard
                    title={job.title}
                    department={departmentLabel(job)}
                    location={job.location}
                    type={job.type}
                    workMode={job.workMode}
                    experienceRequired={job.experienceRequired}
                    openings={job.openings}
                    href={`/careers/${job.slug}`}
                  />
                </AnimateIn>
              ))}
            </div>
          )}
        </Container>
      </Section>

      <Section surface>
        <Container className="space-y-10">
          {[
            {
              title: 'Internship Program',
              body: 'Hands-on experience across AI, analytics, and software engineering with mentorship.',
            },
            {
              title: 'Research Opportunities',
              body: 'Collaborate with the AI Research Lab on publications and applied innovation projects.',
            },
            {
              title: 'Employee Benefits',
              body: 'Flexible work, learning budget, paid leave, and growth-focused career paths.',
            },
          ].map((card) => (
            <div
              key={card.title}
              className="border-t border-[color:var(--color-border)] pt-8 first:border-t-0 first:pt-0"
            >
              <h3 className="font-display text-xl font-semibold text-[color:var(--color-primary)]">
                {card.title}
              </h3>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[color:var(--color-secondary)]">
                {card.body}
              </p>
            </div>
          ))}
        </Container>
      </Section>
    </>
  )
}
