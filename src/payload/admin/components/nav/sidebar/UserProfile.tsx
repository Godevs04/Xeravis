'use client'

import { ChevronDown } from 'lucide-react'
import Link from 'next/link'
import React, { useEffect, useRef, useState } from 'react'

type UserProfileProps = {
  name: string
  email: string
  role: string
  initials: string
  envLabel: string
  onOpenCommand: () => void
  onToggleTheme: () => void
  onLogout?: () => void
  collapsed?: boolean
}

/** Sticky bottom profile card with elevated hover + dropdown. */
export function UserProfile({
  name,
  email,
  role,
  initials,
  envLabel,
  onOpenCommand,
  onToggleTheme,
  onLogout,
  collapsed,
}: UserProfileProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDoc)
      document.removeEventListener('keydown', onKey)
    }
  }, [])

  return (
    <div className={`xe-sb-profile${collapsed ? 'is-rail' : ''}${open ? 'is-open' : ''}`} ref={ref}>
      <button
        type="button"
        className="xe-sb-profile__card"
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label={`Account menu for ${name}`}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="xe-sb-profile__avatar" aria-hidden>
          {initials}
          <span className="xe-sb-profile__status" title="Online" />
        </span>
        <span className="xe-sb-profile__meta">
          <span className="xe-sb-profile__name">{name}</span>
          <span className="xe-sb-profile__role">{role} · Online</span>
        </span>
        <ChevronDown size={14} className="xe-sb-profile__chevron" aria-hidden />
      </button>

      {open ? (
        <div className="xe-sb-profile__menu" role="menu">
          <div className="xe-sb-profile__email">{email}</div>
          <div className="xe-sb-profile__row">
            <span>Workspace</span>
            <strong>{envLabel}</strong>
          </div>
          <div className="xe-sb-profile__row">
            <span>Role</span>
            <strong style={{ textTransform: 'capitalize' }}>{role}</strong>
          </div>
          <div className="xe-sb-profile__row">
            <span>Status</span>
            <strong className="is-online">Online</strong>
          </div>
          <hr className="xe-sb-rule" />
          <Link href="/admin/account" scroll={false} role="menuitem" onClick={() => setOpen(false)}>
            Account settings
          </Link>
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              setOpen(false)
              onOpenCommand()
            }}
          >
            Keyboard shortcuts ⌘K
          </button>
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              onToggleTheme()
              setOpen(false)
            }}
          >
            Toggle theme
          </button>
          <a href="/" target="_blank" rel="noreferrer" role="menuitem">
            View website
          </a>
          <Link
            href="/admin/logout"
            scroll={false}
            role="menuitem"
            className="is-danger"
            onClick={() => {
              onLogout?.()
              setOpen(false)
            }}
          >
            Log out
          </Link>
        </div>
      ) : null}
    </div>
  )
}
