'use client'

import Link from 'next/link'
import React from 'react'

const FAVORITES = [
  { label: 'Recruitment', href: '/admin/workspace/recruitment' },
  { label: 'CRM Inbox', href: '/admin/workspace/crm' },
  { label: 'Pages', href: '/admin/collections/pages' },
  { label: 'Insights', href: '/admin/collections/blogs' },
]

const RECENT = [
  { label: 'SEO Center', href: '/admin/workspace/seo' },
  { label: 'AI Assistant', href: '/admin/workspace/ai' },
  { label: 'Applications', href: '/admin/collections/job-applications' },
  { label: 'Site Settings', href: '/admin/globals/site-settings' },
]

export const FavoritesAndRecent = () => {
  return (
    <>
      <div className="xe-nav-section">
        <div className="xe-nav-section__title">Favorites</div>
        <ul className="xe-nav-section__list">
          {FAVORITES.map((item) => (
            <li key={item.href}>
              <Link href={item.href}>
                <span className="xe-nav-section__dot" />
                {item.label}
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
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}

export default FavoritesAndRecent
