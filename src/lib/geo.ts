import type { Hospital, NearbyFacility, PoliceStation } from '@/types'
import { HOSPITALS, POLICE_STATIONS } from './mockData'

/** Great-circle distance in km between two lat/lng points. */
export function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number) {
  const R = 6371
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLng = ((lng2 - lng1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

/**
 * Returns the closest hospitals + police stations, sorted by distance.
 * Uses the device's real coordinates when available; otherwise falls back
 * to the static demo distances in mockData so the UI still has something to show.
 */
export function getNearbyFacilities(lat: number | null, lng: number | null, limit = 4): NearbyFacility[] {
  const hospitals: NearbyFacility[] = HOSPITALS.map((h: Hospital) => ({
    kind: 'hospital',
    id: h.id,
    name: h.name,
    distanceKm: lat != null && lng != null ? Number(haversineKm(lat, lng, h.lat, h.lng).toFixed(1)) : h.distanceKm,
    phone: h.phone,
    address: h.address,
    lat: h.lat,
    lng: h.lng
  }))

  const police: NearbyFacility[] = POLICE_STATIONS.map((p: PoliceStation) => ({
    kind: 'police',
    id: p.id,
    name: p.name,
    distanceKm: lat != null && lng != null ? Number(haversineKm(lat, lng, p.lat, p.lng).toFixed(1)) : p.distanceKm,
    phone: p.phone,
    address: p.address,
    lat: p.lat,
    lng: p.lng
  }))

  return [...hospitals, ...police].sort((a, b) => a.distanceKm - b.distanceKm).slice(0, limit)
}
