import type { Payload } from 'payload'
import React from 'react'

import { DashboardShell, type DashRow, type DashStat } from './DashboardShell'

type BeforeDashboardProps = {
  payload: Payload
  user?: {
    email?: string
    name?: string
    firstName?: string
  } | null
}

async function countSafe(payload: Payload, collection: string) {
  try {
    const result = await payload.count({
      collection: collection as 'pages',
      overrideAccess: true,
    })
    return result.totalDocs
  } catch {
    return 0
  }
}

async function recentDocs(
  payload: Payload,
  collection: string,
  titleField: string,
): Promise<DashRow[]> {
  try {
    const result = await payload.find({
      collection: collection as 'blogs',
      depth: 0,
      limit: 5,
      sort: '-updatedAt',
      overrideAccess: true,
    })

    return result.docs.map((doc) => {
      const record = doc as unknown as Record<string, unknown>
      const title =
        (typeof record[titleField] === 'string' && record[titleField]) ||
        (typeof record.title === 'string' && record.title) ||
        (typeof record.name === 'string' && record.name) ||
        `Item ${String(record.id)}`

      const status = typeof record._status === 'string' ? record._status : undefined
      const updatedAt =
        typeof record.updatedAt === 'string' ? new Date(record.updatedAt).toLocaleDateString() : ''

      return {
        id: String(record.id),
        title: String(title),
        subtitle: updatedAt ? `Updated ${updatedAt}` : 'Recently updated',
        href: `/admin/collections/${collection}/${record.id}`,
        badge: status,
        badgeTone: status === 'published' ? 'open' : 'default',
      }
    })
  } catch {
    return []
  }
}

async function recentMessages(payload: Payload): Promise<DashRow[]> {
  try {
    const result = await payload.find({
      collection: 'contact-messages',
      depth: 0,
      limit: 5,
      sort: '-createdAt',
      overrideAccess: true,
    })

    return result.docs.map((doc) => {
      const record = doc as unknown as Record<string, unknown>
      const name =
        (typeof record.name === 'string' && record.name) ||
        (typeof record.email === 'string' && record.email) ||
        'Message'
      const subject =
        (typeof record.subject === 'string' && record.subject) ||
        (typeof record.message === 'string' && String(record.message).slice(0, 48)) ||
        'Inbound inquiry'
      const createdAt =
        typeof record.createdAt === 'string' ? new Date(record.createdAt).toLocaleDateString() : ''

      return {
        id: String(record.id),
        title: String(name),
        subtitle: `${subject}${createdAt ? ` · ${createdAt}` : ''}`,
        href: `/admin/collections/contact-messages/${record.id}`,
        badge: 'New',
        badgeTone: 'open',
      }
    })
  } catch {
    return []
  }
}

export const BeforeDashboard = async (props: BeforeDashboardProps) => {
  const { payload, user } = props

  const [
    blogsCount,
    servicesCount,
    careersCount,
    messagesCount,
    blogs,
    services,
    careers,
    messages,
  ] = await Promise.all([
    countSafe(payload, 'blogs'),
    countSafe(payload, 'services'),
    countSafe(payload, 'careers'),
    countSafe(payload, 'contact-messages'),
    recentDocs(payload, 'blogs', 'title'),
    recentDocs(payload, 'services', 'title'),
    recentDocs(payload, 'careers', 'title'),
    recentMessages(payload),
  ])

  const stats: DashStat[] = [
    {
      label: 'Blog posts',
      value: blogsCount,
      meta: 'Content library',
      href: '/admin/collections/blogs',
    },
    {
      label: 'Services',
      value: servicesCount,
      meta: 'Live offerings',
      href: '/admin/collections/services',
    },
    {
      label: 'Open careers',
      value: careersCount,
      meta: 'Hiring pipeline',
      href: '/admin/collections/careers',
    },
    {
      label: 'Messages',
      value: messagesCount,
      meta: 'Inbound demand',
      href: '/admin/collections/contact-messages',
    },
  ]

  const userName =
    (typeof user?.email === 'string' ? user.email.split('@')[0] : undefined) ||
    user?.name ||
    user?.firstName

  return (
    <DashboardShell
      userName={userName}
      stats={stats}
      blogs={blogs}
      services={services}
      careers={careers}
      messages={messages}
    />
  )
}

export default BeforeDashboard
