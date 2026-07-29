'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
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
  const pathname = usePathname()
  const [openMega, setOpenMega] = useState<string | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const brand = brandName.split(' ')[0]
  const ctaText =
    ctaLabel === "Let's Talk" || ctaLabel === 'Talk to us' || !ctaLabel ? 'Contact Us' : ctaLabel

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-[transform,padding] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]',
        hidden && '-translate-y-full',
        solid
          ? 'pt-[max(0.5rem,env(safe-area-inset-top))]'
          : 'pt-[max(0.75rem,env(safe-area-inset-top))]',
      )}
    >
      <div className="container-x">
        <div
          className={cn(
            'mx-auto flex max-w-[1180px] items-center gap-3 rounded-full border border-slate-200/90 bg-white px-3 shadow-[0_12px_40px_rgba(15,23,42,0.12)] sm:gap-4 sm:px-4',
            'transition-[height,box-shadow,max-width] duration-300',
            solid ? 'h-14 shadow-[0_14px_44px_rgba(15,23,42,0.16)]' : 'h-[3.75rem]',
          )}
        >
          <Link
            href="/"
            className="font-display flex shrink-0 items-center gap-2.5 pl-1 text-[1.05rem] font-bold tracking-tight text-[#0F172A]"
          >
            <span className="grid h-8 w-8 place-items-center rounded-full bg-[#0F172A] text-[11px] font-bold text-white">
              X
            </span>
            <span className="hidden sm:inline">{brand}</span>
          </Link>

          <nav
            className="ml-auto hidden items-center justify-center gap-0.5 xl:flex"
            aria-label="Primary"
            onMouseLeave={() => setOpenMega(null)}
          >
            {links.map((link) => {
              const megaKey = link.mega && link.mega !== 'none' ? link.mega : null
              const megaItems = megaKey ? megaMenus[megaKey] : null
              const open = openMega === megaKey
              const active =
                pathname === link.href ||
                (link.href !== '/' && pathname.startsWith(`${link.href}/`)) ||
                (megaItems?.some(
                  (item) => pathname === item.href || pathname.startsWith(`${item.href}/`),
                ) ??
                  false)

              return (
                <div key={link.href} className="relative" onMouseEnter={() => setOpenMega(megaKey)}>
                  <Link
                    href={link.href}
                    className={cn(
                      'inline-flex h-9 items-center gap-1 rounded-full px-3 text-[13px] font-semibold tracking-[-0.01em] whitespace-nowrap transition-colors',
                      'text-[#0F172A]/85 hover:bg-slate-100 hover:text-[#0F172A]',
                      (active || open) && 'bg-slate-100 text-[#0D9488]',
                    )}
                    aria-expanded={megaItems?.length ? open : undefined}
                    aria-haspopup={megaItems?.length ? 'menu' : undefined}
                  >
                    {link.label}
                    {megaItems?.length ? (
                      <ChevronDown
                        className={cn(
                          'h-3.5 w-3.5 text-slate-400 transition-transform',
                          open && 'rotate-180 text-[#0D9488]',
                        )}
                      />
                    ) : null}
                  </Link>
                  {megaItems?.length && open ? <MegaMenu items={megaItems} /> : null}
                </div>
              )
            })}
          </nav>

          <div className="ml-auto flex shrink-0 items-center gap-1 sm:gap-1.5 xl:ml-0">
            <ThemeToggle className="text-[#0F172A] hover:bg-slate-100 hover:text-[#0F172A]" />
            <Button
              asChild
              variant="ghost"
              size="icon"
              className="hidden text-[#0F172A] hover:bg-slate-100 hover:text-[#0F172A] md:inline-flex"
              aria-label="Search"
            >
              <Link href="/search">
                <Search className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              size="sm"
              className="hidden rounded-full bg-[#0D9488] px-4 font-semibold text-white shadow-[0_8px_20px_rgba(13,148,136,0.28)] hover:bg-[#06B6D4] sm:inline-flex"
            >
              <Link href={ctaHref}>{ctaText}</Link>
            </Button>

            <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-[#0F172A] hover:bg-slate-100 xl:hidden"
                  aria-label="Open menu"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[min(100%,360px)] bg-white">
                <SheetHeader>
                  <SheetTitle className="text-[#0F172A]">{brand}</SheetTitle>
                </SheetHeader>
                <nav className="mt-8 flex flex-col gap-1" aria-label="Mobile">
                  {links.map((link) => (
                    <div key={link.href}>
                      <Link
                        href={link.href}
                        onClick={() => setDrawerOpen(false)}
                        className="block rounded-xl px-3 py-3 text-base font-semibold text-[#0F172A] hover:bg-slate-100"
                      >
                        {link.label}
                      </Link>
                      {link.mega && link.mega !== 'none' && megaMenus[link.mega]?.length
                        ? megaMenus[link.mega].map((item) => (
                            <Link
                              key={item.href}
                              href={item.href}
                              onClick={() => setDrawerOpen(false)}
                              className="block rounded-lg px-5 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-[#0D9488]"
                            >
                              {item.label}
                            </Link>
                          ))
                        : null}
                    </div>
                  ))}
                  <Button
                    asChild
                    className="mt-4 rounded-full bg-[#0D9488] font-semibold text-white hover:bg-[#06B6D4]"
                  >
                    <Link href={ctaHref} onClick={() => setDrawerOpen(false)}>
                      {ctaText}
                    </Link>
                  </Button>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}
