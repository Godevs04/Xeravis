'use client'

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

import {
  DEFAULT_WORKSPACE,
  getWorkspace,
  WORKSPACE_STORAGE_KEY,
  WORKSPACES,
  type WorkspaceDef,
  type WorkspaceId,
} from './definitions'

type WorkspaceContextValue = {
  workspaceId: WorkspaceId
  workspace: WorkspaceDef
  workspaces: WorkspaceDef[]
  setWorkspace: (id: WorkspaceId) => void
}

const WorkspaceContext = createContext<WorkspaceContextValue | null>(null)

function applyNavFilter(workspace: WorkspaceDef) {
  if (typeof document === 'undefined') return

  const root = document.documentElement
  root.setAttribute('data-xe-workspace', workspace.id)

  const allowed = new Set(workspace.paths.map((p) => p.toLowerCase()))

  const links = document.querySelectorAll<HTMLAnchorElement>(
    '.nav a[href*="/admin/collections/"], .nav a[href*="/admin/globals/"]',
  )

  links.forEach((link) => {
    const href = link.getAttribute('href') || ''
    const match = href.match(/\/admin\/(?:collections|globals)\/([^/?#]+)/)
    const slug = match?.[1]?.toLowerCase()
    const show = !slug || allowed.has(slug)
    const row = (link.closest('li') as HTMLElement | null) || link
    row.style.display = show ? '' : 'none'
    row.setAttribute('data-xe-nav-filtered', show ? 'show' : 'hide')
  })

  // Hide empty nav groups
  document
    .querySelectorAll<HTMLElement>('.nav .nav-group, .nav [class*="nav-group"]')
    .forEach((group) => {
      const visible = Array.from(
        group.querySelectorAll<HTMLElement>('[data-xe-nav-filtered], a[href*="/admin/"]'),
      ).some((el) => {
        if (el.getAttribute('data-xe-nav-filtered') === 'hide') return false
        if (el.getAttribute('data-xe-nav-filtered') === 'show') return true
        const style = window.getComputedStyle(el)
        return style.display !== 'none' && style.visibility !== 'hidden'
      })
      // Prefer checking filtered children
      const filtered = group.querySelectorAll('[data-xe-nav-filtered]')
      if (filtered.length > 0) {
        const anyShow = Array.from(filtered).some(
          (el) => el.getAttribute('data-xe-nav-filtered') === 'show',
        )
        group.style.display = anyShow ? '' : 'none'
        return
      }
      group.style.display = visible ? '' : 'none'
    })
}

export function WorkspaceProvider({ children }: { children: React.ReactNode }) {
  const [workspaceId, setWorkspaceId] = useState<WorkspaceId>(DEFAULT_WORKSPACE)

  useEffect(() => {
    const stored = window.localStorage.getItem(WORKSPACE_STORAGE_KEY) as WorkspaceId | null
    if (stored && WORKSPACES.some((w) => w.id === stored)) {
      setWorkspaceId(stored)
    }
  }, [])

  const workspace = useMemo(() => getWorkspace(workspaceId), [workspaceId])

  const setWorkspace = useCallback((id: WorkspaceId) => {
    setWorkspaceId(id)
    window.localStorage.setItem(WORKSPACE_STORAGE_KEY, id)
  }, [])

  useEffect(() => {
    applyNavFilter(workspace)

    const observer = new MutationObserver(() => applyNavFilter(workspace))
    const nav = document.querySelector('.nav')
    if (nav) {
      observer.observe(nav, { childList: true, subtree: true })
    }

    const onRoute = () => applyNavFilter(workspace)
    window.addEventListener('popstate', onRoute)

    const interval = window.setInterval(() => applyNavFilter(workspace), 1200)

    return () => {
      observer.disconnect()
      window.removeEventListener('popstate', onRoute)
      window.clearInterval(interval)
    }
  }, [workspace])

  const value = useMemo(
    () => ({
      workspaceId,
      workspace,
      workspaces: WORKSPACES,
      setWorkspace,
    }),
    [workspaceId, workspace, setWorkspace],
  )

  return <WorkspaceContext.Provider value={value}>{children}</WorkspaceContext.Provider>
}

export function useWorkspace() {
  const ctx = useContext(WorkspaceContext)
  if (!ctx) {
    throw new Error('useWorkspace must be used within WorkspaceProvider')
  }
  return ctx
}

export function useWorkspaceOptional() {
  return useContext(WorkspaceContext)
}
