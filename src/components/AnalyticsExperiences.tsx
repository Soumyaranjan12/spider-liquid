import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Activity, ArrowDownRight, ArrowUpRight, CirclePause, CirclePlay, Clock3, MousePointer2, Radio, RefreshCw, Sparkles, Users, Zap } from 'lucide-react'

type Range = '15m' | '1h' | '24h'
type Channel = 'All traffic' | 'Web' | 'App'
type Metric = 'Visitors' | 'Events' | 'Errors'

const liveSeries: Record<Range, number[]> = {
  '15m': [34, 42, 38, 49, 45, 63, 54, 60, 52, 73, 67, 78, 62, 86, 74, 82, 76, 95, 83, 91, 79, 99],
  '1h': [25, 32, 29, 44, 39, 42, 55, 49, 62, 58, 50, 71, 65, 76, 64, 83, 74, 69, 88, 79, 95, 87],
  '24h': [22, 28, 36, 32, 44, 51, 43, 59, 54, 64, 71, 60, 78, 73, 88, 81, 74, 91, 84, 98, 89, 94]
}
const channelScale: Record<Channel, number> = { 'All traffic': 1, Web: .72, App: .28 }

function amount(value: number) { return Math.round(value).toLocaleString('en-US') }

export function RealtimePulseDashboard() {
  const [range, setRange] = useState<Range>('15m')
  const [channel, setChannel] = useState<Channel>('All traffic')
  const [metric, setMetric] = useState<Metric>('Visitors')
  const [live, setLive] = useState(true)
  const [tick, setTick] = useState(0)
  const [events, setEvents] = useState([
    { id: 4, kind: 'checkout.completed', place: 'Singapore', ago: 'just now', tone: 'green' },
    { id: 3, kind: 'page.viewed', place: 'Bengaluru', ago: '2 sec ago', tone: 'blue' },
    { id: 2, kind: 'session.started', place: 'London', ago: '5 sec ago', tone: 'violet' },
    { id: 1, kind: 'signup.completed', place: 'Toronto', ago: '8 sec ago', tone: 'green' }
  ])
  const reduced = useReducedMotion()

  useEffect(() => {
    if (!live) return
    const timer = window.setInterval(() => {
      setTick(value => value + 1)
      setEvents(previous => {
        const samples = [
          ['checkout.completed', 'Singapore', 'green'],
          ['page.viewed', 'Bengaluru', 'blue'],
          ['session.started', 'London', 'violet'],
          ['signup.completed', 'Toronto', 'green'],
          ['search.performed', 'Berlin', 'blue'],
          ['product.opened', 'New York', 'violet']
        ] as const
        const sample = samples[(Date.now() / 1000 | 0) % samples.length]
        return [{ id: Date.now(), kind: sample[0], place: sample[1], ago: 'just now', tone: sample[2] }, ...previous.slice(0, 3)]
      })
    }, 2600)
    return () => window.clearInterval(timer)
  }, [live])

  const series = useMemo(() => liveSeries[range].map((value, index) => {
    const wiggle = live && !reduced ? ((tick + index * 3) % 7 - 3) * (metric === 'Errors' ? .7 : 1.55) : 0
    const multiplier = metric === 'Events' ? 1.28 : metric === 'Errors' ? .18 : 1
    return Math.max(2, (value + wiggle) * multiplier * channelScale[channel])
  }), [range, tick, live, reduced, metric, channel])
  const max = Math.max(...series, 1)
  const total = series.reduce((sum, value) => sum + value, 0)
  const width = 900, height = 200
  const coords = series.map((value, index) => ({ x: index / Math.max(1, series.length - 1) * width, y: 169 - value / max * 122 }))
  const linePath = coords.map((point, index) => `${index ? 'L' : 'M'} ${point.x} ${point.y}`).join(' ')
  const areaPath = `${linePath} L ${width} ${height} L 0 ${height} Z`
  const active = Math.round((245 + (tick % 9 - 4) * (live && !reduced ? 4 : 0)) * channelScale[channel] * (metric === 'Events' ? 1.6 : metric === 'Errors' ? .08 : 1))
  const eventTotal = Math.round(total * (metric === 'Events' ? 16.4 : metric === 'Errors' ? .6 : 1.8))

  return <section className="pulse-dashboard">
    <header className="pulse-header">
      <div><span className="ad-eyebrow"><Radio size={12} /> LIVE INSTRUMENTATION</span><h3>Realtime Pulse <motion.i className={live ? 'pulse-live-dot' : 'pulse-live-dot is-paused'} animate={live && !reduced ? { scale: [1, 1.25, 1], opacity: [1, .7, 1] } : { scale: 1, opacity: .5 }} transition={{ duration: 1.5, repeat: live && !reduced ? Infinity : 0 }} /></h3><p>Activity moving through your product, right now.</p></div>
      <div className="pulse-head-actions"><span className={'pulse-status ' + (live ? 'is-live' : '')}>{live ? 'LIVE STREAM' : 'PAUSED'}</span><button className="pulse-live-toggle" type="button" onClick={() => setLive(value => !value)}>{live ? <CirclePause size={14}/> : <CirclePlay size={14}/>} {live ? 'Pause' : 'Resume'}</button></div>
    </header>
    <div className="pulse-toolbar">
      <div className="pulse-tabs" role="group" aria-label="Channel filter">{(['All traffic', 'Web', 'App'] as Channel[]).map(item => <button type="button" key={item} className={channel === item ? 'active' : ''} onClick={() => setChannel(item)}>{item}</button>)}</div>
      <div className="pulse-tabs pulse-range" role="group" aria-label="Time window">{(['15m', '1h', '24h'] as Range[]).map(item => <button type="button" key={item} className={range === item ? 'active' : ''} onClick={() => setRange(item)}>{item}</button>)}</div>
    </div>
    <div className="pulse-metrics">
      {[
        { label: 'Active visitors', value: amount(active), change: '+12.6%', tone: 'up', icon: Users },
        { label: 'Events processed', value: amount(eventTotal), change: '+8.2%', tone: 'up', icon: Zap },
        { label: 'Median response', value: `${Math.max(42, 86 - tick % 13)} ms`, change: '−4.1%', tone: 'up', icon: Clock3 }
      ].map((item, index) => <motion.article key={item.label} className="pulse-metric" layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * .06, type: 'spring', stiffness: 260, damping: 23 }}>
        <div className="pulse-metric-head"><span>{item.label}</span><i><item.icon size={14}/></i></div>
        <motion.strong key={item.value} initial={{ opacity: .3, y: 6, filter: 'blur(4px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }} transition={{ type: 'spring', stiffness: 320, damping: 24 }}>{item.value}</motion.strong>
        <div className="pulse-metric-foot"><span className="pulse-change"><ArrowUpRight size={12}/>{item.change}</span><span>vs prior window</span></div>
        <div className="pulse-mini-spark" aria-hidden="true">{series.slice(-10).map((point, i) => <motion.i key={i} animate={{ height: `${Math.max(9, point / max * 100)}%` }} transition={{ type: 'spring', stiffness: 220, damping: 20, delay: i * .012 }} />)}</div>
      </motion.article>)}
    </div>
    <div className="pulse-main-grid">
      <article className="pulse-chart-card">
        <div className="pulse-chart-heading"><div><span className="ad-eyebrow">LIVE SIGNAL</span><h4>Stream volume</h4></div><div className="pulse-metric-picks" role="group" aria-label="Stream metric">{(['Visitors', 'Events', 'Errors'] as Metric[]).map(item => <button type="button" key={item} className={metric === item ? 'active' : ''} onClick={() => setMetric(item)}>{item}</button>)}</div></div>
        <div className="pulse-chart">
          <div className="pulse-chart-grid"><i/><i/><i/><i/></div>
          <svg viewBox="0 0 900 200" role="img" aria-label={`${metric} live line chart for ${range}`} preserveAspectRatio="none">
            <defs><linearGradient id="pulseArea" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#ff5267" stopOpacity=".3"/><stop offset="100%" stopColor="#ff5267" stopOpacity="0"/></linearGradient><linearGradient id="pulseLine" x1="0" x2="1"><stop offset="0%" stopColor="#ff9aa6"/><stop offset="100%" stopColor="#ff3e55"/></linearGradient></defs>
            <motion.path key={areaPath} d={areaPath} fill="url(#pulseArea)" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: .4 }}/>
            <motion.path key={linePath} d={linePath} fill="none" stroke="url(#pulseLine)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" initial={{ pathLength: 0, opacity: .7 }} animate={{ pathLength: 1, opacity: 1 }} transition={{ duration: reduced ? 0 : .65, ease: 'easeOut' }}/>
            <motion.circle cx={coords[coords.length - 1]?.x ?? 900} cy={coords[coords.length - 1]?.y ?? 50} r="7" fill="#ff5267" fillOpacity=".22" animate={!reduced && live ? { r: [5, 11, 5], fillOpacity: [.3, .08, .3] } : { r: 6 }} transition={{ duration: 1.6, repeat: live && !reduced ? Infinity : 0 }}/>
            <circle cx={coords[coords.length - 1]?.x ?? 900} cy={coords[coords.length - 1]?.y ?? 50} r="3.4" fill="#fff" stroke="#ff5367" strokeWidth="2"/>
          </svg>
        </div>
        <div className="pulse-axis-labels"><span>{range === '15m' ? '−15 min' : range === '1h' ? '−60 min' : '00:00'}</span><span>{range === '24h' ? '12:00' : '−' + (range === '15m' ? '7 min' : '30 min')}</span><span>NOW</span></div>
        <div className="pulse-chart-foot"><span><i/> Incoming {metric.toLowerCase()}</span><span><RefreshCw size={11}/> Updated every 2.6 sec</span></div>
      </article>
      <article className="pulse-events-card">
        <div className="pulse-chart-heading"><div><span className="ad-eyebrow">EVENT STREAM</span><h4>Latest signals</h4></div><span className="pulse-event-count">{events.length} recent</span></div>
        <div className="pulse-event-list"><AnimatePresence initial={false}>{events.map((event, index) => <motion.div layout key={event.id} className="pulse-event" initial={{ opacity: 0, y: -10, scale: .97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, x: 20, height: 0 }} transition={{ type: 'spring', stiffness: 300, damping: 25 }}>
          <span className={'pulse-event-icon tone-' + event.tone}><Activity size={13}/></span><span className="pulse-event-copy"><b>{event.kind}</b><small>{event.place}</small></span><span className="pulse-event-ago">{index === 0 && live ? 'now' : event.ago}</span>
        </motion.div>)}</AnimatePresence></div>
        <div className="pulse-event-foot"><span className="pulse-event-dot" /> Listening for events</div>
      </article>
    </div>
    <footer className="pulse-footer"><span><MousePointer2 size={12}/> Interactions update the preview</span><span>Sample telemetry · no backend connected</span></footer>
  </section>
}

type FunnelMode = 'Signup' | 'Checkout'
type Device = 'All devices' | 'Desktop' | 'Mobile'
const funnelData: Record<FunnelMode, { stage: string; value: number; note: string }[]> = {
  Signup: [
    { stage: 'Visited landing', value: 24800, note: 'Discovery and initial interest' },
    { stage: 'Viewed plans', value: 14620, note: 'Pricing intent' },
    { stage: 'Started signup', value: 8320, note: 'Registration form opened' },
    { stage: 'Verified email', value: 5940, note: 'Email successfully confirmed' },
    { stage: 'Activated', value: 4260, note: 'First key action completed' }
  ],
  Checkout: [
    { stage: 'Product viewed', value: 18600, note: 'Product detail engagement' },
    { stage: 'Added to cart', value: 9420, note: 'Purchase intent recorded' },
    { stage: 'Checkout started', value: 6230, note: 'Checkout flow opened' },
    { stage: 'Payment submitted', value: 4610, note: 'Payment attempt submitted' },
    { stage: 'Order completed', value: 3890, note: 'Purchase confirmed' }
  ]
}

export function ConversionFunnelDashboard() {
  const [mode, setMode] = useState<FunnelMode>('Signup')
  const [range, setRange] = useState<'7d' | '30d'>('7d')
  const [device, setDevice] = useState<Device>('All devices')
  const [selected, setSelected] = useState(2)
  const [showLoss, setShowLoss] = useState(true)
  const reduced = useReducedMotion()
  const scale = (device === 'Desktop' ? .57 : device === 'Mobile' ? .39 : 1) * (range === '30d' ? 3.64 : 1)
  const stages = useMemo(() => funnelData[mode].map((stage, index) => ({ ...stage, value: Math.round(stage.value * scale * (1 + ((index % 2) ? .015 : 0))) })), [mode, scale])
  const max = stages[0]?.value ?? 1
  const start = stages[0]?.value ?? 0
  const final = stages[stages.length - 1]?.value ?? 0
  const conversion = start ? final / start * 100 : 0
  const active = stages[selected]
  const preceding = stages[Math.max(0, selected - 1)]
  const drop = selected === 0 || !preceding?.value ? 0 : Math.max(0, (preceding.value - (active?.value ?? 0)) / preceding.value * 100)
  const totalLoss = start ? (start - final) / start * 100 : 0

  return <section className="funnel-dashboard">
    <header className="funnel-header"><div><span className="ad-eyebrow"><Sparkles size={12}/> JOURNEY ANALYTICS / 02</span><h3>Conversion Studio</h3><p>Find the step where intent fades and opportunities leak.</p></div><div className="funnel-top-right"><span className="funnel-demo-label">ILLUSTRATIVE DATA</span><div className="funnel-tabs" role="group" aria-label="Funnel mode">{(['Signup', 'Checkout'] as FunnelMode[]).map(item => <button type="button" key={item} className={mode === item ? 'active' : ''} onClick={() => { setMode(item); setSelected(2) }}>{item}</button>)}</div></div></header>
    <div className="funnel-toolbar"><div className="funnel-tabs" role="group" aria-label="Date range">{(['7d', '30d'] as const).map(item => <button key={item} type="button" className={range === item ? 'active' : ''} onClick={() => setRange(item)}>{item}</button>)}</div><div className="funnel-tabs" role="group" aria-label="Device filter">{(['All devices', 'Desktop', 'Mobile'] as Device[]).map(item => <button key={item} type="button" className={device === item ? 'active' : ''} onClick={() => setDevice(item)}>{item}</button>)}</div></div>
    <div className="funnel-kpis">
      <motion.article key={start} layout><span>Entrances</span><motion.b initial={{ y: 5, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>{amount(start)}</motion.b><small><ArrowUpRight size={12}/> +9.3% vs prior period</small></motion.article>
      <motion.article key={final} layout><span>Completed</span><motion.b initial={{ y: 5, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>{amount(final)}</motion.b><small><ArrowUpRight size={12}/> +4.8% vs prior period</small></motion.article>
      <motion.article layout><span>Overall conversion</span><motion.b key={conversion.toFixed(1)} initial={{ y: 5, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>{conversion.toFixed(1)}%</motion.b><small className="funnel-muted">Entry to completion</small></motion.article>
    </div>
    <div className="funnel-content-grid">
      <article className="funnel-chart-card"><div className="pulse-chart-heading"><div><span className="ad-eyebrow">STEP-BY-STEP FLOW</span><h4>{mode} conversion path</h4></div><button type="button" className={'funnel-loss-toggle ' + (showLoss ? 'active' : '')} onClick={() => setShowLoss(value => !value)}>{showLoss ? 'Hide' : 'Show'} drop-off</button></div>
        <div className="funnel-stages">{stages.map((stage, index) => { const share = max ? stage.value / max * 100 : 0; const next = stages[index + 1]; const lossPercent = next && stage.value ? (stage.value - next.value) / stage.value * 100 : 0; return <div className="funnel-stage-wrap" key={stage.stage}>
          <motion.button layout type="button" className={'funnel-stage ' + (selected === index ? 'active' : '')} onClick={() => setSelected(index)} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ type: 'spring', stiffness: 240, damping: 23, delay: index * .045 }}>
            <span className="funnel-stage-number">0{index + 1}</span><span className="funnel-stage-info"><b>{stage.stage}</b><small>{share.toFixed(1)}% of entry cohort</small></span><span className="funnel-stage-count">{amount(stage.value)}</span><span className="funnel-stage-track"><motion.i initial={{ width: 0 }} animate={{ width: share + '%' }} transition={{ type: 'spring', stiffness: 120, damping: 20, delay: index * .07 }}/></span>
          </motion.button>
          {showLoss && next && <motion.div className="funnel-drop-off" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}><span/><b><ArrowDownRight size={11}/>{amount(stage.value - next.value)} lost</b><small>{Math.max(0, lossPercent).toFixed(1)}%</small></motion.div>}
        </div>})}</div>
      </article>
      <AnimatePresence mode="wait"><motion.article key={stageIndexKey(mode, selected, device, range)} className="funnel-insight-card" initial={{ opacity: 0, x: 14, filter: 'blur(4px)' }} animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }} exit={{ opacity: 0, x: -8 }} transition={{ duration: reduced ? 0 : .22 }}>
        <span className="ad-eyebrow">SELECTED STAGE / 0{selected + 1}</span><h4>{active?.stage}</h4><p>{active?.note}</p>
        <div className="funnel-insight-number"><span>Users at this step</span><motion.b key={active?.value} initial={{ y: 7, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>{amount(active?.value ?? 0)}</motion.b></div>
        <div className="funnel-insight-meter"><div><span>From initial entry</span><b>{start ? ((active?.value ?? 0) / start * 100).toFixed(1) : '0'}%</b></div><div className="funnel-meter-track"><motion.i initial={{ width: 0 }} animate={{ width: (start ? (active?.value ?? 0) / start * 100 : 0) + '%' }} transition={{ type: 'spring', stiffness: 150, damping: 23 }}/></div></div>
        <div className="funnel-insight-meter"><div><span>Drop from prior step</span><b>{selected ? drop.toFixed(1) + '%' : '—'}</b></div><div className="funnel-meter-track loss"><motion.i initial={{ width: 0 }} animate={{ width: (selected ? drop : 0) + '%' }} transition={{ type: 'spring', stiffness: 150, damping: 23 }}/></div></div>
        <div className="funnel-insight-tip"><Sparkles size={14}/><span>{selected === 0 ? 'This is the baseline. Compare later stages to locate friction.' : drop > 30 ? 'High drop-off: test clearer messaging or reduce friction at this step.' : 'Drop-off is comparatively contained. Keep validating the experience.'}</span></div>
      </motion.article></AnimatePresence>
    </div>
    <footer className="pulse-footer"><span><Activity size={12}/> Select a stage to inspect conversion</span><span>Sample funnel · no backend connected</span></footer>
  </section>
}

function stageIndexKey(mode: FunnelMode, selected: number, device: Device, range: string) { return `${mode}-${selected}-${device}-${range}` }
