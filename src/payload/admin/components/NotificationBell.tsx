'use client'

import Link from 'next/link'
import React, { useCallback, useEffect, useState } from 'react'

type NotificationItem = {
  id: string
  title: string
  body: string
  href: string
  read: boolean
  type: string
  createdAt: string
}

export function NotificationBell() {
  const [open, setOpen] = useState(false)
  const [items, setItems] = useState<NotificationItem[]>([])
  const [unread, setUnread] = useState(0)

  const load = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/notifications', { credentials: 'include' })
      if (!res.ok) return
      const data = (await res.json()) as { items: NotificationItem[]; unread: number }
      setItems(data.items || [])
      setUnread(data.unread || 0)
    } catch {
      // ignore
    }
  }, [])

  useEffect(() => {
    void load()
    const id = window.setInterval(() => void load(), 60000)
    return () => window.clearInterval(id)
  }, [load])

  async function markAll() {
    await fetch('/api/admin/notifications', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ markAll: true }),
    })
    void load()
  }

  async function markOne(id: string) {
    await fetch('/api/admin/notifications', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    void load()
  }

  return (
    <div className="xe-bell">
      <button
        type="button"
        className="xe-action-btn xe-bell__btn"
        aria-label="Notifications"
        onClick={() => setOpen((v) => !v)}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M15 17H9m9-2V10a6 6 0 10-12 0v5l-2 2h16l-2-2z"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        {unread > 0 ? <span className="xe-bell__dot">{unread > 9 ? '9+' : unread}</span> : null}
      </button>
      {open ? (
        <div className="xe-bell__panel" role="dialog" aria-label="Notification center">
          <div className="xe-bell__head">
            <strong>Notifications</strong>
            <button type="button" className="xe-bell__link" onClick={() => void markAll()}>
              Mark all read
            </button>
          </div>
          <div className="xe-bell__list">
            {items.length === 0 ? (
              <p className="xe-bell__empty">You&apos;re all caught up.</p>
            ) : (
              items.map((item) => (
                <Link
                  key={item.id}
                  href={item.href}
                  className={`xe-bell__item${item.read ? '' : 'is-unread'}`}
                  onClick={() => {
                    void markOne(item.id)
                    setOpen(false)
                  }}
                >
                  <span className="xe-bell__title">{item.title}</span>
                  {item.body ? <span className="xe-bell__body">{item.body}</span> : null}
                </Link>
              ))
            )}
          </div>
        </div>
      ) : null}
    </div>
  )
}

export default NotificationBell
