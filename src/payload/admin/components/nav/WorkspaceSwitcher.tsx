'use client'

import { AnimatePresence, motion } from 'framer-motion'
import React, { useEffect, useRef, useState } from 'react'

import { getWorkspace, WORKSPACES, type WorkspaceId } from '@/payload/admin/workspace/definitions'
import { useWorkspaceOptional } from '@/payload/admin/workspace/WorkspaceContext'

export const WorkspaceSwitcher = () => {
  const ctx = useWorkspaceOptional()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const env = process.env.NODE_ENV === 'production' ? 'Production' : 'Development'

  const workspaceId = ctx?.workspaceId ?? 'website'
  const workspace = ctx?.workspace ?? getWorkspace('website')
  const setWorkspace = ctx?.setWorkspace

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [])

  return (
    <div className="xe-workspace xe-workspace--compact" ref={ref}>
      <button
        type="button"
        className="xe-workspace__btn"
        aria-label="Switch workspace"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="xe-workspace__avatar" aria-hidden>
          {workspace.label.slice(0, 1)}
        </span>
        <span className="xe-workspace__meta">
          <span className="xe-workspace__name">{workspace.label}</span>
          <span className="xe-workspace__env">{env}</span>
        </span>
        <span className="xe-workspace__chevron" aria-hidden>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path
              d="M7 10l5 5 5-5"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </button>

      <AnimatePresence>
        {open ? (
          <motion.div
            className="xe-workspace__menu"
            role="listbox"
            aria-label="Workspaces"
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.16, ease: [0.22, 1, 0.36, 1] }}
          >
            {(ctx?.workspaces || WORKSPACES).map((item) => (
              <button
                key={item.id}
                type="button"
                role="option"
                aria-selected={item.id === workspaceId}
                className={`xe-workspace__option${item.id === workspaceId ? 'is-active' : ''}`}
                onClick={() => {
                  setWorkspace?.(item.id as WorkspaceId)
                  setOpen(false)
                }}
              >
                <span className="xe-workspace__option-label">{item.label}</span>
                <span className="xe-workspace__option-desc">{item.description}</span>
              </button>
            ))}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}

export default WorkspaceSwitcher
