'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@payloadcms/ui'
import posthog from 'posthog-js'
import React, { useCallback, useEffect, useMemo, useState } from 'react'

import { useWorkspaceOptional } from '@/payload/admin/workspace/WorkspaceContext'
import type { WorkspaceId } from '@/payload/admin/workspace/definitions'

import { NavGroup, NavItem, Sidebar, SidebarSection, UserProfile } from '../sidebar'
import {
  NAV_MODULES,
  QUICK_CREATES,
  isLinkActive,
  moduleHasActiveLink,
  resolveModuleNavigation,
  type NavModuleId,
} from './modules'

const NAV_KEY = 'xe-nav-collapsed'
const OPEN_KEY = 'xe-nav-open-modules'

function roleLabel(roles: unknown): string {
  if (!Array.isArray(roles) || roles.length === 0) return 'Member'
  return String(roles[0]).replace(/-/g, ' ')
}

function toggleCollapse() {
  const root = document.documentElement
  const next = root.getAttribute('data-xe-nav') === 'collapsed' ? 'expanded' : 'collapsed'
  root.setAttribute('data-xe-nav', next)
  window.localStorage.setItem(NAV_KEY, next === 'collapsed' ? '1' : '0')
}

function toggleTheme() {
  const root = document.documentElement
  const next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light'
  root.setAttribute('data-xe-ui', 'v5')
  root.setAttribute('data-theme', next)
  root.style.colorScheme = next
  window.localStorage.setItem('payload-theme', next)
  window.localStorage.setItem('xe-theme-preference', next)
}

function openCommand() {
  window.dispatchEvent(new CustomEvent('xe-open-command'))
}

function moduleToWorkspace(id: NavModuleId): WorkspaceId | null {
  if (id === 'overview' || id === 'media' || id === 'ai') return null
  return id as WorkspaceId
}

function readRememberedOpen(): Set<string> {
  try {
    const raw = window.localStorage.getItem(OPEN_KEY)
    if (!raw) return new Set()
    const parsed = JSON.parse(raw) as unknown
    return Array.isArray(parsed) ? new Set(parsed.map(String)) : new Set()
  } catch {
    return new Set()
  }
}

function writeRememberedOpen(ids: Set<string>) {
  window.localStorage.setItem(OPEN_KEY, JSON.stringify([...ids]))
}

/** Single Enterprise OS sidebar — Linear / Vercel / Salesforce quality. */
export function EnterpriseNav() {
  const pathname = usePathname() || '/admin'
  const ctx = useWorkspaceOptional()
  const { user } = useAuth()
  const routeNav = useMemo(() => resolveModuleNavigation(pathname), [pathname])
  const [manualOpen, setManualOpen] = useState<Set<string>>(() => new Set())
  const [collapsed, setCollapsed] = useState(false)

  const email =
    user && typeof user === 'object' && 'email' in user && typeof user.email === 'string'
      ? user.email
      : 'Account'
  const roles =
    user && typeof user === 'object' && 'roles' in user ? (user as { roles?: unknown }).roles : []
  const userId =
    user && typeof user === 'object' && 'id' in user && typeof user.id === 'string' ? user.id : null
  const role = roleLabel(roles)
  const name = email.includes('@') ? email.split('@')[0] : email
  const initials = name.slice(0, 2).toUpperCase()

  useEffect(() => {
    if (!userId) return
    posthog.identify(userId, { email, role })
  }, [email, role, userId])

  useEffect(() => {
    setManualOpen(readRememberedOpen())
    const sync = () => {
      setCollapsed(document.documentElement.getAttribute('data-xe-nav') === 'collapsed')
    }
    sync()
    const obs = new MutationObserver(sync)
    obs.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-xe-nav'],
    })
    return () => obs.disconnect()
  }, [])

  useEffect(() => {
    const ws = routeNav.section ? moduleToWorkspace(routeNav.section) : null
    if (ws) ctx?.setWorkspace(ws)

    // Auto-expand the route-active module and remember it
    if (routeNav.section) {
      setManualOpen((prev) => {
        if (prev.has(routeNav.section!)) return prev
        const next = new Set(prev)
        next.add(routeNav.section!)
        writeRememberedOpen(next)
        return next
      })
    }

    const id = window.requestAnimationFrame(() => {
      const active = document.querySelector<HTMLElement>(
        '.xe-sb-item.is-active, .xe-sb-sub__link.is-active',
      )
      active?.scrollIntoView({ block: 'nearest', inline: 'nearest' })
    })
    return () => window.cancelAnimationFrame(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps -- route sync only
  }, [pathname])

  const isExpanded = useCallback(
    (id: string) => {
      if (manualOpen.has(id)) return true
      return routeNav.section === id
    },
    [manualOpen, routeNav.section],
  )

  const toggleModule = useCallback(
    (id: NavModuleId) => {
      setManualOpen((prev) => {
        const next = new Set(prev)
        if (next.has(id)) next.delete(id)
        else next.add(id)
        writeRememberedOpen(next)
        return next
      })
      const ws = moduleToWorkspace(id)
      if (ws) ctx?.setWorkspace(ws)
    },
    [ctx],
  )

  const pinLabels = useMemo(() => {
    const fromWs = ctx?.workspace.links?.slice(0, 4)
    if (fromWs?.length) {
      return fromWs.map((l) => ({ href: l.href, label: l.label }))
    }
    return [
      { href: '/admin/globals/seo-defaults', label: 'SEO' },
      { href: '/admin/collections/media', label: 'Media' },
      { href: '/admin/collections/blogs', label: 'Blog' },
      { href: '/admin/collections/contact-messages', label: 'CRM' },
    ]
  }, [ctx?.workspace.links])

  const envLabel =
    typeof process !== 'undefined' && process.env.NODE_ENV === 'production' ? 'Production' : 'Local'

  const overview = NAV_MODULES.filter((m) => m.id === 'overview')
  const modules = NAV_MODULES.filter((m) => m.id !== 'overview')

  return (
    <Sidebar
      collapsed={collapsed}
      onToggleCollapse={toggleCollapse}
      onOpenCommand={openCommand}
      quickCreates={QUICK_CREATES}
      envLabel={envLabel}
      footer={
        <>
          {pinLabels.length > 0 ? (
            <SidebarSection label="Pinned" className="xe-sb-section--pins">
              <div className="xe-sb-pins" aria-label="Pinned">
                {pinLabels.map((p) => (
                  <Link
                    key={p.href}
                    href={p.href}
                    className={`xe-sb-pin${isLinkActive(pathname, p.href) ? 'is-active' : ''}`}
                    title={p.label}
                  >
                    {p.label}
                  </Link>
                ))}
              </div>
            </SidebarSection>
          ) : null}
          <UserProfile
            name={name}
            email={email}
            role={role}
            initials={initials}
            envLabel={envLabel}
            collapsed={collapsed}
            onOpenCommand={openCommand}
            onToggleTheme={toggleTheme}
            onLogout={() => posthog.reset()}
          />
        </>
      }
    >
      <SidebarSection label="Overview">
        {overview.map((mod) => {
          if (mod.href && mod.links.length === 0) {
            return (
              <NavItem
                key={mod.id}
                href={mod.href}
                label={mod.label}
                description={mod.description}
                icon={mod.icon}
                active={moduleHasActiveLink(pathname, mod)}
                collapsed={collapsed}
              />
            )
          }
          return null
        })}
      </SidebarSection>

      <SidebarSection label="Workspace">
        {modules.map((mod) => {
          const active = moduleHasActiveLink(pathname, mod)
          if (mod.href && mod.links.length === 0) {
            return (
              <NavItem
                key={mod.id}
                href={mod.href}
                label={mod.label}
                description={mod.description}
                icon={mod.icon}
                active={active}
                collapsed={collapsed}
              />
            )
          }
          return (
            <NavGroup
              key={mod.id}
              id={mod.id}
              label={mod.label}
              description={mod.description}
              icon={mod.icon}
              expanded={isExpanded(mod.id)}
              active={active}
              collapsed={collapsed}
              onToggle={() => toggleModule(mod.id)}
              items={mod.links.map((link) => ({
                id: `${mod.id}:${link.href}`,
                label: link.label,
                href: link.href,
                description: link.hint,
                active: isLinkActive(pathname, link.href),
              }))}
            />
          )
        })}
      </SidebarSection>
    </Sidebar>
  )
}

export default EnterpriseNav
