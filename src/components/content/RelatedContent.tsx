import Link from 'next/link'

import { Container } from '@/components/layout/Container'
import { Section } from '@/components/layout/Section'

export type RelatedContentItem = {
  href: string
  label: string
  description?: string
}

export type RelatedContentGroup = {
  title: string
  items: RelatedContentItem[]
}

type RelatedContentProps = {
  heading?: string
  groups: RelatedContentGroup[]
  cta?: { href: string; label: string }
}

/** CMS-driven related content — used on Services, Solutions, Industries, and hubs. */
export function RelatedContent({
  heading = 'Explore related XELARVIS capabilities',
  groups,
  cta = { href: '/contact', label: 'Talk to an expert' },
}: RelatedContentProps) {
  const visible = groups.filter((g) => g.items.length > 0)
  if (!visible.length) return null

  return (
    <Section>
      <Container>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold tracking-[0.14em] text-[color:var(--color-accent)] uppercase">
              Related
            </p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-[color:var(--color-primary)] md:text-3xl">
              {heading}
            </h2>
          </div>
          {cta ? (
            <Link
              href={cta.href}
              className="inline-flex shrink-0 items-center justify-center rounded-full bg-[color:var(--color-primary)] px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
            >
              {cta.label}
            </Link>
          ) : null}
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-2">
          {visible.map((group) => (
            <div key={group.title}>
              <h3 className="text-sm font-semibold tracking-[0.08em] text-[color:var(--color-secondary)] uppercase">
                {group.title}
              </h3>
              <ul className="mt-3 space-y-2">
                {group.items.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="group flex flex-col rounded-xl border border-[color:var(--color-border)] bg-[color:var(--glass-bg)] px-4 py-3 transition hover:border-[color:var(--color-accent)]"
                    >
                      <span className="font-semibold text-[color:var(--color-primary)] group-hover:text-[color:var(--color-accent)]">
                        {item.label}
                      </span>
                      {item.description ? (
                        <span className="mt-0.5 text-sm text-[color:var(--color-secondary)]">
                          {item.description}
                        </span>
                      ) : null}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  )
}
