import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

import { clientKeyFromHeaders, rateLimit } from '@/lib/rate-limit'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (pathname === '/api/analytics/event' && request.method === 'POST') {
    const key = clientKeyFromHeaders(request.headers, 'analytics')
    const result = rateLimit(key, { limit: 60, windowMs: 60_000 })
    if (!result.ok) {
      return NextResponse.json(
        { ok: false, error: 'Too many requests' },
        {
          status: 429,
          headers: {
            'Retry-After': String(Math.ceil(result.retryAfterMs / 1000) || 1),
          },
        },
      )
    }
  }

  if (pathname.startsWith('/api/downloads/') && request.method === 'GET') {
    const key = clientKeyFromHeaders(request.headers, 'downloads')
    const result = rateLimit(key, { limit: 30, windowMs: 60_000 })
    if (!result.ok) {
      return NextResponse.json(
        { error: 'Too many download requests' },
        {
          status: 429,
          headers: {
            'Retry-After': String(Math.ceil(result.retryAfterMs / 1000) || 1),
          },
        },
      )
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/api/analytics/event', '/api/downloads/:path*'],
}
