import type { AdminViewServerProps } from 'payload'
import Link from 'next/link'
import React from 'react'

import { countCollection } from './lib'
import { WorkspacePanel, WorkspaceShell } from './WorkspaceShell'

export async function AnalyticsView(props: AdminViewServerProps) {
  const { payload } = props

  const [
    pages,
    blogs,
    services,
    industries,
    solutions,
    careers,
    media,
    apps,
    messages,
    subscribers,
  ] = await Promise.all([
    countCollection(payload, 'pages'),
    countCollection(payload, 'blogs'),
    countCollection(payload, 'services'),
    countCollection(payload, 'industries'),
    countCollection(payload, 'solutions'),
    countCollection(payload, 'careers'),
    countCollection(payload, 'media'),
    countCollection(payload, 'job-applications'),
    countCollection(payload, 'contact-messages'),
    countCollection(payload, 'newsletter-subscribers'),
  ])

  let analyticsGlobal: Record<string, unknown> = {}
  try {
    analyticsGlobal = (await payload.findGlobal({
      slug: 'analytics',
      overrideAccess: true,
    })) as unknown as Record<string, unknown>
  } catch {
    analyticsGlobal = {}
  }

  const tracking = [
    { label: 'Google Analytics', configured: Boolean(analyticsGlobal.googleAnalyticsId) },
    { label: 'GTM', configured: Boolean(analyticsGlobal.googleTagManagerId) },
    { label: 'Meta Pixel', configured: Boolean(analyticsGlobal.metaPixelId) },
    { label: 'LinkedIn', configured: Boolean(analyticsGlobal.linkedinPartnerId) },
  ]

  return (
    <WorkspaceShell
      active="analytics"
      title="Analytics"
      subtitle="Operational metrics from Payload collections plus tracking configuration health."
      stats={[
        { label: 'Pages', value: pages, href: '/admin/collections/pages' },
        { label: 'Insights', value: blogs, href: '/admin/collections/blogs', tone: 'accent' },
        { label: 'Services', value: services, href: '/admin/collections/services' },
        {
          label: 'Applications',
          value: apps,
          href: '/admin/collections/job-applications',
          tone: 'warn',
        },
      ]}
      actions={[{ label: 'Tracking settings', href: '/admin/globals/analytics', primary: true }]}
    >
      <div className="xe-ws-grid xe-ws-grid--2">
        <WorkspacePanel title="Content footprint">
          <ul className="xe-ws-kv">
            {[
              ['Industries', industries, '/admin/collections/industries'],
              ['Solutions', solutions, '/admin/collections/solutions'],
              ['Careers', careers, '/admin/collections/careers'],
              ['Media assets', media, '/admin/collections/media'],
              ['Contact messages', messages, '/admin/collections/contact-messages'],
              ['Newsletter subscribers', subscribers, '/admin/collections/newsletter-subscribers'],
            ].map(([label, value, href]) => (
              <li key={String(label)}>
                <Link href={String(href)}>
                  <span>{label}</span>
                  <strong>{value as number}</strong>
                </Link>
              </li>
            ))}
          </ul>
        </WorkspacePanel>
        <WorkspacePanel
          title="Tracking health"
          href="/admin/globals/analytics"
          linkLabel="Configure"
        >
          <ul className="xe-ws-kv">
            {tracking.map((item) => (
              <li key={item.label}>
                <span>{item.label}</span>
                <strong className={item.configured ? 'is-ok' : 'is-miss'}>
                  {item.configured ? 'Configured' : 'Missing'}
                </strong>
              </li>
            ))}
          </ul>
          <p className="xe-ws-note">
            Traffic charts live in your analytics provider. This workspace keeps CMS-side counts and
            tag configuration under one authentication layer.
          </p>
        </WorkspacePanel>
      </div>
    </WorkspaceShell>
  )
}

export default AnalyticsView
