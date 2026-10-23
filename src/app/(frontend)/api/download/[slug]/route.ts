import { NextResponse } from 'next/server'
import { z } from 'zod'

import { serveMediaFile } from '@/lib/media-file'
import { getPayload } from '@/lib/payload'

type Params = { params: Promise<{ slug: string }> }

const emailSchema = z.string().trim().toLowerCase().email().max(200)

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

    const doc = result.docs[0]
    if (!doc) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    let leadEmail: string | null = null
    if (doc.gated) {
      const parsed = emailSchema.safeParse(new URL(request.url).searchParams.get('email') ?? '')
      if (!parsed.success) {
        return NextResponse.json(
          {
            error: 'Email required',
            message: 'This download is gated. Provide ?email=you@company.com to continue.',
          },
          { status: 401 },
        )
      }
      leadEmail = parsed.data
    }

    const file = doc.file && typeof doc.file === 'object' ? doc.file : null
    if (!file?.filename) {
      return NextResponse.json({ error: 'File missing' }, { status: 404 })
    }

    if (leadEmail) {
      // The lead is the point of a gated download, so it is stored before the file is served.
      await payload.create({
        collection: 'form-submissions',
        overrideAccess: true,
        data: {
          type: 'download',
          status: 'new',
          data: { email: leadEmail, download: doc.title, downloadId: String(doc.id), slug },
        },
      })
    }

    const response = await serveMediaFile(file.filename, {
      staticDir: payload.collections.media.config.upload.staticDir || 'media',
      downloadName: file.filename,
    })
    if (!response.ok) {
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

    return response
  } catch {
    return NextResponse.json({ error: 'Unable to download' }, { status: 500 })
  }
}
