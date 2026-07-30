import { NextResponse } from 'next/server'

import { getPayload } from '@/lib/payload'

type Params = { params: Promise<{ slug: string }> }

export async function GET(_request: Request, { params }: Params) {
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
          file?: { url?: string } | string | number | null
        }
      | undefined

    if (!doc) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    const fileUrl =
      doc.file && typeof doc.file === 'object' && typeof doc.file.url === 'string'
        ? doc.file.url
        : null

    if (!fileUrl) {
      return NextResponse.json({ error: 'File missing' }, { status: 404 })
    }

    await payload.update({
      collection: 'downloads',
      id: doc.id,
      overrideAccess: true,
      data: {
        downloadCount: (doc.downloadCount || 0) + 1,
      },
    })

    await payload.create({
      collection: 'analytics-events',
      overrideAccess: true,
      data: {
        type: 'download',
        path: `/downloads/${slug}`,
        meta: { downloadId: String(doc.id) },
      },
    })

    return NextResponse.redirect(
      new URL(fileUrl, process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
    )
  } catch {
    return NextResponse.json({ error: 'Unable to download' }, { status: 500 })
  }
}
