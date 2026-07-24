'use client'

import Link from 'next/link'
import React from 'react'

/** Header shortcut to log out of CMS */
export const LogoutAction = () => {
  return (
    <Link className="xe-action-btn xe-logout-action" href="/admin/logout" aria-label="Log out">
      Log out
    </Link>
  )
}

export default LogoutAction
