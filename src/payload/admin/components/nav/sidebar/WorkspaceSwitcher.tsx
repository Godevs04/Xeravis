'use client'

import React from 'react'

type WorkspaceSwitcherProps = {
  company?: string
  envLabel: string
  collapsed?: boolean
}

/** Compact workspace chip under the brand. */
export function WorkspaceSwitcher({
  company = 'XELARVIS Pvt Ltd',
  envLabel,
  collapsed,
}: WorkspaceSwitcherProps) {
  if (collapsed) return null
  return (
    <div className="xe-sb-workspace" aria-label="Workspace">
      <span className="xe-sb-workspace__company">{company}</span>
      <span className={`xe-sb-workspace__env xe-sb-workspace__env--${envLabel.toLowerCase()}`}>
        {envLabel}
      </span>
    </div>
  )
}
