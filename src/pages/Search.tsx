import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Search as SearchIcon, X, Clock, Building2, Stethoscope, Zap, Phone } from 'lucide-react'
import { PageHeader } from '@/components/PageHeader'
import { EmptyState } from '@/components/ui/EmptyState'
import { HOSPITALS, DOCTORS, HEALTH_CATEGORIES } from '@/lib/mockData'
import { useAppState } from '@/context/AppStateContext'
import { loadState, saveState } from '@/lib/storage'

export function Search() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { emergencyContacts } = useAppState()
  const [query, setQuery] = useState('')
  const [recent, setRecent] = useState<string[]>(() => loadState('recentSearches', []))

  const results = useMemo(() => {
    if (!query.trim()) return null
    const q = query.toLowerCase()
    return {
      hospitals: HOSPITALS.filter((h) => h.name.toLowerCase().includes(q) || h.specializations.some((s) => s.toLowerCase().includes(q))),
      doctors: DOCTORS.filter((d) => d.name.toLowerCase().includes(q) || d.specialty.toLowerCase().includes(q)),
      categories: HEALTH_CATEGORIES.filter((c) => c.label.toLowerCase().includes(q)),
      contacts: emergencyContacts.filter((c) => c.name.toLowerCase().includes(q))
    }
  }, [query, emergencyContacts])

  const commitSearch = (value: string) => {
    if (!value.trim()) return
    const next = [value, ...recent.filter((r) => r !== value)].slice(0, 6)
    setRecent(next)
    saveState('recentSearches', next)
  }

  const totalResults = results
    ? results.hospitals.length + results.doctors.length + results.categories.length + results.contacts.length
    : 0

  return (
    <div className="min-h-screen bg-background">
      <PageHeader title={t('common.search')} />
      <div className="px-4 pt-2">
        <div className="flex items-center gap-2 rounded-2xl border border-border bg-surface px-4 h-12 shadow-soft focus-within:ring-2 focus-within:ring-primary/40">
          <SearchIcon size={18} className="text-muted-foreground shrink-0" />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && commitSearch(query)}
            placeholder={t('search.placeholder') ?? ''}
            className="flex-1 bg-transparent outline-none text-sm"
          />
          {query && (
            <button onClick={() => setQuery('')} aria-label="Clear">
              <X size={16} className="text-muted-foreground" />
            </button>
          )}
        </div>
      </div>

      <div className="px-4 mt-5">
        {!query && (
          <>
            {recent.length > 0 ? (
              <>
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-sm font-semibold">{t('search.recent')}</h2>
                  <button
                    className="text-xs text-primary font-medium"
                    onClick={() => {
                      setRecent([])
                      saveState('recentSearches', [])
                    }}
                  >
                    {t('search.clear')}
                  </button>
                </div>
                <div className="space-y-1">
                  {recent.map((r) => (
                    <button
                      key={r}
                      onClick={() => setQuery(r)}
                      className="w-full flex items-center gap-3 py-2.5 text-sm"
                    >
                      <Clock size={16} className="text-muted-foreground" />
                      {r}
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <EmptyState icon={SearchIcon} title={t('search.empty')} />
            )}
          </>
        )}

        {query && results && totalResults === 0 && (
          <EmptyState icon={SearchIcon} title={t('search.noResults')} body={t('search.noResultsBody') ?? undefined} />
        )}

        {query && results && totalResults > 0 && (
          <div className="space-y-5" onClick={() => commitSearch(query)}>
            {results.hospitals.length > 0 && (
              <div>
                <h3 className="text-xs font-semibold text-muted-foreground uppercase mb-2">{t('hospitals.title')}</h3>
                {results.hospitals.map((h) => (
                  <button
                    key={h.id}
                    onClick={() => navigate(`/hospitals/${h.id}`)}
                    className="w-full flex items-center gap-3 py-2.5 text-left"
                  >
                    <Building2 size={18} className="text-primary shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{h.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{h.specializations.join(', ')}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
            {results.doctors.length > 0 && (
              <div>
                <h3 className="text-xs font-semibold text-muted-foreground uppercase mb-2">{t('hospitals.doctors')}</h3>
                {results.doctors.map((d) => (
                  <div key={d.id} className="flex items-center gap-3 py-2.5">
                    <Stethoscope size={18} className="text-info-600 shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{d.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{d.specialty}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {results.categories.length > 0 && (
              <div>
                <h3 className="text-xs font-semibold text-muted-foreground uppercase mb-2">{t('home.healthServices')}</h3>
                {results.categories.map((c) => (
                  <button key={c.key} onClick={() => navigate('/hospitals')} className="w-full flex items-center gap-3 py-2.5 text-left">
                    <Zap size={18} className="text-warning-600 shrink-0" />
                    <p className="text-sm font-medium">{c.emoji} {c.label}</p>
                  </button>
                ))}
              </div>
            )}
            {results.contacts.length > 0 && (
              <div>
                <h3 className="text-xs font-semibold text-muted-foreground uppercase mb-2">{t('home.emergencyContacts')}</h3>
                {results.contacts.map((c) => (
                  <div key={c.id} className="flex items-center gap-3 py-2.5">
                    <Phone size={18} className="text-emergency shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{c.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{c.relationship}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
