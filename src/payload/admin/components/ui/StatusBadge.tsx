import React from 'react'

type StatusBadgeProps = {
  children: React.ReactNode
  tone?: 'default' | 'success' | 'warning' | 'danger' | 'muted'
  className?: string
}

export function StatusBadge({ children, tone = 'default', className = '' }: StatusBadgeProps) {
  const toneClass = tone === 'default' ? '' : ` is-${tone}`
  return (
    <span className={`xe-badge${toneClass}${className ? ` ${className}` : ''}`}>{children}</span>
  )
}

export default StatusBadge
