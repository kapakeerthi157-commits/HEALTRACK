import { useEffect, useRef, useState, type KeyboardEvent, type ClipboardEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useAuth } from '@/context/AuthContext'

const LENGTH = 4
const RESEND_SECONDS = 30

export function OTP() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { pendingPhone, pendingRole, verifyOtp, requestOtp } = useAuth()
  const [digits, setDigits] = useState<string[]>(Array(LENGTH).fill(''))
  const [error, setError] = useState<string | null>(null)
  const [verifying, setVerifying] = useState(false)
  const [success, setSuccess] = useState(false)
  const [countdown, setCountdown] = useState(RESEND_SECONDS)
  const inputRefs = useRef<Array<HTMLInputElement | null>>([])

  useEffect(() => {
    if (!pendingPhone) {
      navigate('/login', { replace: true })
    }
  }, [pendingPhone, navigate])

  useEffect(() => {
    if (countdown <= 0) return
    const timer = setInterval(() => setCountdown((c) => c - 1), 1000)
    return () => clearInterval(timer)
  }, [countdown])

  const handleChange = (index: number, value: string) => {
    const clean = value.replace(/\D/g, '')
    if (!clean) {
      const next = [...digits]
      next[index] = ''
      setDigits(next)
      return
    }
    const next = [...digits]
    next[index] = clean[clean.length - 1]
    setDigits(next)
    if (index < LENGTH - 1) inputRefs.current[index + 1]?.focus()
  }

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, LENGTH)
    if (!pasted) return
    e.preventDefault()
    const next = Array(LENGTH).fill('')
    pasted.split('').forEach((d, i) => (next[i] = d))
    setDigits(next)
    inputRefs.current[Math.min(pasted.length, LENGTH - 1)]?.focus()
  }

  const otpValue = digits.join('')

  useEffect(() => {
    if (otpValue.length !== LENGTH) return
    setVerifying(true)
    setError(null)
    const timer = setTimeout(() => {
      const result = verifyOtp(otpValue)
      setVerifying(false)
      if (!result.ok) {
        setError(result.error ?? null)
        setDigits(Array(LENGTH).fill(''))
        inputRefs.current[0]?.focus()
        return
      }
      setSuccess(true)
      const destination = pendingRole === 'guardian' ? '/guardian' : '/onboarding/welcome'
      setTimeout(() => navigate(destination, { replace: true }), 900)
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, 500)
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [otpValue])

  const handleResend = () => {
    if (countdown > 0 || !pendingPhone) return
    requestOtp(pendingPhone)
    setCountdown(RESEND_SECONDS)
    setDigits(Array(LENGTH).fill(''))
    setError(null)
    inputRefs.current[0]?.focus()
  }

  if (success) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-background animate-fade-in">
        <div className="h-20 w-20 rounded-full bg-success-50 dark:bg-success/15 flex items-center justify-center animate-scale-in">
          <CheckCircle2 className="text-success" size={40} />
        </div>
        <p className="font-semibold text-lg">{t('auth.verified')}</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col px-6 pt-16 bg-background">
      <h1 className="text-2xl font-bold">{t('auth.otpTitle')}</h1>
      <p className="text-sm text-muted-foreground mt-2">{t('auth.otpSubtitle', { phone: pendingPhone })}</p>

      <div className="flex justify-between gap-3 mt-8">
        {digits.map((d, i) => (
          <input
            key={i}
            ref={(el) => (inputRefs.current[i] = el)}
            value={d}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            onPaste={handlePaste}
            inputMode="numeric"
            maxLength={1}
            autoFocus={i === 0}
            className="h-16 w-16 text-center text-2xl font-bold rounded-2xl border-2 border-border bg-surface focus:border-primary focus:outline-none shadow-soft transition-colors"
          />
        ))}
      </div>

      {error && <p className="text-emergency text-sm mt-4 text-center">{t(error)}</p>}
      {verifying && <p className="text-muted-foreground text-sm mt-4 text-center">{t('common.loading')}</p>}

      <div className="flex items-center justify-between mt-8">
        <button
          onClick={() => {
            resetPendingPhone()
            navigate('/login')
          }}
          className="text-sm font-medium text-primary"
        >
          {t('auth.editNumber')}
        </button>
        <button
          onClick={handleResend}
          disabled={countdown > 0}
          className="text-sm font-medium text-primary disabled:text-muted-foreground"
        >
          {countdown > 0 ? t('auth.resendIn', { seconds: countdown }) : t('auth.resendOtp')}
        </button>
      </div>

      <p className="text-center text-[11px] text-muted-foreground/70 mt-auto mb-8">{t('auth.demoHint')}</p>
    </div>
  )
}
