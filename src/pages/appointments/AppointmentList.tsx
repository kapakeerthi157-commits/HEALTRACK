import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { CalendarPlus, MapPin, Navigation2, XCircle } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { EmptyState } from '@/components/ui/EmptyState'
import { Dialog } from '@/components/ui/Dialog'
import { useAppState } from '@/context/AppStateContext'
import { DOCTORS, HOSPITALS } from '@/lib/mockData'
import { cn } from '@/lib/utils'
import type { Appointment } from '@/types'

const TABS: Array<Appointment['status']> = ['upcoming', 'completed', 'cancelled']

export function AppointmentList() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { appointments, cancelAppointment } = useAppState()
  const [tab, setTab] = useState<Appointment['status']>('upcoming')
  const [toCancel, setToCancel] = useState<string | null>(null)

  const filtered = useMemo(() => appointments.filter((a) => a.status === tab), [appointments, tab])

  const emptyText: Record<Appointment['status'], string> = {
    upcoming: 'appointments.emptyUpcoming',
    completed: 'appointments.emptyCompleted',
    cancelled: 'appointments.emptyCancelled'
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="px-4 pt-6 pb-3 flex items-center justify-between">
        <h1 className="text-xl font-bold">{t('appointments.title')}</h1>
        <button
          onClick={() => navigate('/appointments/book')}
          className="h-9 w-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center"
        >
          <CalendarPlus size={18} />
        </button>
      </header>

      <div className="px-4 flex gap-1 bg-muted mx-4 rounded-xl p-1 mb-4">
        {TABS.map((tb) => (
          <button
            key={tb}
            onClick={() => setTab(tb)}
            className={cn(
              'flex-1 py-2 rounded-lg text-sm font-medium transition-colors',
              tab === tb ? 'bg-surface shadow-soft text-foreground' : 'text-muted-foreground'
            )}
          >
            {t(`appointments.${tb}`)}
          </button>
        ))}
      </div>

      <div className="px-4 space-y-3 pb-6">
        {filtered.length === 0 ? (
          <EmptyState icon={CalendarPlus} title={t(emptyText[tab])} />
        ) : (
          filtered.map((a) => {
            const doctor = DOCTORS.find((d) => d.id === a.doctorId)
            const hospital = HOSPITALS.find((h) => h.id === a.hospitalId)
            return (
              <div key={a.id} className="rounded-2xl border border-border bg-surface p-4">
                <div className="flex items-start gap-3">
                  <div className="h-11 w-11 rounded-full bg-primary-50 dark:bg-primary/15 text-primary flex items-center justify-center font-semibold text-sm shrink-0">
                    {doctor?.initials ?? '—'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm">{doctor?.name ?? 'Doctor'}</p>
                    <p className="text-xs text-muted-foreground">{doctor?.specialty}</p>
                    <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                      <MapPin size={11} /> {hospital?.name}
                    </p>
                    <p className="text-xs font-medium mt-1">{a.date} · {a.time}</p>
                  </div>
                  <Badge tone={a.status === 'upcoming' ? 'info' : a.status === 'completed' ? 'success' : 'muted'}>
                    {t(`appointments.${a.status}`)}
                  </Badge>
                </div>
                {a.status === 'upcoming' && (
                  <div className="flex gap-2 mt-3">
                    <Button size="sm" variant="outline" className="flex-1" onClick={() => hospital && window.open(`https://www.openstreetmap.org/directions?to=${hospital.lat},${hospital.lng}`, '_blank')}>
                      <Navigation2 size={13} /> {t('appointments.reschedule')}
                    </Button>
                    <Button size="sm" variant="ghost" className="flex-1 text-emergency" onClick={() => setToCancel(a.id)}>
                      <XCircle size={13} /> {t('appointments.cancel')}
                    </Button>
                  </div>
                )}
              </div>
            )
          })
        )}
      </div>

      <Dialog open={!!toCancel} onClose={() => setToCancel(null)} title={t('appointments.cancel') ?? ''}>
        <p className="text-sm text-muted-foreground mb-5">{t('appointments.cancelConfirm')}</p>
        <div className="flex gap-3">
          <Button variant="outline" className="flex-1" onClick={() => setToCancel(null)}>
            {t('common.cancel')}
          </Button>
          <Button
            variant="emergency"
            className="flex-1"
            onClick={() => {
              if (toCancel) cancelAppointment(toCancel)
              setToCancel(null)
            }}
          >
            {t('common.confirm')}
          </Button>
        </div>
      </Dialog>
    </div>
  )
}
