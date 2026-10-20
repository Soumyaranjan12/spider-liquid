export type ComponentInfo = {
  id: string
  name: string
  category: string
  description: string
  status: string
  code: string
}

/** The visible library intentionally contains only the current signature series and analytics suite. */
export const components: ComponentInfo[] = [
  { id: 'prism-button', name: 'Prism Button', category: 'Signature', description: 'A cursor-lit glass action with specular highlights, spring lift, and a tactile press.', status: 'Signature', code: `<PrismButton onClick={() => console.log('Launch')}>Launch sequence</PrismButton>` },
  { id: 'mercury-switch', name: 'Mercury Switch', category: 'Signature', description: 'A minimal glass pill switch with a clean thumb and a satisfying elastic bounce.', status: 'Signature', code: `<MercurySwitch defaultChecked label="Fluid motion" />` },
  { id: 'refractive-card', name: 'Refractive Card', category: 'Signature', description: 'Cursor-tracked refraction, gentle 3D tilt, and shifting edge caustics.', status: 'Signature', code: `<RefractiveCard />` },
  { id: 'liquid-dock', name: 'Liquid Dock', category: 'Signature', description: 'A floating navigation rail with a spring-loaded active destination.', status: 'Signature', code: `<LiquidDock />` },
  { id: 'fluid-segmented', name: 'Fluid Segmented Control', category: 'Signature', description: 'A shared layout spring morphs the selection capsule between modes.', status: 'Signature', code: `<FluidSegmentedControl />` },
  { id: 'command-palette', name: 'Glass Command Palette', category: 'Signature', description: 'A keyboard-ready command surface with an animated entrance and filtered results.', status: 'Signature', code: `<GlassCommandPalette />` },
  { id: 'elastic-sheet', name: 'Elastic Glass Sheet', category: 'Signature', description: 'A draggable bottom sheet with spring settling and drag-to-dismiss behavior.', status: 'Signature', code: `<ElasticGlassSheet />` },
  { id: 'toast-stack', name: 'Liquid Toast Stack', category: 'Signature', description: 'Layered notifications with spring entry, dismissal, and clear-all behavior.', status: 'Signature', code: `<LiquidToastStack />` },
  { id: 'analytics', name: 'Analytics Dashboard', category: 'Analytics', description: 'Editable KPI cards, animated trend charts, source breakdowns, time ranges, and CSV export.', status: 'Animated', code: `<AnalyticsDashboard title="Product analytics" subtitle="Workspace activity" />` },
  { id: 'realtime-pulse', name: 'Realtime Pulse Dashboard', category: 'Analytics', description: 'A live-feeling telemetry dashboard with a pulsing SVG signal, event stream, metric filters, and pause/resume.', status: 'Live demo', code: `<RealtimePulseDashboard />` },
  { id: 'conversion-funnel', name: 'Conversion Studio', category: 'Analytics', description: 'An interactive funnel with device filters, animated stage bars, conversion rates, and drop-off inspection.', status: 'Interactive', code: `<ConversionFunnelDashboard />` },
  { id: 'metric-card', name: 'Animated Metric Card', category: 'Analytics', description: 'A reusable KPI card with spring-updating values, period change, and an animated sparkline.', status: 'Animated', code: `<MetricCard title="Monthly revenue" value="$24,680" change="+8.4%" direction="up" />` },
  { id: 'trend-chart', name: 'Interactive Trend Chart', category: 'Analytics', description: 'An animated chart with selectable, keyboard-focusable points and live value readout.', status: 'Interactive', code: `<TrendChart title="Weekly visitors" data={[{ label: "Mon", value: 42 }, { label: "Tue", value: 58 }, { label: "Wed", value: 48 }, { label: "Thu", value: 78 }]} />` },
  { id: 'traffic-sources', name: 'Traffic Source Explorer', category: 'Analytics', description: 'An animated proportional breakdown that calculates totals and share percentages.', status: 'Animated', code: `<TrafficSources data={[{ name: "Direct", value: 38, color: "#ff535f" }, { name: "Search", value: 29, color: "#a78bfa" }, { name: "Social", value: 21, color: "#65d8a0" }]} />` },
  { id: 'analytics-table', name: 'Animated Analytics Table', category: 'Analytics', description: 'A sortable data table with animated row transitions and a separate editable preview.', status: 'Interactive', code: `<AnalyticsTable title="Top pages" columns={[{ key: "page", label: "Page" }, { key: "visitors", label: "Visitors" }]} rows={[{ page: "/dashboard", visitors: 4280 }, { page: "/pricing", visitors: 2310 }]} />` }
]
