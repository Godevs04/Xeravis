/* THIS FILE WAS GENERATED AUTOMATICALLY BY PAYLOAD. */
/* Extended: htmlProps so data-xe-ui is present on first paint (no FOUC / no Script hydration). */
import config from '@payload-config'
import '@payloadcms/next/css'
import type { ServerFunctionClient } from 'payload'
import { handleServerFunctions, RootLayout } from '@payloadcms/next/layouts'
import React from 'react'

import { importMap } from './admin/importMap.js'
import './custom.scss'

type Args = {
  children: React.ReactNode
}

const serverFunction: ServerFunctionClient = async function (args) {
  'use server'
  return handleServerFunctions({
    ...args,
    config,
    importMap,
  })
}

const Layout = ({ children }: Args) => (
  <RootLayout
    config={config}
    importMap={importMap}
    serverFunction={serverFunction}
    htmlProps={{
      'data-xe-ui': 'v5',
      suppressHydrationWarning: true,
    }}
  >
    {children}
  </RootLayout>
)

export default Layout
