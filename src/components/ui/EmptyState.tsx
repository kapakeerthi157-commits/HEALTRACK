import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  body?: string
  action?: ReactNode
  tone?: 'muted' | 'error'
  className?: string
}

export function EmptyState({ icon: Icon, title, body, action, tone = 'muted', className }: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center text-center px-6 py-12 animate-fade-in', className)}>
      <div
        className={cn(
          'h-16 w-16 rounded-2xl flex items-center justify-center mb-4',
          tone === 'error' ? 'bg-emergency-50 text-emergency dark:bg-emergency/15' : 'bg-muted text-muted-foreground'
        )}
      >
        <Icon size={28} strokeWidth={1.75} />
      </div>
      <p className="font-semibold text-foreground">{title}</p>
      {body ? <p className="text-sm text-muted-foreground mt-1 max-w-[280px]">{body}</p> : null}
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  )
}
