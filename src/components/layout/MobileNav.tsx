'use client'

import Link from 'next/link'
import { Menu } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { cn } from '@/lib/utils'

type NavLink = { label: string; href: string }

type MobileNavProps = {
  links: NavLink[]
  ctaLabel: string
  ctaHref: string
}

export function MobileNav({ links, ctaLabel, ctaHref }: MobileNavProps) {
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open menu">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="lg:hidden">
        <SheetHeader>
          <SheetTitle>Menu</SheetTitle>
        </SheetHeader>
        <nav className="flex flex-col gap-1">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="rounded-[var(--radius-sm)] px-3 py-3 text-base font-medium text-primary transition-colors hover:bg-surface"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <Button asChild variant="accent" className="mt-auto w-full">
          <Link href={ctaHref} onClick={() => setOpen(false)}>
            {ctaLabel}
          </Link>
        </Button>
      </SheetContent>
    </Sheet>
  )
}

export function NavLinks({ links, className }: { links: NavLink[]; className?: string }) {
  return (
    <nav className={cn('hidden items-center gap-8 lg:flex', className)} aria-label="Primary">
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className="text-sm font-medium text-secondary transition-colors hover:text-primary"
        >
          {link.label}
        </Link>
      ))}
    </nav>
  )
}
