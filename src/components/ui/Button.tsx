import { forwardRef, type ButtonHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

type Variant = 'primary' | 'emergency' | 'secondary' | 'outline' | 'ghost' | 'success'
type Size = 'sm' | 'md' | 'lg' | 'icon'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  isLoading?: boolean
}

const variantClasses: Record<Variant, string> = {
  primary: 'bg-primary text-primary-foreground hover:opacity-90 active:scale-[0.98] shadow-soft',
  emergency: 'bg-emergency text-emergency-foreground hover:opacity-90 active:scale-[0.98] shadow-card',
  secondary: 'bg-muted text-foreground hover:bg-border active:scale-[0.98]',
  outline: 'border border-border bg-transparent text-foreground hover:bg-muted active:scale-[0.98]',
  ghost: 'bg-transparent text-foreground hover:bg-muted active:scale-[0.98]',
  success: 'bg-success text-white hover:opacity-90 active:scale-[0.98]'
}

const sizeClasses: Record<Size, string> = {
  sm: 'h-9 px-3 text-sm rounded-lg',
  md: 'h-11 px-4 text-sm rounded-xl',
  lg: 'h-14 px-6 text-base rounded-2xl font-semibold',
  icon: 'h-10 w-10 rounded-full'
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, disabled, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          'inline-flex items-center justify-center gap-2 font-medium transition-all duration-150 disabled:opacity-50 disabled:pointer-events-none select-none',
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        {...props}
      >
        {isLoading ? (
          <span className="h-4 w-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
        ) : null}
        {children}
      </button>
    )
  }
)
Button.displayName = 'Button'
