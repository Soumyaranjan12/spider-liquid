import { type ButtonHTMLAttributes, type InputHTMLAttributes, type ReactNode, useState } from 'react'
import { Search, Check, CheckCircle2, Info, X, Settings, ChevronRight } from 'lucide-react'
import AnalyticsDashboard from './AnalyticsDashboard'
import { EditableAnalyticsTable, EditableMetricCard, EditableTrafficSources, EditableTrendChart } from './EditableAnalyticsPreviews'
import { PrismButton, MercurySwitch, RefractiveCard, LiquidDock, FluidSegmentedControl, GlassCommandPalette, ElasticGlassSheet, LiquidToastStack } from './SignatureComponents'

export function GlassButton({ children, variant = 'secondary', ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'quiet' }) {
  return <button className={`glass-button glass-button--${variant}`} {...props}>{children}</button>
}
export function GlassIconButton({ children, label, ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { label: string }) {
  return <button className="glass-icon-button" aria-label={label} title={label} {...props}>{children}</button>
}
export function GlassToggle({ checked, onChange, label }: { checked: boolean; onChange: (value: boolean) => void; label: string }) {
  return <label className="toggle-row"><span>{label}</span><button type="button" role="switch" aria-checked={checked} className={`glass-toggle ${checked ? 'is-on' : ''}`} onClick={() => onChange(!checked)}><span /></button></label>
}
export function GlassSlider({ label, min = 0, max = 100, value, onChange }: { label: string; min?: number; max?: number; value: number; onChange: (v: number) => void }) {
  return <label className="slider-control"><span>{label}<b>{value}%</b></span><input aria-label={label} type="range" min={min} max={max} value={value} onChange={e => onChange(Number(e.target.value))} /></label>
}
export function SegmentedControl({ options, value, onChange }: { options: string[]; value: string; onChange: (v: string) => void }) {
  return <div className="segmented-control" role="group">{options.map(option => <button key={option} type="button" className={value === option ? 'active' : ''} onClick={() => onChange(option)}>{option}</button>)}</div>
}
export function GlassInput({ label, ...props }: InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return <label className="field-control"><span>{label}</span><input {...props} /></label>
}
export function GlassSearch({ placeholder = 'Search…', value, onChange }: { placeholder?: string; value: string; onChange: (v: string) => void }) {
  return <label className="search-control"><Search size={17} /><input placeholder={placeholder} value={value} onChange={e => onChange(e.target.value)} aria-label={placeholder} /></label>
}
export function GlassCard({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`glass-card ${className}`}>{children}</div>
}
export function GlassBadge({ children, tone = 'neutral' }: { children: ReactNode; tone?: 'neutral' | 'success' | 'accent' }) {
  return <span className={`glass-badge glass-badge--${tone}`}><i />{children}</span>
}
export function GlassProgress({ value, label }: { value: number; label?: string }) {
  return <div className="progress-wrap">{label && <div className="progress-label"><span>{label}</span><b>{value}%</b></div>}<div className="progress-track"><span style={{ width: `${Math.min(100, Math.max(0, value))}%` }} /></div></div>
}
export function GlassToast({ title, description }: { title: string; description: string }) {
  return <div className="glass-toast"><CheckCircle2 size={20} /><div><b>{title}</b><p>{description}</p></div><button aria-label="Dismiss notice" onClick={e => e.currentTarget.closest('.glass-toast')?.remove()}><X size={15} /></button></div>
}
export function GlassAvatar({ initials, label = 'Avatar' }: { initials: string; label?: string }) {
  return <span className="glass-avatar" title={label} aria-label={label}>{initials}</span>
}
export function GlassNav({ items, active, onChange }: { items: string[]; active: string; onChange: (v: string) => void }) {
  return <nav className="glass-nav" aria-label="Example navigation">{items.map(item => <button key={item} className={active === item ? 'active' : ''} onClick={() => onChange(item)}>{item}</button>)}</nav>
}
export function GlassDialog({ title, description }: { title: string; description: string }) {
  return <div className="glass-dialog"><div className="dialog-symbol"><Info size={22} /></div><button className="dialog-close" aria-label="Close preview"><X size={15} /></button><h3>{title}</h3><p>{description}</p><div className="dialog-actions"><GlassButton variant="quiet">Not now</GlassButton><GlassButton variant="primary">Continue <ChevronRight size={15} /></GlassButton></div></div>
}
export function PlaygroundSample({ id, onToast }: { id: string; onToast: () => void }) {
  const [toggle, setToggle] = useState(true), [slider, setSlider] = useState(72), [segment, setSegment] = useState('Glass'), [input, setInput] = useState('SpiderPanda'), [query, setQuery] = useState('')
  switch (id) {
    case 'prism-button': return <div className="sp-sample-center"><PrismButton onClick={onToast}>Launch sequence</PrismButton><span className="sp-interaction-hint">MOVE POINTER · PRESS TO ACTIVATE</span></div>
    case 'mercury-switch': return <div className="sp-sample-center"><MercurySwitch defaultChecked label="Fluid motion" /><span className="sp-interaction-hint">TAP TO CHANGE THE PHYSICS</span></div>
    case 'refractive-card': return <div className="sp-sample-center sp-refract-host"><RefractiveCard /><span className="sp-interaction-hint">MOVE POINTER ACROSS THE SURFACE</span></div>
    case 'liquid-dock': return <div className="sp-sample-center sp-wide-sample"><LiquidDock /></div>
    case 'fluid-segmented': return <div className="sp-sample-center sp-wide-sample"><FluidSegmentedControl /></div>
    case 'command-palette': return <div className="sp-sample-center sp-wide-sample"><GlassCommandPalette /></div>
    case 'elastic-sheet': return <div className="sp-sample-center sp-wide-sample"><ElasticGlassSheet /></div>
    case 'toast-stack': return <div className="sp-sample-center sp-wide-sample"><LiquidToastStack /></div>
    case 'button': return <div className="sample-row"><GlassButton variant="primary" onClick={onToast}>Get started <ChevronRight size={16} /></GlassButton><GlassButton onClick={onToast}>Explore docs</GlassButton><GlassButton variant="quiet">Cancel</GlassButton></div>
    case 'icon-button': return <div className="sample-row"><GlassIconButton label="Settings"><Settings size={18} /></GlassIconButton><GlassIconButton label="Dismiss"><X size={18} /></GlassIconButton><GlassIconButton label="Confirm"><Check size={18} /></GlassIconButton></div>
    case 'toggle': return <div className="sample-stack"><GlassToggle checked={toggle} onChange={setToggle} label="Enable liquid effects" /><p className="sample-note">State: <b>{toggle ? 'Enabled' : 'Disabled'}</b></p></div>
    case 'slider': return <div className="sample-stack"><GlassSlider label="Glass intensity" value={slider} onChange={setSlider} /><div className="preview-glass" style={{ opacity: .35 + slider / 160, backdropFilter: `blur(${slider / 8}px)` }}>Live preview</div></div>
    case 'segmented': return <div className="sample-stack"><SegmentedControl options={['Glass', 'Liquid', 'Solid']} value={segment} onChange={setSegment} /><p className="sample-note">Selected style: <b>{segment}</b></p></div>
    case 'input': return <GlassInput label="Display name" value={input} onChange={e => setInput(e.target.value)} placeholder="Your name" />
    case 'search': return <div className="sample-stack"><GlassSearch placeholder="Search the component library…" value={query} onChange={setQuery} /><p className="sample-note">{query ? `Searching for “${query}”` : 'Type to preview a live search field.'}</p></div>
    case 'card': return <GlassCard><div className="mini-card-top"><span className="eyebrow">WEEKLY ACTIVITY</span><GlassBadge tone="success">+18.6%</GlassBadge></div><strong className="metric-number">12,480</strong><p className="muted">Interactions this week</p><GlassProgress value={72} label="Monthly goal" /></GlassCard>
    case 'badge': return <div className="sample-row"><GlassBadge>Draft</GlassBadge><GlassBadge tone="success">Operational</GlassBadge><GlassBadge tone="accent">New release</GlassBadge></div>
    case 'progress': return <div className="sample-stack"><GlassProgress value={72} label="Building your interface" /><GlassProgress value={38} label="Syncing assets" /></div>
    case 'toast': return <GlassToast title="Changes saved" description="Your new glass theme is ready to use." />
    case 'avatar': return <div className="avatar-row"><GlassAvatar initials="SP" label="SpiderPanda" /><GlassAvatar initials="AL" label="Alex Lee" /><GlassAvatar initials="MK" label="Morgan Kim" /><div className="avatar-copy"><b>Design team</b><span>3 collaborators online</span></div></div>
    case 'nav': return <GlassNav items={['Home', 'Explore', 'Saved']} active={segment} onChange={setSegment} />
    case 'dialog': return <GlassDialog title="Ready to launch?" description="Your next idea deserves a beautiful surface. Continue to preview the next step." />
    case 'analytics': return <AnalyticsDashboard title="Product analytics" subtitle="A quick read on workspace activity." />
    case 'metric-card': return <EditableMetricCard />
    case 'trend-chart': return <EditableTrendChart />
    case 'traffic-sources': return <EditableTrafficSources />
    case 'analytics-table': return <EditableAnalyticsTable />
    default: return <GlassCard><p>Choose a component to explore its live preview.</p></GlassCard>
  }
}
