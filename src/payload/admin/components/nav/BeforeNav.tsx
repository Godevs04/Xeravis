import React from 'react'

import { WorkspaceSwitcher } from './WorkspaceSwitcher'

/** Top of sidebar: workspace only — search/create live in the header */
export const BeforeNav = () => {
  return (
    <div className="xe-before-nav">
      <WorkspaceSwitcher />
    </div>
  )
}

export default BeforeNav
