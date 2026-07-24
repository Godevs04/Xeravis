import { SiteHeaderClient } from '@/components/layout/SiteHeaderClient'
import type { MegaMenuItem } from '@/components/layout/MegaMenu'
import { getGlobal, listPublished } from '@/lib/cms'
import { BRAND, DEFAULT_NAV } from '@/lib/fallback-data'

type NavigationGlobal = {
  primaryLinks?: { label: string; href: string; mega?: string | null }[]
  cta?: { label?: string | null; href?: string | null } | null
  ctaLabel?: string
  ctaHref?: string
}

type CmsNavDoc = {
  title?: string | null
  name?: string | null
  slug?: string | null
  summary?: string | null
  shortDescription?: string | null
}

function toMegaItems(
  docs: CmsNavDoc[],
  basePath: string,
  overview: MegaMenuItem,
): MegaMenuItem[] {
  const items: MegaMenuItem[] = []

  for (const doc of docs) {
    const label = doc.title || doc.name
    if (!label || !doc.slug) continue
    items.push({
      label,
      href: `${basePath}/${doc.slug}`,
      description: doc.summary || doc.shortDescription || undefined,
    })
  }

  return [overview, ...items]
}

export async function SiteHeader() {
  const [navigation, solutions, services, industries] = await Promise.all([
    getGlobal<NavigationGlobal>('navigation'),
    listPublished<CmsNavDoc>('solutions', { limit: 8, sort: 'order' }),
    listPublished<CmsNavDoc>('services', { limit: 8, sort: 'order' }),
    listPublished<CmsNavDoc>('industries', { limit: 8, sort: 'order' }),
  ])

  const links = navigation?.primaryLinks?.length ? navigation.primaryLinks : DEFAULT_NAV.primaryLinks
  const ctaLabel = navigation?.cta?.label || navigation?.ctaLabel || DEFAULT_NAV.ctaLabel
  const ctaHref = navigation?.cta?.href || navigation?.ctaHref || DEFAULT_NAV.ctaHref

  const megaMenus: Record<string, MegaMenuItem[]> = {
    solutions: toMegaItems(solutions, '/solutions', {
      label: 'All solutions',
      href: '/solutions',
      description: 'Browse solution catalog.',
    }),
    services: toMegaItems(services, '/services', {
      label: 'All services',
      href: '/services',
      description: 'Full capability catalog.',
    }),
    industries: toMegaItems(industries, '/industries', {
      label: 'All industries',
      href: '/industries',
      description: 'Sector experience.',
    }),
  }

  return (
    <SiteHeaderClient
      links={links}
      ctaLabel={ctaLabel}
      ctaHref={ctaHref}
      brandName={BRAND.name}
      megaMenus={megaMenus}
    />
  )
}
