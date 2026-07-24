'use client'

import Link from 'next/link'
import React from 'react'

const FAVORITES = [
  { label: 'Pages', href: '/admin/collections/pages' },
  { label: 'Blogs', href: '/admin/collections/blogs' },
  { label: 'Services', href: '/admin/collections/services' },
  { label: 'Media', href: '/admin/collections/media' },
]

const RECENT = [
  { label: 'Site Settings', href: '/admin/globals/site-settings' },
  { label: 'Navigation', href: '/admin/globals/navigation' },
  { label: 'Contact Messages', href: '/admin/collections/contact-messages' },
  { label: 'Careers', href: '/admin/collections/careers' },
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
                <span className="xe-nav-section__dot" style={{ background: '#a1a1aa' }} />
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
