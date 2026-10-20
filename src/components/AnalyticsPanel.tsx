import { useCallback, useEffect, useState } from 'react'
import { Activity, BarChart3, Gamepad2, Layers3, RotateCcw, Sparkles, Target, Trash2, Trophy } from 'lucide-react'
import { clearAnalytics, readAnalytics, summarizeAnalytics, type AnalyticsEvent } from '../utils/analytics'

type Props = { onNavigate: (page: 'Components' | 'Games' | 'Playground') => void }

export default function AnalyticsPanel({ onNavigate }: Props) {
  const [events, setEvents] = useState<AnalyticsEvent[]>(() => readAnalytics())
  const [confirmClear, setConfirmClear] = useState(false)
  const refresh = useCallback(() => setEvents(readAnalytics()), [])

  useEffect(() => {
    window.addEventListener('spiderpanda:analytics', refresh)
    window.addEventListener('storage', refresh)
    return () => {
      window.removeEventListener('spiderpanda:analytics', refresh)
      window.removeEventListener('storage', refresh)
    }
  }, [refresh])

  const stats = summarizeAnalytics(events)
  const maxDaily = Math.max(1, ...stats.daily.map(day => day.count))
  const maxGame = Math.max(1, ...stats.games.map(game => game.count))
  const isEmpty = stats.last7Days === 0

  return <section className="subpage analytics-page">
    <div className="subpage-heading analytics-heading">
      <div className="section-kicker">YOUR LOCAL ACTIVITY</div>
      <div className="analytics-title-row"><div><h1>Signals, not <span>noise.</span></h1><p>Understand what you try, build, and play. This dashboard reads only this browser's saved activity.</p></div><button className="analytics-reset" onClick={() => setConfirmClear(true)}><Trash2 size={14} /> Clear history</button></div>
    </div>
    <div className="analytics-notice"><Activity size={16} /><div><b>Private by default</b><span>These numbers are stored locally in your browser. They are not sent to an analytics server and are not shared between devices.</span></div></div>
    <div className="analytics-stat-grid">
      <article className="analytics-stat glass-panel"><div className="analytics-stat-top"><span>Events · 7 days</span><span className="analytics-icon"><Activity size={16} /></span></div><strong>{stats.last7Days.toLocaleString()}</strong><small>{stats.total.toLocaleString()} events recorded in this browser overall</small><div className="stat-mini-line"><i style={{width: `${Math.min(100, stats.last7Days ? stats.last7Days / Math.max(1, stats.total) * 100 : 0)}%`}} /></div></article>
      <article className="analytics-stat glass-panel"><div className="analytics-stat-top"><span>Component previews</span><span className="analytics-icon"><Layers3 size={16} /></span></div><strong>{stats.components}</strong><small>Components selected in the playground</small><div className="stat-mini-line"><i style={{width: `${Math.min(100, stats.components / Math.max(1, stats.last7Days) * 100)}%`}} /></div></article>
      <article className="analytics-stat glass-panel"><div className="analytics-stat-top"><span>Games started</span><span className="analytics-icon"><Gamepad2 size={16} /></span></div><strong>{stats.gamesStarted}</strong><small>Snake, chess and pen-fight sessions</small><div className="stat-mini-line"><i style={{width: `${Math.min(100, stats.gamesStarted / Math.max(1, stats.last7Days) * 100)}%`}} /></div></article>
      <article className="analytics-stat glass-panel"><div className="analytics-stat-top"><span>Pen-fight levels</span><span className="analytics-icon"><Trophy size={16} /></span></div><strong>{stats.levelsCleared}</strong><small>Campaign levels completed</small><div className="stat-mini-line"><i style={{width: `${Math.min(100, stats.levelsCleared * 12)}%`}} /></div></article>
    </div>
    <div className="analytics-main-grid">
      <article className="analytics-card glass-panel">
        <div className="analytics-card-heading"><div><span className="mini-label">ACTIVITY TIMELINE</span><h2>Last seven days</h2></div><span className="analytics-range">LOCAL TIME</span></div>
        <div className="activity-chart" role="img" aria-label="Daily activity counts for the last seven days">
          {stats.daily.map(day => <div className="activity-day" key={day.date}><div className="activity-bar-track"><div className="activity-bar" style={{height: `${day.count ? Math.max(7, day.count / maxDaily * 100) : 2}%`}} title={`${day.count} events`} /></div><b>{day.count}</b><span>{day.label}</span></div>)}
        </div>
        {isEmpty && <div className="chart-empty"><Activity size={19} /><span>Your timeline starts when you explore a component or launch a game.</span></div>}
        <div className="chart-legend"><span><i /> Browser activity events</span><span>Updates as you use the site</span></div>
      </article>
      <article className="analytics-card glass-panel game-analytics">
        <div className="analytics-card-heading"><div><span className="mini-label">PLAY BREAKDOWN</span><h2>Games tried</h2></div><Gamepad2 size={18} /></div>
        {stats.games.map(game => <div className="game-metric" key={game.game}><div className="game-metric-label"><span className={`game-dot game-dot-${game.game}`} />{game.game === 'pen' ? 'Pen Fight' : game.game === 'snake' ? 'Snake' : 'Panda vs Spider Chess'}<b>{game.count}</b></div><div className="game-metric-track"><i style={{width: `${game.count ? Math.max(3, game.count / maxGame * 100) : 0}%`}} /></div></div>)}
        <div className="game-total"><span><Sparkles size={14} /> Total score events</span><b>{stats.snakePoints + stats.chessMoves + stats.penPoints}</b></div>
        <button className="analytics-action" onClick={() => onNavigate('Games')}>Open mini games <span>↗</span></button>
      </article>
    </div>
    <div className="analytics-main-grid analytics-bottom-grid">
      <article className="analytics-card glass-panel">
        <div className="analytics-card-heading"><div><span className="mini-label">COMPONENTS</span><h2>Most explored</h2></div><Layers3 size={18} /></div>
        {stats.popularComponents.length ? <div className="popular-components">{stats.popularComponents.map(([id,count],i) => <div className="popular-row" key={id}><span className="popular-rank">0{i+1}</span><span>{id.replaceAll('-', ' ').replace(/\b\w/g, c => c.toUpperCase())}</span><div className="popular-track"><i style={{width:`${count/Math.max(1,stats.popularComponents[0][1])*100}%`}} /></div><b>{count}</b></div>)}</div> : <div className="analytics-empty"><Layers3 size={20} /><p>No component previews tracked yet.</p><button onClick={() => onNavigate('Components')}>Browse components ↗</button></div>}
      </article>
      <article className="analytics-card glass-panel">
        <div className="analytics-card-heading"><div><span className="mini-label">GAME PERFORMANCE</span><h2>Score events</h2></div><Target size={18} /></div>
        <div className="score-events"><div><span>Snake food collected</span><b>{stats.snakePoints}</b></div><div><span>Chess moves played</span><b>{stats.chessMoves}</b></div><div><span>Pen-fight points scored</span><b>{stats.penPoints}</b></div><div><span>Campaign levels cleared</span><b>{stats.levelsCleared}</b></div></div>
        <button className="analytics-action" onClick={() => onNavigate('Playground')}>Explore components <span>↗</span></button>
      </article>
    </div>
    {confirmClear && <div className="confirm-overlay" role="presentation" onClick={() => setConfirmClear(false)}><div className="confirm-dialog glass-panel" role="dialog" aria-modal="true" aria-labelledby="clear-analytics-title" onClick={event => event.stopPropagation()}><div className="confirm-icon"><RotateCcw size={20} /></div><h2 id="clear-analytics-title">Clear local activity?</h2><p>This erases the activity history stored in this browser. It does not affect game progress.</p><div className="confirm-actions"><button onClick={() => setConfirmClear(false)}>Cancel</button><button className="confirm-danger" onClick={() => { clearAnalytics(); refresh(); setConfirmClear(false) }}>Clear history</button></div></div></div>}
  </section>
}
