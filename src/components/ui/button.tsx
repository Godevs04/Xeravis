import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-semibold transition-[transform,background-color,box-shadow,color,border-color] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]',
  {
    variants: {
      variant: {
        default: 'bg-primary text-white hover:bg-primary/90',
        primary: 'bg-accent text-white hover:bg-[var(--color-accent-hover)] shadow-[var(--shadow-light)] hover:shadow-[var(--shadow-hover)]',
        accent: 'bg-accent text-white hover:bg-[var(--color-accent-hover)] shadow-[var(--shadow-light)] hover:shadow-[var(--shadow-hover)]',
        secondary:
          'border border-[var(--color-muted-line)] bg-transparent text-primary hover:border-primary hover:bg-surface',
        outline:
          'border border-[var(--color-muted-line)] bg-transparent text-primary hover:border-primary hover:bg-surface',
        ghost: 'text-secondary hover:text-primary hover:bg-surface',
        link: 'text-accent underline-offset-4 hover:underline',
        danger: 'bg-[var(--color-danger)] text-white hover:opacity-90',
        success: 'bg-[var(--color-success)] text-white hover:opacity-90',
      },
      size: {
        default: 'h-[var(--touch-min)] min-h-[var(--touch-min)] px-6 rounded-[var(--radius-button)]',
        sm: 'h-9 min-h-9 px-4 rounded-[var(--radius-button)] text-xs',
        lg: 'h-12 min-h-12 px-8 rounded-[var(--radius-button)] text-base',
        icon: 'h-[var(--touch-min)] w-[var(--touch-min)] rounded-[var(--radius-button)]',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'default',
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  loading?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, loading, disabled, children, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'

    if (asChild) {
      return (
        <Comp
          className={cn(buttonVariants({ variant, size, className }))}
          ref={ref}
          {...props}
        >
          {children}
        </Comp>
      )
    }

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || loading}
        aria-busy={loading || undefined}
        {...props}
      >
        {loading ? (
          <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current/30 border-t-current" />
        ) : null}
        {children}
      </Comp>
    )
  },
)
Button.displayName = 'Button'

export { Button, buttonVariants }
