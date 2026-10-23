'use client'

import { usePathname } from 'next/navigation'
import { useAuth } from '@payloadcms/ui'
import { loadPosthog } from '@/lib/analytics-client'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { useWorkspaceOptional } from '@/payload/admin/workspace/WorkspaceContext'
import type { WorkspaceId } from '@/payload/admin/workspace/definitions'

import { NavGroup, NavItem, Sidebar, SidebarSection, UserProfile } from '../sidebar'
import {
  getSidebarBody,
  restoreSidebarScroll,
  revealActiveInSidebar,
} from '../sidebar/sidebarScroll'
import { persistTheme } from '@/payload/admin/components/theme'
import {
  NAV_MODULES,
  QUICK_CREATES,
  isLinkActive,
  moduleHasActiveLink,
  quickCreateAllowed,
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
  persistTheme(next)
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
  const { user, permissions } = useAuth()
  const quickCreates = useMemo(
    () =>
      QUICK_CREATES.filter((item) =>
        quickCreateAllowed(item.href, (slug) => Boolean(permissions?.collections?.[slug]?.create)),
      ),
    [permissions],
  )
  const routeNav = useMemo(() => resolveModuleNavigation(pathname), [pathname])
  const [manualOpen, setManualOpen] = useState<Set<string>>(() => new Set())
  const [collapsed, setCollapsed] = useState(false)
  const [animatedModule, setAnimatedModule] = useState<string | null>(null)
  const deepLinkRevealDone = useRef(false)

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
    void loadPosthog().then((posthog) => posthog?.identify(userId, { email, role }))
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

    if (routeNav.section) {
      setManualOpen((prev) => {
        if (prev.has(routeNav.section!)) return prev
        const next = new Set(prev)
        next.add(routeNav.section!)
        writeRememberedOpen(next)
        return next
      })
    }

    // Preserve sidebar position — never scrollIntoView on route change (causes jump).
    requestAnimationFrame(() => {
      restoreSidebarScroll()
      requestAnimationFrame(restoreSidebarScroll)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps -- route sync only
  }, [pathname])

  /** Cold load / deep link only — reveal active item once if off-screen. */
  useEffect(() => {
    if (deepLinkRevealDone.current) return
    deepLinkRevealDone.current = true

    requestAnimationFrame(() => {
      const body = getSidebarBody()
      const active = body?.querySelector<HTMLElement>(
        '.xe-sb-item.is-active, .xe-sb-sub__link.is-active',
      )
      if (body && active) revealActiveInSidebar(body, active)
    })
  }, [])

  const isExpanded = useCallback(
    (id: string) => {
      if (manualOpen.has(id)) return true
      return routeNav.section === id
    },
    [manualOpen, routeNav.section],
  )

  const toggleModule = useCallback(
    (id: NavModuleId) => {
      setAnimatedModule(id)
      window.setTimeout(() => setAnimatedModule(null), 260)
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

  const envLabel =
    typeof process !== 'undefined' && process.env.NODE_ENV === 'production' ? 'PROD' : 'LOCAL'

  const overview = NAV_MODULES.filter((m) => m.id === 'overview')
  const modules = NAV_MODULES.filter((m) => m.id !== 'overview')

  return (
    <Sidebar
      collapsed={collapsed}
      onToggleCollapse={toggleCollapse}
      onOpenCommand={openCommand}
      quickCreates={quickCreates}
      envLabel={envLabel}
      footer={
        <UserProfile
          name={name}
          email={email}
          role={role}
          initials={initials}
          envLabel={envLabel}
          collapsed={collapsed}
          onOpenCommand={openCommand}
          onToggleTheme={toggleTheme}
          onLogout={() => void loadPosthog().then((posthog) => posthog?.reset())}
        />
      }
    >
      <SidebarSection label="Command Center">
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
              animate={animatedModule === mod.id}
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
