'use client'

import Link from 'next/link'
import React from 'react'

import { useWorkspaceOptional } from '@/payload/admin/workspace/WorkspaceContext'

const RECENT = [
  { label: 'Site Settings', href: '/admin/globals/site-settings' },
  { label: 'Pages', href: '/admin/collections/pages' },
  { label: 'Candidates', href: '/admin/collections/job-applications' },
]

/** Compact pins under BusinessNav — collection links only */
export const FavoritesAndRecent = () => {
  const ctx = useWorkspaceOptional()
  const pins = ctx?.workspace.links?.slice(0, 3) || RECENT
  const creates = ctx?.workspace.creates || []

  return (
    <div className="xe-shortcuts-stack">
      <div className="xe-nav-section">
        <div className="xe-nav-section__title">Pinned</div>
        <ul className="xe-nav-section__list">
          {pins.map((item) => (
            <li key={item.href}>
              <Link href={item.href}>
                <span className="xe-nav-section__dot" />
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
      {creates.length > 0 ? (
        <div className="xe-nav-section">
          <div className="xe-nav-section__title">Quick create</div>
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
    </div>
  )
}

export default FavoritesAndRecent
