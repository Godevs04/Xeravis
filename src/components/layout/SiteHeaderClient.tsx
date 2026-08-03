'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
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

const MEGA_CLOSE_DELAY_MS = 380

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
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const brand = brandName.split(' ')[0]
  const ctaText =
    ctaLabel === "Let's Talk" || ctaLabel === 'Talk to us' || !ctaLabel ? 'Contact Us' : ctaLabel

  const openItems = openMega ? megaMenus[openMega] : null

  const cancelMegaClose = useCallback(() => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current)
      closeTimerRef.current = null
    }
  }, [])

  const scheduleMegaClose = useCallback(() => {
    cancelMegaClose()
    closeTimerRef.current = setTimeout(() => {
      setOpenMega(null)
      closeTimerRef.current = null
    }, MEGA_CLOSE_DELAY_MS)
  }, [cancelMegaClose])

  const openMegaMenu = useCallback(
    (key: string | null) => {
      cancelMegaClose()
      setOpenMega(key)
    },
    [cancelMegaClose],
  )

  useEffect(() => {
    return () => cancelMegaClose()
  }, [cancelMegaClose])

  useEffect(() => {
    if (!openMega) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        cancelMegaClose()
        setOpenMega(null)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [openMega, cancelMegaClose])

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
      <div
        className="container-x relative"
        onMouseEnter={cancelMegaClose}
        onMouseLeave={scheduleMegaClose}
      >
        <div className="relative mx-auto max-w-[1280px]">
          <div
            className={cn(
              'flex items-center gap-2 rounded-full border p-1.5 pl-3 sm:gap-3 sm:pl-4',
              'border-[color:var(--glass-border)] bg-[color:var(--glass-bg-strong)] shadow-[var(--shadow-medium)] backdrop-blur-xl',
              'transition-[height,box-shadow,max-width,background-color,border-color] duration-300',
              solid ? 'h-14 shadow-[var(--shadow-large)]' : 'h-[3.75rem]',
            )}
          >
            <Link
              href="/"
              className="font-display flex shrink-0 items-center gap-2.5 pl-0.5 text-[1.05rem] font-bold tracking-tight text-[color:var(--color-primary)]"
            >
              <span className="grid h-8 w-8 place-items-center rounded-full bg-[color:var(--color-navy)] text-[11px] font-bold text-white shadow-[0_0_20px_var(--color-accent-soft)] dark:bg-gradient-to-br dark:from-teal-500 dark:to-cyan-500">
                X
              </span>
              <span className="hidden sm:inline">{brand}</span>
            </Link>

            <nav
              className="ml-auto hidden min-w-0 items-center justify-end gap-0.5 lg:flex"
              aria-label="Primary"
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
                  <div
                    key={link.href}
                    className="relative"
                    onMouseEnter={() => {
                      // Only switch/open when the link has a mega; otherwise keep the
                      // panel open while the cursor travels diagonally through the bar.
                      if (megaKey && megaItems?.length) openMegaMenu(megaKey)
                    }}
                  >
                    <Link
                      href={link.href}
                      className={cn(
                        'inline-flex h-9 items-center gap-0.5 rounded-full px-1.5 text-[12px] font-semibold tracking-[-0.01em] whitespace-nowrap transition-colors xl:gap-1 xl:px-2.5 xl:text-[13px]',
                        'text-[color:var(--color-primary)]/85 hover:bg-[color:var(--color-hover)] hover:text-[color:var(--color-primary)]',
                        (active || open) &&
                          'bg-[color:var(--color-hover)] text-[color:var(--color-accent)]',
                      )}
                      aria-expanded={megaItems?.length ? open : undefined}
                      aria-haspopup={megaItems?.length ? 'menu' : undefined}
                      aria-controls={megaItems?.length && open ? 'xe-mega-menu' : undefined}
                      onFocus={() => {
                        if (megaKey && megaItems?.length) openMegaMenu(megaKey)
                      }}
                    >
                      {link.label === 'Research & Innovation' ? (
                        <>
                          <span className="xl:hidden">Research</span>
                          <span className="hidden xl:inline">Research & Innovation</span>
                        </>
                      ) : (
                        link.label
                      )}
                      {megaItems?.length ? (
                        <ChevronDown
                          className={cn(
                            'h-3.5 w-3.5 text-[color:var(--color-muted)] transition-transform',
                            open && 'rotate-180 text-[color:var(--color-accent)]',
                          )}
                        />
                      ) : null}
                    </Link>
                  </div>
                )
              })}
            </nav>

            <div className="ml-auto flex shrink-0 items-center gap-0.5 sm:gap-1 lg:ml-1">
              <ThemeToggle className="text-[color:var(--color-primary)] hover:bg-[color:var(--color-hover)] hover:text-[color:var(--color-primary)]" />
              <Button
                asChild
                variant="ghost"
                size="icon"
                className="text-[color:var(--color-primary)] hover:bg-[color:var(--color-hover)] hover:text-[color:var(--color-primary)]"
                aria-label="Search"
              >
                <Link href="/search">
                  <Search className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="sm"
                className="inline-flex h-9 shrink-0 rounded-full bg-[color:var(--color-accent)] px-3.5 font-semibold text-white shadow-[var(--shadow-hover)] hover:bg-[color:var(--color-accent-hover)] sm:px-4"
              >
                <Link href={ctaHref}>
                  <span className="sm:hidden">Contact</span>
                  <span className="hidden sm:inline">{ctaText}</span>
                </Link>
              </Button>

              <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-[color:var(--color-primary)] hover:bg-[color:var(--color-hover)] lg:hidden"
                    aria-label="Open menu"
                  >
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent
                  side="right"
                  className="flex w-[min(100%,360px)] flex-col border-[color:var(--glass-border)] bg-[color:var(--glass-bg-strong)] pb-[max(1.25rem,env(safe-area-inset-bottom))]"
                >
                  <SheetHeader>
                    <SheetTitle className="text-[color:var(--color-primary)]">{brand}</SheetTitle>
                  </SheetHeader>
                  <nav
                    className="mt-6 flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto overscroll-contain"
                    aria-label="Mobile"
                  >
                    {links.map((link) => (
                      <div key={link.href}>
                        <Link
                          href={link.href}
                          onClick={() => setDrawerOpen(false)}
                          className="block min-h-11 rounded-xl px-3 py-3 text-base font-semibold text-[color:var(--color-primary)] hover:bg-[color:var(--color-hover)]"
                        >
                          {link.label}
                        </Link>
                        {link.mega && link.mega !== 'none' && megaMenus[link.mega]?.length
                          ? megaMenus[link.mega].map((item) => (
                              <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setDrawerOpen(false)}
                                className="block min-h-10 rounded-lg px-5 py-2.5 text-sm text-[color:var(--color-muted)] hover:bg-[color:var(--color-hover)] hover:text-[color:var(--color-accent)]"
                              >
                                {item.label}
                              </Link>
                            ))
                          : null}
                      </div>
                    ))}
                    <Link
                      href="/search"
                      onClick={() => setDrawerOpen(false)}
                      className="mt-2 block min-h-11 rounded-xl px-3 py-3 text-base font-semibold text-[color:var(--color-primary)] hover:bg-[color:var(--color-hover)]"
                    >
                      Search
                    </Link>
                    <Button
                      asChild
                      className="mt-4 min-h-11 rounded-full bg-[color:var(--color-accent)] font-semibold text-white hover:bg-[color:var(--color-accent-hover)]"
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

        <AnimatePresence>
          {openItems?.length && openMega ? (
            <div className="pointer-events-auto absolute top-full right-0 left-0 z-50 hidden pt-3 lg:block">
              {/* Extends upward into the pill so the cursor never hits empty space */}
              <div aria-hidden className="absolute inset-x-0 -top-6 h-6" />
              <MegaMenu key={openMega} id="xe-mega-menu" items={openItems} category={openMega} />
            </div>
          ) : null}
        </AnimatePresence>
      </div>
    </header>
  )
}
