import { NextResponse, type NextRequest } from 'next/server'

import { unsubscribe } from '@/lib/newsletter'

/** RFC 8058 one-click unsubscribe: mail clients POST here without user interaction. */
export async function POST(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token') || ''
  const result = await unsubscribe(token).catch(() => 'invalid' as const)
  return NextResponse.json({ ok: result === 'ok' }, { status: result === 'ok' ? 200 : 400 })
}

export function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token') || ''
  return NextResponse.redirect(
    new URL(`/newsletter/unsubscribe?token=${encodeURIComponent(token)}`, request.url),
  )
}
