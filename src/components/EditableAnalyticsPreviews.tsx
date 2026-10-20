import type { Dispatch, SetStateAction } from 'react'
import AnalyticsFlipCard from './AnalyticsFlipCard'
import { AnalyticsTable, MetricCard, TrafficSources, TrendChart, type AnalyticsColumn, type AnalyticsRow, type TrafficSource, type TrendPoint } from './AnalyticsComponents'

type MetricConfig = { title:string; value:string; change:string; direction:'up'|'down'; caption:string }
const metricDefaults:MetricConfig={title:'Monthly revenue',value:'$24,680',change:'8.4',direction:'up',caption:'vs previous month'}

export function EditableMetricCard() {
  return <AnalyticsFlipCard<MetricConfig> name="Analytics Metric Card" storageKey="spiderpanda.metric-card.v1" defaults={metricDefaults}
    renderPreview={data=><MetricCard title={data.title} value={data.value} change={`${Number(data.change)>=0?'+':'−'}${Math.abs(Number(data.change)||0)}%`} direction={data.direction} caption={data.caption}/>}
    renderEditor={(draft,setDraft)=><MetricEditor draft={draft} setDraft={setDraft}/>}
  />
}
function MetricEditor({draft,setDraft}:{draft:MetricConfig;setDraft:Dispatch<SetStateAction<MetricConfig>>}) {
  const field=(key:keyof MetricConfig,value:string)=>setDraft(previous=>({...previous,[key]:value}))
  return <div className="afc-fields"><label>Metric title<input value={draft.title} onChange={e=>field('title',e.target.value)}/></label><label>Value<input type="text" value={draft.value} onChange={e=>field('value',e.target.value)}/></label><label>Change (%)<input type="number" step="any" value={draft.change} onChange={e=>field('change',e.target.value)}/></label><label>Comparison caption<input value={draft.caption} onChange={e=>field('caption',e.target.value)}/></label><label>Trend direction<select value={draft.direction} onChange={e=>field('direction',e.target.value as 'up'|'down')}><option value="up">Up</option><option value="down">Down</option></select></label><p className="afc-hint">The metric and comparison update in the preview after confirmation.</p></div>
}

type TrendConfig = {title:string;labels:string;values:string;suffix:string}
const trendDefaults:TrendConfig={title:'Weekly visitors',labels:'Mon, Tue, Wed, Thu, Fri, Sat, Sun',values:'42, 58, 48, 78, 63, 91, 72',suffix:''}
function trendPoints(config:TrendConfig):TrendPoint[] {
  const values=config.values.split(/[\n,]/).map(v=>v.trim()).filter(Boolean).map(Number).filter(v=>Number.isFinite(v)&&v>=0).slice(0,30)
  const labels=config.labels.split(/[\n,]/).map(v=>v.trim()).filter(Boolean)
  return values.map((value,index)=>({value,label:labels[index]||String(index+1)}))
}
export function EditableTrendChart() {
  return <AnalyticsFlipCard<TrendConfig> name="Analytics Trend Chart" storageKey="spiderpanda.trend-chart.v1" defaults={trendDefaults}
    renderPreview={data=><TrendChart title={data.title} data={trendPoints(data)} valueSuffix={data.suffix}/>}
    renderEditor={(draft,setDraft)=><div className="afc-fields"><label>Chart title<input value={draft.title} onChange={e=>setDraft(p=>({...p,title:e.target.value}))}/></label><label>Value suffix (optional)<input value={draft.suffix} onChange={e=>setDraft(p=>({...p,suffix:e.target.value}))} placeholder="%, k, ms…"/></label><label>Point labels · comma separated<input value={draft.labels} onChange={e=>setDraft(p=>({...p,labels:e.target.value}))}/></label><label>Graph values · comma or line separated<textarea rows={4} value={draft.values} onChange={e=>setDraft(p=>({...p,values:e.target.value}))} spellCheck={false}/></label><p className="afc-hint">Enter up to 30 non-negative numbers. Each value becomes one bar, and the graph scales to your data.</p></div>}
  />
}

type TrafficConfig = {title:string;directName:string;directValue:string;searchName:string;searchValue:string;socialName:string;socialValue:string;referralName:string;referralValue:string}
const trafficDefaults:TrafficConfig={title:'Traffic sources',directName:'Direct',directValue:'38',searchName:'Search',searchValue:'29',socialName:'Social',socialValue:'21',referralName:'Referral',referralValue:'12'}
function trafficRows(data:TrafficConfig):TrafficSource[] {return [
  {name:data.directName||'Direct',value:Math.max(0,Number(data.directValue)||0),color:'#ff535f'},
  {name:data.searchName||'Search',value:Math.max(0,Number(data.searchValue)||0),color:'#a78bfa'},
  {name:data.socialName||'Social',value:Math.max(0,Number(data.socialValue)||0),color:'#65d8a0'},
  {name:data.referralName||'Referral',value:Math.max(0,Number(data.referralValue)||0),color:'#79b7ff'}
]}
const trafficEditorFields = [
  {prefix:'direct',nameKey:'directName',valueKey:'directValue',name:'Direct',color:'#ff535f'},
  {prefix:'search',nameKey:'searchName',valueKey:'searchValue',name:'Search',color:'#a78bfa'},
  {prefix:'social',nameKey:'socialName',valueKey:'socialValue',name:'Social',color:'#65d8a0'},
  {prefix:'referral',nameKey:'referralName',valueKey:'referralValue',name:'Referral',color:'#79b7ff'}
] as const
export function EditableTrafficSources() {
  return <AnalyticsFlipCard<TrafficConfig> name="Traffic Sources" storageKey="spiderpanda.traffic-sources.v1" defaults={trafficDefaults}
    renderPreview={data=><TrafficSources title={data.title} data={trafficRows(data)}/>}
    renderEditor={(draft,setDraft)=><div className="afc-fields"><label>Widget title<input value={draft.title} onChange={e=>setDraft(p=>({...p,title:e.target.value}))}/></label><div className="afc-source-editor">{trafficEditorFields.map(source=><div className="afc-source-pair" key={source.prefix}><label><span><i style={{background:source.color}}/>{source.name} label</span><input value={draft[source.nameKey]} onChange={e=>setDraft(p=>({...p,[source.nameKey]:e.target.value}))}/></label><label><span>Value</span><input type="number" min="0" step="any" value={draft[source.valueKey]} onChange={e=>setDraft(p=>({...p,[source.valueKey]:e.target.value}))}/></label></div>)}</div><p className="afc-hint">Source percentages and the stacked bar are calculated from these values after confirmation.</p></div>}
  />
}

type TableConfig = {title:string;pages:string;visitors:string;changes:string}
const tableDefaults:TableConfig={title:'Top pages',pages:'/dashboard\n/pricing\n/docs\n/signup',visitors:'4280\n2310\n1940\n1240',changes:'+12.4%\n+6.8%\n+18.2%\n-2.1%'}
function tableData(data:TableConfig):{columns:AnalyticsColumn[];rows:AnalyticsRow[]} {
  const pages=data.pages.split('\n').map(v=>v.trim()).filter(Boolean)
  const visitors=data.visitors.split('\n')
  const changes=data.changes.split('\n')
  return {columns:[{key:'page',label:'Page'},{key:'visitors',label:'Visitors'},{key:'change',label:'Change'}],rows:pages.map((page,index)=>({page,visitors:Math.max(0,Number(visitors[index])||0),change:changes[index]?.trim()||'—'}))}
}
export function EditableAnalyticsTable() {
  return <AnalyticsFlipCard<TableConfig> name="Analytics Data Table" storageKey="spiderpanda.analytics-table.v1" defaults={tableDefaults}
    renderPreview={data=>{const result=tableData(data);return <AnalyticsTable title={data.title} columns={result.columns} rows={result.rows}/>}}
    renderEditor={(draft,setDraft)=><div className="afc-fields"><label>Table title<input value={draft.title} onChange={e=>setDraft(p=>({...p,title:e.target.value}))}/></label><div className="afc-table-editor"><label>Pages · one per line<textarea rows={5} value={draft.pages} onChange={e=>setDraft(p=>({...p,pages:e.target.value}))}/></label><label>Visitor values · same line order<textarea rows={5} value={draft.visitors} onChange={e=>setDraft(p=>({...p,visitors:e.target.value}))}/></label><label>Change labels · same line order<textarea rows={5} value={draft.changes} onChange={e=>setDraft(p=>({...p,changes:e.target.value}))}/></label></div><p className="afc-hint">The preview rebuilds rows from these three line-separated lists and keeps sortable column headers.</p></div>}
  />
}
