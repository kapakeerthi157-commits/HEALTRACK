import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Star, MapPin, Phone, Clock, BedDouble, Heart, Building2, ChevronLeft } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { HOSPITALS, DOCTORS } from '@/lib/mockData'
import { cn } from '@/lib/utils'

const TABS = ['overview', 'doctors', 'facilities', 'availability'] as const

export function HospitalDetail() {
  const { id } = useParams()
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [tab, setTab] = useState<(typeof TABS)[number]>('overview')
  const [favorite, setFavorite] = useState(false)

  const hospital = HOSPITALS.find((h) => h.id === id)
  const doctors = DOCTORS.filter((d) => d.hospitalId === id)

  if (!hospital) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Hospital not found</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background pb-28">
      <div className="relative h-48 bg-gradient-to-br from-primary-700 to-primary-900 flex items-end p-4">
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 h-9 w-9 rounded-full bg-white/20 backdrop-blur flex items-center justify-center text-white"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          onClick={() => setFavorite((f) => !f)}
          className="absolute top-4 right-4 h-9 w-9 rounded-full bg-white/20 backdrop-blur flex items-center justify-center text-white"
        >
          <Heart size={18} className={favorite ? 'fill-white' : ''} />
        </button>
        <Building2 size={64} className="text-white/30 absolute right-6 top-6" />
        <div className="relative text-white">
          <h1 className="text-xl font-bold leading-tight">{hospital.name}</h1>
          <div className="flex items-center gap-3 mt-1.5 text-sm text-white/80">
            <span className="flex items-center gap-1"><Star size={13} className="fill-warning text-warning" /> {hospital.rating}</span>
            <span className="flex items-center gap-1"><MapPin size={13} /> {hospital.distanceKm} km</span>
            <Badge tone={hospital.isOpen ? 'success' : 'muted'}>{hospital.isOpen ? t('hospitals.open') : t('hospitals.closed')}</Badge>
          </div>
        </div>
      </div>

      <div className="flex border-b border-border sticky top-0 bg-surface z-20">
        {TABS.map((tb) => (
          <button
            key={tb}
            onClick={() => setTab(tb)}
            className={cn(
              'flex-1 py-3 text-sm font-medium border-b-2 transition-colors',
              tab === tb ? 'border-primary text-primary' : 'border-transparent text-muted-foreground'
            )}
          >
            {t(`hospitals.${tb}`)}
          </button>
        ))}
      </div>

      <div className="p-4">
        {tab === 'overview' && (
          <div className="space-y-4">
            <div className="rounded-2xl border border-border bg-surface p-4 space-y-3">
              <InfoRow icon={MapPin} label={t('hospitals.address')} value={hospital.address} />
              <InfoRow icon={Phone} label={t('common.call')} value={hospital.phone} />
              <InfoRow icon={Clock} label={t('hospitals.workingHours')} value={hospital.hours} />
              <InfoRow icon={BedDouble} label={t('hospitals.bedsAvailable', { count: hospital.bedsAvailable ?? 0 })} value="" hideValue />
            </div>
            {hospital.emergencyAvailable && (
              <div className="rounded-2xl bg-emergency-50 dark:bg-emergency/10 text-emergency-600 dark:text-emergency px-4 py-3 text-sm font-medium">
                🚨 {t('hospitals.emergencyAvailable')}
              </div>
            )}
            <div className="flex flex-wrap gap-2">
              {hospital.specializations.map((s) => (
                <Badge key={s} tone="primary">{s}</Badge>
              ))}
            </div>
          </div>
        )}

        {tab === 'doctors' && (
          <div className="space-y-3">
            {doctors.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">{t('common.notAvailable')}</p>
            ) : (
              doctors.map((d) => (
                <div key={d.id} className="flex items-center gap-3 rounded-2xl border border-border bg-surface p-3">
                  <div className="h-11 w-11 rounded-full bg-primary-50 dark:bg-primary/15 text-primary flex items-center justify-center font-semibold text-sm">
                    {d.initials}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{d.name}</p>
                    <p className="text-xs text-muted-foreground">{d.specialty} · {d.experienceYears} yrs exp</p>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {tab === 'facilities' && (
          <div className="grid grid-cols-2 gap-3">
            {['24/7 Pharmacy', 'ICU', 'Ambulance Bay', 'Diagnostic Lab', 'Blood Bank', 'Cafeteria'].map((f) => (
              <div key={f} className="rounded-xl border border-border bg-surface px-3 py-3 text-sm font-medium">{f}</div>
            ))}
          </div>
        )}

        {tab === 'availability' && (
          <div className="rounded-2xl border border-border bg-surface p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">{t('hospitals.bedsAvailable', { count: hospital.bedsAvailable ?? 0 })}</span>
              <Badge tone={hospital.bedsAvailable ? 'success' : 'muted'}>
                {hospital.bedsAvailable ? t('hospitals.open') : t('hospitals.noBeds')}
              </Badge>
            </div>
          </div>
        )}
      </div>

      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] bg-surface border-t border-border p-3 flex gap-2 safe-bottom">
        <Button variant="outline" className="flex-1" onClick={() => window.open(`tel:${hospital.phone}`)}>
          {t('hospitals.callHospital')}
        </Button>
        <Button
          variant="secondary"
          className="flex-1"
          onClick={() => window.open(`https://www.openstreetmap.org/directions?to=${hospital.lat},${hospital.lng}`, '_blank')}
        >
          {t('hospitals.getDirections')}
        </Button>
        <Button className="flex-1" onClick={() => navigate('/appointments/book', { state: { hospitalId: hospital.id } })}>
          {t('hospitals.bookAppointment')}
        </Button>
      </div>
    </div>
  )
}

function InfoRow({ icon: Icon, label, value, hideValue }: { icon: typeof MapPin; label: string; value: string; hideValue?: boolean }) {
  return (
    <div className="flex items-start gap-3">
      <Icon size={16} className="text-muted-foreground mt-0.5 shrink-0" />
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        {!hideValue && <p className="text-sm font-medium">{value}</p>}
      </div>
    </div>
  )
}
