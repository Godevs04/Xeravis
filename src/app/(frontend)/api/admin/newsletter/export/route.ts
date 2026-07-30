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
      collection: 'newsletter-subscribers',
      depth: 0,
      limit: 5000,
      overrideAccess: true,
      sort: '-createdAt',
    })

    const rows = [
      ['email', 'status', 'createdAt'],
      ...result.docs.map((doc) => {
        const record = doc as unknown as Record<string, unknown>
        return [
          String(record.email || ''),
          String(record.status || ''),
          String(record.createdAt || ''),
        ]
      }),
    ]

    const csv = rows
      .map((row) => row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(','))
      .join('\n')

    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': 'attachment; filename="newsletter-subscribers.csv"',
      },
    })
  } catch {
    return NextResponse.json({ error: 'Export failed' }, { status: 500 })
  }
}
