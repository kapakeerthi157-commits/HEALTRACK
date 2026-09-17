import { useEffect, useRef } from 'react'
import L from 'leaflet'
import type { Hospital } from '@/types'

interface LeafletMapProps {
  hospitals?: Hospital[]
  center?: [number, number]
  markerLabel?: string
  zoom?: number
  routeTo?: [number, number]
}

const DEFAULT_CENTER: [number, number] = [17.4326, 78.4071] // Hyderabad fallback

export function LeafletMap({ hospitals = [], center, markerLabel, zoom = 13, routeTo }: LeafletMapProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const mapRef = useRef<L.Map | null>(null)

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return

    const map = L.map(containerRef.current, { zoomControl: false, attributionControl: true }).setView(
      center ?? DEFAULT_CENTER,
      zoom
    )
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map)

    if (center) {
      const icon = L.divIcon({
        className: '',
        html: `<div style="background:#1e3a8a;width:16px;height:16px;border-radius:50%;border:3px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.35)"></div>`,
        iconSize: [16, 16]
      })
      L.marker(center, { icon }).addTo(map).bindPopup(markerLabel ?? 'You')
    }

    hospitals.forEach((h) => {
      const icon = L.divIcon({
        className: '',
        html: `<div style="background:#e11d2e;color:white;width:28px;height:28px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);display:flex;align-items:center;justify-content:center;border:2px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.35)"></div>`,
        iconSize: [28, 28],
        iconAnchor: [14, 28]
      })
      L.marker([h.lat, h.lng], { icon }).addTo(map).bindPopup(h.name)
    })

    if (routeTo && center) {
      L.polyline([center, routeTo], { color: '#1e3a8a', weight: 3, dashArray: '6 6' }).addTo(map)
    }

    mapRef.current = map

    return () => {
      map.remove()
      mapRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return <div ref={containerRef} className="w-full h-full" />
}
