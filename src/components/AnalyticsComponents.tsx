import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowDownRight, ArrowUpRight, BarChart3, ChevronDown, ChevronUp, TrendingUp } from 'lucide-react'

export type TrendPoint = { label: string; value: number }
export type TrafficSource = { name: string; value: number; color?: string }
export type AnalyticsColumn = { key: string; label: string }
export type AnalyticsRow = Record<string, string | number>

export function MetricCard({
  title = 'Active users',
  value = '8,249',
  change = '+12.8%',
  direction = 'up',
  caption = 'vs previous period'
}: {
  title?: string
  value?: string | number
  change?: string
  direction?: 'up' | 'down'
  caption?: string
}) {
  return <article className="metric-card-component">
    <div className="mcc-top"><span>{title}</span><span className="mcc-icon"><BarChart3 size={15}/></span></div>
    <motion.strong key={String(value)} initial={{ opacity: 0, y: 8, filter: 'blur(4px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }} transition={{ type: 'spring', stiffness: 280, damping: 24 }}>{typeof value === 'number' ? value.toLocaleString() : value}</motion.strong>
    <div className={`mcc-change ${direction === 'up' ? 'is-up' : 'is-down'}`}>{direction === 'up' ? <ArrowUpRight size={13}/> : <ArrowDownRight size={13}/>}<b>{change}</b><span>{caption}</span></div>
    <div className="mcc-sparkline" aria-hidden="true">{[28,42,35,62,48,73,57,87,69,96].map((height,index)=><motion.i key={index} initial={{scaleY:0}} animate={{scaleY:1}} transition={{type:'spring',stiffness:260,damping:19,delay:index*.025}} style={{height:`${height}%`,transformOrigin:'bottom'}}/>)}</div>
  </article>
}

const sampleTrend: TrendPoint[] = [
  {label:'Mon',value:42},{label:'Tue',value:58},{label:'Wed',value:48},
  {label:'Thu',value:78},{label:'Fri',value:63},{label:'Sat',value:91},{label:'Sun',value:72}
]

export function TrendChart({
  title = 'Weekly visitors',
  data = sampleTrend,
  valueSuffix = ''
}: {
  title?: string
  data?: TrendPoint[]
  valueSuffix?: string
}) {
  const max = Math.max(1, ...data.map(point => point.value))
  const [highlight, setHighlight] = useState(Math.max(0, data.length - 1))
  return <article className="trend-chart-component">
    <div className="tcc-head"><div><span>PERFORMANCE</span><h4>{title}</h4></div><motion.span key={data.length ? data[Math.min(highlight,data.length-1)].value : 0} className="tcc-summary" initial={{opacity:0,y:5}} animate={{opacity:1,y:0}} transition={{type:'spring',stiffness:300,damping:22}}><TrendingUp size={13}/>{data.length ? data[Math.min(highlight,data.length-1)].value.toLocaleString() : 0}{valueSuffix}</motion.span></div>
    {data.length ? <div className="tcc-chart" aria-label={title}>
      <div className="tcc-grid-lines"><i/><i/><i/><i/></div>
      {data.map((point,index)=><motion.button layout key={point.label+index} type="button" initial={{opacity:0,y:10,scale:.96}} animate={{opacity:1,y:0,scale:1}} transition={{type:'spring',stiffness:280,damping:23,delay:Math.min(index*.025,.2)}} className={index===highlight?'active':''} onMouseEnter={()=>setHighlight(index)} onFocus={()=>setHighlight(index)} onClick={()=>setHighlight(index)} aria-label={`${point.label}: ${point.value}${valueSuffix}`} title={`${point.label}: ${point.value}${valueSuffix}`}><motion.i animate={{height:`${Math.max(5,point.value/max*100)}%`}} transition={{type:'spring',stiffness:210,damping:22}}/><span>{point.label}</span></motion.button>)}
    </div> : <p className="tcc-empty">Add data points to draw the trend.</p>}
    <div className="tcc-foot"><span><i/> Trend</span><span>{data.length} data points</span></div>
  </article>
}

const defaultSources: TrafficSource[] = [
  {name:'Direct',value:38,color:'#ff535f'},
  {name:'Search',value:29,color:'#a78bfa'},
  {name:'Social',value:21,color:'#65d8a0'},
  {name:'Referral',value:12,color:'#79b7ff'}
]

export function TrafficSources({
  title = 'Traffic sources',
  data = defaultSources
}: {
  title?: string
  data?: TrafficSource[]
}) {
  const total = data.reduce((sum,source)=>sum+Math.max(0,source.value),0)
  return <article className="traffic-sources-component">
    <div className="asc-head"><div><span>ACQUISITION</span><h4>{title}</h4></div><span className="asc-total">{total.toLocaleString()}<small>TOTAL</small></span></div>
    <div className="asc-stacked-bar" role="img" aria-label={data.map(source=>source.name+' '+(total?Math.round(source.value/total*100):0)+'%').join(', ')}>{data.map((source,index)=><motion.i key={source.name+index} initial={{width:0,opacity:0}} animate={{width:`${total?Math.max(0,source.value)/total*100:0}%`,opacity:1}} transition={{type:'spring',stiffness:190,damping:24,delay:index*.045}} style={{background:source.color||'var(--accent)'}}/>)}</div>
    <div className="asc-list">{data.map((source,index)=><motion.div layout className="asc-row" key={source.name+index} initial={{opacity:0,x:-8}} animate={{opacity:1,x:0}} transition={{type:'spring',stiffness:280,damping:24,delay:index*.035}}><span><i style={{background:source.color||'var(--accent)'}}/>{source.name}</span><b><motion.span key={source.value} initial={{opacity:0,y:5}} animate={{opacity:1,y:0}} transition={{type:'spring',stiffness:300,damping:22}}>{source.value.toLocaleString()}</motion.span><small>{total?Math.round(source.value/total*100):0}%</small></b></motion.div>)}</div>
    <p className="asc-note">Percentages are calculated from the supplied values.</p>
  </article>
}

const defaultColumns: AnalyticsColumn[] = [
  {key:'page',label:'Page'},{key:'visitors',label:'Visitors'},{key:'change',label:'Change'}
]
const defaultRows: AnalyticsRow[] = [
  {page:'/dashboard',visitors:4280,change:'+12.4%'},
  {page:'/pricing',visitors:2310,change:'+6.8%'},
  {page:'/docs',visitors:1940,change:'+18.2%'},
  {page:'/signup',visitors:1240,change:'−2.1%'}
]

export function AnalyticsTable({
  title = 'Top pages',
  columns = defaultColumns,
  rows = defaultRows
}: {
  title?: string
  columns?: AnalyticsColumn[]
  rows?: AnalyticsRow[]
}) {
  const [sortBy, setSortBy] = useState(columns[1]?.key || columns[0]?.key || '')
  const [descending, setDescending] = useState(true)
  const sorted = useMemo(()=>[...rows].sort((a,b)=>{
    const left=a[sortBy], right=b[sortBy]
    if(typeof left==='number'&&typeof right==='number') return (left-right)*(descending?-1:1)
    return String(left??'').localeCompare(String(right??''))*(descending?-1:1)
  }),[rows,sortBy,descending])
  const sort=(key:string)=>{if(sortBy===key)setDescending(value=>!value);else{setSortBy(key);setDescending(true)}}
  return <article className="analytics-table-component">
    <div className="atc-head"><div><span>CONTENT PERFORMANCE</span><h4>{title}</h4></div><span>{rows.length} rows</span></div>
    <div className="atc-scroll"><table><thead><tr>{columns.map(column=><th key={column.key}><button onClick={()=>sort(column.key)}>{column.label}{sortBy===column.key?(descending?<ChevronDown size={12}/>:<ChevronUp size={12}/>):null}</button></th>)}</tr></thead><tbody>{sorted.map((row,index)=><motion.tr layout key={String(columns[0] ? row[columns[0].key] : index)} initial={{opacity:0,y:7}} animate={{opacity:1,y:0}} transition={{type:'spring',stiffness:300,damping:25,delay:Math.min(index*.025,.15)}}>{columns.map(column=><td key={column.key}>{column.key==='change'?<span className={String(row[column.key]).startsWith('+')?'atc-positive':'atc-neutral'}>{row[column.key]}</span>:row[column.key]}</td>)}</motion.tr>)}</tbody></table></div>
    <div className="atc-foot">Select a column heading to sort the rows.</div>
  </article>
}

export const analyticsExamples = {
  trend: sampleTrend,
  sources: defaultSources,
  columns: defaultColumns,
  rows: defaultRows
}
