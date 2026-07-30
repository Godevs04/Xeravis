import { headers as getHeaders } from 'next/headers'
import { NextResponse } from 'next/server'

import { getPayload } from '@/lib/payload'

export async function GET() {
  try {
    const payload = await getPayload()
    const { user } = await payload.auth({ headers: await getHeaders() })
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const result = await payload.find({
      collection: 'notifications',
      depth: 0,
      limit: 20,
      sort: '-createdAt',
      overrideAccess: true,
      where: {
        user: { equals: user.id },
      },
    })

    return NextResponse.json({
      items: result.docs.map((doc) => {
        const record = doc as unknown as Record<string, unknown>
        return {
          id: String(record.id),
          title: String(record.title || 'Notification'),
          body: typeof record.body === 'string' ? record.body : '',
          href: typeof record.href === 'string' ? record.href : '/admin',
          read: Boolean(record.read),
          type: typeof record.type === 'string' ? record.type : 'info',
          createdAt: typeof record.createdAt === 'string' ? record.createdAt : '',
        }
      }),
      unread: result.docs.filter((doc) => !(doc as { read?: boolean }).read).length,
    })
  } catch {
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const payload = await getPayload()
    const { user } = await payload.auth({ headers: await getHeaders() })
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = (await request.json()) as { id?: string; markAll?: boolean }
    if (body.markAll) {
      const unread = await payload.find({
        collection: 'notifications',
        depth: 0,
        limit: 100,
        overrideAccess: true,
        where: {
          and: [{ user: { equals: user.id } }, { read: { equals: false } }],
        },
      })
      await Promise.all(
        unread.docs.map((doc) =>
          payload.update({
            collection: 'notifications',
            id: doc.id,
            data: { read: true },
            overrideAccess: true,
          }),
        ),
      )
      return NextResponse.json({ ok: true })
    }

    if (body.id) {
      await payload.update({
        collection: 'notifications',
        id: body.id,
        data: { read: true },
        overrideAccess: true,
      })
      return NextResponse.json({ ok: true })
    }

    return NextResponse.json({ error: 'Bad request' }, { status: 400 })
  } catch {
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}
