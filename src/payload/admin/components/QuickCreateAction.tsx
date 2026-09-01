'use client'

import Link from 'next/link'
import React, { useMemo, useState } from 'react'

import { getGroupedQuickCreates } from '@/payload/admin/nav/registry'
import { saveMainScroll } from '@/payload/admin/components/layout/mainScroll'
import { saveSidebarScroll } from '@/payload/admin/components/nav/sidebar/sidebarScroll'

/** Compact header quick-create — driven by the nav registry */
export const QuickCreateAction = () => {
  const [open, setOpen] = useState(false)
  const groups = useMemo(() => getGroupedQuickCreates(), [])

  const onNavigate = () => {
    saveSidebarScroll()
    saveMainScroll()
    setOpen(false)
  }

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
        <div className="xe-header-create__menu xe-header-create__menu--grouped">
          {groups.map((group) => (
            <div key={group.section} className="xe-header-create__group">
              <div className="xe-header-create__group-label">{group.section}</div>
              {group.items.map((item) => (
                <Link key={item.href} href={item.href} scroll={false} onClick={onNavigate}>
                  {item.label}
                </Link>
              ))}
            </div>
          ))}
        </div>
      ) : null}
    </div>
  )
}

export default QuickCreateAction
