'use client'

import * as React from 'react'

import { useTheme } from 'next-themes'
import { Moon, Sun } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { useMounted } from '@/hooks/useMediaQuery'
import { cn } from '@/lib/utils'

export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme()
  const mounted = useMounted()

  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="icon"
        aria-label="Toggle theme"
        disabled
        className={cn(
          'text-[color:var(--color-primary)] hover:bg-[color:var(--color-hover)]',
          className,
        )}
      />
    )
  }

  const isDark = resolvedTheme === 'dark'

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className={cn(
        'text-[color:var(--color-primary)] hover:bg-[color:var(--color-hover)] hover:text-[color:var(--color-primary)]',
        className,
      )}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
    >
      {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </Button>
  )
}
