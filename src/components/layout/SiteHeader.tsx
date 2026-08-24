import { SiteHeaderClient } from '@/components/layout/SiteHeaderClient'
import type { MegaMenuItem } from '@/components/layout/MegaMenu'
import { getGlobal, listPublished } from '@/lib/cms'
import {
  BRAND,
  DEFAULT_NAV,
  FALLBACK_INDUSTRIES,
  FALLBACK_SERVICES,
  FALLBACK_SOLUTIONS,
} from '@/lib/fallback-data'
import { ABOUT_MEGA, INSIGHTS_MEGA, RESEARCH_MEGA } from '@/lib/site-ia'

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

const ABOUT_MENU: MegaMenuItem[] = [
  {
    label: 'About XELARVIS',
    href: '/about',
    description: 'Company story, mission, and values.',
  },
  ...ABOUT_MEGA,
]

/** CMS nav is used only when it matches Mainplan top nav (no stale Company / Technologies top-level). */
function isMainplanAlignedNav(
  links: { label: string; href: string; mega?: string | null }[],
): boolean {
  if (links.length === 0 || links.length > 9) return false
  const megas = new Set(links.map((l) => l.mega).filter(Boolean))
  const labels = links.map((l) => l.label.trim().toLowerCase())
  const hasResearch = megas.has('research')
  const hasAbout = megas.has('about') || labels.includes('about')
  const hasServices = megas.has('services') || labels.includes('services')
  const hasSolutions = megas.has('solutions') || labels.includes('solutions')
  const hasStaleCompany = labels.includes('company')
  const hasTechnologiesTop = labels.includes('technologies')
  return (
    hasResearch &&
    hasAbout &&
    hasServices &&
    hasSolutions &&
    !hasStaleCompany &&
    !hasTechnologiesTop
  )
}

export async function SiteHeader() {
  const [navigation, solutions, services, industries] = await Promise.all([
    getGlobal<NavigationGlobal>('navigation'),
    listPublished<CmsNavDoc>('solutions', { limit: 9, sort: 'order' }),
    listPublished<CmsNavDoc>('services', { limit: 8, sort: 'order' }),
    listPublished<CmsNavDoc & { tier?: string | null }>('industries', { limit: 12, sort: 'order' }),
  ])

  const cmsLinks = navigation?.primaryLinks ?? []
  const links = isMainplanAlignedNav(cmsLinks) ? cmsLinks : DEFAULT_NAV.primaryLinks
  const ctaLabel = navigation?.cta?.label || navigation?.ctaLabel || DEFAULT_NAV.ctaLabel
  const ctaHref = navigation?.cta?.href || navigation?.ctaHref || DEFAULT_NAV.ctaHref

  const industryMegaSource = (industries.length ? industries : FALLBACK_INDUSTRIES).filter((i) => {
    const tier = 'tier' in i ? i.tier : '1'
    return !tier || tier === '1' || tier === '2'
  })

  const megaMenus: Record<string, MegaMenuItem[]> = {
    about: ABOUT_MENU,
    company: ABOUT_MENU,
    research: RESEARCH_MEGA,
    solutions: toMegaItems(solutions.length ? solutions : FALLBACK_SOLUTIONS, '/solutions', {
      label: 'All solutions',
      href: '/solutions',
      description: 'Browse solution catalog.',
    }),
    services: toMegaItems(services.length ? services : FALLBACK_SERVICES, '/services', {
      label: 'All services',
      href: '/services',
      description: 'Full capability catalog.',
    }),
    industries: toMegaItems(industryMegaSource, '/industries', {
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
