import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Ambulance, ArrowLeft, MapPin, ShieldAlert } from 'lucide-react'
import { useAppState } from '@/context/AppStateContext'

export function GuardianEmergency() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { emergency, location, ambulanceBookings } = useAppState()
  const ambulance = ambulanceBookings[0]

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 bg-surface/90 backdrop-blur border-b border-border px-4 py-3 flex items-center gap-3">
        <button type="button" onClick={() => navigate('/guardian')} className="h-9 w-9 rounded-full flex items-center justify-center hover:bg-muted" aria-label={t('common.back')}>
          <ArrowLeft size={20} />
        </button>
        <h1 className="font-semibold">{t('guardian.emergencyInformation')}</h1>
      </header>
      <main className="px-4 py-5 space-y-4">
        <div className={`rounded-2xl p-5 ${emergency.active ? 'bg-emergency text-white' : 'bg-success text-white'}`}>
          <ShieldAlert size={24} />
          <h2 className="font-bold text-lg mt-3">{emergency.active ? t('guardian.emergencyActive') : t('guardian.noActiveEmergency')}</h2>
          <p className="text-sm opacity-85 mt-1">{emergency.active ? t('guardian.emergencyDetails') : t('guardian.monitoringMessage')}</p>
        </div>
        <section className="rounded-2xl border border-border bg-surface p-4">
          <div className="flex items-center gap-3">
            <MapPin size={20} className="text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">{t('guardian.location')}</p>
              <p className="font-medium text-sm mt-0.5">{location.label || t('guardian.locationUnavailable')}</p>
            </div>
          </div>
          {location.lat != null && location.lng != null && <p className="text-xs text-muted-foreground mt-3">{location.lat.toFixed(5)}, {location.lng.toFixed(5)}</p>}
        </section>
        <section className="rounded-2xl border border-border bg-surface p-4">
          <div className="flex items-center gap-3">
            <Ambulance size={20} className="text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">{t('guardian.ambulance')}</p>
              <p className="font-medium text-sm mt-0.5">{ambulance ? t(`ambulance.status.${ambulance.status}`) : t('guardian.none')}</p>
            </div>
          </div>
          {ambulance && <p className="text-xs text-muted-foreground mt-3">{ambulance.driverName} · {ambulance.vehicleNumber}</p>}
        </section>
        <p className="text-center text-[11px] text-muted-foreground px-5">{t('guardian.privacyNote')}</p>
      </main>
    </div>
  )
}
