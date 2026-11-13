import { NextResponse } from 'next/server'

import { clientKeyFromHeaders, rateLimit } from '@/lib/rate-limit'
import { siteSearch } from '@/lib/site-search'

const MAX_QUERY_LENGTH = 100
const MAX_RESULTS = 8

export async function GET(request: Request) {
  const query = (new URL(request.url).searchParams.get('q') ?? '').trim().slice(0, MAX_QUERY_LENGTH)
  if (query.length < 2) return NextResponse.json({ results: [] })

  const limit = await rateLimit(clientKeyFromHeaders(request.headers, 'site-search'), {
    limit: 60,
    windowMs: 60_000,
  })
  if (!limit.ok) {
    return NextResponse.json(
      { results: [], error: 'Too many searches. Please wait a moment.' },
      { status: 429, headers: { 'Retry-After': String(Math.ceil(limit.retryAfterMs / 1000)) } },
    )
  }

  const results = (await siteSearch(query)).slice(0, MAX_RESULTS)
  return NextResponse.json(
    { results },
    { headers: { 'Cache-Control': 'public, max-age=30, stale-while-revalidate=120' } },
  )
}
