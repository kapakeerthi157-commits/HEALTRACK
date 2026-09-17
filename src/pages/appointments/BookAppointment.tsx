import { useMemo, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { CheckCircle2 } from 'lucide-react'
import { PageHeader } from '@/components/PageHeader'
import { Button } from '@/components/ui/Button'
import { OnboardingProgress } from '@/components/OnboardingProgress'
import { useAppState } from '@/context/AppStateContext'
import { useToast } from '@/components/ui/Toast'
import { DOCTORS, HOSPITALS } from '@/lib/mockData'
import { cn } from '@/lib/utils'

function nextDays(n: number) {
  return Array.from({ length: n }).map((_, i) => {
    const d = new Date()
    d.setDate(d.getDate() + i)
    return d
  })
}

const TIME_SLOTS = ['09:00 AM', '10:30 AM', '12:00 PM', '02:00 PM', '04:00 PM', '06:30 PM']

export function BookAppointment() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()
  const { addAppointment } = useAppState()
  const { show } = useToast()

  const preselectedHospitalId = (location.state as { hospitalId?: string } | null)?.hospitalId
  const [step, setStep] = useState(1)
  const [doctorId, setDoctorId] = useState<string | null>(null)
  const [date, setDate] = useState<Date | null>(null)
  const [time, setTime] = useState<string | null>(null)
  const [reason, setReason] = useState('')
  const [booked, setBooked] = useState(false)

  const days = useMemo(() => nextDays(10), [])
  const availableDoctors = preselectedHospitalId
    ? DOCTORS.filter((d) => d.hospitalId === preselectedHospitalId)
    : DOCTORS

  const doctor = DOCTORS.find((d) => d.id === doctorId)
  const hospital = HOSPITALS.find((h) => h.id === doctor?.hospitalId)

  const canProceed = [!!doctorId, !!date && !!time, true][step - 1]

  const confirm = () => {
    if (!doctor || !hospital || !date || !time) return
    addAppointment({
      doctorId: doctor.id,
      hospitalId: hospital.id,
      date: date.toDateString(),
      time,
      reason: reason || 'General consultation'
    })
    setBooked(true)
  }

  if (booked) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center bg-background">
        <div className="h-20 w-20 rounded-full bg-success-50 dark:bg-success/15 flex items-center justify-center animate-scale-in mb-4">
          <CheckCircle2 className="text-success" size={40} />
        </div>
        <h1 className="text-xl font-bold">{t('appointments.bookingSuccess')}</h1>
        <p className="text-sm text-muted-foreground mt-2">{t('appointments.bookingSuccessBody')}</p>
        <div className="flex gap-3 mt-8 w-full">
          <Button variant="outline" className="flex-1" onClick={() => navigate('/home')}>
            {t('appointments.backToHome')}
          </Button>
          <Button className="flex-1" onClick={() => navigate('/appointments')}>
            {t('appointments.viewAppointments')}
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <PageHeader title={t('appointments.title') ?? ''} />
      <div className="px-4 pt-2 pb-28">
        <OnboardingProgress step={step} total={4} />

        {step === 1 && (
          <div>
            <h2 className="font-semibold mb-3">{t('appointments.selectDoctor')}</h2>
            <div className="space-y-2">
              {availableDoctors.map((d) => (
                <button
                  key={d.id}
                  onClick={() => setDoctorId(d.id)}
                  className={cn(
                    'w-full flex items-center gap-3 rounded-2xl border-2 p-3 text-left transition-colors',
                    doctorId === d.id ? 'border-primary bg-primary-50 dark:bg-primary/10' : 'border-border bg-surface'
                  )}
                >
                  <div className="h-11 w-11 rounded-full bg-primary-50 dark:bg-primary/15 text-primary flex items-center justify-center font-semibold text-sm shrink-0">
                    {d.initials}
                  </div>
                  <div>
                    <p className="font-medium text-sm">{d.name}</p>
                    <p className="text-xs text-muted-foreground">{d.specialty} · {d.experienceYears} yrs</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 className="font-semibold mb-3">{t('appointments.selectDate')}</h2>
            <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
              {days.map((d) => {
                const active = date?.toDateString() === d.toDateString()
                return (
                  <button
                    key={d.toISOString()}
                    onClick={() => setDate(d)}
                    className={cn(
                      'flex flex-col items-center justify-center shrink-0 w-14 h-16 rounded-2xl border-2',
                      active ? 'border-primary bg-primary-50 dark:bg-primary/10' : 'border-border bg-surface'
                    )}
                  >
                    <span className="text-[11px] text-muted-foreground">{d.toLocaleDateString(undefined, { weekday: 'short' })}</span>
                    <span className="font-bold">{d.getDate()}</span>
                  </button>
                )
              })}
            </div>

            <h2 className="font-semibold mb-3 mt-6">{t('appointments.selectTime')}</h2>
            <div className="grid grid-cols-3 gap-2">
              {TIME_SLOTS.map((slot) => (
                <button
                  key={slot}
                  onClick={() => setTime(slot)}
                  className={cn(
                    'py-2.5 rounded-xl border-2 text-sm font-medium',
                    time === slot ? 'border-primary bg-primary-50 dark:bg-primary/10 text-primary' : 'border-border bg-surface'
                  )}
                >
                  {slot}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <h2 className="font-semibold mb-3">{t('appointments.reason')}</h2>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder={t('appointments.reasonPlaceholder') ?? ''}
              rows={5}
              className="w-full rounded-2xl border border-border bg-surface p-4 text-sm outline-none focus:ring-2 focus:ring-primary/40"
            />
          </div>
        )}

        {step === 4 && doctor && hospital && (
          <div>
            <h2 className="font-semibold mb-3">{t('appointments.summary')}</h2>
            <div className="rounded-2xl border border-border bg-surface p-4 space-y-3">
              <SummaryRow label={t('hospitals.title')} value={hospital.name} />
              <SummaryRow label={t('appointments.selectDoctor')} value={doctor.name} />
              <SummaryRow label={t('appointments.selectDate')} value={date?.toDateString() ?? ''} />
              <SummaryRow label={t('appointments.selectTime')} value={time ?? ''} />
              <SummaryRow label={t('appointments.reason')} value={reason || 'General consultation'} />
            </div>
          </div>
        )}
      </div>

      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] bg-surface border-t border-border p-3 flex gap-2 safe-bottom">
        {step > 1 && (
          <Button variant="outline" className="flex-1" onClick={() => setStep((s) => s - 1)}>
            {t('common.back')}
          </Button>
        )}
        {step < 4 ? (
          <Button className="flex-1" disabled={!canProceed} onClick={() => setStep((s) => s + 1)}>
            {t('common.next')}
          </Button>
        ) : (
          <Button className="flex-1" onClick={() => { confirm(); show(t('appointments.bookingSuccess')) }}>
            {t('appointments.confirmAppointment')}
          </Button>
        )}
      </div>
    </div>
  )
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium text-right max-w-[60%]">{value}</span>
    </div>
  )
}
