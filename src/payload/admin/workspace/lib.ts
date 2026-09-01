import type { Payload } from 'payload'

export type WorkspaceStat = {
  label: string
  value: number | string
  meta?: string
  href?: string
  tone?: 'default' | 'accent' | 'warn' | 'muted'
}

export type WorkspaceRow = {
  id: string
  title: string
  subtitle?: string
  href: string
  badge?: string
  badgeTone?: 'default' | 'open' | 'warn' | 'muted'
  meta?: string
}

export async function countCollection(
  payload: Payload,
  collection: string,
  where?: Record<string, unknown>,
) {
  try {
    const result = await payload.count({
      collection: collection as 'pages',
      where: where as never,
      overrideAccess: true,
    })
    return result.totalDocs
  } catch {
    return 0
  }
}

export async function listRecent(
  payload: Payload,
  collection: string,
  opts: {
    titleField?: string
    limit?: number
    sort?: string
    where?: Record<string, unknown>
    hrefBase?: string
  } = {},
): Promise<WorkspaceRow[]> {
  const {
    titleField = 'title',
    limit = 8,
    sort = '-updatedAt',
    where,
    hrefBase = `/admin/collections/${collection}`,
  } = opts

  try {
    const result = await payload.find({
      collection: collection as 'blogs',
      depth: 0,
      limit,
      sort,
      where: where as never,
      overrideAccess: true,
    })

    return result.docs.map((doc) => {
      const record = doc as unknown as Record<string, unknown>
      const title =
        (typeof record[titleField] === 'string' && record[titleField]) ||
        (typeof record.title === 'string' && record.title) ||
        (typeof record.name === 'string' && record.name) ||
        (typeof record.email === 'string' && record.email) ||
        `Item ${String(record.id)}`
      const status =
        (typeof record.status === 'string' && record.status) ||
        (typeof record._status === 'string' && record._status) ||
        undefined
      const updated =
        typeof record.updatedAt === 'string'
          ? new Date(record.updatedAt).toLocaleString()
          : typeof record.createdAt === 'string'
            ? new Date(record.createdAt).toLocaleString()
            : ''

      return {
        id: String(record.id),
        title: String(title),
        subtitle: updated ? `Updated ${updated}` : undefined,
        href: `${hrefBase}/${record.id}`,
        badge: status,
        badgeTone:
          status === 'published' || status === 'new' || status === 'hired'
            ? 'open'
            : status === 'rejected' || status === 'spam'
              ? 'warn'
              : 'default',
        meta: typeof record.applicationId === 'string' ? record.applicationId : undefined,
      }
    })
  } catch {
    return []
  }
}

export const WORKSPACE_NAV = [
  {
    id: 'recruitment',
    label: 'Recruitment',
    href: '/admin/workspace/recruitment',
    description: 'Jobs, applicants, hiring pipeline',
  },
  {
    id: 'crm',
    label: 'CRM Inbox',
    href: '/admin/workspace/crm',
    description: 'Contact inquiries and follow-ups',
  },
  {
    id: 'analytics',
    label: 'Analytics',
    href: '/admin/workspace/analytics',
    description: 'Content and engagement overview',
  },
  {
    id: 'newsletter',
    label: 'Newsletter',
    href: '/admin/workspace/newsletter',
    description: 'Subscribers and audience health',
  },
  {
    id: 'seo',
    label: 'SEO Center',
    href: '/admin/workspace/seo',
    description: 'Defaults, coverage, and audits',
  },
  {
    id: 'ai',
    label: 'AI Assistant',
    href: '/admin/workspace/ai',
    description: 'Draft and refine marketing copy',
  },
  {
    id: 'media',
    label: 'Media Studio',
    href: '/admin/workspace/media',
    description: 'Library, folders, and assets',
  },
  {
    id: 'activity',
    label: 'Activity',
    href: '/admin/workspace/activity',
    description: 'Recent changes across the CMS',
  },
] as const

/** @deprecated Horizontal tabs removed — sidebar BusinessNav is the source of truth */

export type TrafficPoint = { date: string; label: string; views: number }
export type TopPage = { path: string; views: number }

function dayKey(d: Date) {
  return d.toISOString().slice(0, 10)
}

/** Last N days of pageviews + prior window for real deltas (no invented %). */
export async function getTrafficOverview(
  payload: Payload,
  days = 30,
): Promise<{
  series: TrafficPoint[]
  pageviews: number
  priorPageviews: number
  topPages: TopPage[]
  distinctPaths: number
}> {
  const now = new Date()
  const start = new Date(now)
  start.setDate(start.getDate() - (days - 1))
  start.setHours(0, 0, 0, 0)
  const priorStart = new Date(start)
  priorStart.setDate(priorStart.getDate() - days)

  const empty = {
    series: [] as TrafficPoint[],
    pageviews: 0,
    priorPageviews: 0,
    topPages: [] as TopPage[],
    distinctPaths: 0,
  }

  try {
    const result = await payload.find({
      collection: 'analytics-events',
      depth: 0,
      limit: 2000,
      overrideAccess: true,
      sort: '-createdAt',
      where: {
        and: [
          { type: { equals: 'pageview' } },
          { createdAt: { greater_than_equal: priorStart.toISOString() } },
        ],
      } as never,
    })

    const byDay = new Map<string, number>()
    const byPath = new Map<string, number>()
    let pageviews = 0
    let priorPageviews = 0
    const paths = new Set<string>()

    for (const doc of result.docs) {
      const created =
        typeof (doc as { createdAt?: string }).createdAt === 'string'
          ? new Date((doc as { createdAt: string }).createdAt)
          : null
      if (!created || Number.isNaN(created.getTime())) continue
      const path =
        typeof (doc as { path?: string }).path === 'string' ? (doc as { path: string }).path : '/'
      const key = dayKey(created)
      if (created >= start) {
        pageviews += 1
        byDay.set(key, (byDay.get(key) || 0) + 1)
        byPath.set(path, (byPath.get(path) || 0) + 1)
        paths.add(path)
      } else {
        priorPageviews += 1
      }
    }

    const series: TrafficPoint[] = []
    for (let i = 0; i < days; i++) {
      const d = new Date(start)
      d.setDate(start.getDate() + i)
      const key = dayKey(d)
      series.push({
        date: key,
        label: d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
        views: byDay.get(key) || 0,
      })
    }

    const topPages = [...byPath.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([path, views]) => ({ path, views }))

    return { series, pageviews, priorPageviews, topPages, distinctPaths: paths.size }
  } catch {
    return empty
  }
}

export function formatDelta(
  current: number,
  prior: number,
): { text: string; tone: 'up' | 'down' | 'flat' } {
  if (prior === 0 && current === 0) return { text: 'No prior data', tone: 'flat' }
  if (prior === 0) return { text: 'New this period', tone: 'up' }
  const pct = ((current - prior) / prior) * 100
  const rounded = Math.round(pct * 10) / 10
  if (rounded === 0) return { text: '0% vs prior period', tone: 'flat' }
  if (rounded > 0) return { text: `↑ ${rounded}% vs prior period`, tone: 'up' }
  return { text: `↓ ${Math.abs(rounded)}% vs prior period`, tone: 'down' }
}
