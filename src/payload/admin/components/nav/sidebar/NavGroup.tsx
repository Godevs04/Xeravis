'use client'

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ChevronDown, type LucideIcon } from 'lucide-react'
import Link from 'next/link'
import React, { useId } from 'react'

import { NavBadge } from './NavBadge'

const EASE = [0.22, 1, 0.36, 1] as const

export type NavGroupChild = {
  id: string
  label: string
  href: string
  description?: string
  active?: boolean
}

type NavGroupProps = {
  id: string
  label: string
  description?: string
  icon: LucideIcon
  items: NavGroupChild[]
  expanded: boolean
  active: boolean
  collapsed?: boolean
  onToggle: () => void
}

/**
 * Expandable module with connector-line submenu.
 * Height/opacity animate only — never width. Icons stay on the same grid.
 */
export function NavGroup({
  id,
  label,
  description,
  icon: Icon,
  items,
  expanded,
  active,
  collapsed,
  onToggle,
}: NavGroupProps) {
  const reduce = useReducedMotion()
  const panelId = useId()
  const count = items.length
  const showPanel = expanded && !collapsed && count > 0

  return (
    <div
      className={`xe-sb-group${expanded ? 'is-open' : ''}${active ? 'is-active' : ''}${collapsed ? 'is-rail' : ''}`}
      data-nav-group={id}
    >
      <button
        type="button"
        className={`xe-sb-item xe-sb-item--parent${active ? 'is-active' : ''}${expanded ? 'is-open' : ''}`}
        aria-expanded={expanded}
        aria-controls={panelId}
        title={collapsed ? label : description || label}
        onClick={onToggle}
      >
        <span className="xe-sb-item__accent" aria-hidden />
        <span className="xe-sb-item__icon" aria-hidden>
          <Icon size={18} strokeWidth={active || expanded ? 2.25 : 1.75} />
        </span>
        <span className="xe-sb-item__copy">
          <span className="xe-sb-item__label">{label}</span>
          {description ? <span className="xe-sb-item__desc">{description}</span> : null}
        </span>
        <NavBadge count={count} active={active || expanded} />
        <ChevronDown size={14} className="xe-sb-item__chevron" aria-hidden />
      </button>

      <AnimatePresence initial={false}>
        {showPanel ? (
          <motion.div
            id={panelId}
            className="xe-sb-sub"
            role="region"
            aria-label={`${label} links`}
            initial={reduce ? false : { height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: EASE }}
          >
            <div className="xe-sb-sub__inner">
              <span className="xe-sb-sub__rail" aria-hidden />
              <ul className="xe-sb-sub__list">
                {items.map((child, index) => (
                  <motion.li
                    key={child.id}
                    initial={reduce ? false : { opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.02, ease: EASE }}
                  >
                    <Link
                      href={child.href}
                      scroll={false}
                      className={`xe-sb-sub__link${child.active ? 'is-active' : ''}`}
                      title={child.description || child.label}
                      aria-current={child.active ? 'page' : undefined}
                    >
                      <span className="xe-sb-sub__dot" aria-hidden />
                      <span className="xe-sb-sub__copy">
                        <span className="xe-sb-sub__label">{child.label}</span>
                        {child.description ? (
                          <span className="xe-sb-sub__desc">{child.description}</span>
                        ) : null}
                      </span>
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}
