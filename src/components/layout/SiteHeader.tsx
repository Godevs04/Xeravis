import { SiteHeaderClient } from '@/components/layout/SiteHeaderClient'
import { getGlobal } from '@/lib/cms'
import { BRAND, DEFAULT_NAV } from '@/lib/fallback-data'

type NavigationGlobal = {
  primaryLinks?: { label: string; href: string; mega?: string | null }[]
  cta?: { label?: string | null; href?: string | null } | null
  ctaLabel?: string
  ctaHref?: string
}

export async function SiteHeader() {
  const navigation = await getGlobal<NavigationGlobal>('navigation')
  const links = navigation?.primaryLinks?.length ? navigation.primaryLinks : DEFAULT_NAV.primaryLinks
  const ctaLabel = navigation?.cta?.label || navigation?.ctaLabel || DEFAULT_NAV.ctaLabel
  const ctaHref = navigation?.cta?.href || navigation?.ctaHref || DEFAULT_NAV.ctaHref

  return (
    <SiteHeaderClient
      links={links}
      ctaLabel={ctaLabel}
      ctaHref={ctaHref}
      brandName={BRAND.name}
    />
  )
}
