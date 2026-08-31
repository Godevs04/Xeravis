import Link from 'next/link'

import { Container } from '@/components/layout/Container'
import { Section } from '@/components/layout/Section'

export type HubLink = {
  href: string
  label: string
  description?: string
}

type HubLinkStripProps = {
  eyebrow?: string
  heading: string
  subheading?: string
  items: HubLink[]
  surface?: boolean
  viewAll?: { href: string; label: string }
}

/** Lightweight hub strip for Services / Solutions / Industries landings. */
export function HubLinkStrip({
  eyebrow,
  heading,
  subheading,
  items,
  surface,
  viewAll,
}: HubLinkStripProps) {
  if (!items.length) return null

  return (
    <Section surface={surface}>
      <Container>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            {eyebrow ? (
              <p className="text-xs font-semibold tracking-[0.14em] text-[color:var(--color-accent)] uppercase">
                {eyebrow}
              </p>
            ) : null}
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-[color:var(--color-primary)] md:text-3xl">
              {heading}
            </h2>
            {subheading ? (
              <p className="mt-3 max-w-2xl text-sm text-[color:var(--color-secondary)] sm:text-base">
                {subheading}
              </p>
            ) : null}
          </div>
          {viewAll ? (
            <Link
              href={viewAll.href}
              className="text-sm font-semibold text-[color:var(--color-accent)] hover:underline"
            >
              {viewAll.label}
            </Link>
          ) : null}
        </div>
        <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="group block rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--glass-bg)] px-4 py-4 transition hover:border-[color:var(--color-accent)]"
              >
                <span className="font-semibold text-[color:var(--color-primary)] group-hover:text-[color:var(--color-accent)]">
                  {item.label}
                </span>
                {item.description ? (
                  <span className="mt-1 line-clamp-2 block text-sm text-[color:var(--color-secondary)]">
                    {item.description}
                  </span>
                ) : null}
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  )
}
