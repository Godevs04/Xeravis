'use client'

import { AnimatePresence, motion } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React from 'react'

type CmdItem = {
  id: string
  label: string
  href: string
  group: string
}

const STATIC_ITEMS: CmdItem[] = [
  {
    id: 'recruitment',
    label: 'Recruitment workspace',
    href: '/admin/workspace/recruitment',
    group: 'workspace',
  },
  { id: 'crm', label: 'CRM Inbox', href: '/admin/workspace/crm', group: 'workspace' },
  {
    id: 'analytics-ws',
    label: 'Analytics workspace',
    href: '/admin/workspace/analytics',
    group: 'workspace',
  },
  {
    id: 'newsletter-ws',
    label: 'Newsletter workspace',
    href: '/admin/workspace/newsletter',
    group: 'workspace',
  },
  { id: 'seo-ws', label: 'SEO Center', href: '/admin/workspace/seo', group: 'workspace' },
  { id: 'ai-ws', label: 'AI Content Assistant', href: '/admin/workspace/ai', group: 'workspace' },
  { id: 'media-ws', label: 'Media Studio', href: '/admin/workspace/media', group: 'workspace' },
  {
    id: 'activity-ws',
    label: 'Activity timeline',
    href: '/admin/workspace/activity',
    group: 'workspace',
  },
  { id: 'pages', label: 'Pages', href: '/admin/collections/pages', group: 'collection' },
  { id: 'blogs', label: 'Insights / Blogs', href: '/admin/collections/blogs', group: 'collection' },
  { id: 'research', label: 'Research', href: '/admin/collections/research', group: 'collection' },
  { id: 'services', label: 'Services', href: '/admin/collections/services', group: 'collection' },
  {
    id: 'solutions',
    label: 'Solutions',
    href: '/admin/collections/solutions',
    group: 'collection',
  },
  {
    id: 'industries',
    label: 'Industries',
    href: '/admin/collections/industries',
    group: 'collection',
  },
  {
    id: 'technologies',
    label: 'Technologies',
    href: '/admin/collections/technologies',
    group: 'collection',
  },
  { id: 'careers', label: 'Careers', href: '/admin/collections/careers', group: 'collection' },
  {
    id: 'applications',
    label: 'Candidates',
    href: '/admin/collections/job-applications',
    group: 'collection',
  },
  {
    id: 'interviews',
    label: 'Interviews',
    href: '/admin/collections/interviews',
    group: 'collection',
  },
  { id: 'leads', label: 'Leads', href: '/admin/collections/contact-messages', group: 'collection' },
  {
    id: 'downloads',
    label: 'Downloads',
    href: '/admin/collections/downloads',
    group: 'collection',
  },
  { id: 'media', label: 'Media', href: '/admin/collections/media', group: 'collection' },
  {
    id: 'create-blog',
    label: 'Create blog post',
    href: '/admin/collections/blogs/create',
    group: 'action',
  },
  {
    id: 'create-job',
    label: 'Create job',
    href: '/admin/collections/careers/create',
    group: 'action',
  },
  { id: 'account', label: 'Account', href: '/admin/account', group: 'action' },
  { id: 'website', label: 'View website', href: '/', group: 'action' },
]

export const CommandPalette = () => {
  const router = useRouter()
  const [open, setOpen] = React.useState(false)
  const [query, setQuery] = React.useState('')
  const [active, setActive] = React.useState(0)
  const [live, setLive] = React.useState<CmdItem[]>([])
  const [searching, setSearching] = React.useState(false)
  const inputRef = React.useRef<HTMLInputElement>(null)

  const staticFiltered = React.useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return STATIC_ITEMS
    return STATIC_ITEMS.filter(
      (item) => item.label.toLowerCase().includes(q) || item.group.includes(q),
    )
  }, [query])

  const filtered = React.useMemo(() => {
    const map = new Map<string, CmdItem>()
    for (const item of [...live, ...staticFiltered]) {
      map.set(item.id, item)
    }
    return [...map.values()]
  }, [live, staticFiltered])

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
      setLive([])
      setActive(0)
      requestAnimationFrame(() => inputRef.current?.focus())
    }
  }, [open])

  React.useEffect(() => {
    setActive(0)
    const q = query.trim()
    if (q.length < 2) {
      setLive([])
      setSearching(false)
      return
    }

    const controller = new AbortController()
    const timer = window.setTimeout(() => {
      setSearching(true)
      void fetch(`/api/admin/search?q=${encodeURIComponent(q)}`, {
        credentials: 'include',
        signal: controller.signal,
      })
        .then(async (res) => {
          if (!res.ok) return
          const data = (await res.json()) as {
            results?: { id: string; label: string; href: string; group: string }[]
          }
          setLive(
            (data.results || []).map((item) => ({
              id: item.id,
              label: item.label,
              href: item.href,
              group: item.group,
            })),
          )
        })
        .catch(() => {})
        .finally(() => setSearching(false))
    }, 220)

    return () => {
      controller.abort()
      window.clearTimeout(timer)
    }
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
              placeholder="Search blogs, jobs, leads, media, candidates…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={onKeyDown}
              aria-autocomplete="list"
            />
            <div className="xe-cmd__list" role="listbox">
              {filtered.length === 0 ? (
                <div className="xe-cmd__empty">
                  {searching ? 'Searching…' : 'No matches. Try “blogs” or a candidate name.'}
                </div>
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
            <div className="xe-cmd__footer">
              <span>↑↓ navigate</span>
              <span>↵ open</span>
              <span>esc close</span>
              <Link href="/admin" className="xe-cmd__dash" onClick={() => setOpen(false)}>
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
