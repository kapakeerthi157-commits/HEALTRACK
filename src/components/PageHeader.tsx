import { ChevronLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import type { ReactNode } from 'react'

interface PageHeaderProps {
  title: string
  onBack?: () => void
  right?: ReactNode
  transparent?: boolean
}

export function PageHeader({ title, onBack, right, transparent }: PageHeaderProps) {
  const navigate = useNavigate()
  return (
    <header
      className={`sticky top-0 z-30 flex items-center justify-between px-4 py-3 ${
        transparent ? '' : 'bg-surface/90 backdrop-blur border-b border-border'
      }`}
    >
      <button
        onClick={onBack ?? (() => navigate(-1))}
        className="h-9 w-9 rounded-full flex items-center justify-center hover:bg-muted -ml-1.5"
        aria-label="Go back"
      >
        <ChevronLeft size={22} />
      </button>
      <h1 className="text-base font-semibold flex-1 text-center truncate px-2">{title}</h1>
      <div className="w-9 flex justify-end">{right}</div>
    </header>
  )
}
