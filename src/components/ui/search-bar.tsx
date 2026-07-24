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
  action?: string
  method?: 'get' | 'post'
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
  action = '/search',
  method = 'get',
  'aria-label': ariaLabel,
}: SearchBarProps) {
  const [internal, setInternal] = React.useState(defaultValue)
  const current = value !== undefined ? value : internal

  return (
    <form
      role="search"
      action={onSubmitSearch ? undefined : action}
      method={onSubmitSearch ? undefined : method}
      className={cn('relative w-full', containerClassName)}
      onSubmit={(event) => {
        if (onSubmitSearch) {
          event.preventDefault()
          onSubmitSearch(current.trim())
        }
      }}
    >
      <Search
        className="text-muted pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2"
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
