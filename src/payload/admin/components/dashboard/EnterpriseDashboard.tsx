import type { AdminViewServerProps } from 'payload'
import React from 'react'

import { countCollection, listRecent } from '@/payload/admin/workspace/lib'

import { AfterDashboard } from './AfterDashboard'
import { DashboardShell, type DashRow, type DashStat, type DashTask } from './DashboardShell'

function toDashRows(rows: Awaited<ReturnType<typeof listRecent>>): DashRow[] {
  return rows.map((row) => ({
    id: row.id,
    title: row.title,
    subtitle: row.subtitle || row.meta || '',
    href: row.href,
    badge: row.badge,
  }))
}

export async function EnterpriseDashboard(props: AdminViewServerProps) {
  const { payload, user } = props

  const [
    newLeads,
    newApps,
    draftBlogs,
    pageviews,
    messagesCount,
    applicationsCount,
    blogsCount,
    messages,
    applications,
    activity,
    interviewsUpcoming,
  ] = await Promise.all([
    countCollection(payload, 'contact-messages', { status: { equals: 'new' } }),
    countCollection(payload, 'job-applications', { status: { equals: 'new' } }),
    countCollection(payload, 'blogs', { _status: { equals: 'draft' } }),
    countCollection(payload, 'analytics-events', { type: { equals: 'pageview' } }),
    countCollection(payload, 'contact-messages'),
    countCollection(payload, 'job-applications'),
    countCollection(payload, 'blogs'),
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

  const stats: DashStat[] = [
    {
      label: 'Leads',
      value: messagesCount,
      meta: newLeads ? `${newLeads} need reply` : 'Inbox clear',
      href: '/admin/workspace/crm',
    },
    {
      label: 'Applications',
      value: applicationsCount,
      meta: newApps ? `${newApps} new` : 'No new apps',
      href: '/admin/workspace/recruitment',
    },
    {
      label: 'Traffic',
      value: pageviews,
      meta: 'Page views',
      href: '/admin/workspace/analytics',
    },
    {
      label: 'Insights',
      value: blogsCount,
      meta: draftBlogs ? `${draftBlogs} drafts` : 'Published library',
      href: '/admin/collections/blogs',
    },
  ]

  const tasks: DashTask[] = []
  if (newLeads > 0) {
    tasks.push({
      id: 'leads',
      title: `Reply to ${newLeads} lead${newLeads === 1 ? '' : 's'}`,
      meta: 'CRM',
      href: '/admin/workspace/crm',
      tone: 'warn',
    })
  }
  if (newApps > 0) {
    tasks.push({
      id: 'apps',
      title: `Review ${newApps} application${newApps === 1 ? '' : 's'}`,
      meta: 'Recruitment',
      href: '/admin/workspace/recruitment',
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
      : 'Nothing blocking — pick a workspace and ship.'

  const userRecord = user as { email?: string; name?: string } | null
  const userName =
    (typeof userRecord?.email === 'string' ? userRecord.email.split('@')[0] : undefined) ||
    userRecord?.name

  return (
    <>
      <DashboardShell
        userName={userName}
        summary={summary}
        stats={stats}
        tasks={tasks}
        activity={toDashRows(activity)}
        messages={toDashRows(messages)}
        applications={toDashRows(applications)}
        quickActions={[
          { label: 'New blog', href: '/admin/collections/blogs/create' },
          { label: 'New job', href: '/admin/collections/careers/create' },
          { label: 'Leads', href: '/admin/workspace/crm' },
          { label: 'Upload', href: '/admin/collections/media/create' },
        ]}
      />
      <AfterDashboard />
    </>
  )
}

export default EnterpriseDashboard
