'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

import { useMounted } from '@/hooks/useMediaQuery'

export function useScrollHeader(threshold = 48) {
  const mounted = useMounted()
  const [solid, setSolid] = useState(false)
  const [hidden, setHidden] = useState(false)
  const lastY = useRef(0)

  const onScroll = useCallback(() => {
    const y = window.scrollY
    setSolid(y > threshold)
    if (y > 80 && y > lastY.current + 4) setHidden(true)
    else if (y < lastY.current - 4) setHidden(false)
    lastY.current = y
  }, [threshold])

  useEffect(() => {
    if (!mounted) return
    lastY.current = window.scrollY
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [mounted, onScroll])

  // Keep SSR and first client paint identical — only apply scroll state after mount.
  return {
    solid: mounted ? solid : false,
    hidden: mounted ? hidden : false,
  }
}
