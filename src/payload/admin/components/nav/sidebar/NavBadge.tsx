import React from 'react'

type NavBadgeProps = {
  count: number
  active?: boolean
  className?: string
}

/** Capsule badge — fixed height, never shifts the icon grid. */
export function NavBadge({ count, active, className }: NavBadgeProps) {
  if (!count || count < 1) return null
  const label = count > 99 ? '99+' : String(count)
  return (
    <span
      className={`xe-sb-badge${active ? 'is-active' : ''}${className ? ` ${className}` : ''}`}
      aria-label={`${count} items`}
    >
      {label}
    </span>
  )
}
