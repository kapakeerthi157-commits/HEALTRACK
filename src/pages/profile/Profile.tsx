import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  Pencil, ChevronRight, HeartPulse, Weight, Activity, FileText, ShieldCheck,
  FileClock, Users, PhoneCall, Settings as SettingsIcon, Globe, Bell, Moon,
  Lock, HelpCircle, LogOut, IdCard
} from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Dialog } from '@/components/ui/Dialog'
import { useAppState } from '@/context/AppStateContext'
import { useAuth } from '@/context/AuthContext'
import { useTheme } from '@/context/ThemeContext'
import { useState, type ReactNode } from 'react'

export function Profile() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { profile, healthMetrics } = useAppState()
  const { logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const [logoutOpen, setLogoutOpen] = useState(false)

  const heartRate = healthMetrics.find((m) => m.key === 'heartRate')
  const weight = healthMetrics.find((m) => m.key === 'weight')

  const sections: Array<{ title: string; items: Array<{ icon: typeof FileText; label: string; onClick: () => void; right?: ReactNode }> }> = [
    {
      title: t('profile.sectionHealth'),
      items: [
        { icon: FileClock, label: t('profile.medicalHistory'), onClick: () => navigate('/profile/medical-history') },
        { icon: Activity, label: t('profile.healthData'), onClick: () => navigate('/profile/health-data') },
        { icon: ShieldCheck, label: t('profile.insurance'), onClick: () => navigate('/profile/insurance') },
        { icon: IdCard, label: t('profile.medicalId'), onClick: () => navigate('/profile/medical-id') }
      ]
    },
    {
      title: t('profile.sectionEmergency'),
      items: [
        { icon: Users, label: t('profile.guardianAccess'), onClick: () => navigate('/guardians') },
        { icon: PhoneCall, label: t('profile.emergencyContacts'), onClick: () => navigate('/profile/emergency-contacts') }
      ]
    },
    {
      title: t('profile.sectionApp'),
      items: [
        { icon: Globe, label: t('profile.language'), onClick: () => navigate('/profile/settings/language') },
        { icon: Bell, label: t('profile.notifications'), onClick: () => navigate('/notifications') },
        {
          icon: Moon,
          label: t('profile.darkMode'),
          onClick: toggleTheme,
          right: (
            <span className={`h-6 w-11 rounded-full p-0.5 transition-colors ${theme === 'dark' ? 'bg-primary' : 'bg-muted'}`}>
              <span className={`block h-5 w-5 rounded-full bg-white shadow transition-transform ${theme === 'dark' ? 'translate-x-5' : ''}`} />
            </span>
          )
        },
        { icon: SettingsIcon, label: t('profile.settings'), onClick: () => navigate('/profile/settings') }
      ]
    },
    {
      title: t('profile.sectionAccount'),
      items: [
        { icon: Lock, label: t('profile.privacy'), onClick: () => navigate('/profile/settings') },
        { icon: HelpCircle, label: t('profile.help'), onClick: () => navigate('/profile/settings') },
        { icon: LogOut, label: t('profile.logout'), onClick: () => setLogoutOpen(true) }
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-background pb-4">
      <div className="bg-gradient-to-br from-primary-900 to-primary-700 px-5 pt-8 pb-14 text-white relative">
        <h1 className="text-lg font-bold mb-4">{t('profile.title')}</h1>
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-2xl bg-white/15 backdrop-blur flex items-center justify-center font-bold text-xl shrink-0">
            {profile.avatarInitials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-lg truncate">{profile.name}</p>
            <p className="text-sm text-white/70">📱 +91 {profile.phone}</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs text-white/70">{t('profile.age')} {profile.age ?? '—'}</span>
              {profile.bloodGroup && (
                <Badge className="bg-white/20 text-white">🩸 {profile.bloodGroup}</Badge>
              )}
            </div>
          </div>
          <button
            onClick={() => navigate('/profile/edit')}
            className="h-9 w-9 rounded-full bg-white/20 flex items-center justify-center shrink-0"
            aria-label={t('profile.editProfile') ?? 'Edit'}
          >
            <Pencil size={15} />
          </button>
        </div>
      </div>

      <div className="px-4 -mt-8 space-y-4">
        <div
          onClick={() => navigate('/profile/medical-id')}
          className="rounded-2xl border border-border bg-surface shadow-card p-4 cursor-pointer"
        >
          <div className="flex items-center justify-between mb-1">
            <p className="text-xs text-muted-foreground uppercase tracking-wide font-semibold">{t('profile.medicalId')}</p>
            <ChevronRight size={16} className="text-muted-foreground" />
          </div>
          <p className="font-bold">{profile.name}</p>
          <div className="flex items-center gap-3 mt-2 text-sm">
            <Badge tone="emergency">🩸 {profile.bloodGroup ?? '—'}</Badge>
            <span className="text-muted-foreground">{t('profile.age')} {profile.age ?? '—'}</span>
          </div>
        </div>

        <div>
          <h2 className="font-semibold text-sm mb-3 px-0.5">{t('profile.healthSummary')}</h2>
          <div className="grid grid-cols-2 gap-3">
            <SummaryCard icon={HeartPulse} tone="emergency" label={t('profile.heartRate')} value={heartRate?.value ? `${heartRate.value} bpm` : t('common.notAvailable')} />
            <SummaryCard icon={Weight} tone="info" label={t('profile.weight')} value={weight?.value ? `${weight.value} kg` : t('common.notAvailable')} />
          </div>
        </div>

        {sections.map((section) => (
          <div key={section.title}>
            <h2 className="font-semibold text-sm mb-2 px-0.5">{section.title}</h2>
            <div className="rounded-2xl border border-border bg-surface divide-y divide-border overflow-hidden">
              {section.items.map((item) => (
                <button
                  key={item.label}
                  onClick={item.onClick}
                  className="w-full flex items-center gap-3 px-4 py-3.5 text-left active:bg-muted"
                >
                  <item.icon size={18} className="text-muted-foreground shrink-0" />
                  <span className="flex-1 text-sm font-medium">{item.label}</span>
                  {item.right ?? <ChevronRight size={16} className="text-muted-foreground" />}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <Dialog open={logoutOpen} onClose={() => setLogoutOpen(false)} title={t('profile.logout') ?? ''}>
        <p className="text-sm text-muted-foreground mb-5">{t('profile.logoutConfirm')}</p>
        <div className="flex gap-3">
          <Button variant="outline" className="flex-1" onClick={() => setLogoutOpen(false)}>
            {t('common.cancel')}
          </Button>
          <Button variant="emergency" className="flex-1" onClick={logout}>
            {t('profile.logout')}
          </Button>
        </div>
      </Dialog>
    </div>
  )
}

function SummaryCard({ icon: Icon, tone, label, value }: { icon: typeof HeartPulse; tone: 'emergency' | 'info'; label: string; value: string }) {
  const toneClasses = tone === 'emergency' ? 'bg-emergency-50 text-emergency dark:bg-emergency/15' : 'bg-info-50 text-info-600 dark:bg-info/15'
  return (
    <div className="rounded-2xl border border-border bg-surface p-3.5">
      <div className={`h-9 w-9 rounded-xl flex items-center justify-center mb-2 ${toneClasses}`}>
        <Icon size={17} />
      </div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="font-bold text-sm mt-0.5">{value}</p>
    </div>
  )
}
