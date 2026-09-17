import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Ambulance, Bell, ChevronRight, LogOut, MapPin, ShieldAlert, UserRound } from 'lucide-react'
import { PageHeader } from '@/components/PageHeader'
import { useAuth } from '@/context/AuthContext'
import { useAppState } from '@/context/AppStateContext'
import { HOSPITALS } from '@/lib/mockData'

export function GuardianDashboard() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { logout } = useAuth()
  const { profile, emergency, location, sosEvents, ambulanceBookings, notifications } = useAppState()
  const latestAmbulance = ambulanceBookings[0]
  const latestSOS = sosEvents[0]
  const unread = notifications.filter((n) => !n.read).length

  return (
    <div className="min-h-screen bg-background">
      <PageHeader
        title={t('guardian.dashboard') ?? ''}
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

      <main className="px-4 py-5 space-y-4">
        <section className="rounded-2xl border border-border bg-surface p-4 shadow-soft">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-primary-50 dark:bg-primary/15 text-primary flex items-center justify-center">
              <UserRound size={22} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-muted-foreground">{t('guardian.connectedPerson')}</p>
              <p className="font-bold truncate">{profile.name}</p>
              <p className="text-xs text-muted-foreground mt-0.5">+91 {profile.phone}</p>
            </div>
            <span className="text-xs font-semibold rounded-full bg-success-50 dark:bg-success/15 text-success px-2.5 py-1">
              {t('guardian.connected')}
            </span>
          </div>
        </section>

        <section className={`rounded-2xl p-4 border ${emergency.active ? 'border-emergency/40 bg-emergency-50 dark:bg-emergency/10' : 'border-border bg-surface'}`}>
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 rounded-xl bg-emergency/10 text-emergency flex items-center justify-center shrink-0">
              <ShieldAlert size={20} />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-sm">{emergency.active ? t('guardian.emergencyActive') : t('guardian.noActiveEmergency')}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {emergency.active ? t('guardian.emergencyDetails') : t('guardian.monitoringMessage')}
              </p>
            </div>
          </div>
          {emergency.active && (
            <button type="button" onClick={() => navigate('/guardian/emergency')} className="mt-3 w-full rounded-xl bg-emergency text-white py-2.5 text-sm font-semibold">
              {t('guardian.viewEmergency')}
            </button>
          )}
        </section>

        <div className="grid grid-cols-2 gap-3">
          <InfoCard icon={MapPin} label={t('guardian.location')} value={location.label || t('guardian.locationUnavailable')} />
          <InfoCard icon={Bell} label={t('guardian.alerts')} value={String(unread)} />
          <InfoCard icon={ShieldAlert} label={t('guardian.sosHistory')} value={String(sosEvents.length)} />
          <InfoCard icon={Ambulance} label={t('guardian.ambulance')} value={latestAmbulance?.status ? t(`ambulance.status.${latestAmbulance.status}`) : t('guardian.none')} />
        </div>

        <section className="rounded-2xl border border-border bg-surface overflow-hidden">
          <Row label={t('profile.age')} value={String(profile.age ?? '—')} />
          <Row label={t('profile.bloodGroup')} value={profile.bloodGroup ?? '—'} />
          <Row label={t('profile.allergies')} value={profile.allergies.join(', ') || t('common.notAvailable')} />
          <Row label={t('profile.conditions')} value={profile.conditions.join(', ') || t('common.notAvailable')} />
          <Row label={t('profile.emergencyContact')} value={profile.emergencyContactPhone || t('common.notAvailable')} />
        </section>

        {latestSOS && (
          <section className="rounded-2xl border border-border bg-surface p-4">
            <p className="text-xs text-muted-foreground">{t('guardian.latestSOS')}</p>
            <p className="font-semibold mt-1">{new Date(latestSOS.timestamp).toLocaleString()}</p>
            <p className="text-xs text-muted-foreground mt-1">{latestSOS.lat != null && latestSOS.lng != null ? `${latestSOS.lat.toFixed(5)}, ${latestSOS.lng.toFixed(5)}` : t('guardian.locationUnavailable')}</p>
          </section>
        )}

        <section className="rounded-2xl border border-border bg-surface overflow-hidden">
          <button type="button" onClick={() => navigate('/notifications')} className="w-full flex items-center gap-3 px-4 py-3.5 text-left">
            <Bell size={18} className="text-muted-foreground" />
            <span className="flex-1 text-sm font-medium">{t('guardian.notifications')}</span>
            <ChevronRight size={16} className="text-muted-foreground" />
          </button>
          <button type="button" onClick={() => navigate('/guardian/emergency')} className="w-full flex items-center gap-3 px-4 py-3.5 text-left border-t border-border">
            <ShieldAlert size={18} className="text-muted-foreground" />
            <span className="flex-1 text-sm font-medium">{t('guardian.emergencyInformation')}</span>
            <ChevronRight size={16} className="text-muted-foreground" />
          </button>
          <button type="button" onClick={() => navigate('/hospitals')} className="w-full flex items-center gap-3 px-4 py-3.5 text-left border-t border-border">
            <MapPin size={18} className="text-muted-foreground" />
            <span className="flex-1 text-sm font-medium">{HOSPITALS[0]?.name || t('hospitals.title')}</span>
            <ChevronRight size={16} className="text-muted-foreground" />
          </button>
        </section>

        <p className="text-center text-[11px] text-muted-foreground px-5 pb-4">{t('guardian.privacyNote')}</p>
      </main>
    </div>
  )
}

function InfoCard({ icon: Icon, label, value }: { icon: typeof MapPin; label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-3.5 shadow-soft">
      <Icon size={18} className="text-primary mb-2" />
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="font-semibold text-sm mt-0.5 truncate">{value}</p>
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 px-4 py-3.5 border-b last:border-b-0 border-border text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium text-right">{value}</span>
    </div>
  )
}
