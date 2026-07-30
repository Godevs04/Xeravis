import React from 'react'

import { ProfileCard } from './ProfileCard'

/** Bottom of sidebar: profile only — keep nav clean */
export const AfterNavLinks = () => {
  return (
    <div className="xe-after-nav">
      <ProfileCard />
    </div>
  )
}

export default AfterNavLinks
