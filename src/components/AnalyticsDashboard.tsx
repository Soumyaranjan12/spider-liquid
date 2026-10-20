import { useEffect, useMemo, useState } from 'react'
import { Activity, ArrowDownRight, ArrowUpRight, Download, Eye, MousePointer2, RotateCcw, Settings2, Users } from 'lucide-react'

type Range = '7d' | '30d'
type Metric = 'Visitors' | 'Engagement' | 'Conversion'
type KpiKey = 'visitors' | 'sessions' | 'engagement' | 'conversion'
type SourceKey = 'direct' | 'search' | 'social' | 'referral'
type MetricValue = { value: string; change: string }
type RangeData = {
  kpis: Record<KpiKey, MetricValue>
  trends: Record<Metric, string>
  sources: Record<SourceKey, string>
}
type DashboardConfig = Record<Range, RangeData>

const STORAGE_KEY = 'spiderpanda.analytics-dashboard.v1'
const KPI_FIELDS: {key:KpiKey; label:string; icon:'users'|'eye'|'pointer'|'activity'; suffix:string}[] = [
  {key:'visitors',label:'Unique visitors',icon:'users',suffix:''},
  {key:'sessions',label:'Sessions',icon:'eye',suffix:''},
  {key:'engagement',label:'Engagement rate',icon:'pointer',suffix:'%'},
  {key:'conversion',label:'Conversion rate',icon:'activity',suffix:'%'}
]
const SOURCE_FIELDS: {key:SourceKey;label:string;color:string}[] = [
  {key:'direct',label:'Direct',color:'#ff535f'},
  {key:'search',label:'Search',color:'#a78bfa'},
  {key:'social',label:'Social',color:'#65d8a0'},
  {key:'referral',label:'Referral',color:'#79b7ff'}
]

function createDefaultConfig(): DashboardConfig {
  return {
    '7d': {
      kpis: {
        visitors:{value:'824',change:'12.8'},
        sessions:{value:'1248',change:'8.4'},
        engagement:{value:'68.4',change:'3.1'},
        conversion:{value:'4.82',change:'-0.6'}
      },
      trends: {
        Visitors:'42, 58, 48, 78, 63, 91, 72',
        Engagement:'36, 52, 41, 66, 59, 82, 73',
        Conversion:'24, 39, 30, 45, 35, 56, 49'
      },
      sources:{direct:'312',search:'238',social:'173',referral:'101'}
    },
    '30d': {
      kpis: {
        visitors:{value:'3502',change:'18.2'},
        sessions:{value:'5304',change:'11.9'},
        engagement:{value:'71.2',change:'4.8'},
        conversion:{value:'5.16',change:'-0.6'}
      },
      trends: {
        Visitors:'24, 37, 30, 45, 42, 58, 49, 64, 53, 74, 61, 84, 69, 92, 78, 67, 88, 72, 96, 76, 85, 70, 90, 78, 98, 81, 89, 74, 95, 86',
        Engagement:'27, 31, 29, 42, 38, 54, 49, 58, 47, 63, 59, 70, 66, 80, 73, 68, 81, 75, 88, 73, 84, 77, 90, 80, 92, 79, 86, 82, 94, 89',
        Conversion:'17, 22, 19, 28, 24, 34, 30, 39, 32, 43, 38, 47, 43, 53, 48, 45, 56, 49, 61, 52, 57, 51, 63, 55, 67, 59, 64, 57, 69, 62'
      },
      sources:{direct:'1326',search:'1012',social:'735',referral:'429'}
    }
  }
}

function readConfig(): DashboardConfig {
  const defaults = createDefaultConfig()
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null') as Partial<DashboardConfig> | null
    if (!saved) return defaults
    for (const range of ['7d','30d'] as const) {
      const source = saved[range]
      if (!source) continue
      for (const key of ['visitors','sessions','engagement','conversion'] as const) {
        const value = source.kpis?.[key]
        if (value && typeof value.value === 'string' && typeof value.change === 'string') defaults[range].kpis[key] = value
      }
      for (const key of ['Visitors','Engagement','Conversion'] as const) {
        const value = source.trends?.[key]
        if (typeof value === 'string') defaults[range].trends[key] = value
      }
      for (const key of ['direct','search','social','referral'] as const) {
        const value = source.sources?.[key]
        if (typeof value === 'string') defaults[range].sources[key] = value
      }
    }
    return defaults
  } catch {
    return defaults
  }
}

function numeric(value: string): number {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? Math.max(0, parsed) : 0
}
function parseSeries(value: string): number[] {
  return value.split(/[\n,]/).map(part=>part.trim()).filter(Boolean).map(Number).filter(number=>Number.isFinite(number)&&number>=0).slice(0,30)
}
function formatMetric(key: KpiKey, value: string): string {
  const number = numeric(value)
  if (key === 'visitors' || key === 'sessions') return Math.round(number).toLocaleString('en-US')
  return `${value.trim() || '0'}%`
}
function formatChange(value: string): { text:string; positive:boolean } {
  const clean = value.trim().replace(/%/g,'')
  const number = Number(clean)
  const valid = Number.isFinite(number) ? number : 0
  const text = `${valid > 0 ? '+' : valid < 0 ? '−' : ''}${Math.abs(valid)}%`
  return {text,positive:valid>=0}
}

export default function AnalyticsDashboard({
  title = 'Product analytics',
  subtitle = 'A quick read on your workspace activity.'
}: {
  title?: string
  subtitle?: string
}) {
  const [range, setRange] = useState<Range>('7d')
  const [metric, setMetric] = useState<Metric>('Visitors')
  const [editorOpen, setEditorOpen] = useState(true)
  const [config, setConfig] = useState<DashboardConfig>(() => readConfig())
  const [notice, setNotice] = useState('Edits update the chart immediately and are saved in this browser.')
  const rangeData = config[range]
  const series = useMemo(() => parseSeries(rangeData.trends[metric]), [rangeData.trends, metric])
  const labels = useMemo(() => {
    if (range === '7d' && series.length === 7) return ['Mon','Tue','Wed','Thu','Fri','Sat','Sun']
    return series.map((_,index)=> range === '30d' ? String(index+1) : `P${index+1}`)
  },[range,series])
  const max = Math.max(1, ...series)
  const sourceRows = SOURCE_FIELDS.map(source=>({...source,value:numeric(rangeData.sources[source.key])}))
  const sourceTotal = sourceRows.reduce((sum,source)=>sum+source.value,0)

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(config)) } catch { /* Storage can be disabled by the browser. */ }
  }, [config])

  const updateKpi = (key:KpiKey,field:keyof MetricValue,value:string) => {
    setConfig(previous=>({...previous,[range]:{...previous[range],kpis:{...previous[range].kpis,[key]:{...previous[range].kpis[key],[field]:value}}}}))
    setNotice('Unsaved changes are saved locally as you type.')
  }
  const updateTrend = (value:string) => {
    setConfig(previous=>({...previous,[range]:{...previous[range],trends:{...previous[range].trends,[metric]:value}}}))
    setNotice('Trend graph updated. Your values are saved in this browser.')
  }
  const updateSource = (key:SourceKey,value:string) => {
    setConfig(previous=>({...previous,[range]:{...previous[range],sources:{...previous[range].sources,[key]:value}}}))
    setNotice('Traffic-source breakdown updated and saved locally.')
  }
  const resetDemo = () => {
    setConfig(createDefaultConfig())
    setNotice('Demo values restored for both date ranges.')
  }

  const exportCSV = () => {
    const rows = [
      ['range',range],
      ['metric',metric],
      ['data_point','value'],
      ...series.map((value,index)=>[labels[index],String(value)]),
      [],
      ['metric','value','change'],
      ...KPI_FIELDS.map(field=>[field.label,rangeData.kpis[field.key].value,rangeData.kpis[field.key].change]),
      [],
      ['traffic_source','value','share_percent'],
      ...sourceRows.map(source=>[source.label,String(source.value),String(sourceTotal ? Math.round(source.value/sourceTotal*100) : 0)])
    ]
    const csv = rows.map(row=>row.map(value=>{const text=String(value??'');return '"' + text.replace(/"/g,'""') + '"'}).join(',')).join('\n')
    const blob = new Blob([csv], {type:'text/csv;charset=utf-8'})
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = `spiderpanda-analytics-${range}-demo.csv`
    document.body.appendChild(anchor)
    anchor.click()
    anchor.remove()
    URL.revokeObjectURL(url)
    setNotice('Current dashboard values exported to CSV.')
  }

  return <section className="analytics-widget" aria-label={title}>
    <div className="aw-head">
      <div className="aw-title-wrap"><span className="aw-kicker"><Activity size={12}/> DEMO DATA / ANALYTICS</span><h3>{title}</h3><p>{subtitle}</p></div>
      <div className="aw-head-actions">
        <div className="aw-range-switch" role="group" aria-label="Date range"><button className={range==='7d'?'active':''} onClick={()=>setRange('7d')}>7 days</button><button className={range==='30d'?'active':''} onClick={()=>setRange('30d')}>30 days</button></div>
        <button className="aw-edit-toggle" onClick={()=>setEditorOpen(open=>!open)} aria-expanded={editorOpen}><Settings2 size={13}/>{editorOpen?'Hide editor':'Edit demo data'}</button>
        <button className="aw-export" onClick={exportCSV} title="Export current dashboard values as CSV"><Download size={13}/> Export CSV</button>
      </div>
    </div>

    {editorOpen&&<section className="aw-editor" aria-label="Maintain dashboard demo values">
      <div className="aw-editor-top"><div><span>EDITABLE DEMO DATA</span><p>Change the values below. KPI cards, chart bars and source shares refresh as you type.</p></div><button onClick={resetDemo}><RotateCcw size={12}/> Reset demo</button></div>
      <div className="aw-editor-grid">
        <fieldset className="aw-editor-group"><legend>Key metrics · {range==='7d'?'7-day view':'30-day view'}</legend><div className="aw-field-grid">{KPI_FIELDS.map(field=><div className="aw-field-pair" key={field.key}><label><span>{field.label}{field.suffix?' (%)':''}</span><input type="number" min="0" step="any" value={rangeData.kpis[field.key].value} onChange={event=>updateKpi(field.key,'value',event.target.value)} aria-label={`${field.label} value`}/></label><label><span>Change (%)</span><input type="number" step="any" value={rangeData.kpis[field.key].change} onChange={event=>updateKpi(field.key,'change',event.target.value)} aria-label={`${field.label} percentage change`}/></label></div>)}</div></fieldset>
        <fieldset className="aw-editor-group"><legend>Trend series · {metric}</legend><label className="aw-trend-field"><span>Comma-separated values for the {range==='7d'?'7-day':'30-day'} chart</span><textarea rows={3} value={rangeData.trends[metric]} onChange={event=>updateTrend(event.target.value)} spellCheck={false}/></label><small>Enter up to {range==='7d'?'7':'30'} non-negative numbers. The graph uses these values in order.</small></fieldset>
        <fieldset className="aw-editor-group"><legend>Traffic source values</legend><div className="aw-source-fields">{SOURCE_FIELDS.map(source=><label key={source.key}><span><i style={{background:source.color}}/>{source.label}</span><input type="number" min="0" step="1" value={rangeData.sources[source.key]} onChange={event=>updateSource(source.key,event.target.value)} aria-label={`${source.label} traffic source value`}/></label>)}</div><small>Percentages are recalculated from these source values.</small></fieldset>
      </div>
      <div className="aw-editor-status"><span className="aw-editor-saved"/><span>{notice}</span><button onClick={resetDemo}>Restore sample values</button></div>
    </section>}

    <div className="aw-kpis">{KPI_FIELDS.map(field=>{
      const value=rangeData.kpis[field.key]
      const change=formatChange(value.change)
      const Icon=field.icon==='users'?Users:field.icon==='eye'?Eye:field.icon==='pointer'?MousePointer2:Activity
      return <article className="aw-kpi" key={field.key}><span><Icon size={14}/>{field.label}</span><b>{formatMetric(field.key,value.value)}</b><small className={change.positive?'aw-positive':'aw-negative'}>{change.positive?<ArrowUpRight size={12}/>:<ArrowDownRight size={12}/>} {change.text} <i>vs previous period</i></small></article>
    })}</div>

    <div className="aw-analysis-grid">
      <article className="aw-chart-card"><div className="aw-card-head"><div><span className="aw-small-label">PERFORMANCE TREND</span><h4>{metric} <span>· {range==='7d'?'last 7 days':'last 30 days'}</span></h4></div><div className="aw-metric-switch" role="group" aria-label="Chart metric">{(['Visitors','Engagement','Conversion'] as Metric[]).map(item=><button key={item} className={metric===item?'active':''} onClick={()=>setMetric(item)}>{item}</button>)}</div></div>
        <div className="aw-chart" role="img" aria-label={`${metric} chart for the last ${range==='7d'?'7':'30'} days`}><div className="aw-y-axis"><span>{Math.round(max)}{metric==='Conversion'||metric==='Engagement'?'%':''}</span><span>{Math.round(max*.66)}{metric==='Conversion'||metric==='Engagement'?'%':''}</span><span>{Math.round(max*.33)}{metric==='Conversion'||metric==='Engagement'?'%':''}</span><span>0</span></div>{series.length ? <div className="aw-plot">{[0,1,2,3].map(line=><span key={line} className="aw-grid-line" style={{top:`${line*33.333}%`}}/>)}{series.map((value,index)=><div key={index} className="aw-bar-column"><div className={index===series.length-1?'aw-bar current':'aw-bar'} style={{height:`${Math.max(5,value/max*100)}%`}} title={`${labels[index]}: ${value}`}/><span>{range==='30d'?(index%5===0?labels[index]:''):labels[index]}</span></div>)}</div>:<p className="aw-chart-empty">Enter comma-separated numbers above to draw the graph.</p>}</div>
        <div className="aw-chart-footer"><span><i/> Customizable sample series</span><span>{series.length} data points · saved locally</span></div>
      </article>
      <article className="aw-sources-card"><div className="aw-card-head"><div><span className="aw-small-label">TRAFFIC SOURCES</span><h4>Where they came from</h4></div><span className="aw-source-period">{range==='7d'?'7D':'30D'}</span></div>{sourceRows.map(source=><div className="aw-source" key={source.key}><div className="aw-source-top"><span><i style={{background:source.color}}/>{source.label}</span><b>{Math.round(source.value).toLocaleString('en-US')}<small>{sourceTotal?Math.round(source.value/sourceTotal*100):0}%</small></b></div><div className="aw-source-track"><span style={{width:`${sourceTotal?source.value/sourceTotal*100:0}%`,background:source.color}}/></div></div>)}<div className="aw-source-note"><Activity size={13}/><span>Change source values in the editor to update totals and relative shares.</span></div></article>
    </div>
    <div className="aw-foot"><span className="aw-foot-dot"/><span>Editable demo dashboard</span><span className="aw-foot-divider">/</span><span>Values persist in this browser</span><button onClick={()=>setEditorOpen(true)}>Maintain values <Settings2 size={12}/></button></div>
  </section>
}
