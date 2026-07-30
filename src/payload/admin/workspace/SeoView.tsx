import type { AdminViewServerProps, Payload } from 'payload'
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
  { slug: 'research', label: 'Research' },
] as const

async function auditCollection(payload: Payload, slug: string) {
  try {
    const result = await payload.find({
      collection: slug as 'blogs',
      depth: 0,
      limit: 100,
      overrideAccess: true,
    })

    let missingMeta = 0
    let missingOg = 0
    let missingImage = 0

    for (const doc of result.docs) {
      const record = doc as unknown as Record<string, unknown>
      const meta = (record.meta || {}) as Record<string, unknown>
      if (!meta.title && !meta.description) missingMeta += 1
      if (!meta.image) missingOg += 1
      if (!record.cover && !record.heroImage && !meta.image) missingImage += 1
    }

    return {
      total: result.totalDocs,
      scanned: result.docs.length,
      missingMeta,
      missingOg,
      missingImage,
    }
  } catch {
    return { total: 0, scanned: 0, missingMeta: 0, missingOg: 0, missingImage: 0 }
  }
}

export async function SeoView(props: AdminViewServerProps) {
  const { payload } = props

  const audits = await Promise.all(
    SEO_COLLECTIONS.map(async (item) => ({
      ...item,
      ...(await auditCollection(payload, item.slug)),
    })),
  )

  const missingMeta = audits.reduce((sum, a) => sum + a.missingMeta, 0)
  const missingOg = audits.reduce((sum, a) => sum + a.missingOg, 0)
  const missingImage = audits.reduce((sum, a) => sum + a.missingImage, 0)
  const scanned = audits.reduce((sum, a) => sum + a.scanned, 0)
  const score =
    scanned === 0
      ? 100
      : Math.max(
          0,
          Math.round(100 - ((missingMeta + missingOg + missingImage) / (scanned * 3)) * 100),
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
  const researchCount = await countCollection(payload, 'research')

  return (
    <WorkspaceShell
      active="seo"
      title="SEO Center"
      subtitle="Coverage audits for meta, OG, and imagery — plus sitemap and robots shortcuts."
      stats={[
        {
          label: 'SEO score',
          value: `${score}`,
          tone: score >= 80 ? 'accent' : 'warn',
          meta: 'Coverage health',
        },
        { label: 'Missing meta', value: missingMeta, tone: missingMeta ? 'warn' : 'accent' },
        { label: 'Missing OG', value: missingOg, tone: missingOg ? 'warn' : 'default' },
        { label: 'Missing image', value: missingImage, tone: missingImage ? 'warn' : 'default' },
        {
          label: 'Defaults',
          value: seoDefaults.titleTemplate ? 'Set' : 'Missing',
          tone: seoDefaults.titleTemplate ? 'accent' : 'warn',
        },
        { label: 'Research docs', value: researchCount, href: '/admin/collections/research' },
      ]}
      actions={[
        { label: 'SEO defaults', href: '/admin/globals/seo-defaults', primary: true },
        { label: 'Sitemap', href: '/sitemap.xml' },
        { label: 'Robots', href: '/robots.txt' },
      ]}
    >
      <div className="xe-ws-grid xe-ws-grid--2">
        <WorkspacePanel title="Collection audit">
          <ul className="xe-ws-kv">
            {audits.map((item) => (
              <li key={item.slug}>
                <Link href={`/admin/collections/${item.slug}`}>
                  <span>
                    {item.label} · {item.missingMeta + item.missingOg} gaps
                  </span>
                  <strong>{item.total}</strong>
                </Link>
              </li>
            ))}
          </ul>
          <p className="xe-ws-note">
            Schema checklist: Organization JSON-LD ships on the public layout. Add Article schema on
            insight templates as content matures.
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
