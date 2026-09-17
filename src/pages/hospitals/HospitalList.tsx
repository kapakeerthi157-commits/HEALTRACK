import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { SlidersHorizontal, MapPin, List, ArrowUpDown } from 'lucide-react'
import { HospitalCard } from '@/components/HospitalCard'
import { EmptyState } from '@/components/ui/EmptyState'
import { HospitalCardSkeleton } from '@/components/ui/Skeleton'
import { HOSPITALS, HEALTH_CATEGORIES } from '@/lib/mockData'
import { cn } from '@/lib/utils'
import { LeafletMap } from '@/components/LeafletMap'

type SortKey = 'distance' | 'rating'

export function HospitalList() {
  const { t } = useTranslation()
  const [loading] = useState(false)
  const [view, setView] = useState<'list' | 'map'>('list')
  const [sort, setSort] = useState<SortKey>('distance')
  const [openOnly, setOpenOnly] = useState(false)
  const [specFilter, setSpecFilter] = useState<string | null>(null)

  const hospitals = useMemo(() => {
    let list = [...HOSPITALS]
    if (openOnly) list = list.filter((h) => h.isOpen)
    if (specFilter) list = list.filter((h) => h.specializations.includes(specFilter))
    list.sort((a, b) => (sort === 'distance' ? a.distanceKm - b.distanceKm : b.rating - a.rating))
    return list
  }, [sort, openOnly, specFilter])

  return (
    <div className="min-h-screen bg-background">
      <header className="px-4 pt-6 pb-3">
        <h1 className="text-xl font-bold">{t('hospitals.title')}</h1>
      </header>

      <div className="px-4 flex gap-2 overflow-x-auto pb-3 no-scrollbar">
        <FilterChip
          active={openOnly}
          label={t('hospitals.open')}
          onClick={() => setOpenOnly((v) => !v)}
        />
        {HEALTH_CATEGORIES.slice(0, 6).map((c) => (
          <FilterChip
            key={c.key}
            active={specFilter === c.label}
            label={c.label}
            onClick={() => setSpecFilter((v) => (v === c.label ? null : c.label))}
          />
        ))}
      </div>

      <div className="px-4 flex items-center justify-between mb-3">
        <button
          onClick={() => setSort((s) => (s === 'distance' ? 'rating' : 'distance'))}
          className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground"
        >
          <ArrowUpDown size={13} />
          {t('hospitals.sort')}: {sort === 'distance' ? 'Distance' : 'Rating'}
        </button>
        <div className="flex items-center gap-1 bg-muted rounded-full p-1">
          <button
            onClick={() => setView('list')}
            className={cn('h-7 w-7 rounded-full flex items-center justify-center', view === 'list' && 'bg-surface shadow-soft')}
            aria-label={t('hospitals.list') ?? 'List'}
          >
            <List size={14} />
          </button>
          <button
            onClick={() => setView('map')}
            className={cn('h-7 w-7 rounded-full flex items-center justify-center', view === 'map' && 'bg-surface shadow-soft')}
            aria-label={t('hospitals.map') ?? 'Map'}
          >
            <MapPin size={14} />
          </button>
        </div>
      </div>

      <div className="px-4 pb-6">
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <HospitalCardSkeleton key={i} />
            ))}
          </div>
        ) : view === 'map' ? (
          <MiniMap hospitals={hospitals} />
        ) : hospitals.length === 0 ? (
          <EmptyState icon={SlidersHorizontal} title={t('hospitals.empty')} body={t('hospitals.emptyBody') ?? undefined} />
        ) : (
          <div className="space-y-3">
            {hospitals.map((h) => (
              <HospitalCard key={h.id} hospital={h} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function FilterChip({ active, label, onClick }: { active: boolean; label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'shrink-0 px-3.5 h-8 rounded-full text-xs font-medium border transition-colors',
        active ? 'bg-primary text-primary-foreground border-primary' : 'bg-surface border-border text-muted-foreground'
      )}
    >
      {label}
    </button>
  )
}

function MiniMap({ hospitals }: { hospitals: typeof HOSPITALS }) {
  return (
    <div className="h-[420px] rounded-2xl overflow-hidden border border-border bg-muted flex items-center justify-center relative">
      <LeafletMap hospitals={hospitals} />
    </div>
  )
}
