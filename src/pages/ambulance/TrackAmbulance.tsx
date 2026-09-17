import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Phone, XCircle, Ambulance as AmbulanceIcon, Check } from 'lucide-react'
import { PageHeader } from '@/components/PageHeader'
import { Button } from '@/components/ui/Button'
import { Dialog } from '@/components/ui/Dialog'
import { LeafletMap } from '@/components/LeafletMap'
import { useAppState } from '@/context/AppStateContext'
import { HOSPITALS } from '@/lib/mockData'
import { cn } from '@/lib/utils'
import type { AmbulanceBooking } from '@/types'

const STAGES: AmbulanceBooking['status'][] = ['requested', 'assigned', 'on_the_way', 'arrived', 'completed']

export function TrackAmbulance() {
  const { id } = useParams()
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { ambulanceBookings, advanceAmbulance, cancelAmbulance, location } = useAppState()
  const [cancelOpen, setCancelOpen] = useState(false)

  const booking = ambulanceBookings.find((b) => b.id === id)

  useEffect(() => {
    if (!booking || booking.status === 'completed' || booking.status === 'cancelled') return
    const timer = setTimeout(() => advanceAmbulance(booking.id), 4000)
    return () => clearTimeout(timer)
  }, [booking, advanceAmbulance])

  if (!booking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Booking not found</p>
      </div>
    )
  }

  const stageIndex = STAGES.indexOf(booking.status)
  const nearestHospital = HOSPITALS[0]

  return (
    <div className="min-h-screen bg-background pb-6">
      <PageHeader title={t('ambulance.title') ?? ''} />

      <div className="h-56">
        <LeafletMap
          center={location.lat && location.lng ? [location.lat, location.lng] : undefined}
          hospitals={[nearestHospital]}
          routeTo={[nearestHospital.lat, nearestHospital.lng]}
        />
      </div>

      <div className="px-4 pt-5">
        {booking.status !== 'cancelled' && (
          <div className="flex items-center justify-between mb-6">
            {STAGES.map((s, i) => (
              <div key={s} className="flex-1 flex flex-col items-center relative">
                {i > 0 && (
                  <div
                    className={cn(
                      'absolute top-3 right-1/2 h-0.5 w-full -z-0',
                      i <= stageIndex ? 'bg-success' : 'bg-border'
                    )}
                  />
                )}
                <div
                  className={cn(
                    'h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-bold z-10',
                    i < stageIndex ? 'bg-success text-white' : i === stageIndex ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'
                  )}
                >
                  {i < stageIndex ? <Check size={12} /> : i + 1}
                </div>
                <span className="text-[9px] text-muted-foreground mt-1 text-center leading-tight">
                  {t(`ambulance.status.${s}`)}
                </span>
              </div>
            ))}
          </div>
        )}

        <div className="rounded-2xl border border-border bg-surface p-4 space-y-3">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-xl bg-emergency-50 dark:bg-emergency/15 text-emergency flex items-center justify-center">
              <AmbulanceIcon size={22} />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-sm">{booking.driverName}</p>
              <p className="text-xs text-muted-foreground">{booking.vehicleNumber}</p>
            </div>
            {booking.status !== 'cancelled' && booking.status !== 'completed' && (
              <div className="text-right">
                <p className="text-xs text-muted-foreground">{t('ambulance.eta')}</p>
                <p className="font-bold text-primary">{booking.etaMinutes} min</p>
              </div>
            )}
          </div>
          <div className="flex justify-between text-sm pt-2 border-t border-border">
            <span className="text-muted-foreground">{t('ambulance.pickup')}</span>
            <span className="font-medium">{booking.pickup}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">{t('ambulance.destination')}</span>
            <span className="font-medium">{booking.destination}</span>
          </div>
        </div>

        {booking.status !== 'cancelled' && booking.status !== 'completed' && (
          <div className="flex gap-2 mt-4">
            <Button variant="outline" className="flex-1" onClick={() => window.open('tel:+911234567890')}>
              <Phone size={15} /> {t('ambulance.callDriver')}
            </Button>
            <Button variant="ghost" className="flex-1 text-emergency" onClick={() => setCancelOpen(true)}>
              <XCircle size={15} /> {t('ambulance.cancelBooking')}
            </Button>
          </div>
        )}

        {booking.status === 'completed' && (
          <Button className="w-full mt-4" onClick={() => navigate('/home')}>
            {t('appointments.backToHome')}
          </Button>
        )}
      </div>

      <Dialog open={cancelOpen} onClose={() => setCancelOpen(false)} title={t('ambulance.cancelBooking') ?? ''}>
        <p className="text-sm text-muted-foreground mb-5">{t('appointments.cancelConfirm')}</p>
        <div className="flex gap-3">
          <Button variant="outline" className="flex-1" onClick={() => setCancelOpen(false)}>
            {t('common.cancel')}
          </Button>
          <Button
            variant="emergency"
            className="flex-1"
            onClick={() => {
              cancelAmbulance(booking.id)
              setCancelOpen(false)
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
