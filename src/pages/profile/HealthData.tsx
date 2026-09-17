import { useTranslation } from 'react-i18next'
import { HeartPulse, Gauge, Thermometer, Weight, Activity } from 'lucide-react'
import { PageHeader } from '@/components/PageHeader'
import { EmptyState } from '@/components/ui/EmptyState'
import { useAppState } from '@/context/AppStateContext'

const ICONS = { heartRate: HeartPulse, bloodPressure: Gauge, temperature: Thermometer, weight: Weight }

export function HealthData() {
  const { t } = useTranslation()
  const { healthMetrics } = useAppState()
  const hasAnyData = healthMetrics.some((m) => m.value)

  return (
    <div className="min-h-screen bg-background">
      <PageHeader title={t('profile.healthData') ?? ''} />

      <div className="px-4 py-4">
        {!hasAnyData ? (
          <EmptyState icon={Activity} title={t('profile.noHealthData')} />
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {healthMetrics.map((m) => {
              const Icon = ICONS[m.key]
              return (
                <div key={m.key} className="rounded-2xl border border-border bg-surface p-4">
                  <div className="h-10 w-10 rounded-xl bg-emergency-50 dark:bg-emergency/15 text-emergency flex items-center justify-center mb-3">
                    <Icon size={18} />
                  </div>
                  <p className="text-xs text-muted-foreground capitalize">{m.key.replace(/([A-Z])/g, ' $1')}</p>
                  <p className="font-bold text-lg mt-0.5">
                    {m.value ? `${m.value} ${m.unit}` : t('common.notAvailable')}
                  </p>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
