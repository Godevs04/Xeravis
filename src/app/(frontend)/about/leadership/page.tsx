import Link from 'next/link'

import { TeamGrid } from '@/blocks/TeamGrid'
import { Container } from '@/components/layout/Container'
import { PageHero } from '@/components/layout/PageHero'
import { Section } from '@/components/layout/Section'
import { Button } from '@/components/ui/button'
import { ABOUT_MEGA, ABOUT_PAGES } from '@/lib/site-ia'
import { buildMetadata } from '@/lib/seo'

const page = ABOUT_PAGES.find((p) => p.slug === 'leadership')!

export const metadata = buildMetadata({
  title: page.title,
  description: page.subtitle,
  path: page.path,
})

export default function LeadershipPage() {
  const related = ABOUT_MEGA.filter((item) => item.href !== page.path)

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
      <TeamGrid heading="Leadership" />
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
