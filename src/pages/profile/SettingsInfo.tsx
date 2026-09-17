import { useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Bell, HelpCircle, Lock, ShieldAlert } from 'lucide-react'
import { PageHeader } from '@/components/PageHeader'

const CONTENT = {
  privacy: { icon: Lock, titleKey: 'profile.privacy', bodyKey: 'settingsInfo.privacyBody' },
  emergency: { icon: ShieldAlert, titleKey: 'profile.emergencySettings', bodyKey: 'settingsInfo.emergencyBody' },
  help: { icon: HelpCircle, titleKey: 'profile.help', bodyKey: 'settingsInfo.helpBody' }
} as const

export function SettingsInfo() {
  const { section } = useParams<{ section: keyof typeof CONTENT }>()
  const { t } = useTranslation()
  const config = CONTENT[section ?? 'help'] ?? CONTENT.help
  const Icon = config.icon

  return (
    <div className="min-h-screen bg-background">
      <PageHeader title={t(config.titleKey) ?? ''} />
      <main className="px-4 py-5">
        <div className="rounded-2xl border border-border bg-surface p-5 shadow-soft">
          <div className="h-12 w-12 rounded-2xl bg-primary-50 dark:bg-primary/15 text-primary flex items-center justify-center">
            <Icon size={22} />
          </div>
          <h2 className="font-bold text-lg mt-4">{t(config.titleKey)}</h2>
          <p className="text-sm text-muted-foreground leading-6 mt-2">{t(config.bodyKey)}</p>
        </div>
      </main>
    </div>
  )
}
