import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  Siren, MapPin, CheckCircle2, Phone, MessageSquare,
  ShieldAlert, Navigation2, AlertTriangle, ChevronRight, Building2
} from 'lucide-react'
import { Dialog } from '@/components/ui/Dialog'
import { Button } from '@/components/ui/Button'
import { useAppState } from '@/context/AppStateContext'
import { HOSPITALS } from '@/lib/mockData'
import { getNearbyFacilities } from '@/lib/geo'
import type { NearbyFacility, SOSActionStatus, SOSEvent } from '@/types'

type Step = 'closed' | 'choose' | 'confirmGuardian' | 'confirmServices' | 'resultGuardian' | 'resultServices'

const isIOS = () => typeof navigator !== 'undefined' && /iPad|iPhone|iPod/.test(navigator.userAgent)

export function SOSCard() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { emergency, guardians, location, profile, pushNotification, logSOSEvent } = useAppState()
  const [step, setStep] = useState<Step>('closed')
  const [sending, setSending] = useState(false)
  const [result, setResult] = useState<SOSEvent | null>(null)
  const [nearby, setNearby] = useState<NearbyFacility[]>([])

  const close = () => !sending && setStep('closed')
  const guardian = guardians[0] ?? null

  const runGuardianAlert = () => {
    if (!guardian) return
    setSending(true)
    setTimeout(() => {
      const now = Date.now()
      const locationLabel = location.status === 'ready' && location.label
        ? location.label
        : location.lat != null && location.lng != null
          ? `${location.lat.toFixed(5)}, ${location.lng.toFixed(5)}`
          : 'Unavailable'
      const message = t('sos.alertMessage', { name: profile.name, location: locationLabel, time: new Date(now).toLocaleString() })

      let callStatus: SOSActionStatus = 'unavailable'
      try {
        window.open(`tel:${guardian.phone}`, '_self')
        callStatus = 'success'
      } catch {
        callStatus = 'unavailable'
      }

      let smsStatus: SOSActionStatus = 'unavailable'
      try {
        const sep = isIOS() ? '&' : '?'
        window.open(`sms:${guardian.phone}${sep}body=${encodeURIComponent(message)}`, '_self')
        smsStatus = 'success'
      } catch {
        smsStatus = 'unavailable'
      }

      pushNotification({ type: 'emergency', title: t('sos.sentTitle'), message })
      const notificationStatus: SOSActionStatus = 'success'
      const locationStatus: SOSActionStatus = location.status === 'ready' ? 'success' : 'unavailable'

      const successCount = [callStatus, smsStatus, notificationStatus].filter((s) => s === 'success').length
      const overallStatus: SOSEvent['overallStatus'] = successCount === 3 ? 'sent' : successCount > 0 ? 'partial' : 'failed'

      const event = logSOSEvent({
        type: 'guardian',
        timestamp: now,
        lat: location.lat,
        lng: location.lng,
        accuracy: location.accuracy,
        guardianName: guardian.name,
        guardianPhone: guardian.phone,
        callStatus,
        smsStatus,
        notificationStatus,
        locationStatus,
        serviceLookupStatus: 'skipped',
        overallStatus
      })

      setResult(event)
      setSending(false)
      setStep('resultGuardian')
    }, 700)
  }

  const runServicesLookup = () => {
    setSending(true)
    setTimeout(() => {
      const facilities = getNearbyFacilities(location.lat, location.lng, 4)
      setNearby(facilities)
      const now = Date.now()
      const locationStatus: SOSActionStatus = location.status === 'ready' ? 'success' : 'unavailable'
      const event = logSOSEvent({
        type: 'services',
        timestamp: now,
        lat: location.lat,
        lng: location.lng,
        accuracy: location.accuracy,
        guardianName: null,
        guardianPhone: null,
        callStatus: 'skipped',
        smsStatus: 'skipped',
        notificationStatus: 'skipped',
        locationStatus,
        serviceLookupStatus: facilities.length > 0 ? 'success' : 'unavailable',
        overallStatus: facilities.length > 0 ? 'sent' : 'failed'
      })
      setResult(event)
      setSending(false)
      setStep('resultServices')
    }, 600)
  }

  if (emergency.active) {
    const nearest = HOSPITALS[0]
    return (
      <div className="rounded-3xl bg-gradient-to-br from-emergency-600 to-emergency p-5 text-white shadow-card animate-fade-in">
        <div className="flex items-center gap-2 mb-4">
          <span className="h-2.5 w-2.5 rounded-full bg-white animate-pulse" />
          <p className="font-bold tracking-wide">{t('home.sosActive')}</p>
        </div>
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={16} /> <span>{t('emergency.locationShared')}</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 size={16} /> <span>{t('emergency.ambulanceRequested')}</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 size={16} />
            <span>{guardians.length > 0 ? t('emergency.guardianNotified') : t('guardians.empty')}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin size={16} /> <span>{t('emergency.nearestHospital')}: {nearest.name}</span>
          </div>
        </div>
        <Button variant="secondary" className="w-full mt-4 bg-white/15 text-white hover:bg-white/25" onClick={() => navigate('/emergency')}>
          {t('emergency.trackAmbulance')}
        </Button>
      </div>
    )
  }

  return (
    <>
      <div className="rounded-3xl bg-gradient-to-br from-primary-900 to-primary-700 dark:from-emergency-700 dark:to-emergency-600 p-5 shadow-card relative overflow-hidden">
        <div className="relative z-10 flex items-center justify-between">
          <div className="text-white max-w-[62%]">
            <p className="font-bold tracking-wide flex items-center gap-1.5 text-sm">
              <Siren size={16} /> {t('home.sosTitle')}
            </p>
            <p className="text-white/70 text-xs mt-1.5 leading-snug">{t('home.sosSubtitle')}</p>
          </div>

          <button
            onClick={() => setStep('choose')}
            aria-label={t('home.sosButton') ?? 'SOS'}
            className="relative h-20 w-20 shrink-0 flex items-center justify-center active:scale-95 transition-transform"
          >
            <span className="absolute inset-0 rounded-full bg-emergency animate-pulse-ring" />
            <span className="absolute inset-0 rounded-full bg-emergency/90 animate-heartbeat" />
            <span className="relative h-16 w-16 rounded-full bg-emergency flex items-center justify-center text-white font-bold text-lg shadow-floating border-2 border-white/40">
              {t('home.sosButton')}
            </span>
          </button>
        </div>

        <div className="relative z-10 flex gap-2 mt-4 text-[11px] text-white/70">
          <span className="flex items-center gap-1"><Phone size={11} /> {t('sos.optionGuardianTitle')}</span>
          <span className="opacity-50">·</span>
          <span className="flex items-center gap-1"><ShieldAlert size={11} /> {t('sos.optionServicesTitle')}</span>
        </div>
      </div>

      {/* Step 1: choose which SOS option */}
      <Dialog open={step === 'choose'} onClose={close} title={t('sos.chooseTitle') ?? ''}>
        <p className="text-sm text-muted-foreground mb-4">{t('sos.chooseBody')}</p>
        <div className="space-y-3">
          <button
            onClick={() => setStep('confirmGuardian')}
            className="w-full flex items-center gap-3 rounded-2xl border-2 border-border bg-surface p-4 text-left active:scale-[0.98] transition-transform"
          >
            <div className="h-11 w-11 rounded-xl bg-primary-50 dark:bg-primary/15 text-primary flex items-center justify-center shrink-0">
              <Phone size={20} />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-sm">{t('sos.optionGuardianTitle')}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{t('sos.optionGuardianBody')}</p>
            </div>
            <ChevronRight size={18} className="text-muted-foreground shrink-0" />
          </button>

          <button
            onClick={() => setStep('confirmServices')}
            className="w-full flex items-center gap-3 rounded-2xl border-2 border-border bg-surface p-4 text-left active:scale-[0.98] transition-transform"
          >
            <div className="h-11 w-11 rounded-xl bg-emergency-50 dark:bg-emergency/15 text-emergency flex items-center justify-center shrink-0">
              <ShieldAlert size={20} />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-sm">{t('sos.optionServicesTitle')}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{t('sos.optionServicesBody')}</p>
            </div>
            <ChevronRight size={18} className="text-muted-foreground shrink-0" />
          </button>
        </div>
      </Dialog>

      {/* Step 2a: confirm guardian alert */}
      <Dialog open={step === 'confirmGuardian'} onClose={close} title={guardian ? (t('sos.confirmGuardianTitle', { name: guardian.name }) ?? '') : (t('sos.noGuardianTitle') ?? '')}>
        {!guardian ? (
          <>
            <p className="text-sm text-muted-foreground mb-5">{t('sos.noGuardianBody')}</p>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={close}>
                {t('common.cancel')}
              </Button>
              <Button className="flex-1" onClick={() => { close(); navigate('/guardians/add') }}>
                {t('sos.addGuardian')}
              </Button>
            </div>
          </>
        ) : (
          <>
            <p className="text-sm text-muted-foreground mb-5">{t('sos.confirmGuardianBody', { name: guardian.name })}</p>
            <div className="grid grid-cols-3 gap-2 mb-5 text-center">
              <div className="rounded-xl bg-muted p-2.5 flex flex-col items-center gap-1">
                <Phone size={16} className="text-primary" />
                <span className="text-[11px] text-muted-foreground">{t('common.call')}</span>
              </div>
              <div className="rounded-xl bg-muted p-2.5 flex flex-col items-center gap-1">
                <MessageSquare size={16} className="text-primary" />
                <span className="text-[11px] text-muted-foreground">SMS</span>
              </div>
              <div className="rounded-xl bg-muted p-2.5 flex flex-col items-center gap-1">
                <MapPin size={16} className="text-primary" />
                <span className="text-[11px] text-muted-foreground">{t('emergency.locationShared')}</span>
              </div>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={close} disabled={sending}>
                {t('common.cancel')}
              </Button>
              <Button variant="emergency" className="flex-1" onClick={runGuardianAlert} isLoading={sending}>
                {sending ? t('sos.sending') : t('sos.activate')}
              </Button>
            </div>
          </>
        )}
      </Dialog>

      {/* Step 2b: confirm nearby services lookup */}
      <Dialog open={step === 'confirmServices'} onClose={close} title={t('sos.confirmServicesTitle') ?? ''}>
        <p className="text-sm text-muted-foreground mb-5">{t('sos.confirmServicesBody')}</p>
        <div className="flex gap-3">
          <Button variant="outline" className="flex-1" onClick={close} disabled={sending}>
            {t('common.cancel')}
          </Button>
          <Button variant="emergency" className="flex-1" onClick={runServicesLookup} isLoading={sending}>
            {sending ? t('sos.sending') : t('sos.activate')}
          </Button>
        </div>
      </Dialog>

      {/* Step 3a: guardian alert result */}
      <Dialog open={step === 'resultGuardian'} onClose={close} title={t('sos.sentTitle') ?? ''}>
        {result && guardian && (
          <>
            <div className="space-y-2.5 mb-5">
              <ResultRow ok={result.callStatus === 'success'} okLabel={t('sos.callInitiated')} failLabel={t('sos.callUnavailable')} />
              <ResultRow ok={result.smsStatus === 'success'} okLabel={t('sos.smsDrafted')} failLabel={t('sos.smsUnavailable')} />
              <ResultRow ok={result.notificationStatus === 'success'} okLabel={t('sos.notificationSent')} failLabel={t('sos.notificationSent')} />
              <ResultRow ok={result.locationStatus === 'success'} okLabel={t('sos.locationShared')} failLabel={t('sos.locationUnavailable')} />
            </div>
            <div className="flex gap-2 mb-4">
              <Button variant="outline" className="flex-1" onClick={() => window.open(`tel:${guardian.phone}`)}>
                <Phone size={14} /> {t('common.call')}
              </Button>
              <Button variant="outline" className="flex-1" onClick={() => window.open(`sms:${guardian.phone}`)}>
                <MessageSquare size={14} /> SMS
              </Button>
            </div>
            <Button className="w-full" onClick={close}>{t('sos.done')}</Button>
          </>
        )}
      </Dialog>

      {/* Step 3b: nearby services result */}
      <Dialog open={step === 'resultServices'} onClose={close} title={t('sos.servicesFoundTitle') ?? ''}>
        <p className="text-xs text-muted-foreground mb-4">{t('sos.servicesFoundBody')}</p>
        <div className="space-y-2.5 mb-4 max-h-[340px] overflow-y-auto">
          {nearby.map((f) => (
            <div key={f.id} className="rounded-2xl border border-border bg-surface p-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <div className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 ${f.kind === 'police' ? 'bg-info-50 text-info-600 dark:bg-info/15' : 'bg-emergency-50 text-emergency dark:bg-emergency/15'}`}>
                    {f.kind === 'police' ? <ShieldAlert size={15} /> : <Building2 size={15} />}
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-sm truncate">{f.name}</p>
                    <p className="text-[11px] text-muted-foreground">{f.kind === 'police' ? t('sos.police') : t('sos.hospital')} · {f.distanceKm} km</p>
                  </div>
                </div>
              </div>
              <p className="text-[11px] text-muted-foreground mt-1.5 truncate">{f.address}</p>
              <div className="flex gap-2 mt-2">
                <Button size="sm" variant="outline" className="flex-1" onClick={() => window.open(`tel:${f.phone}`)}>
                  <Phone size={12} /> {t('common.call')}
                </Button>
                <Button size="sm" variant="secondary" className="flex-1" onClick={() => window.open(`https://www.openstreetmap.org/directions?to=${f.lat},${f.lng}`, '_blank')}>
                  <Navigation2 size={12} /> {t('common.directions')}
                </Button>
              </div>
            </div>
          ))}
        </div>
        <Button className="w-full" onClick={close}>{t('sos.done')}</Button>
      </Dialog>
    </>
  )
}

function ResultRow({ ok, okLabel, failLabel }: { ok: boolean; okLabel: string; failLabel: string }) {
  return (
    <div className="flex items-center gap-2.5 text-sm">
      {ok ? <CheckCircle2 size={17} className="text-success shrink-0" /> : <AlertTriangle size={17} className="text-warning shrink-0" />}
      <span className={ok ? 'font-medium' : 'text-muted-foreground'}>{ok ? okLabel : failLabel}</span>
    </div>
  )
}
