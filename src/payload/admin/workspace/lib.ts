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
