'use client'

import React, { useEffect } from 'react'

import { NAV_GROUPS, isLinkActive, resolveNavigation } from '@/payload/admin/nav/registry'

/**
 * Dev-only: verify every sidebar href resolves to an active state
 * and that parents expand from the live registry (no hardcoded lists).
 */
export function NavAudit() {
  useEffect(() => {
    if (process.env.NODE_ENV === 'production') return

    const hrefs: string[] = []
    for (const group of NAV_GROUPS) {
      if (group.href) hrefs.push(group.href)
      for (const item of group.items) hrefs.push(item.href)
    }

    const duplicates = hrefs.filter((h, i) => hrefs.indexOf(h) !== i)
    const unique = [...new Set(hrefs)]
    const brokenActive: string[] = []

    for (const href of unique) {
      const nav = resolveNavigation(href)
      if (!nav.section) {
        brokenActive.push(href)
        continue
      }
      const group = NAV_GROUPS.find((g) => g.id === nav.section)
      if (!group) {
        brokenActive.push(href)
        continue
      }
      const leafOk =
        (group.href && isLinkActive(href, group.href)) ||
        group.items.some((item) => isLinkActive(href, item.href))
      if (!leafOk) brokenActive.push(href)
    }

    // eslint-disable-next-line no-console -- intentional admin shell audit
    console.info('[xe-nav-audit]', {
      routes: unique.length,
      duplicates: [...new Set(duplicates)],
      unresolvedActive: brokenActive,
      ok: duplicates.length === 0 && brokenActive.length === 0,
    })
  }, [])

  return null
}

export default NavAudit
