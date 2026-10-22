import { NextResponse } from 'next/server'

import { getPayload } from '@/lib/payload'

type Params = { params: Promise<{ slug: string }> }

export async function GET(request: Request, { params }: Params) {
  try {
    const { slug } = await params
    const payload = await getPayload()
    const result = await payload.find({
      collection: 'downloads',
      depth: 1,
      limit: 1,
      overrideAccess: true,
      where: { slug: { equals: slug } },
    })

    const doc = result.docs[0] as
      | {
          id: string | number
          downloadCount?: number
          gated?: boolean | null
          file?: { url?: string } | string | number | null
        }
      | undefined

    if (!doc) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    if (doc.gated) {
      const email = new URL(request.url).searchParams.get('email')
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return NextResponse.json(
          {
            error: 'Email required',
            message: 'This download is gated. Provide ?email=you@company.com to continue.',
          },
          { status: 401 },
        )
      }
    }

    const fileUrl =
      doc.file && typeof doc.file === 'object' && typeof doc.file.url === 'string'
        ? doc.file.url
        : null

    if (!fileUrl) {
      return NextResponse.json({ error: 'File missing' }, { status: 404 })
    }

    // Best-effort counter; races are acceptable for analytics-style counts.
    void payload
      .update({
        collection: 'downloads',
        id: doc.id,
        overrideAccess: true,
        data: {
          downloadCount: (doc.downloadCount || 0) + 1,
        },
      })
      .catch(() => undefined)

    void payload
      .create({
        collection: 'analytics-events',
        overrideAccess: true,
        data: {
          type: 'download',
          path: `/downloads/${slug}`,
          meta: { downloadId: String(doc.id) },
        },
      })
      .catch(() => undefined)

    return NextResponse.redirect(
      new URL(fileUrl, process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
    )
  } catch {
    return NextResponse.json({ error: 'Unable to download' }, { status: 500 })
  }
}
