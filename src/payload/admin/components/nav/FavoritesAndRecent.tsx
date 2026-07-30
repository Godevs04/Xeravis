'use client'

import Link from 'next/link'
import React from 'react'

import { useWorkspaceOptional } from '@/payload/admin/workspace/WorkspaceContext'

const FALLBACK_FAVORITES = [
  { label: 'SEO Center', href: '/admin/workspace/seo' },
  { label: 'Media Studio', href: '/admin/workspace/media' },
]

export const FavoritesAndRecent = () => {
  const ctx = useWorkspaceOptional()
  const modules = ctx?.workspace.modules || FALLBACK_FAVORITES
  const creates = ctx?.workspace.creates || []

  return (
    <>
      <div className="xe-nav-section">
        <div className="xe-nav-section__title">Pinned</div>
        <ul className="xe-nav-section__list">
          {modules.map((item) => (
            <li key={item.href}>
              <Link href={item.href}>
                <span className="xe-nav-section__dot" />
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      {creates.length > 0 ? (
        <div className="xe-nav-section">
          <div className="xe-nav-section__title">Shortcuts</div>
          <ul className="xe-nav-section__list">
            {creates.slice(0, 4).map((item) => (
              <li key={`${item.href}-${item.label}`}>
                <Link href={item.href}>
                  <span className="xe-nav-section__dot xe-nav-section__dot--muted" />
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </>
  )
}

export default FavoritesAndRecent
