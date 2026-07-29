import Link from 'next/link'

import { JobCard } from '@/components/domain/JobCard'
import { Container } from '@/components/layout/Container'
import { PageHero } from '@/components/layout/PageHero'
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
      <PageHero
        brand="Xelarvis"
        eyebrow="Careers"
        title="Build the Future with AI, Healthcare, and Technology"
        subtitle="Join XELARVIS and work on innovative projects in Artificial Intelligence, Clinical Data Science, Healthcare Analytics, Enterprise Software, and Cloud Technologies."
        size="compact"
        variant="default"
        ctas={[
          { label: 'View Open Positions', href: '#open-positions', variant: 'accent' },
          { label: 'Join Our Talent Network', href: '/contact?intent=careers', variant: 'outline' },
        ]}
      />

      <Section>
        <Container>
          <h2 className="font-display text-3xl font-bold tracking-tight text-[#0F172A]">
            Why Join XELARVIS
          </h2>
          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {WHY_JOIN.map((item) => (
              <div
                key={item}
                className="rounded-[20px] border border-slate-200 bg-white px-4 py-4 text-sm font-medium text-[#0F172A] shadow-[0_8px_24px_rgba(15,23,42,0.04)]"
              >
                {item}
              </div>
            ))}
          </div>
        </Container>
      </Section>

      <Section surface>
        <Container>
          <h2 className="font-display text-3xl font-bold tracking-tight text-[#0F172A]">
            Hiring Process
          </h2>
          <p className="mt-3 max-w-2xl text-slate-600">
            A clear path from application to onboarding so you always know what to expect.
          </p>
          <ol className="mt-10 grid gap-4 md:grid-cols-2">
            {HIRING_STEPS.map((step, index) => (
              <li
                key={step.title}
                className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-[0_8px_24px_rgba(15,23,42,0.04)]"
              >
                <p className="text-xs font-bold tracking-[0.14em] text-[#0D9488] uppercase">
                  Step {index + 1}
                </p>
                <h3 className="mt-2 font-semibold text-[#0F172A]">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{step.description}</p>
              </li>
            ))}
          </ol>
        </Container>
      </Section>

      <Section id="open-positions">
        <Container>
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="font-display text-3xl font-bold tracking-tight text-[#0F172A]">
                Open Positions
              </h2>
              <p className="mt-2 text-slate-600">Roles managed by HR from the admin dashboard.</p>
            </div>
            <Button asChild className="rounded-full bg-[#0D9488] text-white hover:bg-[#06B6D4]">
              <Link href="/contact?intent=careers">Apply Now</Link>
            </Button>
          </div>
          {items.length === 0 ? (
            <p className="text-slate-600">No open roles at the moment. Check back soon.</p>
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
        <Container className="grid gap-8 lg:grid-cols-3">
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
            <div key={card.title} className="rounded-[24px] border border-slate-200 bg-white p-6">
              <h3 className="font-display text-xl font-semibold text-[#0F172A]">{card.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">{card.body}</p>
            </div>
          ))}
        </Container>
      </Section>
    </>
  )
}
