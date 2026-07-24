'use client'

import { Search } from 'lucide-react'
import * as React from 'react'

import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

type SearchBarProps = {
  value?: string
  defaultValue?: string
  onChange?: (value: string) => void
  onSubmitSearch?: (value: string) => void
  placeholder?: string
  className?: string
  containerClassName?: string
  name?: string
  'aria-label'?: string
}

export function SearchBar({
  className,
  containerClassName,
  onSubmitSearch,
  onChange,
  placeholder = 'Search',
  value,
  defaultValue = '',
  name = 'q',
  'aria-label': ariaLabel,
}: SearchBarProps) {
  const [internal, setInternal] = React.useState(defaultValue)
  const current = value !== undefined ? value : internal

  return (
    <form
      role="search"
      className={cn('relative w-full', containerClassName)}
      onSubmit={(event) => {
        event.preventDefault()
        onSubmitSearch?.(current.trim())
      }}
    >
      <Search
        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
        aria-hidden
      />
      <Input
        type="search"
        name={name}
        value={current}
        onChange={(event) => {
          const next = event.target.value
          if (value === undefined) setInternal(next)
          onChange?.(next)
        }}
        placeholder={placeholder}
        className={cn('pl-10', className)}
        aria-label={ariaLabel ?? placeholder}
      />
    </form>
  )
}
