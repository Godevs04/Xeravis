import { NextResponse } from 'next/server'

import { boundMeta } from '@/lib/rate-limit'
import { getPayload } from '@/lib/payload'

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      path?: string
      referrer?: string
      type?: string
      meta?: Record<string, unknown>
    }

    const type = body.type || 'pageview'
    const allowed = ['pageview', 'lead', 'application', 'download', 'newsletter']
    if (!allowed.includes(type)) {
      return NextResponse.json({ ok: false }, { status: 400 })
    }

    const path = typeof body.path === 'string' ? body.path.slice(0, 500) : '/'
    const payload = await getPayload()
    await payload.create({
      collection: 'analytics-events',
      overrideAccess: true,
      data: {
        type: type as 'pageview' | 'lead' | 'application' | 'download' | 'newsletter',
        path,
        referrer: typeof body.referrer === 'string' ? body.referrer.slice(0, 500) : undefined,
        meta: boundMeta(body.meta),
      },
    })

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}
