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
        'absolute top-full left-1/2 z-50 mt-3 max-h-[min(70vh,28rem)] w-[min(22rem,calc(100vw-2rem))] -translate-x-1/2 overflow-y-auto rounded-2xl border border-slate-200 bg-white p-2 shadow-[0_24px_60px_rgba(15,23,42,0.18)]',
        className,
      )}
    >
      <ul className="space-y-0.5">
        {items.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              role="menuitem"
              className="block rounded-xl px-3.5 py-3 transition-colors hover:bg-slate-50 focus-visible:ring-2 focus-visible:ring-[#06B6D4] focus-visible:outline-none"
            >
              <span className="block text-sm font-semibold text-[#0F172A]">{item.label}</span>
              {item.description ? (
                <span className="mt-0.5 block text-xs leading-relaxed text-slate-500">
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
