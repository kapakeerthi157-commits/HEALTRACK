import { cn } from '@/lib/utils'

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn('skeleton rounded-lg', className)} />
}

export function HospitalCardSkeleton() {
  return (
    <div className="rounded-2xl border border-border bg-surface p-3 shadow-soft flex gap-3">
      <Skeleton className="h-20 w-20 rounded-xl shrink-0" />
      <div className="flex-1 space-y-2 py-1">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
        <Skeleton className="h-3 w-2/3" />
      </div>
    </div>
  )
}

export function ProfileCardSkeleton() {
  return (
    <div className="rounded-2xl border border-border bg-surface p-4 shadow-soft flex items-center gap-4">
      <Skeleton className="h-16 w-16 rounded-full shrink-0" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-3 w-1/3" />
      </div>
    </div>
  )
}

export function ListRowSkeleton() {
  return (
    <div className="flex items-center gap-3 p-3">
      <Skeleton className="h-10 w-10 rounded-full shrink-0" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-3.5 w-2/3" />
        <Skeleton className="h-3 w-1/3" />
      </div>
    </div>
  )
}
