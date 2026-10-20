import { type ButtonHTMLAttributes, type ReactNode } from 'react'
import { Search } from 'lucide-react'
import AnalyticsDashboard from './AnalyticsDashboard'
import { EditableAnalyticsTable, EditableMetricCard, EditableTrafficSources, EditableTrendChart } from './EditableAnalyticsPreviews'
import { PrismButton, MercurySwitch, RefractiveCard, LiquidDock, FluidSegmentedControl, GlassCommandPalette, ElasticGlassSheet, LiquidToastStack } from './SignatureComponents'
import { RealtimePulseDashboard, ConversionFunnelDashboard } from './AnalyticsExperiences'

export function GlassButton({ children, variant = 'secondary', ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'quiet' }) {
  return <button className={`glass-button glass-button--${variant}`} {...props}>{children}</button>
}
export function GlassBadge({ children, tone = 'neutral' }: { children: ReactNode; tone?: 'neutral' | 'success' | 'accent' }) {
  return <span className={`glass-badge glass-badge--${tone}`}><i />{children}</span>
}
export function GlassSearch({ placeholder = 'Search…', value, onChange }: { placeholder?: string; value: string; onChange: (v: string) => void }) {
  return <label className="search-control"><Search size={17} /><input placeholder={placeholder} value={value} onChange={e => onChange(e.target.value)} aria-label={placeholder} /></label>
}

export function PlaygroundSample({ id, onToast }: { id: string; onToast: () => void }) {
  switch (id) {
    case 'prism-button': return <div className="sp-sample-center"><PrismButton onClick={onToast}>Launch sequence</PrismButton><span className="sp-interaction-hint">MOVE POINTER · PRESS TO ACTIVATE</span></div>
    case 'mercury-switch': return <div className="sp-sample-center"><MercurySwitch defaultChecked label="Fluid motion" /><span className="sp-interaction-hint">TAP TO FEEL THE BOUNCE</span></div>
    case 'refractive-card': return <div className="sp-sample-center sp-refract-host"><RefractiveCard /><span className="sp-interaction-hint">MOVE POINTER ACROSS THE SURFACE</span></div>
    case 'liquid-dock': return <div className="sp-sample-center sp-wide-sample"><LiquidDock /></div>
    case 'fluid-segmented': return <div className="sp-sample-center sp-wide-sample"><FluidSegmentedControl /></div>
    case 'command-palette': return <div className="sp-sample-center sp-wide-sample"><GlassCommandPalette /></div>
    case 'elastic-sheet': return <div className="sp-sample-center sp-wide-sample"><ElasticGlassSheet /></div>
    case 'toast-stack': return <div className="sp-sample-center sp-wide-sample"><LiquidToastStack /></div>
    case 'analytics': return <AnalyticsDashboard title="Product analytics" subtitle="A quick read on workspace activity." />
    case 'realtime-pulse': return <RealtimePulseDashboard />
    case 'conversion-funnel': return <ConversionFunnelDashboard />
    case 'metric-card': return <EditableMetricCard />
    case 'trend-chart': return <EditableTrendChart />
    case 'traffic-sources': return <EditableTrafficSources />
    case 'analytics-table': return <EditableAnalyticsTable />
    default: return <div className="sample-note">Choose a current component from the library.</div>
  }
}
