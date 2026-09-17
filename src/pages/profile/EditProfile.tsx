import { useState, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { PageHeader } from '@/components/PageHeader'
import { Button } from '@/components/ui/Button'
import { Dialog } from '@/components/ui/Dialog'
import { useAppState } from '@/context/AppStateContext'
import { useToast } from '@/components/ui/Toast'
import { cn } from '@/lib/utils'
import type { BloodGroup } from '@/types'

const BLOOD_GROUPS: BloodGroup[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']

export function EditProfile() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { profile, updateProfile } = useAppState()
  const { show } = useToast()

  const [name, setName] = useState(profile.name)
  const [age, setAge] = useState(profile.age?.toString() ?? '')
  const [bloodGroup, setBloodGroup] = useState<BloodGroup | null>(profile.bloodGroup)
  const [saving, setSaving] = useState(false)
  const [confirmLeave, setConfirmLeave] = useState(false)

  const dirty = name !== profile.name || age !== (profile.age?.toString() ?? '') || bloodGroup !== profile.bloodGroup

  const handleBack = () => {
    if (dirty) setConfirmLeave(true)
    else navigate(-1)
  }

  const save = () => {
    setSaving(true)
    setTimeout(() => {
      try {
        updateProfile({ name, age: age ? Number(age) : null, bloodGroup })
        setSaving(false)
        show(t('profile.saveSuccess'))
        navigate(-1)
      } catch {
        setSaving(false)
        show(t('profile.saveError'), 'error')
      }
    }, 500)
  }

  return (
    <div className="min-h-screen bg-background">
      <PageHeader title={t('profile.editProfile') ?? ''} onBack={handleBack} />

      <div className="px-4 py-4 space-y-5">
        <div className="flex justify-center py-2">
          <div className="h-24 w-24 rounded-full bg-primary-50 dark:bg-primary/15 text-primary flex items-center justify-center font-bold text-3xl">
            {profile.avatarInitials}
          </div>
        </div>

        <Field label="Full Name">
          <input value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-transparent outline-none text-sm" />
        </Field>

        <Field label="Mobile Number">
          <input value={`+91 ${profile.phone}`} disabled className="w-full bg-transparent outline-none text-sm text-muted-foreground" />
        </Field>

        <Field label={t('profile.age')}>
          <input
            value={age}
            onChange={(e) => setAge(e.target.value.replace(/\D/g, '').slice(0, 3))}
            inputMode="numeric"
            className="w-full bg-transparent outline-none text-sm"
          />
        </Field>

        <div>
          <p className="text-xs text-muted-foreground mb-2 px-1">{t('profile.bloodGroup')}</p>
          <div className="grid grid-cols-4 gap-2">
            {BLOOD_GROUPS.map((bg) => (
              <button
                key={bg}
                onClick={() => setBloodGroup(bg)}
                className={cn(
                  'h-11 rounded-xl border-2 font-semibold text-sm',
                  bloodGroup === bg ? 'border-emergency bg-emergency-50 text-emergency dark:bg-emergency/10' : 'border-border bg-surface'
                )}
              >
                {bg}
              </button>
            ))}
          </div>
        </div>

        <Button size="lg" className="w-full mt-4" isLoading={saving} disabled={!dirty} onClick={save}>
          {t('common.save')}
        </Button>
      </div>

      <Dialog open={confirmLeave} onClose={() => setConfirmLeave(false)} title={t('profile.unsavedTitle') ?? ''}>
        <p className="text-sm text-muted-foreground mb-5">{t('profile.unsavedBody')}</p>
        <div className="flex gap-3">
          <Button variant="outline" className="flex-1" onClick={() => setConfirmLeave(false)}>
            {t('common.cancel')}
          </Button>
          <Button variant="emergency" className="flex-1" onClick={() => navigate(-1)}>
            {t('common.confirm')}
          </Button>
        </div>
      </Dialog>
    </div>
  )
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <label className="text-xs text-muted-foreground mb-1.5 block px-1">{label}</label>
      <div className="rounded-2xl border border-border bg-surface px-4 h-12 flex items-center">{children}</div>
    </div>
  )
}
