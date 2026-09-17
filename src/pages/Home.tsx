import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Bell, Search as SearchIcon, CalendarPlus, Building2, Ambulance, IdCard, Users, Share2 } from 'lucide-react'
import { SOSCard } from '@/components/SOSCard'
import { LocationCard } from '@/components/LocationCard'
import { HospitalCard } from '@/components/HospitalCard'
import { Button } from '@/components/ui/Button'
import { useAppState } from '@/context/AppStateContext'
import { greetingKey } from '@/lib/utils'
import { HEALTH_CATEGORIES, HOSPITALS } from '@/lib/mockData'

export function Home() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { profile, notifications } = useAppState()
  const unread = notifications.filter((n) => !n.read).length

  const quickActions = [
    { icon: CalendarPlus, label: t('home.bookAppointment'), to: '/appointments/book', tone: 'primary' },
    { icon: Building2, label: t('home.findHospital'), to: '/hospitals', tone: 'info' },
    { icon: Ambulance, label: t('home.callAmbulance'), to: '/ambulance/book', tone: 'emergency' },
    { icon: IdCard, label: t('home.myMedicalId'), to: '/profile/medical-id', tone: 'success' },
    { icon: Users, label: t('home.emergencyContacts'), to: '/profile/emergency-contacts', tone: 'warning' },
    { icon: Share2, label: t('home.shareLocation'), to: '/profile/emergency-contacts', tone: 'primary' }
  ] as const

  const toneClasses: Record<string, string> = {
    primary: 'bg-primary-50 text-primary dark:bg-primary/15',
    info: 'bg-info-50 text-info-600 dark:bg-info/15',
    emergency: 'bg-emergency-50 text-emergency dark:bg-emergency/15',
    success: 'bg-success-50 text-success-600 dark:bg-success/15',
    warning: 'bg-warning-50 text-warning-600 dark:bg-warning/15'
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="px-4 pt-6 pb-4 flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{t(`greeting.${greetingKey()}`)} 👋</p>
          <p className="text-xl font-bold mt-0.5">{profile.name.split(' ')[0]}</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/notifications')}
            className="relative h-10 w-10 rounded-full bg-surface border border-border flex items-center justify-center"
            aria-label={t('home.notifications') ?? 'Notifications'}
          >
            <Bell size={18} />
            {unread > 0 && (
              <span className="absolute -top-1 -right-1 h-4 min-w-4 px-1 rounded-full bg-emergency text-white text-[10px] font-bold flex items-center justify-center">
                {unread}
              </span>
            )}
          </button>
          <button
            onClick={() => navigate('/profile')}
            className="h-10 w-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold text-sm"
          >
            {profile.avatarInitials}
          </button>
        </div>
      </header>

      <div className="px-4">
        <button
          onClick={() => navigate('/search')}
          className="w-full flex items-center gap-2 rounded-2xl border border-border bg-surface px-4 h-12 text-sm text-muted-foreground shadow-soft mb-4"
        >
          <SearchIcon size={16} />
          {t('search.placeholder')}
        </button>
      </div>

      <div className="px-4 space-y-4">
        <SOSCard />
        <LocationCard />

        <section>
          <h2 className="font-semibold text-sm mb-3 px-0.5">{t('home.healthServices')}</h2>
          <div className="grid grid-cols-4 gap-3">
            {HEALTH_CATEGORIES.map((c) => (
              <button
                key={c.key}
                className="flex flex-col items-center gap-1.5 active:scale-95 transition-transform"
                onClick={() => navigate('/hospitals')}
              >
                <div className="h-14 w-14 rounded-2xl bg-surface border border-border shadow-soft flex items-center justify-center text-2xl">
                  {c.emoji}
                </div>
                <span className="text-[11px] text-center leading-tight text-muted-foreground">{c.label}</span>
              </button>
            ))}
          </div>
        </section>

        <section>
          <h2 className="font-semibold text-sm mb-3 px-0.5">{t('home.quickActions')}</h2>
          <div className="grid grid-cols-3 gap-3">
            {quickActions.map((a) => (
              <button
                key={a.label}
                onClick={() => navigate(a.to)}
                className="flex flex-col items-center gap-2 rounded-2xl border border-border bg-surface p-3 shadow-soft active:scale-95 transition-transform"
              >
                <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${toneClasses[a.tone]}`}>
                  <a.icon size={19} />
                </div>
                <span className="text-[11px] font-medium text-center leading-tight">{a.label}</span>
              </button>
            ))}
          </div>
        </section>

        <section className="pb-4">
          <div className="flex items-center justify-between mb-3 px-0.5">
            <h2 className="font-semibold text-sm">{t('home.nearbyHospitals')}</h2>
            <button onClick={() => navigate('/hospitals')} className="text-xs font-semibold text-primary">
              {t('common.viewAll')}
            </button>
          </div>
          <div className="space-y-3">
            {HOSPITALS.slice(0, 3).map((h) => (
              <HospitalCard key={h.id} hospital={h} />
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
