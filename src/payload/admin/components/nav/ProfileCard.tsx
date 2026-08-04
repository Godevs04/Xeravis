'use client'

import { useAuth } from '@payloadcms/ui'
import { AnimatePresence, motion } from 'framer-motion'
import Link from 'next/link'
import posthog from 'posthog-js'
import React, { useEffect, useState } from 'react'

function toggleTheme() {
  const root = document.documentElement
  const next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light'
  root.setAttribute('data-xe-ui', 'v5')
  root.setAttribute('data-theme', next)
  root.style.colorScheme = next
  window.localStorage.setItem('payload-theme', next)
  window.localStorage.setItem('xe-theme-preference', next)
}

function roleLabel(roles: unknown): string {
  if (!Array.isArray(roles) || roles.length === 0) return 'Member'
  return String(roles[0]).replace(/-/g, ' ')
}

export const ProfileCard = () => {
  const { user } = useAuth()
  const [open, setOpen] = useState(false)

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

  useEffect(() => {
    if (!userId) return

    posthog.identify(userId, {
      email,
      role,
    })
  }, [email, role, userId])

  const handleLogout = () => {
    posthog.reset()
  }
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
          <span className="xe-profile__presence" title="Online" />
        </span>
        <span className="xe-profile__meta">
          <span className="xe-profile__name">{name}</span>
          <span className="xe-profile__role" style={{ textTransform: 'capitalize' }}>
            {role}
          </span>
        </span>
        <span className="xe-profile__chevron" aria-hidden>
          ▾
        </span>
      </button>

      <AnimatePresence>
        {open ? (
          <motion.div
            className="xe-profile__menu"
            role="menu"
            initial={{ opacity: 0, y: 6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.98 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="xe-profile__email">{email}</div>
            <div className="xe-profile__meta-row">
              <span>Role</span>
              <strong style={{ textTransform: 'capitalize' }}>{role}</strong>
            </div>
            <div className="xe-profile__meta-row">
              <span>Status</span>
              <strong className="is-online">Online</strong>
            </div>
            <hr className="xe-profile__rule" />
            <Link href="/admin/account" role="menuitem" onClick={() => setOpen(false)}>
              Account settings
            </Link>
            <button
              type="button"
              role="menuitem"
              onClick={() => window.dispatchEvent(new CustomEvent('xe-open-command'))}
            >
              Keyboard shortcuts ⌘K
            </button>
            <button type="button" role="menuitem" onClick={() => toggleTheme()}>
              Toggle theme
            </button>
            <a href="/" target="_blank" rel="noreferrer" role="menuitem">
              View website
            </a>
            <Link href="/admin/logout" role="menuitem" className="is-danger" onClick={handleLogout}>
              Log out
            </Link>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}

export default ProfileCard
