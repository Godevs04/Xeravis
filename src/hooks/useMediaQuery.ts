'use client'

import { useEffect, useState } from 'react'

/** Desktop with a mouse — the only context that gets continuous / pointer-driven motion. */
export const RICH_MOTION_QUERY = '(min-width: 1024px) and (hover: hover) and (pointer: fine)'

/** Scroll-pinned storytelling only on desktop pointers; touch devices get stacked layouts. */
export const PINNED_SCROLL_QUERY = RICH_MOTION_QUERY

/** Scroll height (vh) given to each step of a pinned section. */
export const PINNED_STEP_VH = 160

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    const media = window.matchMedia(query)
    const onChange = () => setMatches(media.matches)
    onChange()
    media.addEventListener('change', onChange)
    return () => media.removeEventListener('change', onChange)
  }, [query])

  return matches
}

export function useMounted(): boolean {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  return mounted
}
