import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ShieldCheck, HeartPulse, Phone, Shield } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useAuth, type UserRole } from '@/context/AuthContext'
import { cn } from '@/lib/utils'

export function Login() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { requestOtp } = useAuth()
  const [role, setRole] = useState<'user' | 'guardian'>('user')
  const [phone, setPhone] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setTimeout(() => {
      const result = requestOtp(phone, role as UserRole)
      setSubmitting(false)
      if (!result.ok) {
        setError(result.error ?? null)
        return
      }
      setError(null)
      navigate('/otp')
    }, 400)
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-primary-50 to-background dark:from-primary-900/40 dark:to-background">
      <div className="relative pt-14 pb-8 px-6 flex flex-col items-center">
        <div className="absolute top-4 left-4 z-30 flex items-center rounded-full border border-border bg-surface/95 p-1 shadow-soft backdrop-blur-sm">
          <button
            type="button"
            onClick={() => {
              setRole('user')
              setError(null)
            }}
            className={cn(
              'px-3 py-1.5 rounded-full text-xs font-semibold transition-colors',
              role === 'user' ? 'bg-primary text-white' : 'text-muted-foreground hover:bg-muted'
            )}
            aria-pressed={role === 'user'}
          >
            {t('auth.userLogin')}
          </button>
          <button
            type="button"
            onClick={() => {
              setRole('guardian')
              setError(null)
            }}
            className={cn(
              'px-3 py-1.5 rounded-full text-xs font-semibold transition-colors',
              role === 'guardian' ? 'bg-primary text-white' : 'text-muted-foreground hover:bg-muted'
            )}
            aria-pressed={role === 'guardian'}
          >
            {t('auth.guardianLogin')}
          </button>
        </div>
        <button
          type="button"
          onClick={() => navigate('/admin/login')}
          className="absolute top-4 right-4 z-30 inline-flex items-center gap-1.5 rounded-full border border-border bg-surface/95 px-3 py-2 text-xs font-semibold shadow-soft hover:bg-muted transition-colors"
          aria-label={t('auth.adminLogin')}
        >
          <Shield size={14} className="text-primary" />
          {t('auth.admin')}
        </button>
        <div className="absolute inset-x-0 top-0 z-0 h-56 bg-primary-600/10 dark:bg-primary/10 rounded-b-[3rem] pointer-events-none" />
        <div className="relative h-16 w-16 rounded-2xl bg-primary flex items-center justify-center shadow-card mb-4">
          <HeartPulse className="text-white" size={30} />
        </div>
        <h1 className="relative text-2xl font-bold text-center">{t('auth.welcomeBack')}</h1>
        <p className="relative text-sm text-muted-foreground text-center mt-2 max-w-[300px]">{t('auth.subtitle')}</p>
      </div>

      <form onSubmit={onSubmit} className="flex-1 px-6 flex flex-col animate-fade-in">
        <label className="text-sm font-medium mb-2 text-foreground/80">{t('auth.phonePlaceholder')}</label>
        <div className="flex items-center gap-2 rounded-2xl border border-border bg-surface px-4 h-14 shadow-soft focus-within:ring-2 focus-within:ring-primary/40">
          <span className="text-sm font-semibold text-muted-foreground border-r border-border pr-3">+91</span>
          <Phone size={18} className="text-muted-foreground" />
          <input
            inputMode="numeric"
            maxLength={10}
            placeholder={t('auth.phonePlaceholder') ?? ''}
            value={phone}
            onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
            className="flex-1 bg-transparent outline-none text-base tracking-wide placeholder:text-muted-foreground/60"
          />
        </div>
        {error && <p className="text-emergency text-sm mt-2">{t(error)}</p>}

        <Button type="submit" size="lg" className="mt-6 w-full" disabled={phone.length !== 10} isLoading={submitting}>
          {t('common.continue')}
        </Button>

        <div className="flex items-center justify-center gap-2 mt-6 text-xs text-muted-foreground">
          <ShieldCheck size={14} />
          <span>{t('auth.trustMessage')}</span>
        </div>

        <p className="text-center text-[11px] text-muted-foreground/70 mt-auto mb-8">
          {t('auth.demoHint')}<br />
          {role === 'guardian' ? t('auth.guardianDemo') : t('auth.userDemo')}
        </p>
      </form>
    </div>
  )
}

