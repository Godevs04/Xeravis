import Link from 'next/link'
import React from 'react'

import { WORKSPACE_NAV } from '@/payload/admin/workspace/lib'
import { QuickCreate } from './QuickCreate'

/** Injected before collection/global nav links */
export const BeforeNavLinks = () => {
  return (
    <>
      <div className="xe-ws-nav">
        <div className="xe-ws-nav__label">Workspace</div>
        {WORKSPACE_NAV.map((item) => (
          <Link key={item.id} href={item.href} title={item.description}>
            {item.label}
          </Link>
        ))}
      </div>
      <QuickCreate />
    </>
  )
}

export default BeforeNavLinks
