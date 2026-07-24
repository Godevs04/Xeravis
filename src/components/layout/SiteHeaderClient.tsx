'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { ChevronDown, Menu, Search } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { cn } from '@/lib/utils'

export type NavLinkItem = {
  label: string
  href: string
  mega?: 'none' | 'solutions' | 'services' | 'industries' | string | null
}

type MegaItem = { label: string; href: string; description?: string }

const MEGA: Record<string, MegaItem[]> = {
  solutions: [
    { label: 'Cloud Modernization', href: '/solutions/cloud-modernization', description: 'Migrate and optimize with confidence.' },
    { label: 'Enterprise AI Ops', href: '/solutions/enterprise-ai-ops', description: 'Operationalize AI across workflows.' },
    { label: 'Platform Engineering', href: '/solutions', description: 'Internal platforms that accelerate delivery.' },
  ],
  services: [
    { label: 'All services', href: '/services', description: 'Full capability catalog.' },
    { label: 'Cloud & Platform', href: '/services/cloud-platform-engineering', description: 'Secure, scalable platforms.' },
    { label: 'Custom Software', href: '/services/custom-software-development', description: 'Mission-critical applications.' },
    { label: 'Data & AI', href: '/services/data-ai-solutions', description: 'Applied intelligence.' },
  ],
  industries: [
    { label: 'Healthcare', href: '/industries/healthcare' },
    { label: 'Manufacturing', href: '/industries/manufacturing' },
    { label: 'Finance', href: '/industries/financial-services' },
    { label: 'Retail', href: '/industries/retail-ecommerce' },
    { label: 'All industries', href: '/industries' },
  ],
}

type SiteHeaderClientProps = {
  links: NavLinkItem[]
  ctaLabel: string
  ctaHref: string
  brandName: string
}

export function SiteHeaderClient({ links, ctaLabel, ctaHref, brandName }: SiteHeaderClientProps) {
  const [solid, setSolid] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [openMega, setOpenMega] = useState<string | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)

  useEffect(() => {
    let lastY = window.scrollY
    const onScroll = () => {
      const y = window.scrollY
      setSolid(y > 48)
      if (y > 80 && y > lastY + 4) setHidden(true)
      else if (y < lastY - 4) setHidden(false)
      lastY = y
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-40 transition-[transform,background-color,border-color,box-shadow] duration-300',
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
            const megaItems = megaKey ? MEGA[megaKey] : null
            return (
              <div key={link.href} className="relative" onMouseEnter={() => setOpenMega(megaKey)}>
                <Link
                  href={link.href}
                  className="inline-flex items-center gap-1 rounded-[var(--radius-button)] px-3 py-2 text-sm font-medium text-secondary transition-colors hover:text-primary"
                  aria-expanded={megaItems ? openMega === megaKey : undefined}
                >
                  {link.label}
                  {megaItems ? <ChevronDown className="h-3.5 w-3.5 opacity-60" /> : null}
                </Link>
                {megaItems && openMega === megaKey ? (
                  <div className="absolute left-0 top-full z-50 mt-2 w-[22rem] rounded-[var(--radius-dialog)] border border-border bg-background p-4 shadow-[var(--shadow-floating)]">
                    <ul className="space-y-1">
                      {megaItems.map((item) => (
                        <li key={item.href}>
                          <Link
                            href={item.href}
                            className="block rounded-[var(--radius-button)] px-3 py-2.5 transition-colors hover:bg-surface"
                          >
                            <span className="text-sm font-semibold text-primary">{item.label}</span>
                            {item.description ? (
                              <span className="mt-0.5 block text-xs text-muted">{item.description}</span>
                            ) : null}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
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
              <nav className="flex flex-col gap-1">
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
