import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Activity, Ambulance, Building2, CalendarDays, LogOut, ShieldAlert, Users, UserRound } from 'lucide-react'
import { PageHeader } from '@/components/PageHeader'
import { useAuth } from '@/context/AuthContext'
import { useAppState } from '@/context/AppStateContext'
import { HOSPITALS, DOCTORS } from '@/lib/mockData'

export function AdminDashboard() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { logout } = useAuth()
  const { guardians, appointments, ambulanceBookings, sosEvents, emergency } = useAppState()

  const cards = [
    { label: t('admin.users'), value: 1, icon: Users },
    { label: t('admin.guardians'), value: guardians.length, icon: UserRound },
    { label: t('admin.hospitals'), value: HOSPITALS.length, icon: Building2 },
    { label: t('admin.doctors'), value: DOCTORS.length, icon: Activity },
    { label: t('admin.appointments'), value: appointments.length, icon: CalendarDays },
    { label: t('admin.ambulances'), value: ambulanceBookings.length, icon: Ambulance },
    { label: t('admin.sosEvents'), value: sosEvents.length, icon: ShieldAlert }
  ]

  return (
    <div className="min-h-screen bg-background">
      <PageHeader
        title={t('admin.dashboard') ?? ''}
        right={
          <button
            type="button"
            onClick={logout}
            className="h-9 w-9 rounded-full flex items-center justify-center hover:bg-muted text-emergency"
            aria-label={t('profile.logout')}
          >
            <LogOut size={17} />
          </button>
        }
      />
      <main className="px-4 py-5 space-y-5">
        <div className="rounded-2xl bg-primary text-primary-foreground p-5">
          <p className="text-xs uppercase tracking-wide opacity-75">HealTrack</p>
          <h2 className="text-xl font-bold mt-1">{t('admin.overview')}</h2>
          <p className="text-sm opacity-80 mt-1">{t('admin.demoNotice')}</p>
        </div>

        <section className="grid grid-cols-2 gap-3">
          {cards.map(({ label, value, icon: Icon }) => (
            <div key={label} className="rounded-2xl border border-border bg-surface p-4 shadow-soft">
              <div className="h-9 w-9 rounded-xl bg-primary-50 dark:bg-primary/15 text-primary flex items-center justify-center mb-3">
                <Icon size={18} />
              </div>
              <p className="text-xs text-muted-foreground">{label}</p>
              <p className="text-xl font-bold mt-0.5">{value}</p>
            </div>
          ))}
        </section>

        <section className="rounded-2xl border border-border bg-surface p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold">{t('admin.emergencyMonitor')}</h3>
              <p className="text-xs text-muted-foreground mt-1">{t('admin.emergencyMonitorBody')}</p>
            </div>
            <span className={`h-3 w-3 rounded-full ${emergency.active ? 'bg-emergency animate-pulse' : 'bg-success'}`} />
          </div>
          <div className="mt-4 flex items-center justify-between rounded-xl bg-muted px-3 py-3 text-sm">
            <span>{t('admin.activeEmergency')}</span>
            <span className="font-semibold">{emergency.active ? t('admin.active') : t('admin.none')}</span>
          </div>
        </section>

        <button
          type="button"
          onClick={() => navigate('/login')}
          className="w-full rounded-2xl border border-border bg-surface py-3.5 text-sm font-semibold"
        >
          {t('auth.backToLogin')}
        </button>
      </main>
    </div>
  )
}
