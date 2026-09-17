import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { UserPlus, Phone, Trash2, Shield, Lock } from 'lucide-react'
import { PageHeader } from '@/components/PageHeader'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { Dialog } from '@/components/ui/Dialog'
import { useAppState } from '@/context/AppStateContext'
import { cn } from '@/lib/utils'

export function GuardianList() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { guardians, removeGuardian, guardianMode, setGuardianMode, profile } = useAppState()
  const [toRemove, setToRemove] = useState<string | null>(null)

  return (
    <div className="min-h-screen bg-background">
      <PageHeader title={t('guardians.title') ?? ''} />

      <div className="px-4 py-4">
        <div className="flex bg-muted rounded-xl p-1 mb-4">
          <button
            onClick={() => setGuardianMode(false)}
            className={cn('flex-1 py-2 rounded-lg text-sm font-medium', !guardianMode ? 'bg-surface shadow-soft' : 'text-muted-foreground')}
          >
            {t('guardians.myProfile')}
          </button>
          <button
            onClick={() => setGuardianMode(true)}
            className={cn('flex-1 py-2 rounded-lg text-sm font-medium', guardianMode ? 'bg-surface shadow-soft' : 'text-muted-foreground')}
          >
            {t('guardians.guardianView')}
          </button>
        </div>

        {guardianMode ? (
          <div>
            <div className="flex items-center gap-2 bg-info-50 dark:bg-info/10 text-info-600 dark:text-info rounded-xl px-3 py-2 text-xs font-medium mb-4">
              <Lock size={13} /> {t('guardians.privacyNote')}
            </div>
            <div className="rounded-2xl border border-border bg-surface p-4 space-y-3">
              <Row label={t('profile.age')} value={String(profile.age ?? '—')} />
              <Row label={t('profile.bloodGroup')} value={profile.bloodGroup ?? '—'} />
              <Row label={t('profile.allergies')} value={profile.allergies.join(', ') || t('common.notAvailable')} />
              <Row label={t('profile.conditions')} value={profile.conditions.join(', ') || t('common.notAvailable')} />
              <Row label={t('profile.emergencyContact')} value={profile.emergencyContactPhone || t('common.notAvailable')} />
            </div>
          </div>
        ) : (
          <>
            <div className="rounded-2xl bg-primary-50 dark:bg-primary/10 p-4 mb-4">
              <div className="flex items-start gap-3">
                <Shield size={20} className="text-primary mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-medium">{t('guardians.description')}</p>
                  <p className="text-xs text-muted-foreground mt-1">{t('guardians.maxNote')}</p>
                </div>
              </div>
            </div>

            {guardians.length === 0 ? (
              <EmptyState icon={Shield} title={t('guardians.empty')} body={t('guardians.emptyBody') ?? undefined} />
            ) : (
              <div className="space-y-3">
                {guardians.map((g) => (
                  <div key={g.id} className="flex items-center gap-3 rounded-2xl border border-border bg-surface p-3">
                    <div className="h-11 w-11 rounded-full bg-primary-50 dark:bg-primary/15 text-primary flex items-center justify-center font-semibold text-sm shrink-0">
                      {g.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm">{g.name}</p>
                      <p className="text-xs text-muted-foreground">{g.relationship} · {g.phone}</p>
                    </div>
                    <button onClick={() => window.open(`tel:${g.phone}`)} className="h-8 w-8 rounded-full hover:bg-muted flex items-center justify-center">
                      <Phone size={15} />
                    </button>
                    <button onClick={() => setToRemove(g.id)} className="h-8 w-8 rounded-full hover:bg-muted flex items-center justify-center text-emergency">
                      <Trash2 size={15} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {guardians.length < 2 && (
              <Button className="w-full mt-4" onClick={() => navigate('/guardians/add')}>
                <UserPlus size={16} /> {t('guardians.add')}
              </Button>
            )}
          </>
        )}
      </div>

      <Dialog open={!!toRemove} onClose={() => setToRemove(null)} title={t('common.remove') ?? ''}>
        <p className="text-sm text-muted-foreground mb-5">{t('guardians.removeConfirm')}</p>
        <div className="flex gap-3">
          <Button variant="outline" className="flex-1" onClick={() => setToRemove(null)}>
            {t('common.cancel')}
          </Button>
          <Button
            variant="emergency"
            className="flex-1"
            onClick={() => {
              if (toRemove) removeGuardian(toRemove)
              setToRemove(null)
            }}
          >
            {t('common.remove')}
          </Button>
        </div>
      </Dialog>
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  )
}
