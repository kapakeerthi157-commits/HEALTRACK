import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ShieldCheck, LockKeyhole, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useAuth } from '@/context/AuthContext'

export function AdminLogin() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { adminLogin } = useAuth()
  const [adminId, setAdminId] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setTimeout(() => {
      const result = adminLogin(adminId, password)
      setSubmitting(false)
      if (!result.ok) {
        setError(result.error ?? null)
        return
      }
      setError(null)
      navigate('/admin', { replace: true })
    }, 350)
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="px-4 pt-5">
        <button
          type="button"
          onClick={() => navigate('/login')}
          className="h-10 w-10 rounded-full flex items-center justify-center hover:bg-muted"
          aria-label={t('common.back')}
        >
          <ArrowLeft size={20} />
        </button>
      </header>
      <main className="flex-1 px-6 flex flex-col justify-center pb-16">
        <div className="h-16 w-16 rounded-2xl bg-primary flex items-center justify-center shadow-card mb-5">
          <ShieldCheck className="text-white" size={31} />
        </div>
        <h1 className="text-2xl font-bold">{t('auth.adminLogin')}</h1>
        <p className="text-sm text-muted-foreground mt-2">{t('auth.adminSubtitle')}</p>

        <form onSubmit={onSubmit} className="mt-8 space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">{t('auth.adminId')}</label>
            <input
              value={adminId}
              onChange={(e) => setAdminId(e.target.value)}
              autoComplete="username"
              className="w-full h-14 rounded-2xl border border-border bg-surface px-4 outline-none focus:ring-2 focus:ring-primary/40"
              placeholder={t('auth.adminIdPlaceholder') ?? ''}
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">{t('auth.password')}</label>
            <div className="flex items-center gap-2 h-14 rounded-2xl border border-border bg-surface px-4 focus-within:ring-2 focus-within:ring-primary/40">
              <LockKeyhole size={18} className="text-muted-foreground" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                className="flex-1 bg-transparent outline-none"
                placeholder={t('auth.passwordPlaceholder') ?? ''}
              />
            </div>
          </div>
          {error && <p className="text-emergency text-sm">{t(error)}</p>}
          <Button type="submit" size="lg" className="w-full" disabled={!adminId || !password} isLoading={submitting}>
            {t('auth.adminSignIn')}
          </Button>
        </form>

        <div className="mt-6 rounded-2xl bg-muted p-4 text-xs text-muted-foreground">
          <p className="font-semibold text-foreground">{t('auth.adminDemoTitle')}</p>
          <p className="mt-1">{t('auth.adminDemoCredentials')}</p>
        </div>
      </main>
    </div>
  )
}
