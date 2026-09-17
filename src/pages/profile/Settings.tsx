import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Bell, ChevronRight, HelpCircle, Lock, Moon, ShieldAlert } from 'lucide-react'
import { PageHeader } from '@/components/PageHeader'
import { useTheme } from '@/context/ThemeContext'
import { cn } from '@/lib/utils'

export function Settings() {
  const { t, i18n } = useTranslation()
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()

  const items = [
    { icon: Bell, label: t('profile.notifications'), onClick: () => navigate('/notifications') },
    { icon: Lock, label: t('profile.privacy'), onClick: () => navigate('/profile/settings/privacy') },
    { icon: ShieldAlert, label: t('profile.emergencySettings'), onClick: () => navigate('/profile/settings/emergency') },
    { icon: HelpCircle, label: t('profile.help'), onClick: () => navigate('/profile/settings/help') }
  ]

  return (
    <div className="min-h-screen bg-background">
      <PageHeader title={t('profile.settings') ?? ''} />
      <div className="px-4 py-4 space-y-6">
        <section>
          <h2 className="font-semibold text-sm mb-3 px-0.5">{t('profile.language')}</h2>
          <button
            type="button"
            onClick={() => navigate('/profile/settings/language')}
            className="w-full flex items-center gap-3 rounded-2xl border border-border bg-surface px-4 py-4 text-left shadow-soft"
          >
            <div className="h-10 w-10 rounded-xl bg-primary-50 dark:bg-primary/15 text-primary flex items-center justify-center text-sm font-bold">
              {i18n.resolvedLanguage?.toUpperCase() ?? 'EN'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold">{t('profile.changeLanguage')}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{t('onboarding.chooseLanguageBody')}</p>
            </div>
            <ChevronRight size={17} className="text-muted-foreground" />
          </button>
        </section>

        <section className="rounded-2xl border border-border bg-surface divide-y divide-border overflow-hidden">
          <div className="flex items-center gap-3 px-4 py-3.5">
            <Moon size={18} className="text-muted-foreground" />
            <span className="flex-1 text-sm font-medium">{t('profile.darkMode')}</span>
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={t('profile.darkMode')}
              className={cn('h-6 w-11 rounded-full p-0.5 transition-colors', theme === 'dark' ? 'bg-primary' : 'bg-muted')}
            >
              <span className={cn('block h-5 w-5 rounded-full bg-white shadow transition-transform', theme === 'dark' && 'translate-x-5')} />
            </button>
          </div>
          {items.map(({ icon: Icon, label, onClick }) => (
            <button key={label} type="button" onClick={onClick} className="w-full flex items-center gap-3 px-4 py-3.5 text-left active:bg-muted">
              <Icon size={18} className="text-muted-foreground" />
              <span className="flex-1 text-sm font-medium">{label}</span>
              <ChevronRight size={16} className="text-muted-foreground" />
            </button>
          ))}
        </section>
      </div>
    </div>
  )
}
