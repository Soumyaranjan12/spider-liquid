import { useMemo, useState } from 'react'
import { Activity, ArrowDownRight, ArrowUpRight, Download, Eye, MousePointer2, Users } from 'lucide-react'

type Range = '7d' | '30d'
type Metric = 'Visitors' | 'Engagement' | 'Conversion'

const weeklyTraffic = [42, 58, 48, 78, 63, 91, 72]
const monthlyTraffic = [24, 37, 30, 45, 42, 58, 49, 64, 53, 74, 61, 84, 69, 92, 78, 67, 88, 72, 96, 76, 85, 70, 90, 78, 98, 81, 89, 74, 95, 86]
const weeklyEngagement = [36, 52, 41, 66, 59, 82, 73]
const monthlyEngagement = [27, 31, 29, 42, 38, 54, 49, 58, 47, 63, 59, 70, 66, 80, 73, 68, 81, 75, 88, 73, 84, 77, 90, 80, 92, 79, 86, 82, 94, 89]
const weeklyConversion = [24, 39, 30, 45, 35, 56, 49]
const monthlyConversion = [17, 22, 19, 28, 24, 34, 30, 39, 32, 43, 38, 47, 43, 53, 48, 45, 56, 49, 61, 52, 57, 51, 63, 55, 67, 59, 64, 57, 69, 62]

function chartSeries(range: Range, metric: Metric) {
  if (metric === 'Visitors') return range === '7d' ? weeklyTraffic : monthlyTraffic
  if (metric === 'Engagement') return range === '7d' ? weeklyEngagement : monthlyEngagement
  return range === '7d' ? weeklyConversion : monthlyConversion
}

export default function AnalyticsDashboard({ title = 'Product analytics', subtitle = 'A quick read on your workspace activity.' }: { title?: string; subtitle?: string }) {
  const [range, setRange] = useState<Range>('7d')
  const [metric, setMetric] = useState<Metric>('Visitors')
  const series = useMemo(() => chartSeries(range, metric), [range, metric])
  const labels = range === '7d' ? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] : Array.from({length:30},(_,i)=>String(i+1))
  const multiplier = range === '7d' ? 1 : 4.25
  const visitors = Math.round(824 * multiplier)
  const sessions = Math.round(1248 * multiplier)
  const engagement = range === '7d' ? '68.4%' : '71.2%'
  const conversion = range === '7d' ? '4.82%' : '5.16%'
  const delta = range === '7d' ? '+12.8%' : '+18.2%'
  const max = Math.max(...series)

  const exportCSV = () => {
    const rows = [['day', metric.toLowerCase(), 'range'], ...series.map((value, i) => [labels[i], String(value), range])]
    const csv = rows.map(row => row.map(value => '"' + value.replace(/"/g, '""') + '"').join(',')).join('\n')
    const blob = new Blob([csv], {type:'text/csv;charset=utf-8'})
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = `spiderpanda-analytics-${range}-${metric.toLowerCase()}.csv`
    document.body.appendChild(anchor)
    anchor.click()
    anchor.remove()
    URL.revokeObjectURL(url)
  }

  return <section className="analytics-widget" aria-label={title}>
    <div className="aw-head"><div className="aw-title-wrap"><span className="aw-kicker"><Activity size={12}/> OVERVIEW / ANALYTICS</span><h3>{title}</h3><p>{subtitle}</p></div><div className="aw-head-actions"><div className="aw-range-switch" role="group" aria-label="Date range"><button className={range==='7d'?'active':''} onClick={()=>setRange('7d')}>7 days</button><button className={range==='30d'?'active':''} onClick={()=>setRange('30d')}>30 days</button></div><button className="aw-export" onClick={exportCSV} title="Export current chart as CSV"><Download size={13}/> Export</button></div></div>
    <div className="aw-kpis">
      <article className="aw-kpi"><span><Users size={14}/> Unique visitors</span><b>{visitors.toLocaleString('en-US')}</b><small className="aw-positive"><ArrowUpRight size={12}/> {delta} <i>vs previous period</i></small></article>
      <article className="aw-kpi"><span><Eye size={14}/> Sessions</span><b>{sessions.toLocaleString('en-US')}</b><small className="aw-positive"><ArrowUpRight size={12}/> +8.4% <i>vs previous period</i></small></article>
      <article className="aw-kpi"><span><MousePointer2 size={14}/> Engagement</span><b>{engagement}</b><small className="aw-positive"><ArrowUpRight size={12}/> +3.1% <i>vs previous period</i></small></article>
      <article className="aw-kpi"><span><Activity size={14}/> Conversion</span><b>{conversion}</b><small className="aw-negative"><ArrowDownRight size={12}/> −0.6% <i>vs previous period</i></small></article>
    </div>
    <div className="aw-analysis-grid">
      <article className="aw-chart-card"><div className="aw-card-head"><div><span className="aw-small-label">PERFORMANCE TREND</span><h4>{metric} <span>· {range==='7d'?'last 7 days':'last 30 days'}</span></h4></div><div className="aw-metric-switch" role="group" aria-label="Chart metric">{(['Visitors','Engagement','Conversion'] as Metric[]).map(item=><button key={item} className={metric===item?'active':''} onClick={()=>setMetric(item)}>{item}</button>)}</div></div>
        <div className="aw-chart" role="img" aria-label={`${metric} chart for the last ${range==='7d'?'7':'30'} days`}><div className="aw-y-axis"><span>{Math.round(max)}{metric==='Conversion'||metric==='Engagement'?'%':''}</span><span>{Math.round(max*.66)}{metric==='Conversion'||metric==='Engagement'?'%':''}</span><span>{Math.round(max*.33)}{metric==='Conversion'||metric==='Engagement'?'%':''}</span><span>0</span></div><div className="aw-plot">{[0,1,2,3].map(line=><span key={line} className="aw-grid-line" style={{top:`${line*33.333}%`}}/>)}{series.map((value,i)=><div key={i} className="aw-bar-column"><div className={i===series.length-1?'aw-bar current':'aw-bar'} style={{height:`${Math.max(5,value/max*100)}%`}} title={`${labels[i]}: ${value}`}/><span>{range==='30d'?(i%5===0?labels[i]:''):labels[i]}</span></div>)}</div></div>
        <div className="aw-chart-footer"><span><i/> Sample dataset · illustrative figures</span><span>Live controls · local demo data</span></div>
      </article>
      <article className="aw-sources-card"><div className="aw-card-head"><div><span className="aw-small-label">TRAFFIC SOURCES</span><h4>Where they came from</h4></div><span className="aw-source-period">{range==='7d'?'7D':'30D'}</span></div>{[
        {label:'Direct',percent:38,color:'#ff535f',count:Math.round(312*multiplier)},
        {label:'Search',percent:29,color:'#a78bfa',count:Math.round(238*multiplier)},
        {label:'Social',percent:21,color:'#65d8a0',count:Math.round(173*multiplier)},
        {label:'Referral',percent:12,color:'#79b7ff',count:Math.round(101*multiplier)}
      ].map(source=><div className="aw-source" key={source.label}><div className="aw-source-top"><span><i style={{background:source.color}}/>{source.label}</span><b>{source.count.toLocaleString('en-US')}<small>{source.percent}%</small></b></div><div className="aw-source-track"><span style={{width:`${source.percent}%`,background:source.color}}/></div></div>)}<div className="aw-source-note"><Activity size={13}/><span>Use the range and metric controls to explore the sample data. Export downloads the selected chart as a CSV file.</span></div></article>
    </div>
    <div className="aw-foot"><span className="aw-foot-dot"/> Analytics Dashboard component <span className="aw-foot-divider">/</span> responsive, interactive, exportable</div>
  </section>
}
