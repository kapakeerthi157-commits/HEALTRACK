import { useTranslation } from 'react-i18next'
import { Check, Languages } from 'lucide-react'
import { PageHeader } from '@/components/PageHeader'
import { SUPPORTED_LANGUAGES } from '@/i18n'
import { cn } from '@/lib/utils'

export function LanguageSettings() {
  const { t, i18n } = useTranslation()

  return (
    <div className="min-h-screen bg-background">
      <PageHeader title={t('profile.language') ?? ''} />
      <div className="px-4 py-5">
        <div className="flex items-center gap-3 rounded-2xl bg-primary-50 dark:bg-primary/10 p-4 mb-5">
          <div className="h-10 w-10 rounded-xl bg-surface flex items-center justify-center text-primary">
            <Languages size={20} />
          </div>
          <div>
            <p className="font-semibold text-sm">{t('onboarding.chooseLanguage')}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{t('onboarding.chooseLanguageBody')}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {SUPPORTED_LANGUAGES.map((lang) => {
            const active = i18n.resolvedLanguage === lang.code || i18n.language === lang.code
            return (
              <button
                key={lang.code}
                type="button"
                onClick={() => i18n.changeLanguage(lang.code)}
                aria-pressed={active}
                className={cn(
                  'relative rounded-2xl border-2 p-4 text-left transition-all active:scale-[0.97]',
                  active ? 'border-primary bg-primary-50 dark:bg-primary/15' : 'border-border bg-surface'
                )}
              >
                {active && (
                  <div className="absolute top-2.5 right-2.5 h-5 w-5 rounded-full bg-primary flex items-center justify-center">
                    <Check size={13} className="text-white" />
                  </div>
                )}
                <p className="font-semibold text-base">{lang.nativeLabel}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{lang.label}</p>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
