import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Phone, Ambulance, Navigation2, MapPin as MapPinIcon, Users, Siren, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Dialog } from '@/components/ui/Dialog'
import { useAppState } from '@/context/AppStateContext'
import { HOSPITALS } from '@/lib/mockData'
import { formatCountdown } from '@/lib/utils'

export function EmergencyActive() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { emergency, endEmergency, guardians, startEmergency } = useAppState()
  const [elapsed, setElapsed] = useState(0)
  const [endOpen, setEndOpen] = useState(false)
  const [guardiansOpen, setGuardiansOpen] = useState(false)

  useEffect(() => {
    if (!emergency.active || !emergency.startedAt) return
    const timer = setInterval(() => setElapsed(Math.floor((Date.now() - emergency.startedAt!) / 1000)), 1000)
    return () => clearInterval(timer)
  }, [emergency.active, emergency.startedAt])

  const nearestHospital = HOSPITALS[0]

  if (!emergency.active) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center bg-background">
        <div className="h-20 w-20 rounded-3xl bg-emergency-50 dark:bg-emergency/15 flex items-center justify-center text-emergency mb-4">
          <Siren size={34} />
        </div>
        <h1 className="text-xl font-bold">{t('home.sosTitle')}</h1>
        <p className="text-sm text-muted-foreground mt-2 max-w-[280px]">{t('home.sosSubtitle')}</p>
        <Button variant="emergency" size="lg" className="w-full mt-8" onClick={startEmergency}>
          {t('home.sosButton')}
        </Button>
      </div>
    )
  }

  const actions = [
    { icon: Phone, label: t('emergency.call108'), onClick: () => window.open('tel:108') },
    { icon: Ambulance, label: t('emergency.trackAmbulance'), onClick: () => navigate('/home') },
    { icon: Navigation2, label: t('emergency.navigateHospital'), onClick: () => window.open(`https://www.openstreetmap.org/directions?to=${nearestHospital.lat},${nearestHospital.lng}`, '_blank') },
    { icon: MapPinIcon, label: t('emergency.shareLiveLocation'), onClick: () => {} },
    { icon: Users, label: t('emergency.contactGuardians'), onClick: () => setGuardiansOpen(true) }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-emergency-700 to-emergency-600 text-white pb-8">
      <div className="px-5 pt-8 pb-6 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <span className="h-2.5 w-2.5 rounded-full bg-white animate-pulse" />
          <p className="font-bold tracking-wide">{t('emergency.active')}</p>
        </div>
        <p className="text-4xl font-bold tabular-nums tracking-wider">{formatCountdown(elapsed)}</p>
      </div>

      <div className="bg-background text-foreground rounded-t-[2.5rem] px-4 pt-6 pb-4 min-h-[60vh]">
        <div className="space-y-2.5 mb-6">
          <StatusRow done={emergency.locationShared} label={t('emergency.locationShared')} />
          <StatusRow done={emergency.guardianNotified} label={guardians.length > 0 ? t('emergency.guardianNotified') : t('guardians.empty')} />
          <StatusRow done={emergency.ambulanceRequested} label={t('emergency.ambulanceRequested')} />
        </div>

        <div className="rounded-2xl border border-border bg-surface p-4 mb-6">
          <p className="text-xs text-muted-foreground mb-1">{t('emergency.nearestHospital')}</p>
          <p className="font-semibold text-sm">{nearestHospital.name}</p>
          <p className="text-xs text-muted-foreground mt-0.5">{nearestHospital.distanceKm} km · {nearestHospital.address}</p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {actions.map((a) => (
            <button
              key={a.label}
              onClick={a.onClick}
              className="flex flex-col items-center gap-2 rounded-2xl border border-border bg-surface p-4 shadow-soft active:scale-95 transition-transform"
            >
              <div className="h-11 w-11 rounded-xl bg-emergency-50 dark:bg-emergency/15 text-emergency flex items-center justify-center">
                <a.icon size={20} />
              </div>
              <span className="text-xs font-medium text-center leading-tight">{a.label}</span>
            </button>
          ))}
        </div>

        <Button variant="outline" size="lg" className="w-full mt-6" onClick={() => setEndOpen(true)}>
          {t('emergency.endEmergency')}
        </Button>
      </div>

      <Dialog open={guardiansOpen} onClose={() => setGuardiansOpen(false)} title={t('emergency.contactGuardians') ?? ''}>
        {guardians.length > 0 ? (
          <div className="space-y-3">
            {guardians.map((guardian) => (
              <div key={guardian.id} className="rounded-2xl border border-border bg-surface p-4">
                <p className="font-semibold text-sm">{guardian.name}</p>
                <p className="text-xs text-muted-foreground mt-1">{guardian.relationship}</p>
                <div className="flex items-center justify-between gap-3 mt-3">
                  <p className="text-sm font-medium">{guardian.phone}</p>
                  <Button
                    variant="emergency"
                    size="sm"
                    onClick={() => window.open(`tel:${guardian.phone}`)}
                  >
                    <Phone size={15} />
                    Call
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">{t('guardians.emptyBody')}</p>
        )}
      </Dialog>

      <Dialog open={endOpen} onClose={() => setEndOpen(false)} title={t('emergency.endEmergency') ?? ''}>
        <p className="text-sm text-muted-foreground mb-5">{t('emergency.endConfirm')}</p>
        <div className="flex gap-3">
          <Button variant="outline" className="flex-1" onClick={() => setEndOpen(false)}>
            {t('common.cancel')}
          </Button>
          <Button
            variant="emergency"
            className="flex-1"
            onClick={() => {
              endEmergency()
              setEndOpen(false)
              navigate('/home')
            }}
          >
            {t('common.confirm')}
          </Button>
        </div>
      </Dialog>
    </div>
  )
}

function StatusRow({ done, label }: { done: boolean; label: string }) {
  return (
    <div className="flex items-center gap-2.5 text-sm">
      <CheckCircle2 size={18} className={done ? 'text-success' : 'text-muted-foreground'} />
      <span className={done ? 'font-medium' : 'text-muted-foreground'}>{label}</span>
    </div>
  )
}
