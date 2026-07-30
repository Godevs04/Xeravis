'use client'

import React from 'react'

import { BusinessNav } from './BusinessNav'
import { FavoritesAndRecent } from './FavoritesAndRecent'

/** Workspaces → pinned shortcuts; Payload collection links render below */
export const BeforeNavLinks = () => {
  return (
    <div className="xe-before-links">
      <BusinessNav />
      <FavoritesAndRecent />
    </div>
  )
}

export default BeforeNavLinks
