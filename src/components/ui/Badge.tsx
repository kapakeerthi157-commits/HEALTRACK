import type { HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

type Tone = 'primary' | 'emergency' | 'success' | 'warning' | 'info' | 'muted'

const toneClasses: Record<Tone, string> = {
  primary: 'bg-primary-50 text-primary-700 dark:bg-primary/20 dark:text-primary',
  emergency: 'bg-emergency-50 text-emergency-600 dark:bg-emergency/20 dark:text-emergency',
  success: 'bg-success-50 text-success-600 dark:bg-success/20 dark:text-success',
  warning: 'bg-warning-50 text-warning-600 dark:bg-warning/20 dark:text-warning',
  info: 'bg-info-50 text-info-600 dark:bg-info/20 dark:text-info',
  muted: 'bg-muted text-muted-foreground'
}

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: Tone
}

export function Badge({ className, tone = 'muted', ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium',
        toneClasses[tone],
        className
      )}
      {...props}
    />
  )
}
