import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-semibold tracking-tight transition-[transform,background-color,box-shadow,color,border-color] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]',
  {
    variants: {
      variant: {
        default: 'bg-primary text-background hover:bg-primary/90 shadow-[var(--shadow-light)]',
        primary:
          'bg-accent text-white hover:bg-[var(--color-accent-hover)] shadow-[0_0_0_1px_rgba(109,94,249,0.35),0_10px_28px_rgba(109,94,249,0.32)] hover:shadow-[0_0_0_1px_rgba(109,94,249,0.5),0_14px_36px_rgba(109,94,249,0.4)]',
        accent:
          'bg-accent text-white hover:bg-[var(--color-accent-hover)] shadow-[0_0_0_1px_rgba(109,94,249,0.35),0_10px_28px_rgba(109,94,249,0.32)]',
        secondary:
          'border border-[color:var(--glass-border-soft)] bg-[color:var(--glass-bg)] text-primary backdrop-blur-md hover:border-[color:var(--color-border-strong)] hover:bg-[color:var(--color-hover)]',
        outline:
          'border border-[color:var(--color-border-strong)] bg-[color:var(--glass-bg)] text-primary backdrop-blur-md hover:border-accent/40 hover:bg-[color:var(--color-accent-soft)]',
        ghost: 'text-secondary hover:text-primary hover:bg-[color:var(--color-hover)]',
        link: 'text-accent underline-offset-4 hover:underline',
        danger: 'bg-[var(--color-danger)] text-white hover:opacity-90',
        success: 'bg-[var(--color-success)] text-white hover:opacity-90',
      },
      size: {
        default:
          'h-[var(--touch-min)] min-h-[var(--touch-min)] px-6 rounded-[var(--radius-button)]',
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
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean
  loading?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, loading, disabled, children, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'

    if (asChild) {
      return (
        <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props}>
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
