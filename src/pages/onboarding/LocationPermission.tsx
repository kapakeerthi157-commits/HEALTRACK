import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { MapPin, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { OnboardingProgress } from '@/components/OnboardingProgress'
import { useAppState } from '@/context/AppStateContext'
import { useAuth } from '@/context/AuthContext'

export function LocationPermission() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { location, detectLocation } = useAppState()
  const { completeOnboarding } = useAuth()

  const finish = () => {
    completeOnboarding()
    navigate('/home', { replace: true })
  }

  return (
    <div className="min-h-screen flex flex-col px-6 pt-10 pb-8 bg-background">
      <OnboardingProgress step={3} total={3} />

      <div className="flex-1 flex flex-col items-center justify-center text-center">
        <div className="relative flex items-center justify-center mb-6">
          {location.status === 'loading' && (
            <span className="absolute h-24 w-24 rounded-full bg-primary/15 animate-pulse-ring" />
          )}
          <div className="h-20 w-20 rounded-3xl bg-primary-50 dark:bg-primary/15 flex items-center justify-center text-primary">
            <MapPin size={34} />
          </div>
        </div>
        <h1 className="text-2xl font-bold">{t('onboarding.locationTitle')}</h1>
        <p className="text-sm text-muted-foreground mt-3 max-w-[300px]">{t('onboarding.locationBody')}</p>

        {location.status === 'loading' && (
          <p className="text-sm text-primary mt-4 font-medium">{t('onboarding.detecting')}</p>
        )}
        {location.status === 'ready' && (
          <p className="text-sm text-success mt-4 font-medium">{location.label}</p>
        )}
        {location.status === 'error' && (
          <div className="flex items-center gap-2 text-warning-600 text-sm mt-4 bg-warning-50 dark:bg-warning/10 rounded-xl px-3 py-2">
            <AlertTriangle size={16} />
            <span>{t('onboarding.locationDenied')}</span>
          </div>
        )}
      </div>

      {location.status === 'ready' ? (
        <Button size="lg" className="w-full" onClick={finish}>
          {t('common.continue')}
        </Button>
      ) : (
        <>
          <Button size="lg" className="w-full" isLoading={location.status === 'loading'} onClick={detectLocation}>
            {t('onboarding.enableLocation')}
          </Button>
          <button onClick={finish} className="text-sm text-muted-foreground mt-4 mx-auto font-medium">
            {t('common.skip')}
          </button>
        </>
      )}
    </div>
  )
}
