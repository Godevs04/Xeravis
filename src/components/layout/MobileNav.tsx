'use client'

import { BrandLogo } from '@/components/brand/BrandLogo'
import type { MegaMenuItem } from '@/components/layout/MegaMenu'
import type { NavLinkItem } from '@/components/layout/SiteHeaderClient'
import { Button } from '@/components/ui/button'
import Link from '@/components/ui/link'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import type { RefObject } from 'react'

type MobileNavProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  links: NavLinkItem[]
  megaMenus: Record<string, MegaMenuItem[]>
  brand: string
  ctaHref: string
  ctaText: string
  returnFocusRef: RefObject<HTMLElement | null>
}

export function MobileNav({
  open,
  onOpenChange,
  links,
  megaMenus,
  brand,
  ctaHref,
  ctaText,
  returnFocusRef,
}: MobileNavProps) {
  const close = () => onOpenChange(false)

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        onCloseAutoFocus={(event) => {
          event.preventDefault()
          returnFocusRef.current?.focus()
        }}
        className="flex w-[min(100%,360px)] flex-col border-[color:var(--glass-border)] bg-[color:var(--glass-bg-strong)] pb-[max(1.25rem,env(safe-area-inset-bottom))]"
      >
        <SheetHeader className="border-b border-[color:var(--glass-border-soft)] pb-4 text-left">
          <SheetTitle className="sr-only">{brand}</SheetTitle>
          <BrandLogo
            variant="header"
            wordmark="Xelarvis Technologies"
            size={44}
            href="/"
            onClick={close}
            wordmarkClassName="text-[1.05rem]"
          />
        </SheetHeader>
        <nav
          className="mt-6 flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto overscroll-contain"
          aria-label="Mobile"
        >
          {links.map((link) => (
            <div key={link.href}>
              <Link
                href={link.href}
                onClick={close}
                className="block min-h-11 rounded-xl px-3 py-3 text-base font-semibold text-[color:var(--color-primary)] hover:bg-[color:var(--color-hover)]"
              >
                {link.label}
              </Link>
              {link.mega && link.mega !== 'none' && megaMenus[link.mega]?.length
                ? megaMenus[link.mega].map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={close}
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
            onClick={close}
            className="mt-2 block min-h-11 rounded-xl px-3 py-3 text-base font-semibold text-[color:var(--color-primary)] hover:bg-[color:var(--color-hover)]"
          >
            Search
          </Link>
          <Button
            asChild
            className="mt-4 min-h-11 rounded-full bg-[color:var(--color-accent)] font-semibold text-[color:var(--color-on-accent)] hover:bg-[color:var(--color-accent-hover)]"
          >
            <Link href={ctaHref} onClick={close}>
              {ctaText}
            </Link>
          </Button>
        </nav>
      </SheetContent>
    </Sheet>
  )
}
