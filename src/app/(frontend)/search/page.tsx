import Link from 'next/link'

import { Container } from '@/components/layout/Container'
import { PageHero } from '@/components/layout/PageHero'
import { Section } from '@/components/layout/Section'
import { safePayload } from '@/lib/cms'
import { buildMetadata } from '@/lib/seo'

export const revalidate = 60

type SearchDoc = {
  id: string
  title?: string | null
  slug?: string | null
  doc?: {
    relationTo?: string
    value?: { slug?: string; title?: string } | string
  }
}

type Props = {
  searchParams: Promise<{ q?: string }>
}

export const metadata = buildMetadata({
  title: 'Search',
  description: 'Search the Xelarvis Technologies website.',
  path: '/search',
  noIndex: true,
})

function resolveHref(doc: SearchDoc): string {
  const relationTo = doc.doc?.relationTo
  const value = doc.doc?.value
  const slug = typeof value === 'object' && value ? value.slug : doc.slug

  if (!slug) return '/'

  switch (relationTo) {
    case 'services':
      return `/services/${slug}`
    case 'industries':
      return `/industries/${slug}`
    case 'solutions':
      return `/solutions/${slug}`
    case 'case-studies':
      return `/case-studies/${slug}`
    case 'blogs':
      return `/blog/${slug}`
    case 'careers':
      return `/careers/${slug}`
    case 'pages':
      return slug === 'home' ? '/' : `/${slug}`
    default:
      return `/${slug}`
  }
}

export default async function SearchPage({ searchParams }: Props) {
  const { q } = await searchParams
  const query = q?.trim() ?? ''

  let results: SearchDoc[] = []

  if (query.length >= 2) {
    const response = await safePayload((payload) =>
      payload.find({
        collection: 'search',
        where: {
          title: { like: query },
        },
        limit: 20,
        depth: 1,
      }),
    )
    results = (response?.docs as SearchDoc[]) ?? []
  }

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
              placeholder="Search…"
              className="h-11 flex-1 rounded-[var(--radius-sm)] border border-border px-4 text-sm"
              aria-label="Search query"
            />
            <button
              type="submit"
              className="h-11 rounded-[var(--radius-sm)] bg-accent px-6 text-sm font-semibold text-white"
            >
              Search
            </button>
          </form>

          {query.length > 0 && query.length < 2 && (
            <p className="mt-8 text-secondary">Enter at least two characters.</p>
          )}

          {query.length >= 2 && results.length === 0 && (
            <p className="mt-8 text-secondary">No results for &ldquo;{query}&rdquo;.</p>
          )}

          {results.length > 0 && (
            <ul className="mt-10 divide-y divide-border border-t border-border">
              {results.map((result) => (
                <li key={result.id}>
                  <Link href={resolveHref(result)} className="block py-5 transition-colors hover:text-accent">
                    <p className="font-semibold">{result.title}</p>
                    {result.doc?.relationTo && (
                      <p className="mt-1 text-xs uppercase tracking-wide text-muted">{result.doc.relationTo}</p>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Container>
      </Section>
    </>
  )
}
