import React from 'react'

type ContentShellProps = {
  children: React.ReactNode
  className?: string
  /** Optional page frame without outer padding when nested */
  flush?: boolean
}

/**
 * Shared content column for custom admin views (dashboard, workspaces).
 * Uses the same xe-page / tokenized shell as content-os.scss.
 */
export function ContentShell({ children, className = '', flush = false }: ContentShellProps) {
  return (
    <div
      className={`xe-content-shell xe-page${flush ? 'is-flush' : ''}${className ? ` ${className}` : ''}`}
    >
      {children}
    </div>
  )
}

export default ContentShell
