'use client'

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ChevronsLeft, ChevronsRight, Plus, Search } from 'lucide-react'
import Link from 'next/link'
import React, { type ReactNode, useEffect, useRef, useState } from 'react'

import { WorkspaceSwitcher } from './WorkspaceSwitcher'

const EASE = [0.22, 1, 0.36, 1] as const

export type QuickCreateOption = {
  label: string
  href: string
  icon: React.ComponentType<{ size?: number; 'aria-hidden'?: boolean }>
}

type SidebarProps = {
  collapsed: boolean
  onToggleCollapse: () => void
  onOpenCommand: () => void
  quickCreates: QuickCreateOption[]
  envLabel: string
  children: ReactNode
  footer: ReactNode
}

/** Outer chrome: brand, search, create, scroll body, sticky footer. */
export function Sidebar({
  collapsed,
  onToggleCollapse,
  onOpenCommand,
  quickCreates,
  envLabel,
  children,
  footer,
}: SidebarProps) {
  const reduce = useReducedMotion()
  const [createOpen, setCreateOpen] = useState(false)
  const createRef = useRef<HTMLDivElement>(null)
  const bodyRef = useRef<HTMLElement | null>(null)
  const SCROLL_KEY = 'xe-sb-body-scroll'

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (createRef.current && !createRef.current.contains(e.target as Node)) setCreateOpen(false)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setCreateOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDoc)
      document.removeEventListener('keydown', onKey)
    }
  }, [])

  useEffect(() => {
    const el = bodyRef.current
    if (!el) return
    try {
      const saved = Number(sessionStorage.getItem(SCROLL_KEY) || '0')
      if (saved > 0) el.scrollTop = saved
    } catch {
      /* ignore */
    }
    const onScroll = () => {
      try {
        sessionStorage.setItem(SCROLL_KEY, String(el.scrollTop))
      } catch {
        /* ignore */
      }
    }
    el.addEventListener('scroll', onScroll, { passive: true })
    return () => el.removeEventListener('scroll', onScroll)
  }, [])

  const closeMobileDrawer = () => {
    const root = document.documentElement
    if (root.getAttribute('data-xe-nav') === 'open') {
      root.setAttribute('data-xe-nav', 'expanded')
      document.querySelector('aside.nav')?.classList.remove('nav--nav-open')
    }
  }

  return (
    <div className={`xe-sb${collapsed ? 'is-collapsed' : ''}`} data-xe-os-nav data-xe-sidebar>
      <div className="xe-sb__top">
        <div className="xe-sb__brand-row">
          <Link href="/admin" scroll={false} className="xe-sb__brand" title="Xelarvis Admin">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/brand/xel-mark.png" alt="" width={32} height={32} className="xe-sb__mark" />
            <span className="xe-sb__brand-copy">
              <span className="xe-sb__brand-name">Xelarvis</span>
              <span className="xe-sb__brand-sub">Enterprise OS</span>
            </span>
          </Link>
          <button
            type="button"
            className="xe-sb__collapse"
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            title="Toggle sidebar (⌘B)"
            onClick={onToggleCollapse}
          >
            {collapsed ? <ChevronsRight size={16} /> : <ChevronsLeft size={16} />}
          </button>
        </div>

        <WorkspaceSwitcher envLabel={envLabel} collapsed={collapsed} />

        <button type="button" className="xe-sb__search" onClick={onOpenCommand}>
          <Search size={16} aria-hidden />
          <span className="xe-sb__search-label">Search anything...</span>
          <kbd className="xe-sb__kbd">⌘K</kbd>
        </button>

        <div className="xe-sb__create" ref={createRef}>
          <button
            type="button"
            className={`xe-sb__create-btn${createOpen ? 'is-open' : ''}`}
            aria-expanded={createOpen}
            aria-haspopup="menu"
            aria-label="Create"
            onClick={() => setCreateOpen((v) => !v)}
          >
            <Plus size={18} aria-hidden />
            <span>Create</span>
          </button>
          <AnimatePresence>
            {createOpen ? (
              <motion.div
                className="xe-sb__create-menu"
                role="menu"
                initial={reduce ? false : { opacity: 0, y: 6, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 4, scale: 0.98 }}
                transition={{ duration: 0.18, ease: EASE }}
              >
                {quickCreates.map((item) => {
                  const Icon = item.icon
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      scroll={false}
                      role="menuitem"
                      className="xe-sb__create-item"
                      onClick={() => {
                        setCreateOpen(false)
                        closeMobileDrawer()
                      }}
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

      <nav
        ref={bodyRef}
        className="xe-sb__body"
        aria-label="Admin modules"
        onClick={(e) => {
          const t = e.target as HTMLElement
          if (t.closest('a[href]')) closeMobileDrawer()
        }}
      >
        {children}
      </nav>

      <div className="xe-sb__footer">{footer}</div>
    </div>
  )
}
