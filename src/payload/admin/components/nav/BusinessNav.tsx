'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect, useState } from 'react'

import { WORKSPACES, type WorkspaceId } from '@/payload/admin/workspace/definitions'
import { useWorkspaceOptional } from '@/payload/admin/workspace/WorkspaceContext'

type NavSection = {
  title: string
  items: Array<
    | { kind: 'link'; label: string; href: string; hint?: string; icon: string }
    | { kind: 'area'; id: WorkspaceId; icon: string }
  >
}

/**
 * Default side header — curated Payload collection/global links.
 * No /admin/workspace/* navigation; hubs stay on Command Center only.
 */
const SECTIONS: NavSection[] = [
  {
    title: 'Overview',
    items: [
      {
        kind: 'link',
        label: 'Command Center',
        href: '/admin',
        hint: 'Executive dashboard',
        icon: '⌂',
      },
    ],
  },
  {
    title: 'Website',
    items: [{ kind: 'area', id: 'website', icon: '◈' }],
  },
  {
    title: 'Insights',
    items: [{ kind: 'area', id: 'content', icon: '✎' }],
  },
  {
    title: 'Growth',
    items: [
      { kind: 'area', id: 'marketing', icon: '◎' },
      { kind: 'area', id: 'sales', icon: '✉' },
    ],
  },
  {
    title: 'Recruitment',
    items: [{ kind: 'area', id: 'recruitment', icon: '▣' }],
  },
  {
    title: 'Intelligence',
    items: [{ kind: 'area', id: 'analytics', icon: '▤' }],
  },
  {
    title: 'System',
    items: [{ kind: 'area', id: 'administration', icon: '⚙' }],
  },
]

function isLinkActive(pathname: string, href: string) {
  if (href === '/admin') return pathname === '/admin' || pathname === '/admin/'
  return pathname === href || pathname.startsWith(`${href}/`)
}

function areaHasActiveLink(pathname: string, id: WorkspaceId) {
  const ws = WORKSPACES.find((w) => w.id === id)
  if (!ws) return false
  return ws.links.some((l) => isLinkActive(pathname, l.href))
}

/** Side header: expand areas → open real Payload collections/globals */
export const BusinessNav = () => {
  const ctx = useWorkspaceOptional()
  const pathname = usePathname() || '/admin'
  const [openId, setOpenId] = useState<WorkspaceId | null>(ctx?.workspaceId ?? 'website')

  useEffect(() => {
    const fromPath = WORKSPACES.find((w) => w.links.some((l) => isLinkActive(pathname, l.href)))
    if (fromPath) {
      setOpenId(fromPath.id)
      ctx?.setWorkspace(fromPath.id)
    } else if (ctx?.workspaceId) {
      setOpenId(ctx.workspaceId)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- sync from route only
  }, [pathname])

  return (
    <nav className="xe-biz-nav xe-biz-nav--os" aria-label="Admin navigation">
      {SECTIONS.map((section) => (
        <div key={section.title} className="xe-biz-nav__section">
          <div className="xe-nav-section__title">{section.title}</div>
          {section.items.map((item) => {
            if (item.kind === 'link') {
              const active = isLinkActive(pathname, item.href)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`xe-biz-nav__item xe-biz-nav__item--link${active ? 'is-active' : ''}`}
                >
                  <span className="xe-biz-nav__icon" aria-hidden>
                    {item.icon}
                  </span>
                  <span className="xe-biz-nav__copy">
                    <span className="xe-biz-nav__label">{item.label}</span>
                    {item.hint ? <span className="xe-biz-nav__hint">{item.hint}</span> : null}
                  </span>
                </Link>
              )
            }

            const ws = WORKSPACES.find((w) => w.id === item.id)
            if (!ws) return null
            const active = areaHasActiveLink(pathname, item.id) || ctx?.workspaceId === item.id
            const expanded = openId === item.id
            return (
              <div key={item.id} className="xe-biz-nav__group">
                <button
                  type="button"
                  className={`xe-biz-nav__item${active ? 'is-active' : ''}${expanded ? 'is-open' : ''}`}
                  onClick={() => {
                    ctx?.setWorkspace(item.id)
                    setOpenId((prev) => (prev === item.id ? null : item.id))
                  }}
                >
                  <span className="xe-biz-nav__icon" aria-hidden>
                    {item.icon}
                  </span>
                  <span className="xe-biz-nav__copy">
                    <span className="xe-biz-nav__label">{ws.label}</span>
                    <span className="xe-biz-nav__hint">{ws.description}</span>
                  </span>
                  <em className="xe-biz-nav__count">{ws.links.length}</em>
                </button>
                {expanded ? (
                  <div className="xe-biz-nav__modules">
                    {ws.links.map((m) => (
                      <Link
                        key={m.href}
                        href={m.href}
                        className={`xe-biz-nav__module${isLinkActive(pathname, m.href) ? 'is-active' : ''}`}
                      >
                        <span>{m.label}</span>
                        {m.hint ? <em>{m.hint}</em> : null}
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
        </div>
      ))}
    </nav>
  )
}

export default BusinessNav
