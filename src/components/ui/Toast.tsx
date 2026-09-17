import { createContext, useCallback, useContext, useState, type ReactNode } from 'react'
import { CheckCircle2, AlertCircle, Info } from 'lucide-react'
import { cn } from '@/lib/utils'

type ToastKind = 'success' | 'error' | 'info'
interface ToastItem {
  id: string
  message: string
  kind: ToastKind
}

const ToastContext = createContext<{ show: (msg: string, kind?: ToastKind) => void } | undefined>(undefined)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const show = useCallback((message: string, kind: ToastKind = 'success') => {
    const id = Math.random().toString(36).slice(2)
    setToasts((prev) => [...prev, { id, message, kind }])
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3000)
  }, [])

  const icons: Record<ToastKind, typeof CheckCircle2> = { success: CheckCircle2, error: AlertCircle, info: Info }
  const colors: Record<ToastKind, string> = {
    success: 'text-success',
    error: 'text-emergency',
    info: 'text-info'
  }

  return (
    <ToastContext.Provider value={{ show }}>
      {children}
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] flex flex-col gap-2 w-[92%] max-w-[440px] pointer-events-none">
        {toasts.map((t) => {
          const Icon = icons[t.kind]
          return (
            <div
              key={t.id}
              className="pointer-events-auto flex items-center gap-2 bg-surface border border-border shadow-floating rounded-xl px-4 py-3 animate-fade-in"
            >
              <Icon size={18} className={cn('shrink-0', colors[t.kind])} />
              <p className="text-sm font-medium text-foreground">{t.message}</p>
            </div>
          )
        })}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}
