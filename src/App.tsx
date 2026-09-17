import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider, useAuth } from '@/context/AuthContext'
import { ThemeProvider } from '@/context/ThemeContext'
import { AppStateProvider } from '@/context/AppStateContext'
import { ToastProvider } from '@/components/ui/Toast'
import { BottomNav } from '@/components/BottomNav'
import { Splash } from '@/pages/Splash'
import { Login } from '@/pages/Login'
import { OTP } from '@/pages/OTP'
import { Welcome } from '@/pages/onboarding/Welcome'
import { LanguageSelect } from '@/pages/onboarding/LanguageSelect'
import { LocationPermission } from '@/pages/onboarding/LocationPermission'
import { Home } from '@/pages/Home'
import { Search } from '@/pages/Search'
import { HospitalList } from '@/pages/hospitals/HospitalList'
import { HospitalDetail } from '@/pages/hospitals/HospitalDetail'
import { BookAppointment } from '@/pages/appointments/BookAppointment'
import { AppointmentList } from '@/pages/appointments/AppointmentList'
import { BookAmbulance } from '@/pages/ambulance/BookAmbulance'
import { TrackAmbulance } from '@/pages/ambulance/TrackAmbulance'
import { EmergencyActive } from '@/pages/emergency/EmergencyActive'
import { GuardianList } from '@/pages/guardians/GuardianList'
import { AddGuardian } from '@/pages/guardians/AddGuardian'
import { Profile } from '@/pages/profile/Profile'
import { EditProfile } from '@/pages/profile/EditProfile'
import { MedicalHistory } from '@/pages/profile/MedicalHistory'
import { HealthData } from '@/pages/profile/HealthData'
import { Insurance } from '@/pages/profile/Insurance'
import { EmergencyContacts } from '@/pages/profile/EmergencyContacts'
import { MedicalIdCard } from '@/pages/profile/MedicalIdCard'
import { Settings } from '@/pages/profile/Settings'
import { Notifications } from '@/pages/Notifications'
import { GuardianDashboard } from '@/pages/GuardianDashboard'
import { GuardianEmergency } from '@/pages/GuardianEmergency'
import { AdminLogin } from '@/pages/AdminLogin'
import { AdminDashboard } from '@/pages/AdminDashboard'
import { LanguageSettings } from '@/pages/profile/LanguageSettings'
import { SettingsInfo } from '@/pages/profile/SettingsInfo'
import type { ReactNode } from 'react'

function RequireAuth({ children }: { children: ReactNode }) {
  const { isAuthenticated, hasOnboarded, role } = useAuth()
  if (!isAuthenticated) return <Navigate to="/login" replace />
  if (role === 'guardian') return <Navigate to="/guardian" replace />
  if (role === 'admin') return <Navigate to="/admin" replace />
  if (!hasOnboarded) return <Navigate to="/onboarding/welcome" replace />
  return <>{children}</>
}

function RequireRole({ role: requiredRole, children }: { role: 'guardian' | 'admin'; children: ReactNode }) {
  const { isAuthenticated, role } = useAuth()
  if (!isAuthenticated) return <Navigate to={requiredRole === 'admin' ? '/admin/login' : '/login'} replace />
  if (role !== requiredRole) {
    if (role === 'admin') return <Navigate to="/admin" replace />
    if (role === 'guardian') return <Navigate to="/guardian" replace />
    return <Navigate to="/home" replace />
  }
  return <>{children}</>
}

function TabLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <div className="pb-24">{children}</div>
      <BottomNav />
    </>
  )
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Splash />} />
      <Route path="/login" element={<Login />} />
      <Route path="/otp" element={<OTP />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin" element={<RequireRole role="admin"><AdminDashboard /></RequireRole>} />
      <Route path="/guardian" element={<RequireRole role="guardian"><GuardianDashboard /></RequireRole>} />
      <Route path="/guardian/emergency" element={<RequireRole role="guardian"><GuardianEmergency /></RequireRole>} />
      <Route path="/onboarding/welcome" element={<Welcome />} />
      <Route path="/onboarding/language" element={<LanguageSelect />} />
      <Route path="/onboarding/location" element={<LocationPermission />} />

      <Route path="/home" element={<RequireAuth><TabLayout><Home /></TabLayout></RequireAuth>} />
      <Route path="/search" element={<RequireAuth><Search /></RequireAuth>} />
      <Route path="/hospitals" element={<RequireAuth><TabLayout><HospitalList /></TabLayout></RequireAuth>} />
      <Route path="/hospitals/:id" element={<RequireAuth><HospitalDetail /></RequireAuth>} />
      <Route path="/appointments" element={<RequireAuth><TabLayout><AppointmentList /></TabLayout></RequireAuth>} />
      <Route path="/appointments/book" element={<RequireAuth><BookAppointment /></RequireAuth>} />
      <Route path="/ambulance/book" element={<RequireAuth><BookAmbulance /></RequireAuth>} />
      <Route path="/ambulance/track/:id" element={<RequireAuth><TrackAmbulance /></RequireAuth>} />
      <Route path="/emergency" element={<RequireAuth><TabLayout><EmergencyActive /></TabLayout></RequireAuth>} />
      <Route path="/guardians" element={<RequireAuth><GuardianList /></RequireAuth>} />
      <Route path="/guardians/add" element={<RequireAuth><AddGuardian /></RequireAuth>} />
      <Route path="/profile" element={<RequireAuth><TabLayout><Profile /></TabLayout></RequireAuth>} />
      <Route path="/profile/edit" element={<RequireAuth><EditProfile /></RequireAuth>} />
      <Route path="/profile/medical-history" element={<RequireAuth><MedicalHistory /></RequireAuth>} />
      <Route path="/profile/health-data" element={<RequireAuth><HealthData /></RequireAuth>} />
      <Route path="/profile/insurance" element={<RequireAuth><Insurance /></RequireAuth>} />
      <Route path="/profile/emergency-contacts" element={<RequireAuth><EmergencyContacts /></RequireAuth>} />
      <Route path="/profile/medical-id" element={<RequireAuth><MedicalIdCard /></RequireAuth>} />
      <Route path="/profile/settings" element={<RequireAuth><Settings /></RequireAuth>} />
      <Route path="/profile/settings/language" element={<RequireAuth><LanguageSettings /></RequireAuth>} />
      <Route path="/profile/settings/:section" element={<RequireAuth><SettingsInfo /></RequireAuth>} />
      <Route path="/notifications" element={<RequireAuth><Notifications /></RequireAuth>} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <AppStateProvider>
            <BrowserRouter>
              <AppRoutes />
            </BrowserRouter>
          </AppStateProvider>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  )
}
