import { useState, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { PageHeader } from '@/components/PageHeader'
import { Button } from '@/components/ui/Button'
import { useAppState } from '@/context/AppStateContext'
import { useToast } from '@/components/ui/Toast'
import { RELATIONSHIP_OPTIONS } from '@/lib/mockData'
import { cn } from '@/lib/utils'

export function AddGuardian() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { addGuardian } = useAppState()
  const { show } = useToast()
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [relationship, setRelationship] = useState('')

  const canSubmit = name.trim().length > 1 && /^\d{10}$/.test(phone) && relationship

  const submit = () => {
    const ok = addGuardian({ name, phone, relationship })
    if (ok) {
      show(t('profile.saveSuccess'))
      navigate('/guardians')
    } else {
      show(t('guardians.maxNote'), 'error')
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <PageHeader title={t('guardians.add') ?? ''} />

      <div className="px-4 py-4 space-y-5">
        <Field label={t('guardians.name')}>
          <input value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-transparent outline-none text-sm" />
        </Field>

        <Field label={t('guardians.mobile')}>
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-muted-foreground">+91</span>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
              inputMode="numeric"
              className="flex-1 bg-transparent outline-none text-sm"
            />
          </div>
        </Field>

        <div>
          <p className="text-xs text-muted-foreground mb-2 px-1">{t('guardians.relationship')}</p>
          <div className="flex flex-wrap gap-2">
            {RELATIONSHIP_OPTIONS.map((r) => (
              <button
                key={r}
                onClick={() => setRelationship(r)}
                className={cn(
                  'px-3.5 h-9 rounded-full text-sm font-medium border',
                  relationship === r ? 'bg-primary text-primary-foreground border-primary' : 'bg-surface border-border'
                )}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        <Button size="lg" className="w-full mt-4" disabled={!canSubmit} onClick={submit}>
          {t('common.save')}
        </Button>
      </div>
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
