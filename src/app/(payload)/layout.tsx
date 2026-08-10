/* THIS FILE WAS GENERATED AUTOMATICALLY BY PAYLOAD. */
/* Extended: htmlProps + Inter via next/font for admin design system. */
import config from '@payload-config'
import '@payloadcms/next/css'
import type { ServerFunctionClient } from 'payload'
import { handleServerFunctions, RootLayout } from '@payloadcms/next/layouts'
import { Inter } from 'next/font/google'
import React from 'react'

import { importMap } from './admin/importMap.js'
import './custom.scss'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
  weight: ['400', '500', '600', '700'],
})

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

const htmlProps = {
  'data-xe-ui': 'v5',
  className: inter.variable,
  suppressHydrationWarning: true,
} as React.HtmlHTMLAttributes<HTMLHtmlElement>

const Layout = ({ children }: Args) => (
  <RootLayout
    config={config}
    importMap={importMap}
    serverFunction={serverFunction}
    htmlProps={htmlProps}
  >
    {children}
  </RootLayout>
)

export default Layout
