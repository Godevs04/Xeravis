'use client'

import { AnimatePresence, motion } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React from 'react'

type CmdItem = {
  id: string
  label: string
  href: string
  group: 'collection' | 'global' | 'action'
}

const ITEMS: CmdItem[] = [
  { id: 'pages', label: 'Pages', href: '/admin/collections/pages', group: 'collection' },
  { id: 'blogs', label: 'Blogs', href: '/admin/collections/blogs', group: 'collection' },
  { id: 'services', label: 'Services', href: '/admin/collections/services', group: 'collection' },
  { id: 'careers', label: 'Careers', href: '/admin/collections/careers', group: 'collection' },
  { id: 'media', label: 'Media', href: '/admin/collections/media', group: 'collection' },
  {
    id: 'messages',
    label: 'Contact Messages',
    href: '/admin/collections/contact-messages',
    group: 'collection',
  },
  { id: 'users', label: 'Users', href: '/admin/collections/users', group: 'collection' },
  {
    id: 'site-settings',
    label: 'Site Settings',
    href: '/admin/globals/site-settings',
    group: 'global',
  },
  { id: 'navigation', label: 'Navigation', href: '/admin/globals/navigation', group: 'global' },
  { id: 'seo', label: 'SEO Defaults', href: '/admin/globals/seo-defaults', group: 'global' },
  {
    id: 'create-blog',
    label: 'Create blog post',
    href: '/admin/collections/blogs/create',
    group: 'action',
  },
  {
    id: 'create-page',
    label: 'Create page',
    href: '/admin/collections/pages/create',
    group: 'action',
  },
  { id: 'account', label: 'Account', href: '/admin/account', group: 'action' },
  { id: 'logout', label: 'Log out', href: '/admin/logout', group: 'action' },
  { id: 'website', label: 'View website', href: '/', group: 'action' },
]

export const CommandPalette = () => {
  const router = useRouter()
  const [open, setOpen] = React.useState(false)
  const [query, setQuery] = React.useState('')
  const [active, setActive] = React.useState(0)
  const inputRef = React.useRef<HTMLInputElement>(null)

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return ITEMS
    return ITEMS.filter((item) => item.label.toLowerCase().includes(q) || item.group.includes(q))
  }, [query])

  React.useEffect(() => {
    const onOpen = () => setOpen(true)
    const onKey = (e: KeyboardEvent) => {
      const isMetaK = (e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k'
      if (isMetaK) {
        e.preventDefault()
        setOpen((v) => !v)
      }
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('xe-open-command', onOpen)
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('xe-open-command', onOpen)
      window.removeEventListener('keydown', onKey)
    }
  }, [])

  React.useEffect(() => {
    if (open) {
      setQuery('')
      setActive(0)
      requestAnimationFrame(() => inputRef.current?.focus())
    }
  }, [open])

  React.useEffect(() => {
    setActive(0)
  }, [query])

  const go = React.useCallback(
    (href: string) => {
      setOpen(false)
      router.push(href)
    },
    [router],
  )

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActive((i) => Math.min(i + 1, Math.max(filtered.length - 1, 0)))
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActive((i) => Math.max(i - 1, 0))
    }
    if (e.key === 'Enter' && filtered[active]) {
      e.preventDefault()
      go(filtered[active].href)
    }
  }

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="xe-cmd-overlay"
          role="dialog"
          aria-modal="true"
          aria-label="Command palette"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setOpen(false)
          }}
        >
          <motion.div
            className="xe-cmd"
            initial={{ opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
          >
            <input
              ref={inputRef}
              className="xe-cmd__input"
              placeholder="Search collections, globals, actions…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={onKeyDown}
              aria-autocomplete="list"
            />
            <div className="xe-cmd__list" role="listbox">
              {filtered.length === 0 ? (
                <div className="xe-cmd__empty">No matches. Try “blogs” or “media”.</div>
              ) : (
                filtered.map((item, index) => (
                  <button
                    key={item.id}
                    type="button"
                    role="option"
                    aria-selected={index === active}
                    className="xe-cmd__item"
                    data-active={index === active}
                    onMouseEnter={() => setActive(index)}
                    onClick={() => go(item.href)}
                  >
                    <span>{item.label}</span>
                    <span className="xe-cmd__meta">{item.group}</span>
                  </button>
                ))
              )}
            </div>
            <div
              style={{
                display: 'flex',
                gap: 12,
                padding: '10px 16px',
                borderTop: '1px solid rgba(255,255,255,.08)',
                color: '#a1a1aa',
                fontSize: 11,
              }}
            >
              <span>↑↓ navigate</span>
              <span>↵ open</span>
              <span>esc close</span>
              <Link
                href="/admin"
                style={{ marginLeft: 'auto', color: '#93c5fd', textDecoration: 'none' }}
                onClick={() => setOpen(false)}
              >
                Dashboard
              </Link>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}

export default CommandPalette
