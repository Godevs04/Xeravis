import React from 'react'

import { AdminAccountBar } from './AdminAccountBar'
import { FavoritesAndRecent } from './FavoritesAndRecent'

/** Injected after collection/global nav links */
export const AfterNavLinks = () => {
  return (
    <>
      <FavoritesAndRecent />
      <AdminAccountBar />
    </>
  )
}

export default AfterNavLinks
