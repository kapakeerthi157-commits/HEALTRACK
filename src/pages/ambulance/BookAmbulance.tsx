import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { MapPin, Navigation, Check } from 'lucide-react'
import { PageHeader } from '@/components/PageHeader'
import { Button } from '@/components/ui/Button'
import { useAppState } from '@/context/AppStateContext'
import { AMBULANCE_TYPES } from '@/lib/mockData'
import { cn } from '@/lib/utils'
import type { AmbulanceType } from '@/types'

export function BookAmbulance() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { location, requestAmbulance } = useAppState()
  const [type, setType] = useState<AmbulanceType>('basic')
  const [pickup, setPickup] = useState(location.label ?? '')
  const [destination, setDestination] = useState('')
  const [requesting, setRequesting] = useState(false)

  const selected = AMBULANCE_TYPES.find((a) => a.type === type)!

  const submit = () => {
    setRequesting(true)
    setTimeout(() => {
      const booking = requestAmbulance(type, pickup || 'Current location', destination || 'Nearest hospital')
      setRequesting(false)
      navigate(`/ambulance/track/${booking.id}`)
    }, 900)
  }

  return (
    <div className="min-h-screen bg-background">
      <PageHeader title={t('ambulance.title') ?? ''} />

      <div className="px-4 py-4 space-y-5 pb-28">
        <div>
          <h2 className="font-semibold mb-3">{t('ambulance.selectType')}</h2>
          <div className="space-y-3">
            {AMBULANCE_TYPES.map((a) => (
              <button
                key={a.type}
                onClick={() => setType(a.type)}
                className={cn(
                  'w-full text-left rounded-2xl border-2 p-4 transition-colors relative',
                  type === a.type ? 'border-emergency bg-emergency-50 dark:bg-emergency/10' : 'border-border bg-surface'
                )}
              >
                {type === a.type && (
                  <div className="absolute top-3 right-3 h-5 w-5 rounded-full bg-emergency flex items-center justify-center">
                    <Check size={12} className="text-white" />
                  </div>
                )}
                <p className="font-semibold text-sm flex items-center gap-1.5">🚑 {a.name}</p>
                <p className="text-xs text-muted-foreground mt-1">{a.description}</p>
                <div className="mt-2 text-xs font-medium text-muted-foreground">
                  {t('ambulance.eta')} {a.eta}
                </div>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {a.equipment.map((e) => (
                    <span key={e} className="text-[10px] bg-muted rounded-full px-2 py-0.5 text-muted-foreground">
                      {e}
                    </span>
                  ))}
                </div>
              </button>
            ))}
          </div>
        </div>

        <div>
          <h2 className="font-semibold mb-3">{t('ambulance.pickup')}</h2>
          <div className="flex items-center gap-2 rounded-2xl border border-border bg-surface px-4 h-12">
            <MapPin size={16} className="text-muted-foreground shrink-0" />
            <input
              value={pickup}
              onChange={(e) => setPickup(e.target.value)}
              placeholder={t('ambulance.useCurrentLocation') ?? ''}
              className="flex-1 bg-transparent outline-none text-sm"
            />
          </div>
        </div>

        <div>
          <h2 className="font-semibold mb-3">{t('ambulance.destination')}</h2>
          <div className="flex items-center gap-2 rounded-2xl border border-border bg-surface px-4 h-12">
            <Navigation size={16} className="text-muted-foreground shrink-0" />
            <input
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder={t('ambulance.chooseOnMap') ?? ''}
              className="flex-1 bg-transparent outline-none text-sm"
            />
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] bg-surface border-t border-border p-3 safe-bottom">
        <Button variant="emergency" size="lg" className="w-full" isLoading={requesting} onClick={submit}>
          {t('ambulance.requestNow')}
        </Button>
      </div>
    </div>
  )
}
