import Link from 'next/link'

import { Container } from '@/components/layout/Container'
import { PageHero } from '@/components/layout/PageHero'
import { Section } from '@/components/layout/Section'
import { siteSearch } from '@/lib/site-search'
import { buildMetadata } from '@/lib/seo'

export const revalidate = 60

type Props = {
  searchParams: Promise<{ q?: string }>
}

export const metadata = buildMetadata({
  title: 'Search',
  description: 'Search the Xelarvis Technologies website.',
  path: '/search',
  noIndex: true,
})

export default async function SearchPage({ searchParams }: Props) {
  const { q } = await searchParams
  const query = q?.trim() ?? ''
  const results = query.length >= 2 ? await siteSearch(query) : []

  return (
    <>
      <PageHero eyebrow="Search" title="Find pages, services, and articles." size="compact" />
      <Section>
        <Container className="max-w-3xl">
          <form action="/search" method="get" className="flex gap-3">
            <input
              type="search"
              name="q"
              defaultValue={query}
              placeholder="Search careers, services, insights…"
              className="h-11 flex-1 rounded-full border border-[color:var(--glass-border)] bg-[color:var(--glass-bg)] px-5 text-sm text-[color:var(--color-primary)] shadow-[var(--shadow-light)] backdrop-blur-md placeholder:text-[color:var(--color-muted)] focus-visible:border-[color:var(--color-accent)]/40 focus-visible:ring-2 focus-visible:ring-[color:var(--color-accent)]/30 focus-visible:outline-none"
              aria-label="Search query"
            />
            <button
              type="submit"
              className="h-11 rounded-full bg-[color:var(--color-accent)] px-6 text-sm font-semibold text-white shadow-[var(--shadow-hover)] hover:bg-[color:var(--color-accent-hover)]"
            >
              Search
            </button>
          </form>

          {query.length > 0 && query.length < 2 ? (
            <p className="mt-8 text-[color:var(--color-secondary)]">
              Enter at least two characters.
            </p>
          ) : null}

          {query.length >= 2 && results.length === 0 ? (
            <p className="mt-8 text-[color:var(--color-secondary)]">
              No results for &ldquo;{query}&rdquo;.
            </p>
          ) : null}

          {results.length > 0 ? (
            <ul className="mt-10 divide-y divide-[color:var(--glass-border)] border-t border-[color:var(--glass-border)]">
              {results.map((result) => (
                <li key={result.id}>
                  <Link
                    href={result.href}
                    className="group block py-5 transition-colors hover:text-[color:var(--color-accent)]"
                  >
                    <p className="font-semibold text-[color:var(--color-primary)] group-hover:text-[color:var(--color-accent)]">
                      {result.title}
                    </p>
                    {result.excerpt ? (
                      <p className="mt-1 text-sm text-[color:var(--color-secondary)]">
                        {result.excerpt}
                      </p>
                    ) : null}
                    <p className="mt-1 text-xs tracking-wide text-[color:var(--color-muted)] uppercase">
                      {result.kind.replace('-', ' ')}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          ) : null}
        </Container>
      </Section>
    </>
  )
}
