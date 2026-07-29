import type { AdminViewServerProps } from 'payload'
import Link from 'next/link'
import React from 'react'

import { countCollection, listRecent } from './lib'
import { WorkspacePanel, WorkspaceShell, WorkspaceTable } from './WorkspaceShell'

const SEO_COLLECTIONS = [
  { slug: 'pages', label: 'Pages' },
  { slug: 'blogs', label: 'Insights' },
  { slug: 'services', label: 'Services' },
  { slug: 'solutions', label: 'Solutions' },
  { slug: 'industries', label: 'Industries' },
  { slug: 'case-studies', label: 'Case studies' },
  { slug: 'careers', label: 'Careers' },
] as const

export async function SeoView(props: AdminViewServerProps) {
  const { payload } = props

  const counts = await Promise.all(
    SEO_COLLECTIONS.map(async (item) => ({
      ...item,
      total: await countCollection(payload, item.slug),
    })),
  )

  let seoDefaults: Record<string, unknown> = {}
  try {
    seoDefaults = (await payload.findGlobal({
      slug: 'seo-defaults',
      overrideAccess: true,
    })) as unknown as Record<string, unknown>
  } catch {
    seoDefaults = {}
  }

  const recentBlogs = await listRecent(payload, 'blogs', { limit: 6 })

  return (
    <WorkspaceShell
      active="seo"
      title="SEO Center"
      subtitle="Defaults, collection coverage, and quick access to meta-managed documents."
      stats={[
        {
          label: 'Title template',
          value: typeof seoDefaults.titleTemplate === 'string' ? 'Set' : 'Missing',
          tone: seoDefaults.titleTemplate ? 'accent' : 'warn',
        },
        {
          label: 'Default description',
          value: typeof seoDefaults.defaultDescription === 'string' ? 'Set' : 'Missing',
          tone: seoDefaults.defaultDescription ? 'accent' : 'warn',
        },
        {
          label: 'Indexed collections',
          value: SEO_COLLECTIONS.length,
          meta: 'SEO plugin enabled',
        },
        {
          label: 'Insights posts',
          value: counts.find((c) => c.slug === 'blogs')?.total ?? 0,
          href: '/admin/collections/blogs',
        },
      ]}
      actions={[
        { label: 'SEO defaults', href: '/admin/globals/seo-defaults', primary: true },
        { label: 'Site settings', href: '/admin/globals/site-settings' },
      ]}
    >
      <div className="xe-ws-grid xe-ws-grid--2">
        <WorkspacePanel title="Collection coverage">
          <ul className="xe-ws-kv">
            {counts.map((item) => (
              <li key={item.slug}>
                <Link href={`/admin/collections/${item.slug}`}>
                  <span>{item.label}</span>
                  <strong>{item.total}</strong>
                </Link>
              </li>
            ))}
          </ul>
          <p className="xe-ws-note">
            Edit meta title, description, and OG image on each document via the SEO plugin panel.
          </p>
        </WorkspacePanel>
        <WorkspacePanel title="Recent insights" href="/admin/collections/blogs">
          <WorkspaceTable rows={recentBlogs} empty="No blog posts yet." />
        </WorkspacePanel>
      </div>
    </WorkspaceShell>
  )
}

export default SeoView
