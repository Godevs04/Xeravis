'use client'

import React from 'react'

import { EnterpriseNav } from './enterprise/EnterpriseNav'

/**
 * Payload mounts beforeNav as a sibling of .nav__wrap (not inside it).
 * OS shell lives here so wrap/group CSS cannot hide navigation.
 */
export const BeforeNav = () => {
  return <EnterpriseNav />
}

export default BeforeNav
