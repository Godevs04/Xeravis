import Link from 'next/link'
import React from 'react'

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

function toneClass(tone?: WorkspaceStat['tone'] | WorkspaceRow['badgeTone']) {
  if (tone === 'accent' || tone === 'open') return 'xe-ws-badge--open'
  if (tone === 'warn') return 'xe-ws-badge--warn'
  if (tone === 'muted') return 'xe-ws-badge--muted'
  return ''
}

export function WorkspaceShell({
  title,
  subtitle,
  stats = [],
  actions = [],
  children,
}: WorkspaceShellProps) {
  return (
    <div className="xe-ws">
      <header className="xe-ws__hero">
        <div>
          <p className="xe-ws__eyebrow">Xelarvis Admin</p>
          <h1 className="xe-ws__title">{title}</h1>
          <p className="xe-ws__subtitle">{subtitle}</p>
        </div>
        {actions.length > 0 ? (
          <div className="xe-ws__actions">
            {actions.map((action) => (
              <Link
                key={action.href}
                href={action.href}
                className={action.primary ? 'xe-ws-btn xe-ws-btn--primary' : 'xe-ws-btn'}
              >
                {action.label}
              </Link>
            ))}
          </div>
        ) : null}
      </header>

      {stats.length > 0 ? (
        <section className="xe-ws__stats">
          {stats.map((stat) => {
            const inner = (
              <>
                <span className="xe-ws-stat__label">{stat.label}</span>
                <strong className="xe-ws-stat__value">{stat.value}</strong>
                {stat.meta ? <span className="xe-ws-stat__meta">{stat.meta}</span> : null}
              </>
            )
            return stat.href ? (
              <Link
                key={stat.label}
                href={stat.href}
                className={`xe-ws-stat ${toneClass(stat.tone)}`}
              >
                {inner}
              </Link>
            ) : (
              <div key={stat.label} className={`xe-ws-stat ${toneClass(stat.tone)}`}>
                {inner}
              </div>
            )
          })}
        </section>
      ) : null}

      <div className="xe-ws__body">{children}</div>
    </div>
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
    <section className="xe-ws-panel">
      <div className="xe-ws-panel__head">
        <h2>{title}</h2>
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
  if (!rows.length) return <p className="xe-ws-empty">{empty}</p>

  return (
    <ul className="xe-ws-list">
      {rows.map((row) => (
        <li key={row.id}>
          <Link href={row.href} className="xe-ws-row">
            <span className="xe-ws-row__main">
              <span className="xe-ws-row__title">{row.title}</span>
              {row.subtitle ? <span className="xe-ws-row__sub">{row.subtitle}</span> : null}
            </span>
            <span className="xe-ws-row__side">
              {row.meta ? <span className="xe-ws-row__meta">{row.meta}</span> : null}
              {row.badge ? (
                <span className={`xe-ws-badge ${toneClass(row.badgeTone)}`}>{row.badge}</span>
              ) : null}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  )
}
