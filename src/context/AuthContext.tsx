import { createContext, useContext, useState, type ReactNode } from 'react'
import { loadState, saveState, clearAll } from '@/lib/storage'

const DEMO_PHONE = '9876543210'
const DEMO_OTP = '1234'
const DEMO_ADMIN_ID = 'admin'
const DEMO_ADMIN_PASSWORD = 'admin123'

export type UserRole = 'user' | 'guardian' | 'admin'

interface AuthState {
  isAuthenticated: boolean
  hasOnboarded: boolean
  phone: string | null
  role: UserRole | null
}

interface AuthContextValue extends AuthState {
  pendingPhone: string | null
  pendingRole: UserRole | null
  requestOtp: (phone: string, role?: UserRole) => { ok: boolean; error?: string }
  verifyOtp: (otp: string) => { ok: boolean; error?: string }
  adminLogin: (adminId: string, password: string) => { ok: boolean; error?: string }
  resetPendingPhone: () => void
  completeOnboarding: () => void
  logout: () => void
}

const DEFAULT_AUTH: AuthState = {
  isAuthenticated: false,
  hasOnboarded: false,
  phone: null,
  role: null
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>(() => loadState('auth', DEFAULT_AUTH))
  const [pendingPhone, setPendingPhone] = useState<string | null>(null)
  const [pendingRole, setPendingRole] = useState<UserRole | null>(null)

  const persist = (next: AuthState) => {
    setState(next)
    saveState('auth', next)
  }

  const requestOtp = (phone: string, role: UserRole = 'user') => {
    if (!/^\d{10}$/.test(phone)) {
      return { ok: false, error: 'auth.invalidPhone' }
    }
    setPendingPhone(phone)
    setPendingRole(role)
    return { ok: true }
  }

  const verifyOtp = (otp: string) => {
    if (!pendingPhone) return { ok: false, error: 'auth.invalidOtp' }
    const isValidDemo = otp === DEMO_OTP
    if (!isValidDemo) {
      return { ok: false, error: 'auth.invalidOtp' }
    }
    const role = pendingRole ?? 'user'
    persist({
      ...state,
      isAuthenticated: true,
      phone: pendingPhone,
      role,
      hasOnboarded: role === 'user' ? state.hasOnboarded : true
    })
    return { ok: true }
  }

  const adminLogin = (adminId: string, password: string) => {
    if (adminId.trim() !== DEMO_ADMIN_ID || password !== DEMO_ADMIN_PASSWORD) {
      return { ok: false, error: 'auth.invalidAdminCredentials' }
    }
    persist({
      ...state,
      isAuthenticated: true,
      hasOnboarded: true,
      phone: null,
      role: 'admin'
    })
    return { ok: true }
  }

  const resetPendingPhone = () => {
    setPendingPhone(null)
    setPendingRole(null)
  }

  const completeOnboarding = () => {
    persist({ ...state, hasOnboarded: true })
  }

  const logout = () => {
    clearAll()
    setPendingPhone(null)
    setPendingRole(null)
    setState(DEFAULT_AUTH)
  }

  return (
    <AuthContext.Provider
      value={{
        ...state,
        pendingPhone,
        pendingRole,
        requestOtp,
        verifyOtp,
        adminLogin,
        resetPendingPhone,
        completeOnboarding,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
