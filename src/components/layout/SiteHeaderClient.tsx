'use client'

import Link from 'next/link'
import { useState } from 'react'
import { ChevronDown, Menu, Search } from 'lucide-react'

import { MegaMenu, type MegaMenuItem } from '@/components/layout/MegaMenu'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/ui/theme-toggle'
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
        'fixed inset-x-0 top-0 z-50 transition-[transform,padding] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]',
        hidden && '-translate-y-full',
        solid
          ? 'pt-[max(0.75rem,env(safe-area-inset-top))]'
          : 'pt-[max(1rem,env(safe-area-inset-top))]',
      )}
    >
      <div
        className={cn('container-x transition-[max-width] duration-300', solid && 'max-w-[1100px]')}
      >
        <div
          className={cn(
            'flex items-center justify-between rounded-full border px-3 transition-[background-color,border-color,box-shadow,height,backdrop-filter,padding] duration-300 sm:px-5',
            solid
              ? 'h-14 border-[color:var(--glass-border)] bg-[color:var(--nav-solid)] shadow-[var(--shadow-medium)] backdrop-blur-2xl'
              : 'h-16 border-[color:var(--glass-border-soft)] bg-[color:var(--glass-bg)] shadow-[var(--shadow-light)] backdrop-blur-xl',
          )}
        >
          <Link
            href="/"
            className="group font-display text-primary flex items-center gap-2.5 pl-1 text-lg font-bold tracking-tight"
          >
            <span className="grid h-8 w-8 place-items-center rounded-xl bg-gradient-to-br from-[#6d5ef9] to-[#a18cff] text-[11px] font-bold text-white shadow-[0_0_28px_var(--color-accent-glow)]">
              X
            </span>
            <span>
              <span className="sm:hidden">{brandName.split(' ')[0]}</span>
              <span className="hidden sm:inline">{brandName.split(' ')[0]}</span>
            </span>
          </Link>

          <nav
            className="hidden items-center gap-0.5 lg:flex"
            aria-label="Primary"
            onMouseLeave={() => setOpenMega(null)}
          >
            {links.map((link) => {
              const megaKey = link.mega && link.mega !== 'none' ? link.mega : null
              const megaItems = megaKey ? megaMenus[megaKey] : null
              const active = openMega === megaKey
              return (
                <div key={link.href} className="relative" onMouseEnter={() => setOpenMega(megaKey)}>
                  <Link
                    href={link.href}
                    className={cn(
                      'text-secondary hover:text-primary inline-flex items-center gap-1 rounded-full px-3.5 py-2 text-[13px] font-medium transition-colors hover:bg-[color:var(--color-hover)]',
                      active && 'text-primary bg-[color:var(--color-hover)]',
                    )}
                    aria-expanded={megaItems?.length ? active : undefined}
                    aria-haspopup={megaItems?.length ? 'menu' : undefined}
                  >
                    {link.label}
                    {megaItems?.length ? <ChevronDown className="h-3.5 w-3.5 opacity-50" /> : null}
                  </Link>
                  {megaItems?.length && active ? <MegaMenu items={megaItems} /> : null}
                </div>
              )
            })}
            <Link
              href="/contact"
              className="text-secondary hover:text-primary rounded-full px-3.5 py-2 text-[13px] font-medium transition-colors hover:bg-[color:var(--color-hover)]"
            >
              Contact
            </Link>
          </nav>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <ThemeToggle />
            <Button
              asChild
              variant="ghost"
              size="icon"
              className="hidden sm:inline-flex"
              aria-label="Search"
            >
              <Link href="/search">
                <Search className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              variant="primary"
              size="sm"
              className="hidden rounded-full px-4 shadow-[0_0_28px_var(--color-accent-glow)] lg:inline-flex"
            >
              <Link href={ctaHref}>{ctaLabel}</Link>
            </Button>

            <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open menu">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="border-border bg-background flex flex-col lg:hidden"
              >
                <SheetHeader>
                  <SheetTitle className="font-display">Menu</SheetTitle>
                </SheetHeader>
                <Link
                  href="/search"
                  onClick={() => setDrawerOpen(false)}
                  className="hover:bg-surface mb-2 flex items-center gap-2 rounded-xl px-3 py-3 text-base font-medium"
                >
                  <Search className="h-4 w-4" /> Search
                </Link>
                <nav className="flex flex-col gap-1" aria-label="Mobile">
                  {links.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setDrawerOpen(false)}
                      className="text-primary hover:bg-surface rounded-xl px-3 py-3 text-base font-medium"
                    >
                      {link.label}
                    </Link>
                  ))}
                  <Link
                    href="/contact"
                    onClick={() => setDrawerOpen(false)}
                    className="text-primary hover:bg-surface rounded-xl px-3 py-3 text-base font-medium"
                  >
                    Contact
                  </Link>
                </nav>
                <div className="border-border mt-4 flex items-center justify-between rounded-xl border px-3 py-2">
                  <span className="text-secondary text-sm">Theme</span>
                  <ThemeToggle />
                </div>
                <Button asChild variant="primary" className="mt-auto w-full rounded-full">
                  <Link href={ctaHref} onClick={() => setDrawerOpen(false)}>
                    {ctaLabel}
                  </Link>
                </Button>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}
