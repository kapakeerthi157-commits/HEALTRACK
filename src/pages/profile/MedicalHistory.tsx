import { useTranslation } from 'react-i18next'
import { FileClock, Stethoscope, Syringe, Pill } from 'lucide-react'
import { PageHeader } from '@/components/PageHeader'
import { EmptyState } from '@/components/ui/EmptyState'
import { useAppState } from '@/context/AppStateContext'

const ICONS = { checkup: Stethoscope, allergy: Pill, surgery: Syringe, vaccination: Syringe }

export function MedicalHistory() {
  const { t } = useTranslation()
  const { medicalHistory } = useAppState()

  const grouped = medicalHistory.reduce<Record<string, typeof medicalHistory>>((acc, entry) => {
    acc[entry.year] = acc[entry.year] ? [...acc[entry.year], entry] : [entry]
    return acc
  }, {})
  const years = Object.keys(grouped).sort((a, b) => Number(b) - Number(a))

  return (
    <div className="min-h-screen bg-background">
      <PageHeader title={t('profile.medicalHistory') ?? ''} />

      <div className="px-4 py-4">
        {years.length === 0 ? (
          <EmptyState icon={FileClock} title={t('profile.noMedicalHistory')} />
        ) : (
          <div className="space-y-6">
            {years.map((year) => (
              <div key={year}>
                <p className="font-bold text-lg mb-3">{year}</p>
                <div className="space-y-3 border-l-2 border-border pl-4">
                  {grouped[year].map((entry) => {
                    const Icon = ICONS[entry.icon]
                    return (
                      <div key={entry.id} className="relative">
                        <div className="absolute -left-[22px] top-1 h-3 w-3 rounded-full bg-primary" />
                        <div className="flex items-center gap-2 mb-0.5">
                          <Icon size={15} className="text-primary" />
                          <p className="font-semibold text-sm">{entry.title}</p>
                        </div>
                        <p className="text-xs text-muted-foreground">{entry.status}</p>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
