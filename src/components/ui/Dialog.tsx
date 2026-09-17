import { type ReactNode } from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface DialogProps {
  open: boolean
  onClose: () => void
  title?: string
  children: ReactNode
  className?: string
}

export function Dialog({ open, onClose, title, children, className }: DialogProps) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/50 animate-fade-in" onClick={onClose} />
      <div
        className={cn(
          'relative z-10 w-full max-w-[440px] bg-surface rounded-t-3xl sm:rounded-3xl p-5 animate-scale-in shadow-floating',
          className
        )}
      >
        {title ? (
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold">{title}</h3>
            <button onClick={onClose} className="h-8 w-8 rounded-full flex items-center justify-center hover:bg-muted" aria-label="Close">
              <X size={18} />
            </button>
          </div>
        ) : null}
        {children}
      </div>
    </div>
  )
}
