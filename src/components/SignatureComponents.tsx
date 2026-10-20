import { useEffect, useState, type CSSProperties, type ReactNode } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Activity, ArrowUpRight, Check, Command, Compass, Home, Layers3, Plus, Search, Settings2, Sparkles, UserRound, X } from 'lucide-react'

type SpotStyle = CSSProperties & { '--spot-x'?: string; '--spot-y'?: string; '--tilt-x'?: string; '--tilt-y'?: string }

export function PrismButton({ children = 'Launch sequence', onClick }: { children?: ReactNode; onClick?: () => void }) {
  const [spot, setSpot] = useState({ x: 50, y: 50 })
  const reduced = useReducedMotion()
  return <motion.button
    type="button"
    className="sp-prism-button"
    style={{ '--spot-x': spot.x + '%', '--spot-y': spot.y + '%' } as SpotStyle}
    whileHover={reduced ? undefined : { y: -3, scale: 1.025 }}
    whileTap={reduced ? undefined : { scale: .965, y: 0 }}
    transition={{ type: 'spring', stiffness: 420, damping: 22 }}
    onPointerMove={event => {
      const box = event.currentTarget.getBoundingClientRect()
      setSpot({ x: ((event.clientX - box.left) / box.width) * 100, y: ((event.clientY - box.top) / box.height) * 100 })
    }}
    onPointerLeave={() => setSpot({ x: 50, y: 50 })}
    onClick={onClick}
  >
    <span className="sp-prism-noise" aria-hidden="true" />
    <span className="sp-prism-label">{children}<ArrowUpRight size={16} /></span>
  </motion.button>
}

export function MercurySwitch({ defaultChecked = true, label = 'Fluid motion' }: { defaultChecked?: boolean; label?: string }) {
  const [checked, setChecked] = useState(defaultChecked)
  const reduced = useReducedMotion()
  return <div className="sp-mercury-wrap">
    <div className="sp-mercury-label"><span>{label}</span><small>{checked ? 'On' : 'Off'}</small></div>
    <button type="button" className="sp-mercury-switch" role="switch" aria-checked={checked} aria-label={label} onClick={() => setChecked(value => !value)}>
      <motion.span className="sp-mercury-track" animate={{ backgroundColor: checked ? '#ff4859' : 'rgba(255,255,255,.11)', borderColor: checked ? 'rgba(255,110,127,.72)' : 'rgba(255,255,255,.18)' }} transition={{ duration: .18 }} />
      <motion.span className="sp-mercury-thumb" animate={{ x: checked ? 28 : 0, scale: checked ? [1, 1.17, .94, 1] : [1, .9, 1] }} transition={reduced ? { duration: 0 } : { type: 'spring', stiffness: 560, damping: 17, mass: .58 }} />
    </button>
  </div>
}

export function RefractiveCard() {
  const [tilt, setTilt] = useState({ x: 0, y: 0, px: 50, py: 40 })
  const reduced = useReducedMotion()
  return <motion.div
    className="sp-refractive-card"
    style={{ '--spot-x': tilt.px + '%', '--spot-y': tilt.py + '%', '--tilt-x': tilt.x + 'deg', '--tilt-y': tilt.y + 'deg' } as SpotStyle}
    onPointerMove={event => {
      const r = event.currentTarget.getBoundingClientRect()
      const nx = (event.clientX - r.left) / r.width
      const ny = (event.clientY - r.top) / r.height
      setTilt({ x: (0.5 - ny) * 11, y: (nx - 0.5) * 13, px: nx * 100, py: ny * 100 })
    }}
    onPointerLeave={() => setTilt({ x: 0, y: 0, px: 50, py: 40 })}
    animate={reduced ? undefined : { rotateX: tilt.x, rotateY: tilt.y }}
    transition={{ type: 'spring', stiffness: 180, damping: 22, mass: .7 }}
  >
    <div className="sp-refract-aurora" />
    <div className="sp-refract-top"><span className="sp-refract-icon"><Layers3 size={17} /></span><span className="sp-live-pill"><i /> LIVE MATERIAL</span></div>
    <div className="sp-refract-body"><span className="sp-component-eyebrow">SURFACE / 003</span><h3>Glass, in motion.</h3><p>Move your cursor across the surface. Light bends; the edge catches a soft red flare.</p></div>
    <div className="sp-refract-footer"><span>REFRACTION STUDY</span><span>01 <i /> 04</span></div>
  </motion.div>
}

const dockItems = [
  { label: 'Home', icon: Home },
  { label: 'Explore', icon: Compass },
  { label: 'Layers', icon: Layers3 },
  { label: 'Profile', icon: UserRound }
]
export function LiquidDock() {
  const [active, setActive] = useState('Explore')
  return <div className="sp-dock-demo">
    <nav className="sp-liquid-dock" aria-label="Demo navigation">
      {dockItems.map(({ label, icon: Icon }) => <button type="button" key={label} className={active === label ? 'active' : ''} onClick={() => setActive(label)} aria-current={active === label ? 'page' : undefined}>
        {active === label && <motion.span className="sp-dock-active" layoutId="sp-dock-active" transition={{ type: 'spring', stiffness: 450, damping: 32 }} />}
        <Icon size={18} strokeWidth={1.8} /><span>{label}</span>
      </button>)}
    </nav>
    <div className="sp-dock-status"><span className="sp-status-dot" /> Active destination <b>{active}</b></div>
  </div>
}

const segmentOptions = ['Glass', 'Liquid', 'Solid']
export function FluidSegmentedControl() {
  const [active, setActive] = useState('Liquid')
  return <div className="sp-segment-wrap">
    <div className="sp-fluid-segment" role="group" aria-label="Surface material">
      {segmentOptions.map(option => <button key={option} type="button" onClick={() => setActive(option)} className={active === option ? 'active' : ''}>
        {active === option && <motion.span layoutId="sp-segment-active" className="sp-segment-active" transition={{ type: 'spring', stiffness: 430, damping: 31 }} />}
        <span>{option}</span>
      </button>)}
    </div>
    <div className={'sp-segment-sample material-' + active.toLowerCase()}><span className="sp-segment-sample-icon"><Sparkles size={16} /></span><div><b>{active} material</b><small>{active === 'Glass' ? 'Quiet transparency · soft blur' : active === 'Liquid' ? 'Elastic highlights · fluid depth' : 'Crisp contrast · no translucency'}</small></div><span className="sp-segment-ready">PREVIEW</span></div>
  </div>
}

const paletteItems = [
  { title: 'Open component library', detail: 'Browse all 27+ building blocks', icon: Layers3, keys: 'G L' },
  { title: 'Change appearance', detail: 'Material and accent settings', icon: Settings2, keys: 'G A' },
  { title: 'View activity', detail: 'Explore animated data components', icon: Activity, keys: 'G D' },
  { title: 'Create new project', detail: 'Start with a blank canvas', icon: Plus, keys: 'G N' }
]
export function GlassCommandPalette() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [chosen, setChosen] = useState('')
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') { event.preventDefault(); setOpen(value => !value) }
      if (event.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])
  const filtered = paletteItems.filter(item => (item.title + item.detail).toLowerCase().includes(query.toLowerCase()))
  return <div className="sp-palette-demo">
    <button type="button" className="sp-palette-launch" onClick={() => { setOpen(true); setQuery('') }}><span className="sp-palette-search"><Search size={17} /> Search commands and components…</span><span className="sp-palette-shortcut"><Command size={12} /> K</span></button>
    <p className="sp-helper-line">Click to open, or use <kbd>Ctrl</kbd> + <kbd>K</kbd>. Try searching “activity”.</p>
    {chosen && <div className="sp-palette-chosen"><Check size={14} /> Selected: <b>{chosen}</b></div>}
    <AnimatePresence>
      {open && <motion.div className="sp-palette-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={event => { if (event.target === event.currentTarget) setOpen(false) }}>
        <motion.div className="sp-command-palette" role="dialog" aria-modal="true" aria-label="Command palette" initial={{ opacity: 0, y: -18, scale: .96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -10, scale: .98 }} transition={{ type: 'spring', stiffness: 360, damping: 28 }}>
          <label className="sp-command-search"><Search size={18} /><input autoFocus value={query} onChange={event => setQuery(event.target.value)} placeholder="Search commands…" aria-label="Search commands" /><kbd>ESC</kbd><button type="button" aria-label="Close palette" onClick={() => setOpen(false)}><X size={16} /></button></label>
          <div className="sp-command-section">SUGGESTED ACTIONS <span>⌘ K</span></div>
          <div className="sp-command-results">{filtered.map((item, i) => <button type="button" key={item.title} onClick={() => { setChosen(item.title); setOpen(false) }}><span className="sp-command-icon"><item.icon size={16} /></span><span><b>{item.title}</b><small>{item.detail}</small></span><kbd>{item.keys}</kbd>{i === 0 && <span className="sp-command-enter">↵</span>}</button>)}
            {filtered.length === 0 && <div className="sp-command-empty">No matching commands. Try a shorter search.</div>}
          </div>
          <div className="sp-command-foot"><span><kbd>↑</kbd><kbd>↓</kbd> Navigate</span><span><kbd>↵</kbd> Select <i /> <kbd>ESC</kbd> Close</span></div>
        </motion.div>
      </motion.div>}
    </AnimatePresence>
  </div>
}

export function ElasticGlassSheet() {
  const [open, setOpen] = useState(false)
  return <div className="sp-sheet-demo">
    <div className="sp-sheet-underlay"><span className="sp-component-eyebrow">DETAILS / 01</span><h3>Keep the context.</h3><p>A bottom sheet that arrives with weight, then follows your gesture.</p><button type="button" className="sp-sheet-open" onClick={() => setOpen(true)}>Pull up sheet <ArrowUpRight size={15} /></button></div>
    <AnimatePresence>
      {open && <motion.div className="sp-sheet-scrim" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(false)}>
        <motion.section className="sp-elastic-sheet" role="dialog" aria-modal="true" aria-labelledby="sp-sheet-title" initial={{ y: '105%' }} animate={{ y: 0 }} exit={{ y: '105%' }} transition={{ type: 'spring', stiffness: 290, damping: 28, mass: .9 }} drag="y" dragConstraints={{ top: 0, bottom: 220 }} dragElastic={.16} onDragEnd={(_, info) => { if (info.offset.y > 85 || info.velocity.y > 600) setOpen(false) }} onClick={event => event.stopPropagation()}>
          <button type="button" className="sp-sheet-grabber" aria-label="Drag sheet down to dismiss" onClick={() => setOpen(false)}><span /></button>
          <div className="sp-sheet-content"><span className="sp-component-eyebrow">QUICK PANEL / INTERACTIVE</span><h3 id="sp-sheet-title">The space between.</h3><p>Grab the handle and drag down to dismiss. The spring settles the surface into place without feeling mechanical.</p><div className="sp-sheet-stats"><div><small>SPRING</small><b>290</b></div><div><small>DAMPING</small><b>28</b></div><div><small>WEIGHT</small><b>0.9</b></div></div><button type="button" onClick={() => setOpen(false)} className="sp-sheet-confirm"><Check size={15} /> Looks good</button></div>
        </motion.section>
      </motion.div>}
    </AnimatePresence>
  </div>
}

type ToastEntry = { id: number; title: string; message: string; tone: 'success' | 'info' }
export function LiquidToastStack() {
  const [items, setItems] = useState<ToastEntry[]>([])
  const pushToast = (tone: ToastEntry['tone']) => {
    const id = Date.now() + Math.floor(Math.random() * 1000)
    const content = tone === 'success'
      ? { title: 'Changes crystallized', message: 'Your new surface is ready.' }
      : { title: 'A fresh layer arrived', message: 'One more glass toast in the stack.' }
    setItems(current => [{ id, ...content, tone }, ...current].slice(0, 3))
  }
  const dismiss = (id: number) => setItems(current => current.filter(item => item.id !== id))
  return <div className="sp-toast-demo">
    <div className="sp-toast-actions"><button type="button" className="sp-toast-primary" onClick={() => pushToast('success')}><Plus size={15} /> Spawn toast</button><button type="button" className="sp-toast-secondary" onClick={() => pushToast('info')}>Add another layer</button>{items.length > 0 && <button type="button" className="sp-toast-clear" onClick={() => setItems([])}>Clear stack</button>}</div>
    <div className="sp-toast-stage" aria-live="polite">
      <div className="sp-toast-orbit" />
      <AnimatePresence initial={false}>{items.map((item, index) => <motion.div key={item.id} layout className={'sp-liquid-toast tone-' + item.tone} initial={{ opacity: 0, y: 24, scale: .82, rotateX: -15 }} animate={{ opacity: 1, y: index * -8, scale: 1 - index * .025, rotateX: 0 }} exit={{ opacity: 0, x: 55, scale: .84, filter: 'blur(8px)' }} transition={{ type: 'spring', stiffness: 430, damping: 31, delay: index * .035 }}>
        <span className="sp-liquid-toast-icon">{item.tone === 'success' ? <Check size={17} /> : <Sparkles size={17} />}</span><span className="sp-liquid-toast-copy"><b>{item.title}</b><small>{item.message}</small><i><span /></i></span><button type="button" aria-label="Dismiss notification" onClick={() => dismiss(item.id)}><X size={15} /></button>
      </motion.div>)}</AnimatePresence>
      {items.length === 0 && <div className="sp-toast-empty"><span><Sparkles size={21} /></span><b>No interruptions.</b><small>Send a glass note to preview the stack.</small></div>}
    </div>
  </div>
}
