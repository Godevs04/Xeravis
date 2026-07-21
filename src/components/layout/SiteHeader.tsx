import Link from 'next/link'

import { Container } from '@/components/layout/Container'
import { MobileNav, NavLinks } from '@/components/layout/MobileNav'
import { Button } from '@/components/ui/button'
import { getGlobal } from '@/lib/cms'
import { DEFAULT_NAV } from '@/lib/fallback-data'

type NavigationGlobal = {
  primaryLinks?: { label: string; href: string }[]
  ctaLabel?: string
  ctaHref?: string
}

export async function SiteHeader() {
  const navigation = await getGlobal<NavigationGlobal>('navigation')
  const links = navigation?.primaryLinks?.length ? navigation.primaryLinks : DEFAULT_NAV.primaryLinks
  const ctaLabel = navigation?.ctaLabel || DEFAULT_NAV.ctaLabel
  const ctaHref = navigation?.ctaHref || DEFAULT_NAV.ctaHref

  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-background/90 backdrop-blur-md">
      <Container className="flex h-16 items-center justify-between lg:h-[4.5rem]">
        <Link href="/" className="text-lg font-bold tracking-tight text-primary">
          <span className="sm:hidden">Xelarvis</span>
          <span className="hidden sm:inline">Xelarvis Technologies</span>
        </Link>
        <NavLinks links={links} />
        <div className="flex items-center gap-2">
          <Button asChild variant="accent" size="sm" className="hidden lg:inline-flex">
            <Link href={ctaHref}>{ctaLabel}</Link>
          </Button>
          <MobileNav links={links} ctaLabel={ctaLabel} ctaHref={ctaHref} />
        </div>
      </Container>
    </header>
  )
}
