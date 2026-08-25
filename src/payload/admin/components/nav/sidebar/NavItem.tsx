'use client'

import type { LucideIcon } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

import { NavBadge } from './NavBadge'

type NavItemProps = {
  href: string
  label: string
  description?: string
  icon?: LucideIcon
  active?: boolean
  badge?: number
  collapsed?: boolean
  onClick?: () => void
}

/** Leaf or solo destination — same 24/36 icon · 12 gap · text · badge grid. */
export function NavItem({
  href,
  label,
  description,
  icon: Icon,
  active,
  badge,
  collapsed,
  onClick,
}: NavItemProps) {
  return (
    <Link
      href={href}
      className={`xe-sb-item${active ? 'is-active' : ''}${collapsed ? 'is-rail' : ''}`}
      title={collapsed ? label : description || label}
      aria-current={active ? 'page' : undefined}
      aria-label={label}
      onClick={onClick}
    >
      <span className="xe-sb-item__accent" aria-hidden />
      <span className="xe-sb-item__icon" aria-hidden>
        {Icon ? <Icon size={18} strokeWidth={active ? 2.25 : 1.75} /> : null}
      </span>
      <span className="xe-sb-item__copy">
        <span className="xe-sb-item__label">{label}</span>
        {description ? <span className="xe-sb-item__desc">{description}</span> : null}
      </span>
      <NavBadge count={badge ?? 0} active={active} />
    </Link>
  )
}
