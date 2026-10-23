'use client'

import { useAuth } from '@payloadcms/ui'
import { Plus } from 'lucide-react'
import Link from 'next/link'
import React, { useEffect, useMemo, useRef, useState } from 'react'

import { getGroupedQuickCreates } from '@/payload/admin/nav/registry'
import { saveMainScroll } from '@/payload/admin/components/layout/mainScroll'
import { saveSidebarScroll } from '@/payload/admin/components/nav/sidebar/sidebarScroll'

/** Compact header quick-create — driven by the nav registry */
export const QuickCreateAction = () => {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const { permissions } = useAuth()

  useEffect(() => {
    if (!open) return
    const onDoc = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false)
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
  }, [open])
  const groups = useMemo(
    () => getGroupedQuickCreates((slug) => Boolean(permissions?.collections?.[slug]?.create)),
    [permissions],
  )

  if (groups.length === 0) return null

  const onNavigate = () => {
    saveSidebarScroll()
    saveMainScroll()
    setOpen(false)
  }

  return (
    <div className="xe-header-create" ref={rootRef}>
      <button
        type="button"
        className="xe-action-btn"
        aria-label="Quick create"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <Plus size={15} aria-hidden />
        <span className="xe-action-btn__label">Create</span>
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
