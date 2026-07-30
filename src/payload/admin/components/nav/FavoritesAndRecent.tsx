'use client'

import Link from 'next/link'
import React from 'react'

import { useWorkspaceOptional } from '@/payload/admin/workspace/WorkspaceContext'

const FALLBACK_FAVORITES = [
  { label: 'SEO Center', href: '/admin/workspace/seo' },
  { label: 'Media Studio', href: '/admin/workspace/media' },
]

const RECENT = [
  { label: 'Site Settings', href: '/admin/globals/site-settings' },
  { label: 'Pages', href: '/admin/collections/pages' },
]

export const FavoritesAndRecent = () => {
  const ctx = useWorkspaceOptional()
  const modules = ctx?.workspace.modules?.slice(0, 3) || FALLBACK_FAVORITES
  const creates = ctx?.workspace.creates || []

  return (
    <div className="xe-shortcuts-stack">
      <div className="xe-nav-section">
        <div className="xe-nav-section__title">Pinned</div>
        <ul className="xe-nav-section__list">
          {modules.map((item) => (
            <li key={item.href}>
              <Link href={item.href}>
                <span className="xe-nav-section__dot" />
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div className="xe-nav-section">
        <div className="xe-nav-section__title">Recent</div>
        <ul className="xe-nav-section__list">
          {RECENT.map((item) => (
            <li key={item.href}>
              <Link href={item.href}>
                <span className="xe-nav-section__dot xe-nav-section__dot--muted" />
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
      {creates.length > 0 ? (
        <div className="xe-nav-section">
          <div className="xe-nav-section__title">Favorites</div>
          <ul className="xe-nav-section__list">
            {creates.slice(0, 3).map((item) => (
              <li key={`${item.href}-${item.label}`}>
                <Link href={item.href}>
                  <span className="xe-nav-section__dot" />
                  <span>{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
      <div className="xe-nav-section__title xe-nav-section__title--collections">Collections</div>
    </div>
  )
}

export default FavoritesAndRecent
