import { draftMode } from 'next/headers'
import { NextResponse, type NextRequest } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  ;(await draftMode()).disable()
  const target = request.nextUrl.searchParams.get('path') || '/'
  const path = target.startsWith('/') && !target.startsWith('//') ? target : '/'
  return NextResponse.redirect(new URL(path, request.url))
}
