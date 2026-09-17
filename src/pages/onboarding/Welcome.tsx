import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Ambulance, Building2, Users } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { OnboardingProgress } from '@/components/OnboardingProgress'

export function Welcome() {
  const { t } = useTranslation()
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex flex-col px-6 pt-10 pb-8 bg-background">
      <OnboardingProgress step={1} total={3} />

      <div className="flex-1 flex flex-col items-center justify-center text-center">
        <div className="grid grid-cols-3 gap-3 mb-8">
          {[Ambulance, Building2, Users].map((Icon, i) => (
            <div
              key={i}
              className="h-16 w-16 rounded-2xl bg-primary-50 dark:bg-primary/15 flex items-center justify-center text-primary animate-fade-in"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <Icon size={26} />
            </div>
          ))}
        </div>
        <h1 className="text-2xl font-bold leading-snug">{t('onboarding.welcomeTitle')}</h1>
        <p className="text-sm text-muted-foreground mt-3 max-w-[300px]">{t('onboarding.welcomeBody')}</p>
      </div>

      <Button size="lg" className="w-full" onClick={() => navigate('/onboarding/language')}>
        {t('common.next')}
      </Button>
    </div>
  )
}
