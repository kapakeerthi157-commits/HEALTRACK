import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function uid(prefix = 'id') {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}${Date.now().toString(36)}`
}

export function timeAgo(timestamp: number, t: (k: string, o?: Record<string, unknown>) => string) {
  const diffMs = Date.now() - timestamp
  const mins = Math.floor(diffMs / 60000)
  if (mins < 1) return t('time.justNow')
  if (mins < 60) return t('time.minutesAgo', { count: mins })
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return t('time.hoursAgo', { count: hrs })
  const days = Math.floor(hrs / 24)
  return t('time.daysAgo', { count: days })
}

export function formatCountdown(totalSeconds: number) {
  const m = Math.floor(totalSeconds / 60)
  const s = totalSeconds % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

export function greetingKey(date = new Date()): 'morning' | 'afternoon' | 'evening' | 'night' {
  const h = date.getHours()
  if (h < 12) return 'morning'
  if (h < 17) return 'afternoon'
  if (h < 21) return 'evening'
  return 'night'
}
