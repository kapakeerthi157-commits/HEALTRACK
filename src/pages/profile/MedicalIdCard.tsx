import { useTranslation } from 'react-i18next'
import { PageHeader } from '@/components/PageHeader'
import { useAppState } from '@/context/AppStateContext'
import { HeartPulse } from 'lucide-react'

export function MedicalIdCard() {
  const { t } = useTranslation()
  const { profile } = useAppState()

  return (
    <div className="min-h-screen bg-background">
      <PageHeader title={t('profile.medicalId') ?? ''} />

      <div className="px-4 py-6">
        <div className="rounded-3xl bg-gradient-to-br from-emergency-700 to-emergency-600 text-white p-5 shadow-floating relative overflow-hidden">
          <HeartPulse className="absolute -right-4 -bottom-4 text-white/10" size={140} />
          <div className="relative flex items-center justify-between mb-4">
            <p className="font-bold tracking-wide text-sm">MEDICAL ID</p>
            <div className="h-9 w-9 rounded-full bg-white/20 flex items-center justify-center font-bold text-xs">
              {profile.avatarInitials}
            </div>
          </div>
          <p className="relative text-2xl font-bold">{profile.name}</p>
          <div className="relative flex items-center gap-4 mt-3">
            <div>
              <p className="text-[10px] text-white/70 uppercase">{t('profile.bloodGroup')}</p>
              <p className="text-xl font-bold">{profile.bloodGroup ?? '—'}</p>
            </div>
            <div className="h-8 w-px bg-white/25" />
            <div>
              <p className="text-[10px] text-white/70 uppercase">{t('profile.age')}</p>
              <p className="text-xl font-bold">{profile.age ?? '—'}</p>
            </div>
          </div>
          <div className="relative mt-4 pt-3 border-t border-white/20 space-y-1.5 text-xs">
            <p><span className="text-white/70">{t('profile.emergencyContact')}: </span>{profile.emergencyContactPhone || t('common.notAvailable')}</p>
            <p><span className="text-white/70">{t('profile.allergies')}: </span>{profile.allergies.join(', ') || t('common.notAvailable')}</p>
            <p><span className="text-white/70">{t('profile.conditions')}: </span>{profile.conditions.join(', ') || t('common.notAvailable')}</p>
          </div>
        </div>

        <p className="text-xs text-muted-foreground text-center mt-4">
          Show this card to first responders in case of emergency
        </p>
      </div>
    </div>
  )
}
