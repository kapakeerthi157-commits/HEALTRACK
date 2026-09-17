import type { AppNotification, Doctor, Hospital, MedicalHistoryEntry, PoliceStation } from '@/types'

export const HOSPITALS: Hospital[] = [
  {
    id: 'h1',
    name: 'Apollo Multispeciality Hospital',
    distanceKm: 1.2,
    rating: 4.6,
    specializations: ['Cardiology', 'Trauma', 'General Care'],
    isOpen: true,
    bedsAvailable: 14,
    phone: '+914023456789',
    address: 'Jubilee Hills, Hyderabad',
    hours: '24 Hours',
    emergencyAvailable: true,
    lat: 17.4326,
    lng: 78.4071
  },
  {
    id: 'h2',
    name: 'Continental Care Hospital',
    distanceKm: 2.4,
    rating: 4.3,
    specializations: ['Neurology', 'Orthopedics'],
    isOpen: true,
    bedsAvailable: 6,
    phone: '+914023459988',
    address: 'Banjara Hills, Hyderabad',
    hours: '24 Hours',
    emergencyAvailable: true,
    lat: 17.4156,
    lng: 78.4347
  },
  {
    id: 'h3',
    name: 'Sunrise Pediatric Center',
    distanceKm: 3.6,
    rating: 4.8,
    specializations: ['Pediatrics', 'General Care'],
    isOpen: false,
    bedsAvailable: 0,
    phone: '+914023441122',
    address: 'Madhapur, Hyderabad',
    hours: '8:00 AM – 9:00 PM',
    emergencyAvailable: false,
    lat: 17.4483,
    lng: 78.3915
  },
  {
    id: 'h4',
    name: 'CarePlus Pulmonology & Respiratory Institute',
    distanceKm: 4.1,
    rating: 4.1,
    specializations: ['Pulmonology', 'General Care'],
    isOpen: true,
    bedsAvailable: 9,
    phone: '+914023447722',
    address: 'Kondapur, Hyderabad',
    hours: '24 Hours',
    emergencyAvailable: true,
    lat: 17.4615,
    lng: 78.3672
  }
]

export const DOCTORS: Doctor[] = [
  { id: 'd1', name: 'Dr. Anjali Rao', specialty: 'Cardiologist', hospitalId: 'h1', initials: 'AR', experienceYears: 14 },
  { id: 'd2', name: 'Dr. Vikram Sethi', specialty: 'Trauma Surgeon', hospitalId: 'h1', initials: 'VS', experienceYears: 9 },
  { id: 'd3', name: 'Dr. Meera Iyer', specialty: 'Neurologist', hospitalId: 'h2', initials: 'MI', experienceYears: 11 },
  { id: 'd4', name: 'Dr. Kabir Nair', specialty: 'Orthopedic Surgeon', hospitalId: 'h2', initials: 'KN', experienceYears: 16 },
  { id: 'd5', name: 'Dr. Priya Desai', specialty: 'Pediatrician', hospitalId: 'h3', initials: 'PD', experienceYears: 8 }
]

export const HEALTH_CATEGORIES = [
  { key: 'cardiology', label: 'Cardiology', emoji: '❤️' },
  { key: 'trauma', label: 'Trauma', emoji: '🚑' },
  { key: 'pediatrics', label: 'Pediatrics', emoji: '👶' },
  { key: 'neurology', label: 'Neurology', emoji: '🧠' },
  { key: 'orthopedics', label: 'Orthopedics', emoji: '🦴' },
  { key: 'pulmonology', label: 'Pulmonology', emoji: '🫁' },
  { key: 'generalCare', label: 'General Care', emoji: '🩺' },
  { key: 'pharmacy', label: 'Pharmacy', emoji: '💊' }
]

export const RELATIONSHIP_OPTIONS = ['Father', 'Mother', 'Spouse', 'Brother', 'Sister', 'Friend', 'Other']

export const MEDICAL_HISTORY: MedicalHistoryEntry[] = []

export const NOTIFICATIONS_SEED: AppNotification[] = [
  {
    id: 'n1',
    type: 'appointment',
    title: 'Appointment confirmed',
    message: 'Your appointment with Dr. Anjali Rao is confirmed for tomorrow at 10:30 AM.',
    timestamp: Date.now() - 1000 * 60 * 25,
    read: false,
    group: 'today'
  },
  {
    id: 'n2',
    type: 'hospital',
    title: 'Apollo Hospital updated bed availability',
    message: '14 beds now available in the general ward.',
    timestamp: Date.now() - 1000 * 60 * 60 * 3,
    read: false,
    group: 'today'
  },
  {
    id: 'n3',
    type: 'general',
    title: 'Complete your medical profile',
    message: 'Add your allergies and conditions so guardians can access them during an emergency.',
    timestamp: Date.now() - 1000 * 60 * 60 * 30,
    read: true,
    group: 'earlier'
  }
]

export const POLICE_STATIONS: PoliceStation[] = [
  {
    id: 'p1',
    name: 'Jubilee Hills Police Station',
    distanceKm: 1.8,
    phone: '+914023544100',
    address: 'Road No. 3, Jubilee Hills, Hyderabad',
    lat: 17.4308,
    lng: 78.4102
  },
  {
    id: 'p2',
    name: 'Banjara Hills Police Station',
    distanceKm: 2.9,
    phone: '+914023544200',
    address: 'Road No. 12, Banjara Hills, Hyderabad',
    lat: 17.4139,
    lng: 78.4365
  },
  {
    id: 'p3',
    name: 'Madhapur Police Station',
    distanceKm: 4.5,
    phone: '+914023544300',
    address: 'Ayyappa Society Rd, Madhapur, Hyderabad',
    lat: 17.4476,
    lng: 78.3912
  }
]

export const AMBULANCE_TYPES: Array<{
  type: 'basic' | 'advanced' | 'icu'
  name: string
  description: string
  price: string
  eta: string
  equipment: string[]
}> = [
  {
    type: 'basic',
    name: 'Basic Life Support',
    description: 'For stable patients needing safe, quick transport.',
    price: '₹800 – ₹1,200',
    eta: '8–12 min',
    equipment: ['First aid kit', 'Oxygen cylinder', 'Stretcher']
  },
  {
    type: 'advanced',
    name: 'Advanced Life Support',
    description: 'Trained paramedic with advanced monitoring equipment.',
    price: '₹1,800 – ₹2,500',
    eta: '10–15 min',
    equipment: ['Cardiac monitor', 'Defibrillator', 'IV support', 'Paramedic on board']
  },
  {
    type: 'icu',
    name: 'ICU Ambulance',
    description: 'Full mobile ICU setup for critical patients.',
    price: '₹3,500 – ₹5,000',
    eta: '12–20 min',
    equipment: ['Ventilator', 'ICU monitor', 'Critical care nurse', 'Emergency medication']
  }
]
