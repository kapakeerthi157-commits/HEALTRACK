import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Check, Languages } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { OnboardingProgress } from '@/components/OnboardingProgress'
import { SUPPORTED_LANGUAGES } from '@/i18n'

export function LanguageSelect() {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex flex-col px-6 pt-10 pb-8 bg-background">
      <OnboardingProgress step={2} total={3} />

      <div className="flex items-center gap-3 mb-1">
        <div className="h-11 w-11 rounded-xl bg-primary-50 dark:bg-primary/15 flex items-center justify-center text-primary">
          <Languages size={22} />
        </div>
        <div>
          <h1 className="text-xl font-bold">{t('onboarding.chooseLanguage')}</h1>
        </div>
      </div>
      <p className="text-sm text-muted-foreground mb-6">{t('onboarding.chooseLanguageBody')}</p>

      <div className="grid grid-cols-2 gap-3 flex-1 content-start overflow-y-auto pb-4">
        {SUPPORTED_LANGUAGES.map((lang) => {
          const active = i18n.language === lang.code
          return (
            <button
              key={lang.code}
              onClick={() => i18n.changeLanguage(lang.code)}
              className={`relative rounded-2xl border-2 p-4 text-left transition-all active:scale-[0.97] ${
                active ? 'border-primary bg-primary-50 dark:bg-primary/15' : 'border-border bg-surface'
              }`}
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

      <Button size="lg" className="w-full mt-4" onClick={() => navigate('/onboarding/location')}>
        {t('common.next')}
      </Button>
    </div>
  )
}
