import { useCallback, useEffect, useState } from 'react'
import { Activity, BookOpen, BarChart3, Code2, Layers3, RotateCcw, Trash2 } from 'lucide-react'
import { clearAnalytics, readAnalytics, summarizeAnalytics, type AnalyticsEvent } from '../utils/analytics'

type Props = { onNavigate: (page: 'Components' | 'Playground' | 'Documentation') => void }

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
  const empty = stats.last7Days === 0

  return <section className="subpage analytics-page">
    <div className="subpage-heading analytics-heading">
      <div className="section-kicker">LOCAL WORKSPACE INSIGHTS</div>
      <div className="analytics-title-row"><div><h1>Your activity, <span>clearly.</span></h1><p>See how you explore the component library and documentation. The history is saved only in this browser.</p></div><button className="analytics-reset" onClick={() => setConfirmClear(true)}><Trash2 size={14}/> Clear history</button></div>
    </div>
    <div className="analytics-notice"><Activity size={16}/><div><b>Private by default</b><span>Activity stays in local browser storage. Nothing is sent to an analytics server, and records do not sync between devices.</span></div></div>
    <div className="analytics-stat-grid">
      <article className="analytics-stat glass-panel"><div className="analytics-stat-top"><span>Events · 7 days</span><span className="analytics-icon"><Activity size={16}/></span></div><strong>{stats.last7Days.toLocaleString()}</strong><small>{stats.total.toLocaleString()} events stored overall</small><div className="stat-mini-line"><i style={{width:`${Math.min(100,stats.last7Days/Math.max(1,stats.total)*100)}%`}}/></div></article>
      <article className="analytics-stat glass-panel"><div className="analytics-stat-top"><span>Page views</span><span className="analytics-icon"><BarChart3 size={16}/></span></div><strong>{stats.pageViews}</strong><small>Views recorded in the last seven days</small><div className="stat-mini-line"><i style={{width:`${Math.min(100,stats.pageViews/Math.max(1,stats.last7Days)*100)}%`}}/></div></article>
      <article className="analytics-stat glass-panel"><div className="analytics-stat-top"><span>Component previews</span><span className="analytics-icon"><Layers3 size={16}/></span></div><strong>{stats.componentPreviews}</strong><small>Component previews selected</small><div className="stat-mini-line"><i style={{width:`${Math.min(100,stats.componentPreviews/Math.max(1,stats.last7Days)*100)}%`}}/></div></article>
      <article className="analytics-stat glass-panel"><div className="analytics-stat-top"><span>Code copies</span><span className="analytics-icon"><Code2 size={16}/></span></div><strong>{stats.codeCopies}</strong><small>Copy-code actions in this browser</small><div className="stat-mini-line"><i style={{width:`${Math.min(100,stats.codeCopies/Math.max(1,stats.last7Days)*100)}%`}}/></div></article>
    </div>
    <div className="analytics-main-grid">
      <article className="analytics-card glass-panel"><div className="analytics-card-heading"><div><span className="mini-label">ACTIVITY TIMELINE</span><h2>Last seven days</h2></div><span className="analytics-range">LOCAL HISTORY</span></div>
        <div className="activity-chart" role="img" aria-label="Daily local activity for the last seven days">{stats.daily.map(day=><div className="activity-day" key={day.date}><div className="activity-bar-track"><div className="activity-bar" style={{height:`${day.count?Math.max(7,day.count/maxDaily*100):2}%`}} title={`${day.count} events`}/></div><b>{day.count}</b><span>{day.label}</span></div>)}</div>
        {empty&&<div className="chart-empty"><Activity size={19}/><span>Your timeline starts when you open a page, preview a component, or copy example code.</span></div>}
        <div className="chart-legend"><span><i/> Locally recorded events</span><span>Updates as you use the site</span></div>
      </article>
      <article className="analytics-card glass-panel"><div className="analytics-card-heading"><div><span className="mini-label">COMPONENT STUDIO</span><h2>Most explored</h2></div><Layers3 size={18}/></div>
        {stats.popularComponents.length?<div className="popular-components">{stats.popularComponents.map(([id,count],i)=><div className="popular-row" key={id}><span className="popular-rank">{String(i+1).padStart(2,'0')}</span><span>{id.replace(/-/g,' ').replace(/\b\w/g,c=>c.toUpperCase())}</span><div className="popular-track"><i style={{width:`${count/Math.max(1,stats.popularComponents[0][1])*100}%`}}/></div><b>{count}</b></div>)}</div>:<div className="analytics-empty"><Layers3 size={20}/><p>No component previews recorded yet.</p><button onClick={()=>onNavigate('Components')}>Browse components ↗</button></div>}
        <button className="analytics-action" onClick={()=>onNavigate('Components')}>Browse component library <span>↗</span></button>
      </article>
    </div>
    <div className="analytics-main-grid analytics-bottom-grid">
      <article className="analytics-card glass-panel"><div className="analytics-card-heading"><div><span className="mini-label">NAVIGATION</span><h2>Pages you visit</h2></div><BarChart3 size={18}/></div>
        {stats.popularPages.length?<div className="popular-components">{stats.popularPages.map(([id,count],i)=><div className="popular-row" key={id}><span className="popular-rank">{String(i+1).padStart(2,'0')}</span><span>{id}</span><div className="popular-track"><i style={{width:`${count/Math.max(1,stats.popularPages[0][1])*100}%`}}/></div><b>{count}</b></div>)}</div>:<div className="analytics-empty"><BookOpen size={20}/><p>Page views appear here as you navigate.</p><button onClick={()=>onNavigate('Documentation')}>Read documentation ↗</button></div>}
      </article>
      <article className="analytics-card glass-panel"><div className="analytics-card-heading"><div><span className="mini-label">RECENT ACTIVITY</span><h2>Latest events</h2></div><Activity size={18}/></div>
        {events.length?<div className="recent-events">{events.slice(-6).reverse().map((event,i)=><div className="recent-event" key={event.at+event.name+i}><span className="recent-event-icon">{event.name==='component_preview'?<Layers3 size={13}/>:event.name==='copy_code'?<Code2 size={13}/>:<Activity size={13}/>}</span><div><b>{event.name.replace(/_/g,' ')}</b><small>{event.label||'Workspace'} · {new Date(event.at).toLocaleString()}</small></div></div>)}</div>:<div className="analytics-empty"><Activity size={20}/><p>Nothing tracked yet. Try a component preview or copy an example.</p><button onClick={()=>onNavigate('Playground')}>Open playground ↗</button></div>}
      </article>
    </div>
    {confirmClear&&<div className="confirm-overlay" role="presentation" onClick={()=>setConfirmClear(false)}><div className="confirm-dialog glass-panel" role="dialog" aria-modal="true" aria-labelledby="clear-analytics-title" onClick={event=>event.stopPropagation()}><div className="confirm-icon"><RotateCcw size={20}/></div><h2 id="clear-analytics-title">Clear local activity?</h2><p>This deletes the activity history stored in this browser. It does not change the component library or examples.</p><div className="confirm-actions"><button onClick={()=>setConfirmClear(false)}>Cancel</button><button className="confirm-danger" onClick={()=>{clearAnalytics();refresh();setConfirmClear(false)}}>Clear history</button></div></div></div>}
  </section>
}
