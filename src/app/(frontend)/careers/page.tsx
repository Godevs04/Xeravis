import { JobCard } from '@/components/domain/JobCard'
import { Container } from '@/components/layout/Container'
import { PageHero } from '@/components/layout/PageHero'
import { Section } from '@/components/layout/Section'
import { AnimateIn } from '@/components/motion/AnimateIn'
import { listPublished } from '@/lib/cms'
import { FALLBACK_JOBS, UNSPLASH } from '@/lib/fallback-data'
import { buildMetadata } from '@/lib/seo'

export const revalidate = 60

type CareerDoc = {
  id: string
  title: string
  slug: string
  department: string
  location: string
  type: string
  active?: boolean | null
}

export const metadata = buildMetadata({
  title: 'Careers',
  description: 'Join Xelarvis Technologies — build enterprise platforms with a team that values craft.',
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
        eyebrow="Careers"
        title="Engineer the future of enterprise software."
        subtitle="We hire people who care about clarity, quality, and impact."
        image={UNSPLASH.team}
        size="compact"
      />
      <Section>
        <Container>
          {items.length === 0 ? (
            <p className="text-secondary">No open roles at the moment. Check back soon.</p>
          ) : (
            items.map((job, index) => (
              <AnimateIn key={job.id} delay={index * 0.03}>
                <JobCard
                  title={job.title}
                  department={job.department}
                  location={job.location}
                  type={job.type}
                  href={`/careers/${job.slug}`}
                />
              </AnimateIn>
            ))
          )}
        </Container>
      </Section>
    </>
  )
}
