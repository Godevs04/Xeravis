'use client'

import Link from 'next/link'
import React from 'react'

import { useWorkspaceOptional } from '@/payload/admin/workspace/WorkspaceContext'
import { getWorkspace } from '@/payload/admin/workspace/definitions'

/** Compact module links for the active workspace */
export const BeforeNavLinks = () => {
  const ctx = useWorkspaceOptional()
  const workspace = ctx?.workspace ?? getWorkspace('website')

  if (workspace.modules.length === 0) return null

  return (
    <div className="xe-ws-nav xe-ws-nav--compact">
      <div className="xe-ws-nav__label">Modules</div>
      {workspace.modules.map((item) => (
        <Link key={item.href} href={item.href} title={item.hint}>
          {item.label}
        </Link>
      ))}
    </div>
  )
}

export default BeforeNavLinks
