/**
 * Thin compatibility layer over the canonical nav registry.
 * New code should import from `@/payload/admin/nav/registry`.
 */

import {
  NAV_GROUPS,
  QUICK_CREATES as REGISTRY_QUICK_CREATES,
  groupHasActiveLink,
  isLinkActive,
  type NavGroup,
  type NavItem,
} from '@/payload/admin/nav/registry'

export type NavModuleId = string

export type NavLink = {
  label: string
  href: string
  hint?: string
}

export type NavModule = {
  id: string
  label: string
  description: string
  icon: NavGroup['icon']
  href?: string
  links: NavLink[]
  creates: { label: string; href: string }[]
}

function toModule(group: NavGroup): NavModule {
  return {
    id: group.id,
    label: group.label,
    description: group.description,
    icon: group.icon,
    href: group.href,
    links: group.items.map((item: NavItem) => ({
      label: item.label,
      href: item.href,
      hint: item.description,
    })),
    creates: [],
  }
}

export const NAV_MODULES: NavModule[] = NAV_GROUPS.map(toModule)

export const QUICK_CREATES = REGISTRY_QUICK_CREATES.map((c) => ({
  label: c.label,
  href: c.href,
  icon: c.icon,
}))

export { isLinkActive }

export function moduleHasActiveLink(pathname: string, mod: NavModule) {
  return groupHasActiveLink(pathname, {
    id: mod.id,
    label: mod.label,
    description: mod.description,
    icon: mod.icon,
    href: mod.href,
    items: mod.links.map((l) => ({ id: l.href, label: l.label, href: l.href })),
  })
}
