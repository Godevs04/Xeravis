'use client'

import { usePathname } from 'next/navigation'
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

import {
  DEFAULT_WORKSPACE,
  getWorkspace,
  WORKSPACE_STORAGE_KEY,
  WORKSPACES,
  workspaceIdFromPath,
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

export function WorkspaceProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || '/admin'
  const [workspaceId, setWorkspaceId] = useState<WorkspaceId>(DEFAULT_WORKSPACE)

  useEffect(() => {
    const stored = window.localStorage.getItem(WORKSPACE_STORAGE_KEY) as WorkspaceId | null
    if (stored && WORKSPACES.some((w) => w.id === stored)) {
      setWorkspaceId(stored)
    }
  }, [])

  useEffect(() => {
    const fromPath = workspaceIdFromPath(pathname)
    if (fromPath) {
      setWorkspaceId(fromPath)
      window.localStorage.setItem(WORKSPACE_STORAGE_KEY, fromPath)
    }
  }, [pathname])

  const workspace = useMemo(() => getWorkspace(workspaceId), [workspaceId])

  const setWorkspace = useCallback((id: WorkspaceId) => {
    setWorkspaceId(id)
    window.localStorage.setItem(WORKSPACE_STORAGE_KEY, id)
    document.documentElement.setAttribute('data-xe-workspace', id)
  }, [])

  useEffect(() => {
    document.documentElement.setAttribute('data-xe-workspace', workspace.id)
  }, [workspace.id])

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
