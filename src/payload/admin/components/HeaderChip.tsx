'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useMemo } from 'react'

import { getBreadcrumbTrail } from '@/payload/admin/nav/registry'

/** Header breadcrumb trail — derived from the shared nav registry */
export const HeaderChip = () => {
  const pathname = usePathname() || '/admin'
  const crumbs = useMemo(() => getBreadcrumbTrail(pathname), [pathname])

  if (crumbs.length <= 1) return null

  return (
    <nav className="xe-header-chip xe-header-chip--breadcrumb" aria-label="Breadcrumb">
      <ol className="xe-breadcrumb">
        {crumbs.map((crumb, index) => {
          const last = index === crumbs.length - 1
          return (
            <li key={`${crumb.label}-${index}`} className="xe-breadcrumb__item">
              {index > 0 ? (
                <span className="xe-breadcrumb__sep" aria-hidden>
                  /
                </span>
              ) : null}
              {crumb.href && !last ? (
                <Link href={crumb.href} className="xe-breadcrumb__link">
                  {crumb.label}
                </Link>
              ) : (
                <span className="xe-breadcrumb__current" aria-current={last ? 'page' : undefined}>
                  {crumb.label}
                </span>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

export default HeaderChip
