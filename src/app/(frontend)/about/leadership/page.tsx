import Link from '@/components/ui/link'

import { LeadershipProfiles } from '@/components/about/LeadershipProfiles'
import { Container } from '@/components/layout/Container'
import { PageHero } from '@/components/layout/PageHero'
import { Section } from '@/components/layout/Section'
import { Button } from '@/components/ui/button'
import { ABOUT_MEGA, ABOUT_PAGES } from '@/lib/site-ia'
import { buildMetadata } from '@/lib/seo'
import { getTeamMembers } from '@/lib/team'

export const revalidate = 60

const page = ABOUT_PAGES.find((p) => p.slug === 'leadership')!

export const metadata = buildMetadata({
  title: page.title,
  description: page.subtitle,
  path: page.path,
})

export default async function LeadershipPage() {
  const related = ABOUT_MEGA.filter((item) => item.href !== page.path)
  const members = await getTeamMembers()

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
      {members.length > 0 ? (
        <LeadershipProfiles members={members} />
      ) : (
        <Section>
          <Container className="max-w-3xl">
            <p className="text-secondary text-base leading-relaxed">
              Leadership profiles are being prepared for publication. To speak with our founders and
              directors about an engagement, get in touch with our team.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild className="rounded-full">
                <Link href="/contact?intent=business">Contact leadership</Link>
              </Button>
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
