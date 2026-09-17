import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { HeartPulse } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'

export function Splash() {
  const navigate = useNavigate()
  const { isAuthenticated, hasOnboarded } = useAuth()
  const [fadeOut, setFadeOut] = useState(false)

  useEffect(() => {
    const fadeTimer = setTimeout(() => setFadeOut(true), 1400)
    const navTimer = setTimeout(() => {
      if (isAuthenticated && hasOnboarded) navigate('/home', { replace: true })
      else if (isAuthenticated) navigate('/onboarding/welcome', { replace: true })
      else navigate('/login', { replace: true })
    }, 1800)
    return () => {
      clearTimeout(fadeTimer)
      clearTimeout(navTimer)
    }
  }, [isAuthenticated, hasOnboarded, navigate])

  return (
    <div
      className={`min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-primary-900 via-primary-700 to-primary-600 text-white transition-opacity duration-500 ${
        fadeOut ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <div className="relative flex items-center justify-center mb-6">
        <span className="absolute h-24 w-24 rounded-full bg-white/20 animate-pulse-ring" />
        <div className="h-20 w-20 rounded-3xl bg-white/15 backdrop-blur flex items-center justify-center animate-heartbeat">
          <HeartPulse size={38} strokeWidth={2} />
        </div>
      </div>
      <h1 className="text-2xl font-bold tracking-tight">HealTrack</h1>
      <p className="text-sm text-white/70 mt-1.5">Smart Emergency Healthcare</p>
    </div>
  )
}
