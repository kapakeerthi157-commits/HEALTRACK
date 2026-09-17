import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Star, MapPin, BedDouble, Phone, Navigation2, Building2 } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import type { Hospital } from '@/types'

export function HospitalCard({ hospital }: { hospital: Hospital }) {
  const { t } = useTranslation()
  const navigate = useNavigate()

  return (
    <Card
      className="p-3 flex gap-3 cursor-pointer hover:shadow-card transition-shadow"
      onClick={() => navigate(`/hospitals/${hospital.id}`)}
    >
      <div className="h-20 w-20 rounded-xl bg-primary-50 dark:bg-primary/15 flex items-center justify-center text-primary shrink-0">
        <Building2 size={28} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p className="font-semibold text-sm leading-tight truncate">{hospital.name}</p>
          <Badge tone={hospital.isOpen ? 'success' : 'muted'} className="shrink-0">
            {hospital.isOpen ? t('hospitals.open') : t('hospitals.closed')}
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground mt-1 truncate">{hospital.specializations.join(' · ')}</p>
        <div className="flex items-center gap-3 mt-1.5 text-xs text-muted-foreground">
          <span className="flex items-center gap-1"><Star size={12} className="text-warning fill-warning" /> {hospital.rating}</span>
          <span className="flex items-center gap-1"><MapPin size={12} /> {hospital.distanceKm} km</span>
          {hospital.bedsAvailable != null && (
            <span className="flex items-center gap-1"><BedDouble size={12} /> {hospital.bedsAvailable}</span>
          )}
        </div>
        <div className="flex gap-2 mt-2.5" onClick={(e) => e.stopPropagation()}>
          <Button size="sm" variant="outline" className="flex-1" onClick={() => window.open(`tel:${hospital.phone}`)}>
            <Phone size={14} /> {t('common.call')}
          </Button>
          <Button
            size="sm"
            variant="secondary"
            className="flex-1"
            onClick={() =>
              window.open(`https://www.openstreetmap.org/directions?to=${hospital.lat},${hospital.lng}`, '_blank')
            }
          >
            <Navigation2 size={14} /> {t('common.directions')}
          </Button>
        </div>
      </div>
    </Card>
  )
}
