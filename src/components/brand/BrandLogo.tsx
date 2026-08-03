'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion, useReducedMotion } from 'framer-motion'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

import { cn } from '@/lib/utils'

export const BRAND_MARK_SRC = '/brand/xel-mark.png'
export const BRAND_MARK_DARK_SRC = '/brand/xel-mark-dark.png'
export const BRAND_MARK_ALT = 'Xelarvis'

type BrandLogoProps = {
  showWordmark?: boolean
  wordmark?: string
  /** Optional second line under the wordmark (Lakshya-style lockup) */
  tagline?: string
  /** Mark height in px — width follows square mark */
  size?: number
  href?: string | false
  className?: string
  markClassName?: string
  wordmarkClassName?: string
  animate?: boolean
  priority?: boolean
  onClick?: () => void
  variant?: 'default' | 'header' | 'footer'
}

const EASE = [0.22, 1, 0.36, 1] as const

/**
 * Horizontal brand lockup — mark + wordmark, Lakshya-style:
 * freestanding mark, vertically centered text, quiet spacing, no badge chrome.
 */
export function BrandLogo({
  showWordmark = true,
  wordmark = 'Xelarvis',
  tagline,
  size = 40,
  href = '/',
  className,
  markClassName,
  wordmarkClassName,
  animate = true,
  priority = false,
  onClick,
  variant = 'default',
}: BrandLogoProps) {
  const reduce = useReducedMotion()
  const motionOn = animate && !reduce
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const isDark = mounted && resolvedTheme === 'dark'
  const markSrc = isDark ? BRAND_MARK_DARK_SRC : BRAND_MARK_SRC
  const isLockup = variant === 'header' || variant === 'footer'
  const markSize = size

  const mark = (
    <motion.span
      className={cn('relative block shrink-0 overflow-visible', markClassName)}
      style={{ width: markSize, height: markSize }}
      initial={motionOn ? { opacity: 0, y: 4 } : false}
      animate={
        motionOn ? { opacity: 1, y: 0, transition: { duration: 0.45, ease: EASE } } : undefined
      }
      whileHover={motionOn ? { y: -1, transition: { duration: 0.25, ease: EASE } } : undefined}
    >
      <Image
        src={markSrc}
        alt=""
        width={markSize * 2}
        height={markSize * 2}
        priority={priority}
        className="h-full w-full object-contain object-center"
        sizes={`${markSize}px`}
      />
    </motion.span>
  )

  const label = showWordmark ? (
    <motion.span
      className={cn('flex min-w-0 flex-col justify-center', isLockup ? 'gap-0.5' : 'gap-0')}
      initial={motionOn ? { opacity: 0, x: -6 } : false}
      animate={
        motionOn
          ? { opacity: 1, x: 0, transition: { delay: 0.08, duration: 0.4, ease: EASE } }
          : undefined
      }
    >
      <span
        className={cn(
          'truncate leading-none tracking-[-0.02em] text-[color:var(--color-primary)]',
          isLockup
            ? 'font-sans text-[0.95rem] font-semibold sm:text-[1.02rem]'
            : 'font-display text-[1.05rem] font-bold',
          wordmarkClassName,
        )}
      >
        {wordmark}
      </span>
      {tagline ? (
        <span className="hidden truncate text-[10px] font-medium tracking-[0.04em] text-[color:var(--color-muted)] uppercase sm:block">
          {tagline}
        </span>
      ) : null}
    </motion.span>
  ) : null

  const inner = (
    <span
      className={cn('inline-flex min-w-0 items-center', isLockup ? 'gap-3' : 'gap-2.5', className)}
    >
      {mark}
      {label}
    </span>
  )

  if (href === false) {
    return (
      <span className="inline-flex items-center" aria-label={BRAND_MARK_ALT}>
        {inner}
      </span>
    )
  }

  return (
    <Link
      href={href}
      onClick={onClick}
      className="group inline-flex max-w-full items-center rounded-md transition-opacity outline-none hover:opacity-90 focus-visible:ring-2 focus-visible:ring-[color:var(--color-accent)]/45 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
      aria-label={BRAND_MARK_ALT}
    >
      {inner}
    </Link>
  )
}
