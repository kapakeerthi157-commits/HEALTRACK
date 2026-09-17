import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ShieldCheck, Plus } from 'lucide-react'
import { PageHeader } from '@/components/PageHeader'
import { EmptyState } from '@/components/ui/EmptyState'
import { Button } from '@/components/ui/Button'
import { Dialog } from '@/components/ui/Dialog'
import { Badge } from '@/components/ui/Badge'
import { useAppState } from '@/context/AppStateContext'

function maskPolicy(num: string) {
  if (num.length <= 4) return num
  return `${'•'.repeat(num.length - 4)}${num.slice(-4)}`
}

export function Insurance() {
  const { t } = useTranslation()
  const { insurance, setInsurance } = useAppState()
  const [open, setOpen] = useState(false)
  const [provider, setProvider] = useState('')
  const [policyNumber, setPolicyNumber] = useState('')
  const [policyHolder, setPolicyHolder] = useState('')
  const [validUntil, setValidUntil] = useState('')

  const save = () => {
    setInsurance({ provider, policyNumber, policyHolder, status: 'Active', validUntil })
    setOpen(false)
  }

  return (
    <div className="min-h-screen bg-background">
      <PageHeader title={t('profile.insurance') ?? ''} />

      <div className="px-4 py-4">
        {!insurance ? (
          <EmptyState
            icon={ShieldCheck}
            title={t('profile.noInsurance')}
            action={
              <Button onClick={() => setOpen(true)}>
                <Plus size={15} /> {t('common.save')}
              </Button>
            }
          />
        ) : (
          <div className="rounded-2xl border border-border bg-surface p-4 space-y-3">
            <div className="flex items-center justify-between">
              <p className="font-bold">{insurance.provider}</p>
              <Badge tone={insurance.status === 'Active' ? 'success' : 'muted'}>{insurance.status}</Badge>
            </div>
            <Row label="Policy Number" value={maskPolicy(insurance.policyNumber)} />
            <Row label="Policy Holder" value={insurance.policyHolder} />
            <Row label="Valid Until" value={insurance.validUntil} />
          </div>
        )}
      </div>

      <Dialog open={open} onClose={() => setOpen(false)} title={t('profile.insurance') ?? ''}>
        <div className="space-y-3">
          <input placeholder="Provider" value={provider} onChange={(e) => setProvider(e.target.value)} className="w-full rounded-xl border border-border bg-surface px-3 h-11 text-sm outline-none" />
          <input placeholder="Policy Number" value={policyNumber} onChange={(e) => setPolicyNumber(e.target.value)} className="w-full rounded-xl border border-border bg-surface px-3 h-11 text-sm outline-none" />
          <input placeholder="Policy Holder" value={policyHolder} onChange={(e) => setPolicyHolder(e.target.value)} className="w-full rounded-xl border border-border bg-surface px-3 h-11 text-sm outline-none" />
          <input placeholder="Valid Until (e.g. Dec 2027)" value={validUntil} onChange={(e) => setValidUntil(e.target.value)} className="w-full rounded-xl border border-border bg-surface px-3 h-11 text-sm outline-none" />
          <Button className="w-full" disabled={!provider || !policyNumber} onClick={save}>
            {t('common.save')}
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
