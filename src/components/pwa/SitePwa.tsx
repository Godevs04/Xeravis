'use client'

import { PwaInstallPrompt } from '@/components/pwa/PwaInstallPrompt'
import { PwaRegister } from '@/components/pwa/PwaRegister'

export function SitePwa() {
  return (
    <>
      <PwaRegister scriptUrl="/sw.js" scope="/" />
      <PwaInstallPrompt
        appName="Xelarvis"
        description="Install Xelarvis for a faster, app-like browsing experience — offline-ready essentials included."
        storageKey="xe-pwa-site"
        tone="site"
      />
    </>
  )
}
