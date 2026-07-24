import * as React from 'react'

import { cn } from '@/lib/utils'

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'text-primary placeholder:text-muted focus-visible:border-accent/40 focus-visible:ring-accent/30 flex h-11 w-full rounded-[14px] border border-[color:var(--glass-border-soft)] bg-[color:var(--glass-bg)] px-4 py-2 text-sm shadow-[var(--shadow-light)] backdrop-blur-md transition-[border-color,box-shadow,background-color] focus-visible:bg-white/80 focus-visible:ring-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:focus-visible:bg-white/5',
          className,
        )}
        ref={ref}
        {...props}
      />
    )
  },
)
Input.displayName = 'Input'

export { Input }
