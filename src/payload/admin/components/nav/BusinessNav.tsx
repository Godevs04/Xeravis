'use client'

import Link from 'next/link'
import React, { useState } from 'react'

import { WORKSPACES, type WorkspaceId } from '@/payload/admin/workspace/definitions'
import { useWorkspaceOptional } from '@/payload/admin/workspace/WorkspaceContext'

const BIZ_ORDER: WorkspaceId[] = [
  'website',
  'marketing',
  'sales',
  'recruitment',
  'content',
  'analytics',
  'administration',
]

/** Business navigation — one row per workspace, modules as stacked links */
export const BusinessNav = () => {
  const ctx = useWorkspaceOptional()
  const [openId, setOpenId] = useState<WorkspaceId | null>(ctx?.workspaceId ?? 'website')

  return (
    <nav className="xe-biz-nav" aria-label="Business areas">
      <div className="xe-nav-section__title">Workspaces</div>
      <Link href="/admin" className="xe-biz-nav__item">
        <span className="xe-biz-nav__label">Dashboard</span>
      </Link>
      {BIZ_ORDER.map((id) => {
        const ws = WORKSPACES.find((w) => w.id === id)
        if (!ws) return null
        const active = ctx?.workspaceId === id
        const expanded = openId === id
        return (
          <div key={id} className="xe-biz-nav__group">
            <button
              type="button"
              className={`xe-biz-nav__item${active ? 'is-active' : ''}`}
              onClick={() => {
                ctx?.setWorkspace(id)
                setOpenId((prev) => (prev === id ? null : id))
              }}
            >
              <span className="xe-biz-nav__label">{ws.label}</span>
              <em className="xe-biz-nav__count">{ws.modules.length || ws.paths.length}</em>
            </button>
            {expanded ? (
              <div className="xe-biz-nav__modules">
                {ws.modules.map((m) => (
                  <Link key={m.href} href={m.href} className="xe-biz-nav__module">
                    {m.label}
                  </Link>
                ))}
                {ws.creates.slice(0, 2).map((c) => (
                  <Link
                    key={`${c.href}-${c.label}`}
                    href={c.href}
                    className="xe-biz-nav__module xe-biz-nav__module--create"
                  >
                    + {c.label}
                  </Link>
                ))}
              </div>
            ) : null}
          </div>
        )
      })}
    </nav>
  )
}

export default BusinessNav
