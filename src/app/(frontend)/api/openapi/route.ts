import { NextResponse } from 'next/server'

import { buildOpenApiDocument } from '@/lib/openapi'

export const revalidate = 3600

export async function GET() {
  const document = buildOpenApiDocument()
  return NextResponse.json(document, {
    headers: {
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      'Access-Control-Allow-Origin': '*',
    },
  })
}
