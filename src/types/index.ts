export type BloodGroup = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-'

export interface UserProfile {
  id: string
  name: string
  phone: string
  age: number | null
  bloodGroup: BloodGroup | null
  avatarInitials: string
  allergies: string[]
  conditions: string[]
  emergencyContactName: string | null
  emergencyContactPhone: string | null
}

export interface Guardian {
  id: string
  name: string
  phone: string
  relationship: string
  accessGranted: boolean
}

export interface EmergencyContact {
  id: string
  name: string
  phone: string
  relationship: string
}

export interface Hospital {
  id: string
  name: string
  distanceKm: number
  rating: number
  specializations: string[]
  isOpen: boolean
  bedsAvailable: number | null
  phone: string
  address: string
  hours: string
  emergencyAvailable: boolean
  lat: number
  lng: number
}

export interface Doctor {
  id: string
  name: string
  specialty: string
  hospitalId: string
  initials: string
  experienceYears: number
}

export interface Appointment {
  id: string
  doctorId: string
  hospitalId: string
  date: string
  time: string
  reason: string
  status: 'upcoming' | 'completed' | 'cancelled'
}

export type AmbulanceType = 'basic' | 'advanced' | 'icu'

export interface AmbulanceBooking {
  id: string
  type: AmbulanceType
  pickup: string
  destination: string
  status: 'requested' | 'assigned' | 'on_the_way' | 'arrived' | 'completed' | 'cancelled'
  driverName: string
  vehicleNumber: string
  etaMinutes: number
  createdAt: number
}

export interface MedicalHistoryEntry {
  id: string
  year: string
  title: string
  status: 'Completed' | 'Ongoing'
  icon: 'checkup' | 'allergy' | 'surgery' | 'vaccination'
}

export interface HealthMetric {
  key: 'heartRate' | 'bloodPressure' | 'temperature' | 'weight'
  value: string | null
  unit: string
  updatedAt: string | null
}

export interface InsuranceInfo {
  provider: string
  policyNumber: string
  policyHolder: string
  status: 'Active' | 'Expired'
  validUntil: string
}

export interface AppNotification {
  id: string
  type: 'emergency' | 'appointment' | 'hospital' | 'general'
  title: string
  message: string
  timestamp: number
  read: boolean
  group: 'today' | 'earlier'
}

export interface LocationState {
  lat: number | null
  lng: number | null
  accuracy: number | null
  label: string | null
  status: 'idle' | 'loading' | 'ready' | 'error'
  updatedAt: number | null
}

export interface PoliceStation {
  id: string
  name: string
  distanceKm: number
  phone: string
  address: string
  lat: number
  lng: number
}

export type NearbyFacility = (
  | ({ kind: 'hospital' } & Pick<Hospital, 'id' | 'name' | 'distanceKm' | 'phone' | 'address' | 'lat' | 'lng'>)
  | ({ kind: 'police' } & Pick<PoliceStation, 'id' | 'name' | 'distanceKm' | 'phone' | 'address' | 'lat' | 'lng'>)
)

export type SOSActionStatus = 'success' | 'unavailable' | 'skipped'

export interface SOSEvent {
  id: string
  type: 'guardian' | 'services'
  timestamp: number
  lat: number | null
  lng: number | null
  accuracy: number | null
  guardianName: string | null
  guardianPhone: string | null
  callStatus: SOSActionStatus
  smsStatus: SOSActionStatus
  notificationStatus: SOSActionStatus
  locationStatus: SOSActionStatus
  serviceLookupStatus: SOSActionStatus
  overallStatus: 'sent' | 'partial' | 'failed'
}
