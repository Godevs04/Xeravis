import { after, NextResponse } from 'next/server'
import { z } from 'zod'

import { verifyDownloadToken } from '@/lib/download-token'
import { sendEmail } from '@/lib/email'
import { serveMediaFile } from '@/lib/media-file'
import { notifyLead } from '@/lib/notify'
import { getPayload } from '@/lib/payload'
import { turnstileEnabled } from '@/lib/turnstile'

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
      const searchParams = new URL(request.url).searchParams
      // Signed links come from the download form, which already stored the lead.
      if (!verifyDownloadToken(slug, searchParams.get('t'))) {
        const parsed = emailSchema.safeParse(searchParams.get('email') ?? '')
        // The bare ?email= form skips the bot check, so it is disabled once Turnstile is on.
        if (!parsed.success || turnstileEnabled()) {
          return NextResponse.json(
            {
              error: 'Email required',
              message: 'This download is gated. Request it from the download form on the website.',
            },
            { status: 401 },
          )
        }
        leadEmail = parsed.data
      }
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
      const email = leadEmail
      after(async () => {
        await Promise.allSettled([
          sendEmail({
            to: process.env.CONTACT_NOTIFY_EMAIL || process.env.EMAIL_TO,
            replyTo: email,
            subject: `New download lead: ${doc.title}`,
            text: `Email: ${email}\nDownload: ${doc.title}\n\nReview in Payload Admin > Form Submissions.`,
          }),
          notifyLead({
            type: 'download',
            title: doc.title,
            fields: [['Email', email]],
            adminPath: '/admin/collections/form-submissions',
          }),
        ])
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
