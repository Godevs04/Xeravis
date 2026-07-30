'use client'

import { useAuth } from '@payloadcms/ui'
import Link from 'next/link'
import React, { useState } from 'react'

import { useWorkspaceOptional } from '@/payload/admin/workspace/WorkspaceContext'

function toggleTheme() {
  const root = document.documentElement
  const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark'
  root.setAttribute('data-theme', next)
  root.style.colorScheme = next
  window.localStorage.setItem('payload-theme', next)
}

function roleLabel(roles: unknown): string {
  if (!Array.isArray(roles) || roles.length === 0) return 'Member'
  return String(roles[0]).replace(/-/g, ' ')
}

/** Compact profile — real user from Payload auth */
export const ProfileCard = () => {
  const ctx = useWorkspaceOptional()
  const { user } = useAuth()
  const [open, setOpen] = useState(false)

  const email =
    user && typeof user === 'object' && 'email' in user && typeof user.email === 'string'
      ? user.email
      : 'Account'
  const roles =
    user && typeof user === 'object' && 'roles' in user ? (user as { roles?: unknown }).roles : []
  const role = roleLabel(roles)
  const name = email.includes('@') ? email.split('@')[0] : email
  const initials = name.slice(0, 2).toUpperCase()

  return (
    <div className={`xe-profile${open ? 'is-open' : ''}`}>
      <button
        type="button"
        className="xe-profile__card"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="xe-profile__avatar" aria-hidden>
          {initials}
          <span className="xe-profile__presence" />
        </span>
        <span className="xe-profile__meta">
          <span className="xe-profile__name">{name}</span>
          <span className="xe-profile__role">
            {role} · {ctx?.workspace.label || 'Website'}
          </span>
        </span>
        <span className="xe-profile__chevron" aria-hidden>
          ▾
        </span>
      </button>

      {open ? (
        <div className="xe-profile__menu" role="menu">
          <div className="xe-profile__email">{email}</div>
          <Link href="/admin/account" role="menuitem" onClick={() => setOpen(false)}>
            Account settings
          </Link>
          <button
            type="button"
            role="menuitem"
            onClick={() => window.dispatchEvent(new CustomEvent('xe-open-command'))}
          >
            Command palette ⌘K
          </button>
          <button type="button" role="menuitem" onClick={() => toggleTheme()}>
            Toggle theme
          </button>
          <a href="/" target="_blank" rel="noreferrer" role="menuitem">
            View website
          </a>
          <Link href="/admin/logout" role="menuitem" className="is-danger">
            Log out
          </Link>
        </div>
      ) : null}
    </div>
  )
}

export default ProfileCard
