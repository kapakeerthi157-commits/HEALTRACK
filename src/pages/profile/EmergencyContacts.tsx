import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Phone, Pencil, Trash2, Plus, Users } from 'lucide-react'
import { PageHeader } from '@/components/PageHeader'
import { EmptyState } from '@/components/ui/EmptyState'
import { Button } from '@/components/ui/Button'
import { Dialog } from '@/components/ui/Dialog'
import { useAppState } from '@/context/AppStateContext'
import { RELATIONSHIP_OPTIONS } from '@/lib/mockData'
import { cn } from '@/lib/utils'

export function EmergencyContacts() {
  const { t } = useTranslation()
  const { emergencyContacts, addEmergencyContact, removeEmergencyContact } = useAppState()
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [relationship, setRelationship] = useState('')
  const [toRemove, setToRemove] = useState<string | null>(null)

  const canSubmit = name.trim().length > 1 && /^\d{10}$/.test(phone) && relationship

  const submit = () => {
    addEmergencyContact({ name, phone, relationship })
    setName('')
    setPhone('')
    setRelationship('')
    setOpen(false)
  }

  return (
    <div className="min-h-screen bg-background">
      <PageHeader title={t('profile.emergencyContacts') ?? ''} />

      <div className="px-4 py-4">
        {emergencyContacts.length === 0 ? (
          <EmptyState icon={Users} title={t('guardians.empty')} />
        ) : (
          <div className="space-y-3">
            {emergencyContacts.map((c) => (
              <div key={c.id} className="flex items-center gap-3 rounded-2xl border border-border bg-surface p-3">
                <div className="h-11 w-11 rounded-full bg-primary-50 dark:bg-primary/15 text-primary flex items-center justify-center font-semibold text-sm shrink-0">
                  {c.name.slice(0, 2).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm">{c.name}</p>
                  <p className="text-xs text-muted-foreground">{c.relationship} · {c.phone}</p>
                </div>
                <button onClick={() => window.open(`tel:${c.phone}`)} className="h-8 w-8 rounded-full hover:bg-muted flex items-center justify-center">
                  <Phone size={15} />
                </button>
                <button onClick={() => setToRemove(c.id)} className="h-8 w-8 rounded-full hover:bg-muted flex items-center justify-center text-emergency">
                  <Trash2 size={15} />
                </button>
              </div>
            ))}
          </div>
        )}

        <Button className="w-full mt-4" onClick={() => setOpen(true)}>
          <Plus size={16} /> {t('home.emergencyContacts')}
        </Button>
      </div>

      <Dialog open={open} onClose={() => setOpen(false)} title={t('home.emergencyContacts') ?? ''}>
        <div className="space-y-3">
          <input placeholder={t('guardians.name') ?? ''} value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-xl border border-border bg-surface px-3 h-11 text-sm outline-none" />
          <input
            placeholder={t('guardians.mobile') ?? ''}
            value={phone}
            onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
            inputMode="numeric"
            className="w-full rounded-xl border border-border bg-surface px-3 h-11 text-sm outline-none"
          />
          <div className="flex flex-wrap gap-2">
            {RELATIONSHIP_OPTIONS.map((r) => (
              <button
                key={r}
                onClick={() => setRelationship(r)}
                className={cn(
                  'px-3 h-8 rounded-full text-xs font-medium border',
                  relationship === r ? 'bg-primary text-primary-foreground border-primary' : 'bg-surface border-border'
                )}
              >
                {r}
              </button>
            ))}
          </div>
          <Button className="w-full" disabled={!canSubmit} onClick={submit}>
            {t('common.save')}
          </Button>
        </div>
      </Dialog>

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
              if (toRemove) removeEmergencyContact(toRemove)
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
