'use client'

import Link from 'next/link'
import React, { useState } from 'react'

const TARGETS = [
  { label: 'Blog', href: '/admin/collections/blogs/create' },
  { label: 'Job', href: '/admin/collections/careers/create' },
  { label: 'Service', href: '/admin/collections/services/create' },
  { label: 'Media', href: '/admin/collections/media/create' },
  { label: 'Lead inbox', href: '/admin/collections/contact-messages' },
]

/** Compact header quick-create */
export const QuickCreateAction = () => {
  const [open, setOpen] = useState(false)

  return (
    <div className="xe-header-create">
      <button
        type="button"
        className="xe-action-btn"
        aria-label="Quick create"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        Create
      </button>
      {open ? (
        <div className="xe-header-create__menu">
          {TARGETS.map((item) => (
            <Link key={item.href} href={item.href} onClick={() => setOpen(false)}>
              {item.label}
            </Link>
          ))}
        </div>
      ) : null}
    </div>
  )
}

export default QuickCreateAction
