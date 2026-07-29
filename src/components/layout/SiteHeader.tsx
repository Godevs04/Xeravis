import { SiteHeaderClient } from '@/components/layout/SiteHeaderClient'
import type { MegaMenuItem } from '@/components/layout/MegaMenu'
import { getGlobal, listPublished } from '@/lib/cms'
import { BRAND, DEFAULT_NAV } from '@/lib/fallback-data'
import { ABOUT_MEGA, INSIGHTS_MEGA } from '@/lib/site-ia'

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

function toMegaItems(docs: CmsNavDoc[], basePath: string, overview: MegaMenuItem): MegaMenuItem[] {
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

const COMPANY_MEGA: MegaMenuItem[] = [
  {
    label: 'About XELARVIS',
    href: '/about',
    description: 'Company story, mission, and values.',
  },
  ...ABOUT_MEGA,
  {
    label: 'AI Research Lab',
    href: '/ai-research-lab',
    description: 'Research that ships to production.',
  },
  {
    label: 'Technologies',
    href: '/technologies',
    description: 'AI, clinical, cloud, and data stack.',
  },
  {
    label: 'Case Studies',
    href: '/case-studies',
    description: 'Selected delivery outcomes.',
  },
]

export async function SiteHeader() {
  const [navigation, solutions, services, industries] = await Promise.all([
    getGlobal<NavigationGlobal>('navigation'),
    listPublished<CmsNavDoc>('solutions', { limit: 8, sort: 'order' }),
    listPublished<CmsNavDoc>('services', { limit: 8, sort: 'order' }),
    listPublished<CmsNavDoc>('industries', { limit: 8, sort: 'order' }),
  ])

  // Keep the desktop bar slim — overcrowded CMS menus fall back to the designed nav.
  const cmsLinks = navigation?.primaryLinks ?? []
  const links = cmsLinks.length > 0 && cmsLinks.length <= 7 ? cmsLinks : DEFAULT_NAV.primaryLinks
  const ctaLabel = navigation?.cta?.label || navigation?.ctaLabel || DEFAULT_NAV.ctaLabel
  const ctaHref = navigation?.cta?.href || navigation?.ctaHref || DEFAULT_NAV.ctaHref

  const megaMenus: Record<string, MegaMenuItem[]> = {
    about: COMPANY_MEGA,
    company: COMPANY_MEGA,
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
    insights: INSIGHTS_MEGA,
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
