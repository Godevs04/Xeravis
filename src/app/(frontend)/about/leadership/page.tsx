import Link from 'next/link'

import { TeamGrid } from '@/blocks/TeamGrid'
import { Container } from '@/components/layout/Container'
import { PageHero } from '@/components/layout/PageHero'
import { Section } from '@/components/layout/Section'
import { Button } from '@/components/ui/button'
import { LEADERSHIP } from '@/lib/about-content'
import { safePayload } from '@/lib/cms'
import { ABOUT_MEGA, ABOUT_PAGES } from '@/lib/site-ia'
import { buildMetadata } from '@/lib/seo'

const page = ABOUT_PAGES.find((p) => p.slug === 'leadership')!

export const metadata = buildMetadata({
  title: page.title,
  description: page.subtitle,
  path: page.path,
})

export default async function LeadershipPage() {
  const related = ABOUT_MEGA.filter((item) => item.href !== page.path)
  const result = await safePayload((payload) =>
    payload.find({
      collection: 'team-members',
      sort: 'order',
      limit: 8,
      depth: 0,
    }),
  )
  const hasLeaders = (result?.docs?.length ?? 0) > 0

  return (
    <>
      <PageHero
        brand="Xelarvis"
        eyebrow={page.eyebrow}
        title={page.title}
        subtitle={page.subtitle}
        size="compact"
        variant="default"
        ctas={[
          { label: 'Work With Us', href: '/contact?intent=business', variant: 'accent' },
          { label: 'Explore capabilities', href: '/services', variant: 'outline' },
        ]}
      />
      {hasLeaders ? (
        <TeamGrid heading="Leadership" />
      ) : (
        <Section>
          <Container className="max-w-3xl">
            <p className="text-secondary text-base leading-relaxed">{LEADERSHIP.intro}</p>
            <p className="text-secondary mt-4 text-sm leading-relaxed">
              Published leadership profiles will appear here when available in the CMS. We do not
              invent team members or executive rosters.
            </p>
            <div className="mt-8">
              <Button asChild variant="outline" className="rounded-full">
                <Link href="/about">Back to About</Link>
              </Button>
            </div>
          </Container>
        </Section>
      )}
      {related.length > 0 ? (
        <Section surface>
          <Container>
            <h2 className="font-display text-primary text-xl font-semibold">Explore more</h2>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild variant="outline" className="rounded-full">
                <Link href="/about">About XELARVIS</Link>
              </Button>
              {related.map((item) => (
                <Button key={item.href} asChild variant="outline" className="rounded-full">
                  <Link href={item.href}>{item.label}</Link>
                </Button>
              ))}
            </div>
          </Container>
        </Section>
      ) : null}
    </>
  )
}
