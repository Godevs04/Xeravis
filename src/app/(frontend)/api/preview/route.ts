import { draftMode } from 'next/headers'
import { NextResponse, type NextRequest } from 'next/server'

import { getPayload } from '@/lib/payload'
import { isPreviewCollection, previewPath } from '@/lib/preview'

export const dynamic = 'force-dynamic'

/** Turns on Next draft mode for signed-in staff, then redirects to the document's page. */
export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams
  const collection = params.get('collection')
  const slug = params.get('slug') || ''

  const secret = process.env.PREVIEW_SECRET
  if (secret && params.get('secret') !== secret) {
    return NextResponse.json({ error: 'Invalid preview token' }, { status: 401 })
  }
  if (!isPreviewCollection(collection) || !/^[a-z0-9-]*$/i.test(slug)) {
    return NextResponse.json({ error: 'Invalid preview target' }, { status: 400 })
  }

  const payload = await getPayload()
  const { user } = await payload.auth({ headers: request.headers })
  if (!user) {
    return NextResponse.json({ error: 'Sign in to the admin to preview drafts' }, { status: 401 })
  }

  ;(await draftMode()).enable()
  return NextResponse.redirect(new URL(previewPath(collection, slug), request.url))
}
