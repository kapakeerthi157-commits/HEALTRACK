import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { MapPin, RotateCw, AlertTriangle } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/Card'
import { Skeleton } from '@/components/ui/Skeleton'
import { useAppState } from '@/context/AppStateContext'
import { timeAgo } from '@/lib/utils'

export function LocationCard() {
  const { t } = useTranslation()
  const { location, detectLocation } = useAppState()

  useEffect(() => {
    if (location.status === 'idle') detectLocation()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Card>
      <CardContent className="flex items-center gap-3 py-3.5">
        <div className="h-11 w-11 rounded-xl bg-info-50 dark:bg-info/15 text-info-600 dark:text-info flex items-center justify-center shrink-0">
          <MapPin size={20} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-muted-foreground">{t('home.currentLocation')}</p>
          {location.status === 'loading' && <Skeleton className="h-4 w-32 mt-1" />}
          {location.status === 'ready' && (
            <>
              <p className="font-semibold text-sm truncate">{location.label}</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                {location.accuracy != null ? t('home.accuracy', { meters: location.accuracy }) : ''}
                {location.updatedAt ? ` · ${t('home.lastUpdated', { time: timeAgo(location.updatedAt, t) })}` : ''}
              </p>
            </>
          )}
          {location.status === 'error' && (
            <p className="text-xs text-warning-600 flex items-center gap-1 mt-0.5">
              <AlertTriangle size={12} /> {t('home.locationError')}
            </p>
          )}
        </div>
        <button
          onClick={detectLocation}
          className="h-9 w-9 rounded-full flex items-center justify-center hover:bg-muted shrink-0"
          aria-label={t('home.refreshLocation') ?? 'Refresh'}
        >
          <RotateCw size={16} className={location.status === 'loading' ? 'animate-spin' : ''} />
        </button>
      </CardContent>
    </Card>
  )
}
