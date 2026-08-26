import type { AdminViewServerProps } from 'payload'
import React from 'react'

import {
  countCollection,
  formatDelta,
  getTrafficOverview,
  listRecent,
} from '@/payload/admin/workspace/lib'

import { AfterDashboard } from './AfterDashboard'
import {
  DashboardShell,
  type DashRow,
  type DashStat,
  type DashTask,
  type SystemStatus,
} from './DashboardShell'

function toDashRows(rows: Awaited<ReturnType<typeof listRecent>>): DashRow[] {
  return rows.map((row) => ({
    id: row.id,
    title: row.title,
    subtitle: row.subtitle || row.meta || '',
    href: row.href,
    badge: row.badge,
  }))
}

function formatRange(days = 30) {
  const end = new Date()
  const start = new Date()
  start.setDate(end.getDate() - (days - 1))
  const opts: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric', year: 'numeric' }
  return `${start.toLocaleDateString(undefined, opts)} – ${end.toLocaleDateString(undefined, opts)}`
}

export async function EnterpriseDashboard(props: AdminViewServerProps) {
  const { payload, user } = props

  const [
    traffic,
    newLeads,
    newApps,
    draftBlogs,
    messagesCount,
    applicationsCount,
    uniqueLeadsPeriod,
    messages,
    applications,
    activity,
    interviewsUpcoming,
  ] = await Promise.all([
    getTrafficOverview(payload, 30),
    countCollection(payload, 'contact-messages', { status: { equals: 'new' } }),
    countCollection(payload, 'job-applications', { status: { equals: 'new' } }),
    countCollection(payload, 'blogs', { _status: { equals: 'draft' } }),
    countCollection(payload, 'contact-messages'),
    countCollection(payload, 'job-applications'),
    countCollection(payload, 'analytics-events', { type: { equals: 'lead' } }),
    listRecent(payload, 'contact-messages', {
      titleField: 'name',
      sort: '-createdAt',
      limit: 4,
      where: { status: { equals: 'new' } },
    }),
    listRecent(payload, 'job-applications', {
      titleField: 'name',
      sort: '-createdAt',
      limit: 4,
    }),
    listRecent(payload, 'activity-logs', {
      titleField: 'summary',
      sort: '-createdAt',
      limit: 6,
    }),
    countCollection(payload, 'interviews', {
      and: [
        { scheduledAt: { greater_than_equal: new Date().toISOString() } },
        { outcome: { equals: 'scheduled' } },
      ],
    }),
  ])

  const viewsDelta = formatDelta(traffic.pageviews, traffic.priorPageviews)
  const leadsDelta = formatDelta(messagesCount, Math.max(0, messagesCount - newLeads))

  const stats: DashStat[] = [
    {
      label: 'Total Visitors',
      value: traffic.distinctPaths,
      meta:
        traffic.distinctPaths > 0
          ? `${traffic.distinctPaths} unique paths · 30d`
          : 'Awaiting first visits',
      href: '/admin/workspace/analytics',
      tone: traffic.distinctPaths > 0 ? 'up' : 'flat',
      icon: '◎',
    },
    {
      label: 'Page Views',
      value: traffic.pageviews,
      meta: viewsDelta.text,
      href: '/admin/collections/analytics-events',
      tone: viewsDelta.tone,
      icon: '◈',
    },
    {
      label: 'Leads',
      value: messagesCount,
      meta: newLeads ? `${newLeads} need reply` : leadsDelta.text,
      href: '/admin/collections/contact-messages',
      tone: newLeads > 0 ? 'up' : 'flat',
      icon: '✉',
    },
    {
      label: 'Applications',
      value: applicationsCount,
      meta: newApps ? `${newApps} new` : `${uniqueLeadsPeriod} lead events tracked`,
      href: '/admin/collections/job-applications',
      tone: newApps > 0 ? 'up' : 'flat',
      icon: '▣',
    },
  ]

  const tasks: DashTask[] = []
  if (newLeads > 0) {
    tasks.push({
      id: 'leads',
      title: `Reply to ${newLeads} lead${newLeads === 1 ? '' : 's'}`,
      meta: 'CRM',
      href: '/admin/collections/contact-messages',
      tone: 'warn',
    })
  }
  if (newApps > 0) {
    tasks.push({
      id: 'apps',
      title: `Review ${newApps} application${newApps === 1 ? '' : 's'}`,
      meta: 'Recruitment',
      href: '/admin/collections/job-applications',
      tone: 'accent',
    })
  }
  if (draftBlogs > 0) {
    tasks.push({
      id: 'drafts',
      title: `Finish ${draftBlogs} draft${draftBlogs === 1 ? '' : 's'}`,
      meta: 'Content',
      href: '/admin/collections/blogs?where[_status][equals]=draft',
    })
  }
  if (interviewsUpcoming > 0) {
    tasks.push({
      id: 'interviews',
      title: `${interviewsUpcoming} interview${interviewsUpcoming === 1 ? '' : 's'} upcoming`,
      meta: 'Schedule',
      href: '/admin/collections/interviews',
      tone: 'accent',
    })
  }

  const pending = newLeads + newApps + draftBlogs
  const summary =
    pending > 0
      ? `${pending} item${pending === 1 ? '' : 's'} need attention.`
      : 'Nothing blocking — open a collection and ship.'

  const systemStatus: SystemStatus[] = [
    { id: 'website', label: 'Website', status: 'operational' },
    { id: 'api', label: 'API', status: 'operational' },
    {
      id: 'database',
      label: 'Database',
      status: traffic.pageviews >= 0 ? 'operational' : 'degraded',
    },
    { id: 'storage', label: 'Storage', status: 'operational' },
  ]

  const userRecord = user as { email?: string; name?: string } | null
  const userName =
    (typeof userRecord?.email === 'string' ? userRecord.email.split('@')[0] : undefined) ||
    userRecord?.name

  return (
    <>
      <DashboardShell
        userName={userName}
        summary={summary}
        dateRangeLabel={formatRange(30)}
        stats={stats}
        traffic={traffic.series}
        topPages={traffic.topPages}
        activity={toDashRows(activity)}
        systemStatus={systemStatus}
        tasks={tasks}
        messages={toDashRows(messages)}
        applications={toDashRows(applications)}
        quickActions={[
          { label: 'New blog', href: '/admin/collections/blogs/create' },
          { label: 'New job', href: '/admin/collections/careers/create' },
          { label: 'Leads', href: '/admin/collections/contact-messages' },
          { label: 'Upload', href: '/admin/collections/media/create' },
        ]}
      />
      <AfterDashboard />
    </>
  )
}

export default EnterpriseDashboard
