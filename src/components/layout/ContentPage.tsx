import Link from 'next/link'

import { Container } from '@/components/layout/Container'
import { PageHero } from '@/components/layout/PageHero'
import { Section } from '@/components/layout/Section'
import { Button } from '@/components/ui/button'
import type { ContentPageDef } from '@/lib/site-ia'

type ContentPageProps = {
  page: ContentPageDef
  related?: { label: string; href: string }[]
  cta?: { label: string; href: string }
}

export function ContentPage({
  page,
  related,
  cta = { label: 'Talk to us', href: '/contact' },
}: ContentPageProps) {
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
          { label: cta.label, href: cta.href, variant: 'accent' },
          { label: 'Explore services', href: '/services', variant: 'outline' },
        ]}
      />
      {page.sections.map((section) => (
        <Section key={section.heading}>
          <Container className="max-w-3xl">
            <h2 className="font-display text-primary text-2xl font-bold tracking-tight sm:text-3xl">
              {section.heading}
            </h2>
            <p className="text-secondary mt-4 text-base leading-relaxed sm:text-lg">
              {section.body}
            </p>
            {section.bullets?.length ? (
              <ul className="mt-6 space-y-3">
                {section.bullets.map((item) => (
                  <li
                    key={item}
                    className="text-primary flex gap-3 text-sm leading-relaxed sm:text-base"
                  >
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#0D9488]" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            ) : null}
          </Container>
        </Section>
      ))}
      {related?.length ? (
        <Section surface>
          <Container>
            <h2 className="font-display text-primary text-xl font-semibold">Explore more</h2>
            <div className="mt-6 flex flex-wrap gap-3">
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
