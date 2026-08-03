import Link from 'next/link'

import { Container } from '@/components/layout/Container'
import { Section } from '@/components/layout/Section'
import type { RelatedLink } from '@/lib/seo-content'

type RelatedLinksProps = {
  heading?: string
  links: RelatedLink[]
}

/** Internal linking block for topical clusters — preserves existing design tokens. */
export function RelatedLinks({ heading = 'Related resources', links }: RelatedLinksProps) {
  if (!links.length) return null

  return (
    <Section>
      <Container>
        <h2 className="text-2xl font-bold tracking-tight">{heading}</h2>
        <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="block rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--glass-bg)] px-4 py-3 transition-colors hover:border-[color:var(--color-accent)] hover:bg-[color:var(--color-hover)]"
              >
                <span className="font-semibold text-[color:var(--color-primary)]">
                  {link.label}
                </span>
                {link.description ? (
                  <span className="mt-1 block text-sm text-[color:var(--color-secondary)]">
                    {link.description}
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
