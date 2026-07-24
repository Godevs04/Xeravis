'use client'

import Link from 'next/link'
import { useState } from 'react'
import { ChevronDown, Menu, Search } from 'lucide-react'

import { MegaMenu, type MegaMenuItem } from '@/components/layout/MegaMenu'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { useScrollHeader } from '@/hooks/useScrollHeader'
import { cn } from '@/lib/utils'

export type NavLinkItem = {
  label: string
  href: string
  mega?: 'none' | 'solutions' | 'services' | 'industries' | string | null
}

type SiteHeaderClientProps = {
  links: NavLinkItem[]
  ctaLabel: string
  ctaHref: string
  brandName: string
  megaMenus: Record<string, MegaMenuItem[]>
}

export function SiteHeaderClient({
  links,
  ctaLabel,
  ctaHref,
  brandName,
  megaMenus,
}: SiteHeaderClientProps) {
  const { solid, hidden } = useScrollHeader(48)
  const [openMega, setOpenMega] = useState<string | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-40 transition-[transform,background-color,border-color,box-shadow] duration-[var(--duration-base)]',
        hidden && 'max-lg:-translate-y-full lg:-translate-y-full',
        solid
          ? 'border-b border-border/80 bg-background/95 shadow-[var(--shadow-light)] backdrop-blur-md'
          : 'border-b border-transparent bg-transparent',
      )}
    >
      <div className="container-x flex h-16 items-center justify-between lg:h-[4.5rem]">
        <Link href="/" className="text-lg font-bold tracking-tight text-primary">
          <span className="sm:hidden">{brandName.split(' ')[0]}</span>
          <span className="hidden sm:inline">{brandName}</span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary" onMouseLeave={() => setOpenMega(null)}>
          {links.map((link) => {
            const megaKey = link.mega && link.mega !== 'none' ? link.mega : null
            const megaItems = megaKey ? megaMenus[megaKey] : null
            return (
              <div key={link.href} className="relative" onMouseEnter={() => setOpenMega(megaKey)}>
                <Link
                  href={link.href}
                  className="inline-flex items-center gap-1 rounded-[var(--radius-button)] px-3 py-2 text-sm font-medium text-secondary transition-colors hover:text-primary"
                  aria-expanded={megaItems?.length ? openMega === megaKey : undefined}
                  aria-haspopup={megaItems?.length ? 'menu' : undefined}
                >
                  {link.label}
                  {megaItems?.length ? <ChevronDown className="h-3.5 w-3.5 opacity-60" /> : null}
                </Link>
                {megaItems?.length && openMega === megaKey ? <MegaMenu items={megaItems} /> : null}
              </div>
            )
          })}
          <Link
            href="/contact"
            className="rounded-[var(--radius-button)] px-3 py-2 text-sm font-medium text-secondary transition-colors hover:text-primary"
          >
            Contact
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <Button asChild variant="ghost" size="icon" className="hidden sm:inline-flex" aria-label="Search">
            <Link href="/search">
              <Search className="h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="primary" size="sm" className="hidden lg:inline-flex">
            <Link href={ctaHref}>{ctaLabel}</Link>
          </Button>

          <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="flex flex-col lg:hidden">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <Link
                href="/search"
                onClick={() => setDrawerOpen(false)}
                className="mb-2 flex items-center gap-2 rounded-[var(--radius-button)] px-3 py-3 text-base font-medium hover:bg-surface"
              >
                <Search className="h-4 w-4" /> Search
              </Link>
              <nav className="flex flex-col gap-1" aria-label="Mobile">
                {links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setDrawerOpen(false)}
                    className="rounded-[var(--radius-button)] px-3 py-3 text-base font-medium text-primary hover:bg-surface"
                  >
                    {link.label}
                  </Link>
                ))}
                <Link
                  href="/contact"
                  onClick={() => setDrawerOpen(false)}
                  className="rounded-[var(--radius-button)] px-3 py-3 text-base font-medium text-primary hover:bg-surface"
                >
                  Contact
                </Link>
              </nav>
              <Button asChild variant="primary" className="mt-auto w-full">
                <Link href={ctaHref} onClick={() => setDrawerOpen(false)}>
                  {ctaLabel}
                </Link>
              </Button>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
