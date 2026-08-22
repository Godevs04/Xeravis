import Link from 'next/link'
import React from 'react'

import { ContentShell } from '@/payload/admin/components/layout/ContentShell'
import { EmptyState } from '@/payload/admin/components/ui/EmptyState'
import { PageHeader } from '@/payload/admin/components/ui/PageHeader'
import { StatCard } from '@/payload/admin/components/ui/StatCard'
import { StatusBadge } from '@/payload/admin/components/ui/StatusBadge'

import type { WorkspaceRow, WorkspaceStat } from './lib'

type WorkspaceShellProps = {
  title: string
  subtitle: string
  /** Kept for call-site compatibility — horizontal tab strip removed (sidebar is source of truth) */
  active?: string
  stats?: WorkspaceStat[]
  actions?: { label: string; href: string; primary?: boolean }[]
  children: React.ReactNode
}

function badgeTone(tone?: WorkspaceStat['tone'] | WorkspaceRow['badgeTone']) {
  if (tone === 'accent' || tone === 'open') return 'success' as const
  if (tone === 'warn') return 'warning' as const
  if (tone === 'muted') return 'muted' as const
  return 'default' as const
}

export function WorkspaceShell({
  title,
  subtitle,
  stats = [],
  actions = [],
  children,
}: WorkspaceShellProps) {
  return (
    <ContentShell className="xe-ws">
      <PageHeader
        eyebrow="Xelarvis Admin"
        title={title}
        description={subtitle}
        actions={
          actions.length > 0 ? (
            <>
              {actions.map((action) => (
                <Link
                  key={action.href}
                  href={action.href}
                  className={action.primary ? 'xe-ws-btn xe-ws-btn--primary' : 'xe-ws-btn'}
                >
                  {action.label}
                </Link>
              ))}
            </>
          ) : undefined
        }
      />

      {stats.length > 0 ? (
        <section className="xe-ws__stats" aria-label="Workspace metrics">
          {stats.map((stat) => {
            const card = <StatCard label={stat.label} value={stat.value} hint={stat.meta} />
            return stat.href ? (
              <Link key={stat.label} href={stat.href} className="xe-ws-stat-link">
                {card}
              </Link>
            ) : (
              <div key={stat.label} className="xe-ws-stat-link">
                {card}
              </div>
            )
          })}
        </section>
      ) : null}

      <div className="xe-ws__body">{children}</div>
    </ContentShell>
  )
}

export function WorkspacePanel({
  title,
  href,
  linkLabel = 'Open',
  children,
}: {
  title: string
  href?: string
  linkLabel?: string
  children: React.ReactNode
}) {
  return (
    <section className="xe-ws-panel xe-card is-static">
      <div className="xe-ws-panel__head">
        <h2 className="xe-card__title">{title}</h2>
        {href ? (
          <Link href={href} className="xe-ws-panel__link">
            {linkLabel}
          </Link>
        ) : null}
      </div>
      <div className="xe-ws-panel__body">{children}</div>
    </section>
  )
}

export function WorkspaceTable({ rows, empty }: { rows: WorkspaceRow[]; empty: string }) {
  if (!rows.length) return <EmptyState title="No items" description={empty} />

  return (
    <ul className="xe-ws-list">
      {rows.map((row) => (
        <li key={row.id}>
          <Link href={row.href} className="xe-ws-row">
            <span className="xe-ws-row__main">
              <span className="xe-ws-row__title">{row.title}</span>
              {row.subtitle ? <span className="xe-ws-row__sub">{row.subtitle}</span> : null}
            </span>
            {row.badge ? (
              <StatusBadge tone={badgeTone(row.badgeTone)}>{row.badge}</StatusBadge>
            ) : null}
          </Link>
        </li>
      ))}
    </ul>
  )
}
