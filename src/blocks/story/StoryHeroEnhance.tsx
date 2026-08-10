'use client'

import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'

const StoryHeroMotion = dynamic(() => import('./StoryHeroMotion').then((m) => m.StoryHeroMotion), {
  ssr: false,
})

/** Loads cinematic hero motion only after the user interacts (keeps LCP clean). */
export function StoryHeroEnhance() {
  const [active, setActive] = useState(false)

  useEffect(() => {
    const enable = () => setActive(true)
    const opts: AddEventListenerOptions = { once: true, passive: true }
    window.addEventListener('pointerdown', enable, opts)
    window.addEventListener('keydown', enable, opts)
    window.addEventListener('scroll', enable, opts)
    return () => {
      window.removeEventListener('pointerdown', enable)
      window.removeEventListener('keydown', enable)
      window.removeEventListener('scroll', enable)
    }
  }, [])

  if (!active) return null
  return <StoryHeroMotion />
}
