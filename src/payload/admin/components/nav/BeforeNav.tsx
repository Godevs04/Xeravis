import React from 'react'

import { NavSearchTrigger } from './NavSearchTrigger'
import { WorkspaceSwitcher } from './WorkspaceSwitcher'

/** Injected above the nav wrap via admin.components.beforeNav */
export const BeforeNav = () => {
  return (
    <div className="xe-before-nav">
      <WorkspaceSwitcher />
      <NavSearchTrigger />
    </div>
  )
}

export default BeforeNav
