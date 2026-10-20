export type AnalyticsEvent = {
  name: string
  label: string
  at: string
  value?: number
}

const STORAGE_KEY = 'spiderpanda.analytics.v1'
const MAX_EVENTS = 2500

export function readAnalytics(): AnalyticsEvent[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed: unknown = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed.filter(isAnalyticsEvent) : []
  } catch {
    return []
  }
}

function isAnalyticsEvent(value: unknown): value is AnalyticsEvent {
  if (!value || typeof value !== 'object') return false
  const event = value as Partial<AnalyticsEvent>
  return typeof event.name === 'string' && typeof event.label === 'string' && typeof event.at === 'string'
}

export function trackEvent(name: string, label = '', value?: number) {
  try {
    const events = readAnalytics()
    events.push({ name, label, at: new Date().toISOString(), ...(typeof value === 'number' ? { value } : {}) })
    localStorage.setItem(STORAGE_KEY, JSON.stringify(events.slice(-MAX_EVENTS)))
    window.dispatchEvent(new CustomEvent('spiderpanda:analytics'))
  } catch {
    // Analytics is optional; the app remains usable when browser storage is unavailable.
  }
}

export function clearAnalytics() {
  try {
    localStorage.removeItem(STORAGE_KEY)
    window.dispatchEvent(new CustomEvent('spiderpanda:analytics'))
  } catch {
    // Ignore storage restrictions.
  }
}

export function summarizeAnalytics(events = readAnalytics()) {
  const since = Date.now() - 7 * 24 * 60 * 60 * 1000
  const recent = events.filter(event => Date.parse(event.at) >= since)
  const count = (name: string) => recent.filter(event => event.name === name).length
  return {
    total: events.length,
    last7Days: recent.length,
    pageViews: count('page_view'),
    components: count('component_preview'),
    gamesStarted: count('game_started'),
    snakePoints: recent.filter(e => e.name === 'snake_point').reduce((sum, e) => sum + (e.value || 1), 0),
    chessMoves: count('chess_move'),
    penPoints: recent.filter(e => e.name === 'pen_point').reduce((sum, e) => sum + (e.value || 1), 0),
    levelsCleared: count('pen_level_complete'),
    daily: Array.from({ length: 7 }, (_, i) => {
      const date = new Date()
      date.setHours(0, 0, 0, 0)
      date.setDate(date.getDate() - (6 - i))
      const key = date.toISOString().slice(0, 10)
      return {
        date: key,
        label: date.toLocaleDateString(undefined, { weekday: 'short' }),
        count: recent.filter(event => event.at.slice(0, 10) === key).length
      }
    }),
    popularComponents: Object.entries(recent.filter(e => e.name === 'component_preview').reduce<Record<string, number>>((acc, e) => {
      acc[e.label] = (acc[e.label] || 0) + 1
      return acc
    }, {})).sort((a, b) => b[1] - a[1]).slice(0, 5),
    games: ['snake', 'chess', 'pen'].map(game => ({
      game,
      count: recent.filter(e => e.name === 'game_started' && e.label === game).length
    }))
  }
}
