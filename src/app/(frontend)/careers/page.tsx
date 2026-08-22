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
import { GRADUATE_PROGRAMS, HIRING_STEPS, LIFE_AT_XELARVIS, WHY_JOIN } from '@/lib/site-ia'
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
  postedAt?: string | null
  applicationDeadline?: string | null
  active?: boolean | null
}

function departmentLabel(job: CareerDoc) {
  if (typeof job.departmentRef === 'object' && job.departmentRef?.title) {
    return job.departmentRef.title
  }
  return job.department || 'General'
}

export const metadata = buildMetadata({
  title: 'Careers in AI, Data Science & IT Consulting',
  description:
    'Join Xelarvis—life at XELARVIS, hiring process, learning & development, internships, graduate programs, and open roles across Artificial Intelligence, Data Science, and IT Consulting.',
  path: '/careers',
})

const PROGRAMS = [
  {
    id: 'internships',
    title: 'Internship Program',
    body: 'Hands-on experience across Artificial Intelligence, Data Science, and IT Consulting with structured mentorship and real delivery work.',
  },
  {
    id: 'graduates',
    title: GRADUATE_PROGRAMS.title,
    body: GRADUATE_PROGRAMS.body,
  },
  {
    id: 'learning',
    title: 'Learning & Development',
    body: 'Certification support, research exposure, and continuous learning budgets so talent grows with the practice.',
  },
  {
    id: 'research',
    title: 'Research Opportunities',
    body: 'Collaborate with the AI Research Lab on publications, benchmarks, open-source, and applied innovation projects.',
  },
  {
    id: 'benefits',
    title: 'Employee Benefits',
    body: 'Flexible work, learning budget, paid leave, and growth-focused career paths.',
  },
] as const

export default async function CareersPage() {
  const careers = await listPublished<CareerDoc>('careers', {
    where: { active: { equals: true } },
  })
  const fromCms = careers.length > 0
  const items = fromCms ? careers : FALLBACK_JOBS

  return (
    <>
      <CareersPageHero
        title="Build careers in AI, Data Science, and IT Consulting"
        subtitle="Join XELARVIS to turn data and technology into measurable business value—across Artificial Intelligence, Data Science, IT Consulting, and Healthcare as a specialty."
      />

      <WhyJoinSection benefits={WHY_JOIN} />

      <Section id="life-at-xelarvis" surface>
        <Container className="max-w-3xl">
          <h2 className="font-display text-3xl font-bold tracking-tight text-[color:var(--color-primary)]">
            {LIFE_AT_XELARVIS.title}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-[color:var(--color-secondary)]">
            {LIFE_AT_XELARVIS.body}
          </p>
          <ul className="mt-6 space-y-2 text-sm text-[color:var(--color-secondary)]">
            {LIFE_AT_XELARVIS.bullets.map((item) => (
              <li key={item} className="flex gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[color:var(--color-accent)]" />
                {item}
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      <div id="hiring-process">
        <HiringProcessSection steps={HIRING_STEPS} />
      </div>

      <Section id="open-roles">
        <Container>
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="font-display text-3xl font-bold tracking-tight text-[color:var(--color-primary)]">
                Open Positions
              </h2>
              <p className="mt-2 max-w-xl text-[color:var(--color-secondary)]">
                {fromCms
                  ? 'Select a role to review responsibilities, requirements, and apply online.'
                  : 'Preview roles below. Online applications open when positions are published in careers admin—or email hr@xelarvis.in.'}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                asChild
                className="rounded-full bg-[color:var(--color-accent)] text-white hover:bg-[color:var(--color-accent-hover)]"
              >
                <Link href="#open-roles">Browse roles</Link>
              </Button>
              <Button asChild variant="outline" className="rounded-full">
                <a href="mailto:hr@xelarvis.in">Email recruiting</a>
              </Button>
            </div>
          </div>
          {items.length === 0 ? (
            <div className="rounded-[24px] border border-[color:var(--glass-border-soft)] bg-[color:var(--glass-bg)] p-8 text-center">
              <p className="text-[color:var(--color-secondary)]">
                No open roles at the moment. Send your profile to{' '}
                <a
                  href="mailto:hr@xelarvis.in"
                  className="font-semibold text-[color:var(--color-accent)] hover:underline"
                >
                  hr@xelarvis.in
                </a>{' '}
                and we will keep you in mind for future openings.
              </p>
            </div>
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
                    postedAt={'postedAt' in job ? job.postedAt : null}
                    applicationDeadline={
                      'applicationDeadline' in job ? job.applicationDeadline : null
                    }
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
          {PROGRAMS.map((card) => (
            <div
              key={card.id}
              id={card.id}
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
