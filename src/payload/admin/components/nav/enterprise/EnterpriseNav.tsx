'use client'

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import {
  Bell,
  ChevronDown,
  ChevronsLeft,
  ChevronsRight,
  Plus,
  Search,
  Settings,
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@payloadcms/ui'
import posthog from 'posthog-js'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { useWorkspaceOptional } from '@/payload/admin/workspace/WorkspaceContext'
import type { WorkspaceId } from '@/payload/admin/workspace/definitions'

import {
  NAV_MODULES,
  QUICK_CREATES,
  isLinkActive,
  moduleHasActiveLink,
  type NavModule,
  type NavModuleId,
} from './modules'

const NAV_KEY = 'xe-nav-collapsed'
const EASE = [0.22, 1, 0.36, 1] as const

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

export function EnterpriseNav() {
  const pathname = usePathname() || '/admin'
  const ctx = useWorkspaceOptional()
  const { user } = useAuth()
  const reduce = useReducedMotion()
  const [openId, setOpenId] = useState<NavModuleId | null>('website')
  const [createOpen, setCreateOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(false)
  const createRef = useRef<HTMLDivElement>(null)
  const profileRef = useRef<HTMLDivElement>(null)

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
    const active = NAV_MODULES.find((m) => moduleHasActiveLink(pathname, m))
    if (active) {
      setOpenId(active.id)
      const ws = moduleToWorkspace(active.id)
      if (ws) ctx?.setWorkspace(ws)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- route sync only
  }, [pathname])

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      const t = e.target as Node
      if (createRef.current && !createRef.current.contains(t)) setCreateOpen(false)
      if (profileRef.current && !profileRef.current.contains(t)) setProfileOpen(false)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setCreateOpen(false)
        setProfileOpen(false)
      }
    }
    document.addEventListener('mousedown', onDoc)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDoc)
      document.removeEventListener('keydown', onKey)
    }
  }, [])

  const toggleModule = useCallback(
    (id: NavModuleId) => {
      setOpenId((prev) => (prev === id ? null : id))
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

  return (
    <div className={`xe-os-nav${collapsed ? 'is-collapsed' : ''}`} data-xe-os-nav>
      <div className="xe-os-nav__top">
        <div className="xe-os-nav__brand-row">
          <Link href="/admin" className="xe-os-nav__brand" title="Xelarvis Admin">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/brand/xel-mark.png"
              alt=""
              width={28}
              height={28}
              className="xe-os-nav__mark"
            />
            <span className="xe-os-nav__brand-copy">
              <span className="xe-os-nav__brand-name">Xelarvis</span>
              <span className="xe-os-nav__brand-sub">Admin</span>
            </span>
          </Link>
          <button
            type="button"
            className="xe-os-nav__collapse"
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            title="Toggle sidebar (⌘B)"
            onClick={toggleCollapse}
          >
            {collapsed ? <ChevronsRight size={16} /> : <ChevronsLeft size={16} />}
          </button>
        </div>

        <div className="xe-os-nav__meta-row">
          <span className="xe-os-nav__company">XELARVIS Pvt Ltd</span>
          <span className={`xe-os-nav__env xe-os-nav__env--${envLabel.toLowerCase()}`}>
            {envLabel}
          </span>
        </div>

        <button type="button" className="xe-os-nav__search" onClick={openCommand}>
          <Search size={15} aria-hidden />
          <span className="xe-os-nav__search-label">Search</span>
          <kbd className="xe-os-nav__kbd">⌘K</kbd>
        </button>

        <div className="xe-os-nav__create" ref={createRef}>
          <button
            type="button"
            className={`xe-os-nav__create-btn${createOpen ? 'is-open' : ''}`}
            aria-expanded={createOpen}
            aria-haspopup="menu"
            onClick={() => setCreateOpen((v) => !v)}
          >
            <Plus size={16} aria-hidden />
            <span>Create</span>
          </button>
          <AnimatePresence>
            {createOpen ? (
              <motion.div
                className="xe-os-nav__create-menu"
                role="menu"
                initial={reduce ? false : { opacity: 0, y: 6, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 4, scale: 0.98 }}
                transition={{ duration: 0.18, ease: EASE }}
              >
                {QUICK_CREATES.map((item) => {
                  const Icon = item.icon
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      role="menuitem"
                      className="xe-os-nav__create-item"
                      onClick={() => setCreateOpen(false)}
                    >
                      <Icon size={14} aria-hidden />
                      {item.label}
                    </Link>
                  )
                })}
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </div>

      <nav className="xe-os-nav__modules" aria-label="Admin modules">
        {NAV_MODULES.map((mod) => (
          <ModuleCard
            key={mod.id}
            mod={mod}
            pathname={pathname}
            expanded={openId === mod.id}
            collapsed={collapsed}
            reduce={!!reduce}
            onToggle={() => toggleModule(mod.id)}
          />
        ))}
      </nav>

      <div className="xe-os-nav__bottom">
        {pinLabels.length > 0 ? (
          <div className="xe-os-nav__pins" aria-label="Pinned">
            <div className="xe-os-nav__pins-label">Pinned</div>
            <div className="xe-os-nav__pins-row">
              {pinLabels.map((p) => (
                <Link
                  key={p.href}
                  href={p.href}
                  className={`xe-os-nav__pin${isLinkActive(pathname, p.href) ? 'is-active' : ''}`}
                  title={p.label}
                >
                  {p.label}
                </Link>
              ))}
            </div>
          </div>
        ) : null}

        <div className="xe-os-nav__dock">
          <Link
            href="/admin/collections/notifications"
            className="xe-os-nav__dock-btn"
            title="Notifications"
            aria-label="Notifications"
          >
            <Bell size={16} />
          </Link>
          <Link
            href="/admin/account"
            className="xe-os-nav__dock-btn"
            title="Settings"
            aria-label="Account settings"
          >
            <Settings size={16} />
          </Link>
        </div>

        <div className="xe-os-nav__profile" ref={profileRef}>
          <button
            type="button"
            className={`xe-os-nav__profile-card${profileOpen ? 'is-open' : ''}`}
            aria-expanded={profileOpen}
            onClick={() => setProfileOpen((v) => !v)}
          >
            <span className="xe-os-nav__avatar" aria-hidden>
              {initials}
              <span className="xe-os-nav__presence" title="Online" />
            </span>
            <span className="xe-os-nav__profile-meta">
              <span className="xe-os-nav__profile-name">{name}</span>
              <span className="xe-os-nav__profile-role" style={{ textTransform: 'capitalize' }}>
                {role} · Online
              </span>
            </span>
            <ChevronDown size={14} className="xe-os-nav__profile-chevron" aria-hidden />
          </button>
          <AnimatePresence>
            {profileOpen ? (
              <motion.div
                className="xe-os-nav__profile-menu"
                role="menu"
                initial={reduce ? false : { opacity: 0, y: 6, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 4, scale: 0.98 }}
                transition={{ duration: 0.18, ease: EASE }}
              >
                <div className="xe-os-nav__profile-email">{email}</div>
                <div className="xe-os-nav__profile-row">
                  <span>Workspace</span>
                  <strong>{envLabel}</strong>
                </div>
                <div className="xe-os-nav__profile-row">
                  <span>Role</span>
                  <strong style={{ textTransform: 'capitalize' }}>{role}</strong>
                </div>
                <div className="xe-os-nav__profile-row">
                  <span>Status</span>
                  <strong className="is-online">Online</strong>
                </div>
                <hr className="xe-os-nav__rule" />
                <Link href="/admin/account" role="menuitem" onClick={() => setProfileOpen(false)}>
                  Account settings
                </Link>
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    setProfileOpen(false)
                    openCommand()
                  }}
                >
                  Keyboard shortcuts ⌘K
                </button>
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    toggleTheme()
                    setProfileOpen(false)
                  }}
                >
                  Toggle theme
                </button>
                <a href="/" target="_blank" rel="noreferrer" role="menuitem">
                  View website
                </a>
                <Link
                  href="/admin/logout"
                  role="menuitem"
                  className="is-danger"
                  onClick={() => posthog.reset()}
                >
                  Log out
                </Link>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

function ModuleCard({
  mod,
  pathname,
  expanded,
  collapsed,
  reduce,
  onToggle,
}: {
  mod: NavModule
  pathname: string
  expanded: boolean
  collapsed: boolean
  reduce: boolean
  onToggle: () => void
}) {
  const Icon = mod.icon
  const active = moduleHasActiveLink(pathname, mod)
  const count = mod.links.length

  if (mod.href && mod.links.length === 0) {
    return (
      <Link href={mod.href} className={`xe-os-mod${active ? 'is-active' : ''}`} title={mod.label}>
        <span className="xe-os-mod__rail" aria-hidden />
        <span className="xe-os-mod__icon">
          <Icon size={16} strokeWidth={active ? 2.25 : 1.75} />
        </span>
        <span className="xe-os-mod__body">
          <span className="xe-os-mod__label">{mod.label}</span>
          <span className="xe-os-mod__hint">{mod.description}</span>
        </span>
      </Link>
    )
  }

  return (
    <div className={`xe-os-mod-wrap${expanded ? 'is-open' : ''}${active ? 'is-active' : ''}`}>
      <button
        type="button"
        className={`xe-os-mod${active ? 'is-active' : ''}${expanded ? 'is-open' : ''}`}
        aria-expanded={expanded}
        title={mod.label}
        onClick={onToggle}
      >
        <span className="xe-os-mod__rail" aria-hidden />
        <span className="xe-os-mod__icon">
          <Icon size={16} strokeWidth={active || expanded ? 2.25 : 1.75} />
        </span>
        <span className="xe-os-mod__body">
          <span className="xe-os-mod__label">{mod.label}</span>
          <span className="xe-os-mod__hint">{mod.description}</span>
        </span>
        {count > 0 ? <span className="xe-os-mod__count">{count}</span> : null}
        <ChevronDown size={14} className="xe-os-mod__chevron" aria-hidden />
      </button>

      <AnimatePresence initial={false}>
        {expanded && !collapsed ? (
          <motion.div
            className="xe-os-mod__links"
            initial={reduce ? false : { height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: EASE }}
          >
            <div className="xe-os-mod__links-inner">
              {mod.links.map((link) => {
                const linkActive = isLinkActive(pathname, link.href)
                return (
                  <Link
                    key={`${mod.id}:${link.href}`}
                    href={link.href}
                    className={`xe-os-mod__link${linkActive ? 'is-active' : ''}`}
                    aria-current={linkActive ? 'page' : undefined}
                  >
                    <span className="xe-os-mod__link-rail" aria-hidden>
                      <span className="xe-os-mod__link-dot" />
                    </span>
                    <span className="xe-os-mod__link-text">
                      <span className="xe-os-mod__link-label">{link.label}</span>
                      {link.hint ? <span className="xe-os-mod__link-hint">{link.hint}</span> : null}
                    </span>
                  </Link>
                )
              })}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}

export default EnterpriseNav
