import { useTranslation } from 'react-i18next'
import { Bell, Siren, Calendar, Building2, CheckCheck, Trash2 } from 'lucide-react'
import { PageHeader } from '@/components/PageHeader'
import { EmptyState } from '@/components/ui/EmptyState'
import { useAppState } from '@/context/AppStateContext'
import { timeAgo } from '@/lib/utils'
import { cn } from '@/lib/utils'
import type { AppNotification } from '@/types'

const ICONS: Record<AppNotification['type'], typeof Bell> = {
  emergency: Siren,
  appointment: Calendar,
  hospital: Building2,
  general: Bell
}

export function Notifications() {
  const { t } = useTranslation()
  const { notifications, markNotificationRead, markAllNotificationsRead, clearAllNotifications } = useAppState()

  const today = notifications.filter((n) => n.group === 'today')
  const earlier = notifications.filter((n) => n.group === 'earlier')

  return (
    <div className="min-h-screen bg-background">
      <PageHeader
        title={t('notificationsPage.title') ?? ''}
        right={
          notifications.length > 0 && (
            <button onClick={markAllNotificationsRead} aria-label="Mark all read">
              <CheckCheck size={18} className="text-primary" />
            </button>
          )
        }
      />

      <div className="px-4 py-4">
        {notifications.length === 0 ? (
          <EmptyState icon={Bell} title={t('notificationsPage.empty')} body={t('notificationsPage.emptyBody') ?? undefined} />
        ) : (
          <div className="space-y-6">
            {today.length > 0 && (
              <Group title={t('notificationsPage.today')} items={today} onRead={markNotificationRead} />
            )}
            {earlier.length > 0 && (
              <Group title={t('notificationsPage.earlier')} items={earlier} onRead={markNotificationRead} />
            )}
            <button onClick={clearAllNotifications} className="flex items-center gap-1.5 text-xs text-muted-foreground mx-auto">
              <Trash2 size={13} /> {t('notificationsPage.clearAll')}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

function Group({ title, items, onRead }: { title: string; items: AppNotification[]; onRead: (id: string) => void }) {
  const { t } = useTranslation()
  return (
    <div>
      <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">{title}</h2>
      <div className="space-y-2">
        {items.map((n) => {
          const Icon = ICONS[n.type]
          return (
            <button
              key={n.id}
              onClick={() => onRead(n.id)}
              className={cn(
                'w-full text-left flex items-start gap-3 rounded-2xl border p-3.5',
                n.read ? 'border-border bg-surface' : 'border-primary-50 bg-primary-50 dark:border-primary/20 dark:bg-primary/10'
              )}
            >
              <div className={cn('h-9 w-9 rounded-xl flex items-center justify-center shrink-0', n.type === 'emergency' ? 'bg-emergency-50 text-emergency dark:bg-emergency/15' : 'bg-primary-50 text-primary dark:bg-primary/15')}>
                <Icon size={16} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <p className="font-semibold text-sm truncate">{n.title}</p>
                  {!n.read && <span className="h-1.5 w-1.5 rounded-full bg-emergency shrink-0" />}
                </div>
                <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{n.message}</p>
                <p className="text-[10px] text-muted-foreground/70 mt-1">{timeAgo(n.timestamp, t)}</p>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
