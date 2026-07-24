'use client'

import Link from 'next/link'
import React from 'react'

const CREATE_TARGETS = [
  { label: 'Blog post', href: '/admin/collections/blogs/create' },
  { label: 'Service', href: '/admin/collections/services/create' },
  { label: 'Career', href: '/admin/collections/careers/create' },
  { label: 'Page', href: '/admin/collections/pages/create' },
]

export const QuickCreate = () => {
  const [open, setOpen] = React.useState(false)

  return (
    <div className="xe-quick-create">
      <button
        type="button"
        className="xe-quick-create__btn"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
        Quick create
      </button>
      {open ? (
        <div className="xe-nav-section" style={{ marginTop: 8 }}>
          <div className="xe-nav-section__title">New</div>
          <ul className="xe-nav-section__list">
            {CREATE_TARGETS.map((item) => (
              <li key={item.href}>
                <Link href={item.href} onClick={() => setOpen(false)}>
                  <span className="xe-nav-section__dot" />
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  )
}

export default QuickCreate
