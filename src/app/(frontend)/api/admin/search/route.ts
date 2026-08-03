import { headers as getHeaders } from 'next/headers'
import { NextResponse } from 'next/server'

import { getPayload } from '@/lib/payload'

const SEARCH_TARGETS = [
  { collection: 'blogs', titleField: 'title' },
  { collection: 'pages', titleField: 'title' },
  { collection: 'services', titleField: 'title' },
  { collection: 'technologies', titleField: 'title' },
  { collection: 'careers', titleField: 'title' },
  { collection: 'media', titleField: 'filename' },
  { collection: 'job-applications', titleField: 'name' },
  { collection: 'contact-messages', titleField: 'name' },
] as const

export async function GET(request: Request) {
  try {
    const payload = await getPayload()
    const { user } = await payload.auth({ headers: await getHeaders() })
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const q = new URL(request.url).searchParams.get('q')?.trim() || ''
    if (q.length < 2 || q.length > 80) {
      return NextResponse.json({ results: [] })
    }

    const batches = await Promise.all(
      SEARCH_TARGETS.map(async (target) => {
        try {
          const result = await payload.find({
            collection: target.collection as 'blogs',
            depth: 0,
            limit: 4,
            overrideAccess: true,
            where: {
              [target.titleField]: {
                like: q,
              },
            },
          })

          return result.docs.map((doc) => {
            const record = doc as unknown as Record<string, unknown>
            const title =
              (typeof record[target.titleField] === 'string' && record[target.titleField]) ||
              String(record.id)
            return {
              id: `${target.collection}-${record.id}`,
              label: String(title),
              href: `/admin/collections/${target.collection}/${record.id}`,
              group: target.collection,
            }
          })
        } catch {
          return []
        }
      }),
    )

    return NextResponse.json({ results: batches.flat().slice(0, 32) })
  } catch {
    return NextResponse.json({ error: 'Search failed' }, { status: 500 })
  }
}
