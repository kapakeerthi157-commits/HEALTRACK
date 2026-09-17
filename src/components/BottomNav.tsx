import { NavLink } from 'react-router-dom'
import { Home, Building2, Calendar, User, Siren } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import { useAppState } from '@/context/AppStateContext'

export function BottomNav() {
  const { t } = useTranslation()
  const { emergency } = useAppState()

  const items = [
    { to: '/home', icon: Home, label: t('nav.home') },
    { to: '/hospitals', icon: Building2, label: t('nav.hospitals') },
    { to: '/emergency', icon: Siren, label: t('nav.emergency'), center: true },
    { to: '/appointments', icon: Calendar, label: t('nav.appointments') },
    { to: '/profile', icon: User, label: t('nav.profile') }
  ]

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] z-40 safe-bottom">
      <div className="bg-surface/95 backdrop-blur border-t border-border px-2 pt-2 pb-1 flex items-end justify-between">
        {items.map((item) => {
          if (item.center) {
            return (
              <NavLink key={item.to} to={item.to} className="flex-1 flex flex-col items-center -mt-7">
                {({ isActive }) => (
                  <>
                    <div
                      className={cn(
                        'h-14 w-14 rounded-full flex items-center justify-center shadow-floating border-4 border-background transition-transform',
                        emergency.active ? 'bg-emergency animate-pulse' : 'bg-emergency',
                        isActive && 'scale-105'
                      )}
                    >
                      <item.icon size={24} className="text-white" strokeWidth={2.25} />
                    </div>
                    <span className={cn('text-[11px] mt-1 font-medium', isActive ? 'text-emergency' : 'text-muted-foreground')}>
                      {item.label}
                    </span>
                  </>
                )}
              </NavLink>
            )
          }
          return (
            <NavLink key={item.to} to={item.to} className="flex-1 flex flex-col items-center py-1.5 gap-1">
              {({ isActive }) => (
                <>
                  <item.icon size={22} className={isActive ? 'text-primary' : 'text-muted-foreground'} strokeWidth={isActive ? 2.4 : 2} />
                  <span className={cn('text-[11px] font-medium', isActive ? 'text-primary' : 'text-muted-foreground')}>
                    {item.label}
                  </span>
                </>
              )}
            </NavLink>
          )
        })}
      </div>
    </nav>
  )
}
