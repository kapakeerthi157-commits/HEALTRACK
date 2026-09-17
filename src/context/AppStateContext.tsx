import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { loadState, saveState } from '@/lib/storage'
import { uid } from '@/lib/utils'
import { NOTIFICATIONS_SEED } from '@/lib/mockData'
import type {
  AmbulanceBooking,
  AmbulanceType,
  Appointment,
  AppNotification,
  EmergencyContact,
  Guardian,
  HealthMetric,
  InsuranceInfo,
  LocationState,
  MedicalHistoryEntry,
  SOSEvent,
  UserProfile
} from '@/types'

interface EmergencyState {
  active: boolean
  startedAt: number | null
  locationShared: boolean
  guardianNotified: boolean
  ambulanceRequested: boolean
}

interface AppState {
  profile: UserProfile
  guardians: Guardian[]
  emergencyContacts: EmergencyContact[]
  appointments: Appointment[]
  ambulanceBookings: AmbulanceBooking[]
  medicalHistory: MedicalHistoryEntry[]
  healthMetrics: HealthMetric[]
  insurance: InsuranceInfo | null
  notifications: AppNotification[]
  emergency: EmergencyState
  guardianMode: boolean
  location: LocationState
  sosEvents: SOSEvent[]
}

const DEFAULT_PROFILE: UserProfile = {
  id: 'u1',
  name: 'Venu Kumar',
  phone: '9876543210',
  age: 21,
  bloodGroup: 'O+',
  avatarInitials: 'VK',
  allergies: [],
  conditions: [],
  emergencyContactName: null,
  emergencyContactPhone: null
}

const DEFAULT_HEALTH_METRICS: HealthMetric[] = [
  { key: 'heartRate', value: null, unit: 'bpm', updatedAt: null },
  { key: 'bloodPressure', value: null, unit: 'mmHg', updatedAt: null },
  { key: 'temperature', value: null, unit: '°F', updatedAt: null },
  { key: 'weight', value: null, unit: 'kg', updatedAt: null }
]

const DEFAULT_STATE: AppState = {
  profile: DEFAULT_PROFILE,
  guardians: [],
  emergencyContacts: [],
  appointments: [],
  ambulanceBookings: [],
  medicalHistory: [],
  healthMetrics: DEFAULT_HEALTH_METRICS,
  insurance: null,
  notifications: NOTIFICATIONS_SEED,
  emergency: { active: false, startedAt: null, locationShared: false, guardianNotified: false, ambulanceRequested: false },
  guardianMode: false,
  location: { lat: null, lng: null, accuracy: null, label: null, status: 'idle', updatedAt: null },
  sosEvents: []
}

interface AppStateContextValue extends AppState {
  updateProfile: (patch: Partial<UserProfile>) => void
  addGuardian: (g: Omit<Guardian, 'id' | 'accessGranted'>) => boolean
  removeGuardian: (id: string) => void
  addEmergencyContact: (c: Omit<EmergencyContact, 'id'>) => void
  removeEmergencyContact: (id: string) => void
  addAppointment: (a: Omit<Appointment, 'id' | 'status'>) => void
  cancelAppointment: (id: string) => void
  requestAmbulance: (type: AmbulanceType, pickup: string, destination: string) => AmbulanceBooking
  advanceAmbulance: (id: string) => void
  cancelAmbulance: (id: string) => void
  startEmergency: () => void
  endEmergency: () => void
  setGuardianMode: (v: boolean) => void
  markNotificationRead: (id: string) => void
  markAllNotificationsRead: () => void
  clearAllNotifications: () => void
  detectLocation: () => void
  setInsurance: (i: InsuranceInfo) => void
  pushNotification: (n: Pick<AppNotification, 'type' | 'title' | 'message'>) => void
  logSOSEvent: (e: Omit<SOSEvent, 'id'>) => SOSEvent
}

const AppStateContext = createContext<AppStateContextValue | undefined>(undefined)

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(() => loadState('appstate', DEFAULT_STATE))

  useEffect(() => {
    saveState('appstate', state)
  }, [state])

  const patch = (p: Partial<AppState>) => setState((prev) => ({ ...prev, ...p }))

  const updateProfile: AppStateContextValue['updateProfile'] = (p) =>
    setState((prev) => ({ ...prev, profile: { ...prev.profile, ...p } }))

  const addGuardian: AppStateContextValue['addGuardian'] = (g) => {
    if (state.guardians.length >= 2) return false
    const guardian: Guardian = { ...g, id: uid('grd'), accessGranted: true }
    setState((prev) => ({ ...prev, guardians: [...prev.guardians, guardian] }))
    return true
  }

  const removeGuardian: AppStateContextValue['removeGuardian'] = (id) =>
    setState((prev) => ({ ...prev, guardians: prev.guardians.filter((g) => g.id !== id) }))

  const addEmergencyContact: AppStateContextValue['addEmergencyContact'] = (c) =>
    setState((prev) => ({ ...prev, emergencyContacts: [...prev.emergencyContacts, { ...c, id: uid('ec') }] }))

  const removeEmergencyContact: AppStateContextValue['removeEmergencyContact'] = (id) =>
    setState((prev) => ({ ...prev, emergencyContacts: prev.emergencyContacts.filter((c) => c.id !== id) }))

  const addAppointment: AppStateContextValue['addAppointment'] = (a) =>
    setState((prev) => ({
      ...prev,
      appointments: [{ ...a, id: uid('appt'), status: 'upcoming' }, ...prev.appointments]
    }))

  const cancelAppointment: AppStateContextValue['cancelAppointment'] = (id) =>
    setState((prev) => ({
      ...prev,
      appointments: prev.appointments.map((a) => (a.id === id ? { ...a, status: 'cancelled' } : a))
    }))

  const requestAmbulance: AppStateContextValue['requestAmbulance'] = (type, pickup, destination) => {
    const drivers = [
      { name: 'Suresh Reddy', vehicle: 'TS 09 EA 4521' },
      { name: 'Naveen Kumar', vehicle: 'TS 07 FB 7788' },
      { name: 'Ravi Teja', vehicle: 'TS 10 GH 3390' }
    ]
    const d = drivers[Math.floor(Math.random() * drivers.length)]
    const booking: AmbulanceBooking = {
      id: uid('amb'),
      type,
      pickup,
      destination,
      status: 'requested',
      driverName: d.name,
      vehicleNumber: d.vehicle,
      etaMinutes: 8 + Math.floor(Math.random() * 7),
      createdAt: Date.now()
    }
    setState((prev) => ({ ...prev, ambulanceBookings: [booking, ...prev.ambulanceBookings] }))
    return booking
  }

  const advanceAmbulance: AppStateContextValue['advanceAmbulance'] = (id) => {
    const order: AmbulanceBooking['status'][] = ['requested', 'assigned', 'on_the_way', 'arrived', 'completed']
    setState((prev) => ({
      ...prev,
      ambulanceBookings: prev.ambulanceBookings.map((b) => {
        if (b.id !== id) return b
        const idx = order.indexOf(b.status)
        const next = order[Math.min(idx + 1, order.length - 1)]
        return { ...b, status: next }
      })
    }))
  }

  const cancelAmbulance: AppStateContextValue['cancelAmbulance'] = (id) =>
    setState((prev) => ({
      ...prev,
      ambulanceBookings: prev.ambulanceBookings.map((b) => (b.id === id ? { ...b, status: 'cancelled' } : b))
    }))

  const startEmergency = () =>
    setState((prev) => ({
      ...prev,
      emergency: { active: true, startedAt: Date.now(), locationShared: true, guardianNotified: prev.guardians.length > 0, ambulanceRequested: true }
    }))

  const endEmergency = () =>
    setState((prev) => ({
      ...prev,
      emergency: { active: false, startedAt: null, locationShared: false, guardianNotified: false, ambulanceRequested: false }
    }))

  const setGuardianMode = (v: boolean) => patch({ guardianMode: v })

  const markNotificationRead: AppStateContextValue['markNotificationRead'] = (id) =>
    setState((prev) => ({
      ...prev,
      notifications: prev.notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
    }))

  const markAllNotificationsRead = () =>
    setState((prev) => ({ ...prev, notifications: prev.notifications.map((n) => ({ ...n, read: true })) }))

  const clearAllNotifications = () => setState((prev) => ({ ...prev, notifications: [] }))

  const setInsurance: AppStateContextValue['setInsurance'] = (i) => patch({ insurance: i })

  const pushNotification: AppStateContextValue['pushNotification'] = (n) =>
    setState((prev) => ({
      ...prev,
      notifications: [
        { ...n, id: uid('notif'), timestamp: Date.now(), read: false, group: 'today' },
        ...prev.notifications
      ]
    }))

  const logSOSEvent: AppStateContextValue['logSOSEvent'] = (e) => {
    const event: SOSEvent = { ...e, id: uid('sos') }
    setState((prev) => ({ ...prev, sosEvents: [event, ...prev.sosEvents] }))
    return event
  }

  const detectLocation = () => {
    setState((prev) => ({ ...prev, location: { ...prev.location, status: 'loading' } }))
    if (!navigator.geolocation) {
      setState((prev) => ({ ...prev, location: { ...prev.location, status: 'error' } }))
      return
    }
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude, accuracy } = pos.coords
        let label = 'Your current location'
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`
          )
          const data = await res.json()
          label = data.address
            ? [data.address.suburb || data.address.neighbourhood, data.address.city || data.address.town]
                .filter(Boolean)
                .join(', ') || data.display_name
            : label
        } catch {
          // reverse geocoding failed — keep the fallback label, coordinates are still accurate
        }
        setState((prev) => ({
          ...prev,
          location: { lat: latitude, lng: longitude, accuracy: Math.round(accuracy), label, status: 'ready', updatedAt: Date.now() }
        }))
      },
      () => {
        setState((prev) => ({ ...prev, location: { ...prev.location, status: 'error' } }))
      },
      { enableHighAccuracy: true, timeout: 10000 }
    )
  }

  return (
    <AppStateContext.Provider
      value={{
        ...state,
        updateProfile,
        addGuardian,
        removeGuardian,
        addEmergencyContact,
        removeEmergencyContact,
        addAppointment,
        cancelAppointment,
        requestAmbulance,
        advanceAmbulance,
        cancelAmbulance,
        startEmergency,
        endEmergency,
        setGuardianMode,
        markNotificationRead,
        markAllNotificationsRead,
        clearAllNotifications,
        detectLocation,
        setInsurance,
        pushNotification,
        logSOSEvent
      }}
    >
      {children}
    </AppStateContext.Provider>
  )
}

export function useAppState() {
  const ctx = useContext(AppStateContext)
  if (!ctx) throw new Error('useAppState must be used within AppStateProvider')
  return ctx
}
