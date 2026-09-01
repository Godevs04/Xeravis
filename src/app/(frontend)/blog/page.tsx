import { redirect } from 'next/navigation'

type Props = {
  searchParams: Promise<{ category?: string; q?: string }>
}

/** Canonical blog hub is /insights/blogs — permanent redirect also in next.config.ts */
export default async function BlogIndexRedirect({ searchParams }: Props) {
  const params = await searchParams
  const query = new URLSearchParams()
  if (params.category) query.set('category', params.category)
  if (params.q) query.set('q', params.q)
  const suffix = query.toString() ? `?${query.toString()}` : ''
  redirect(`/insights/blogs${suffix}`)
}
