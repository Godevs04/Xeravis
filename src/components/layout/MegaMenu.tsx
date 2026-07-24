'use client'

import Link from 'next/link'

import { cn } from '@/lib/utils'

export type MegaMenuItem = {
  label: string
  href: string
  description?: string
}

type MegaMenuProps = {
  items: MegaMenuItem[]
  className?: string
  id?: string
}

export function MegaMenu({ items, className, id }: MegaMenuProps) {
  if (!items.length) return null

  return (
    <div
      id={id}
      role="menu"
      className={cn(
        'absolute left-0 top-full z-50 mt-2 w-[22rem] rounded-[var(--radius-dialog)] border border-border bg-background p-4 shadow-[var(--shadow-floating)] dark:bg-surface',
        className,
      )}
    >
      <ul className="space-y-1">
        {items.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              role="menuitem"
              className="block rounded-[var(--radius-button)] px-3 py-2.5 transition-colors hover:bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              <span className="block text-sm font-medium text-primary">{item.label}</span>
              {item.description ? (
                <span className="mt-0.5 block text-xs text-secondary">{item.description}</span>
              ) : null}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
