'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

export function useScrollHeader(threshold = 48) {
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
    lastY.current = window.scrollY
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [onScroll])

  return { solid, hidden }
}
