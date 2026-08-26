'use client'

import Link from 'next/link'
import React, { useState } from 'react'

import { getQuickCreates } from '@/payload/admin/nav/registry'

/** Compact header quick-create — driven by the nav registry */
export const QuickCreateAction = () => {
  const [open, setOpen] = useState(false)
  const targets = getQuickCreates()

  return (
    <div className="xe-header-create">
      <button
        type="button"
        className="xe-action-btn"
        aria-label="Quick create"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        + Create
      </button>
      {open ? (
        <div className="xe-header-create__menu">
          {targets.map((item) => (
            <Link key={item.href} href={item.href} scroll={false} onClick={() => setOpen(false)}>
              {item.label}
            </Link>
          ))}
        </div>
      ) : null}
    </div>
  )
}

export default QuickCreateAction
