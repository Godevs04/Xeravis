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
        'absolute top-full left-0 z-50 mt-3 w-[24rem] rounded-[24px] border border-[color:var(--glass-border)] bg-[color:var(--glass-bg-strong)] p-3 shadow-[var(--shadow-floating)] backdrop-blur-2xl',
        className,
      )}
    >
      <ul className="space-y-0.5">
        {items.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              role="menuitem"
              className="hover:bg-surface focus-visible:ring-accent block rounded-xl px-3.5 py-3 transition-colors focus-visible:ring-2 focus-visible:outline-none"
            >
              <span className="text-primary block text-sm font-semibold">{item.label}</span>
              {item.description ? (
                <span className="text-secondary mt-0.5 block text-xs leading-relaxed">
                  {item.description}
                </span>
              ) : null}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
