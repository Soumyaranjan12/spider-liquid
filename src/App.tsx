import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  Activity, ArrowRight, ArrowUpRight, BarChart3, BookOpen, Check, Code2, Copy,
  ChevronRight, Github, Layers3, Menu, Search, Settings2, Sparkles, X
} from 'lucide-react'
import { components } from './data/components'
import { GlassBadge, GlassButton, GlassSearch, PlaygroundSample } from './components/GlassKit'

type Page = 'Overview' | 'Components' | 'Playground' | 'Documentation'
const categories = ['All components', 'Signature', 'Analytics']
const docsSnippet = "import { PrismButton } from './components/SignatureComponents'\n\nexport function Example() {\n  return <PrismButton onClick={() => console.log('Launch')}>Launch sequence</PrismButton>\n}"

export default function App() {
  const [page, setPage] = useState<Page>('Overview')
  const [selected, setSelected] = useState('prism-button')
  const [category, setCategory] = useState('All components')
  const [search, setSearch] = useState('')
  const [copied, setCopied] = useState('')
  const [toast, setToast] = useState(false)
  const [mobileNav, setMobileNav] = useState(false)
  const current = components.find(c => c.id === selected) || components[0]
  const componentReference: Record<string, {
    importName: string
    summary: string
    props: { name: string; type: string; description: string }[]
    usage: string
    accessibility: string
    notes: string
  }> = {
    'analytics': {
      importName: 'AnalyticsDashboard',
      summary: 'A composed analytics dashboard with KPI cards, trend chart, traffic-source breakdown and CSV export.',
      props: [
        { name: 'title', type: 'string', description: 'Optional dashboard heading.' },
        { name: 'subtitle', type: 'string', description: 'Optional supporting sentence beneath the heading.' }
      ],
      usage: 'Open the live preview and click Edit data. The card flips to fields for KPI values, percentage changes, trend series and traffic-source counts; select Confirm & preview to apply and save them. The chart, KPIs and percentages then reflect your demo data. Values persist in this browser.',
      accessibility: 'Uses semantic headings, labeled controls and a chart description. Replace demo data before using it for business decisions.',
      notes: 'Composite widget example; import it from ./components/AnalyticsDashboard. Figures are illustrative, not a real analytics feed. Demo values are saved to localStorage under spiderpanda.analytics-dashboard.v1 and can be restored with Reset demo.'
    },
    'metric-card': {
      importName: 'MetricCard',
      summary: 'A compact KPI card showing a metric, direction of change, period caption, and sparkline.',
      props: [
        { name: 'title', type: 'string', description: 'Metric label, such as Monthly revenue or Active users.' },
        { name: 'value', type: 'string | number', description: 'Primary metric value. Numbers are formatted with locale separators.' },
        { name: 'change', type: 'string', description: 'Change to display, e.g. +8.4% or −2.1%.' },
        { name: 'direction', type: '"up" | "down"', description: 'Selects positive or negative trend styling.' },
        { name: 'caption', type: 'string', description: 'Small context line; defaults to vs previous period.' }
      ],
      usage: 'Use for the most important one-number summaries at the top of a dashboard. Keep the metric unit and comparison period explicit. In the playground, click Edit data to flip the card, change its title, value and trend, then select Confirm & preview to save the updated visualization.',
      accessibility: 'The title and value are text, so the meaning does not depend on the sparkline or color. Ensure a down direction is not automatically described as bad unless the metric requires it.',
      notes: 'The sparkline is decorative sample artwork; pass real values into the metric props and replace sparkline data if you need a true historical mini-chart.'
    },
    'trend-chart': {
      importName: 'TrendChart',
      summary: 'A small time-series bar chart with hover, focus, and click selection for individual points.',
      props: [
        { name: 'title', type: 'string', description: 'Chart heading.' },
        { name: 'data', type: 'Array<{ label: string; value: number }>', description: 'Ordered points to display; each point needs a label and numeric value.' },
        { name: 'valueSuffix', type: 'string', description: 'Optional suffix such as % or k, used in the selected point summary.' }
      ],
      usage: 'Pass points in chronological order. In the playground, click Edit data to flip the card, edit point labels and comma-separated values, then select Confirm & preview; the chart uses the saved series. For more complex date ranges, format labels in your application before passing data.',
      accessibility: 'Data bars are keyboard-focusable buttons with a label for each point; visible text reports the selected value.',
      notes: 'The included example data is for preview. The component calculates bar heights from the largest value in the provided series.'
    },
    'traffic-sources': {
      importName: 'TrafficSources',
      summary: 'A proportional stacked bar and source list that calculates totals and percentage share.',
      props: [
        { name: 'title', type: 'string', description: 'Section heading.' },
        { name: 'data', type: 'Array<{ name: string; value: number; color?: string }>', description: 'Source names and numeric values; color is optional.' }
      ],
      usage: 'Use when comparing a small collection of acquisition or category sources. Values should use the same unit and time period. Click Edit data in the playground to change each source label and count, then select Confirm & preview to save and recalculate the stacked bar and percentages.',
      accessibility: 'Source names, values, and calculated percentages are written out below the stacked visual instead of relying on color alone.',
      notes: 'Negative values are excluded from the visual total. If no color is provided, the component uses the SpiderPanda accent.'
    },
    'analytics-table': {
      importName: 'AnalyticsTable',
      summary: 'A compact data table with sortable column headings for analytics reports.',
      props: [
        { name: 'title', type: 'string', description: 'Table heading.' },
        { name: 'columns', type: 'Array<{ key: string; label: string }>', description: 'Column keys and human-readable labels.' },
        { name: 'rows', type: 'Array<Record<string, string | number>>', description: 'Rows whose keys match the configured columns.' }
      ],
      usage: 'Keep columns focused on the decision users need to make. Use numbers for metric columns so sorting is numeric rather than alphabetical. Click Edit data to flip to fields for page paths, visitor values and change labels. Confirm & preview applies the new rows to the table.',
      accessibility: 'Uses a semantic HTML table and buttons inside headings to toggle sort direction.',
      notes: 'This component handles client-side sorting only. Fetch, filter, paginate, and validate records in the parent application when needed.'
    }
  }
  Object.assign(componentReference, {
    'realtime-pulse': {
      importName: 'RealtimePulseDashboard', summary: 'A live-feeling telemetry surface with a pulsing signal, shifting KPIs, interactive metric filters, and a rolling event feed.',
      props: [],
      usage: 'Toggle Pause/Resume to control the demo stream. Change the time window, traffic channel, or Visitors/Events/Errors metric to animate the chart and KPI values.',
      accessibility: 'All filters are buttons with accessible group labels. The SVG chart has a text label and the live status does not rely on color alone.',
      notes: 'Import from ./components/AnalyticsExperiences. The values and event stream are illustrative and generated locally; connect your own telemetry service before production use.'
    },
    'conversion-funnel': {
      importName: 'ConversionFunnelDashboard', summary: 'An interactive journey dashboard with conversion KPIs, animated stage bars, device filters, and stage-level drop-off insights.',
      props: [],
      usage: 'Switch between signup and checkout journeys, choose a period/device, toggle drop-off annotations, and select a funnel step to inspect it.',
      accessibility: 'Funnel stages are buttons with text values. The selected stage details are readable text and do not rely only on bar length.',
      notes: 'Import from ./components/AnalyticsExperiences. The data is a local example scaled by selected filters, not a connection to real product analytics.'
    },
    'prism-button': {
      importName: 'PrismButton', summary: 'A cursor-reactive primary action with a moving specular highlight, layered glass edge, and spring lift.',
      props: [
        { name: 'children', type: 'ReactNode', description: 'The action label or inline content.' },
        { name: 'onClick', type: '() => void', description: 'Optional activation callback.' }
      ],
      usage: 'Use for a single high-emphasis action. Move the pointer to steer the reflected highlight; the button lifts on hover and compresses on press.',
      accessibility: 'Rendered as a native button, with keyboard focus visibility and a reduced-motion fallback.',
      notes: 'Import from ./components/SignatureComponents. The highlight follows pointer coordinates and returns to center when the pointer leaves.'
    },
    'mercury-switch': {
      importName: 'MercurySwitch', summary: 'A switch with a liquid-metal thumb, elastic travel, and a luminous active track.',
      props: [
        { name: 'defaultChecked', type: 'boolean', description: 'Initial on/off state; defaults to true.' },
        { name: 'label', type: 'string', description: 'Visible and accessible switch label.' }
      ],
      usage: 'Use for an immediate binary setting. The preview keeps its own state so you can try the transition directly.',
      accessibility: 'Exposes role="switch", aria-checked, and an accessible label. Supports keyboard operation through the native button.',
      notes: 'Import from ./components/SignatureComponents. For app settings that must be controlled externally, adapt the component to accept checked and onChange.'
    },
    'refractive-card': {
      importName: 'RefractiveCard', summary: 'A display surface with pointer-tracked light, perspective tilt, edge refraction, and layered highlights.',
      props: [],
      usage: 'Use for a featured item, product tile, or showcase surface. Keep important text within the content area and avoid using the tilt effect on dense layouts.',
      accessibility: 'Decorative motion does not carry essential information, and the effect becomes still when reduced motion is preferred.',
      notes: 'Import from ./components/SignatureComponents. Pointer position controls the specular hotspot and the spring-settled 3D angle.'
    },
    'liquid-dock': {
      importName: 'LiquidDock', summary: 'A floating navigation dock whose active glass capsule glides between destinations.',
      props: [],
      usage: 'Best for a small set of destinations or modes. Click an item to move the active pill and update the current destination label.',
      accessibility: 'Uses a labeled nav region and buttons, with aria-current on the selected destination.',
      notes: 'Import from ./components/SignatureComponents. Replace the sample destinations with your router or local state in production.'
    },
    'fluid-segmented': {
      importName: 'FluidSegmentedControl', summary: 'A three-way material selector with a shared animated selection capsule and live material preview.',
      props: [],
      usage: 'Keep choices mutually exclusive and short. The preview below the control updates to explain the selected material mode.',
      accessibility: 'Each choice is a native button and the selection is conveyed by both label and state styling.',
      notes: 'Import from ./components/SignatureComponents. Options are illustrative in this demo; make options and onChange configurable for a reusable production API.'
    },
    'command-palette': {
      importName: 'GlassCommandPalette', summary: 'A searchable command overlay that opens with a morphing entrance and supports Ctrl/Cmd+K and Escape.',
      props: [],
      usage: 'Use for keyboard-first navigation and frequently used actions. Try searching “activity” or “project”, then select a result.',
      accessibility: 'The overlay is exposed as a dialog, has labeled search and close controls, and responds to Escape.',
      notes: 'Import from ./components/SignatureComponents. This is a self-contained demo command list; connect results to actual application actions.'
    },
    'elastic-sheet': {
      importName: 'ElasticGlassSheet', summary: 'A bottom sheet that enters with spring physics and can be pulled down to dismiss.',
      props: [],
      usage: 'Use for lightweight secondary content on touch-first layouts. Open the sheet, drag its handle down, or use the close actions.',
      accessibility: 'The open panel has dialog semantics and named content; all close actions are keyboard-accessible buttons.',
      notes: 'Import from ./components/SignatureComponents. For production, add focus trapping/restoration and coordinate drag behavior with nested scroll areas.'
    },
    'toast-stack': {
      importName: 'LiquidToastStack', summary: 'A staged notification stack with layered depth, spring entry, dismissal, and clear-all behavior.',
      props: [],
      usage: 'Add one toast at a time to see the stack reflow. Keep each message brief and reserve success styling for a confirmed result.',
      accessibility: 'The notification region uses aria-live, and every toast can be dismissed with a labeled button.',
      notes: 'Import from ./components/SignatureComponents. This example is manually triggered and does not auto-dismiss, so you can inspect the entrance and exit animations.'
    }
  })
  const reference = componentReference[current.id] || componentReference.analytics
  const analyticsImports: Record<string, string> = {
    'prism-button': "import { PrismButton } from './components/SignatureComponents'",
    'mercury-switch': "import { MercurySwitch } from './components/SignatureComponents'",
    'refractive-card': "import { RefractiveCard } from './components/SignatureComponents'",
    'liquid-dock': "import { LiquidDock } from './components/SignatureComponents'",
    'fluid-segmented': "import { FluidSegmentedControl } from './components/SignatureComponents'",
    'command-palette': "import { GlassCommandPalette } from './components/SignatureComponents'",
    'elastic-sheet': "import { ElasticGlassSheet } from './components/SignatureComponents'",
    'toast-stack': "import { LiquidToastStack } from './components/SignatureComponents'",
    'realtime-pulse': "import { RealtimePulseDashboard } from './components/AnalyticsExperiences'",
    'conversion-funnel': "import { ConversionFunnelDashboard } from './components/AnalyticsExperiences'",
    analytics: "import AnalyticsDashboard from './components/AnalyticsDashboard'",
    'metric-card': "import { MetricCard } from './components/AnalyticsComponents'",
    'trend-chart': "import { TrendChart } from './components/AnalyticsComponents'",
    'traffic-sources': "import { TrafficSources } from './components/AnalyticsComponents'",
    'analytics-table': "import { AnalyticsTable } from './components/AnalyticsComponents'"
  }
  const componentSnippet = `${analyticsImports[current.id] || `import { ${reference.importName} } from './components/GlassKit'`}\n\n${current.code}`
  const openComponentDocs = () => {
    setPage('Documentation')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  const filtered = useMemo(
    () => components.filter(c => (category === 'All components' || c.category === category) && (c.name + ' ' + c.description).toLowerCase().includes(search.toLowerCase())),
    [category, search]
  )
  const copy = async (text: string, label = 'Copied to clipboard') => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text)
      } else {
        throw new Error('Clipboard API unavailable')
      }
      setCopied(label)
      window.setTimeout(() => setCopied(''), 2200)
    } catch {
      // Clipboard API can be blocked by browser permissions. Try the legacy selection fallback.
      try {
        const textarea = document.createElement('textarea')
        textarea.value = text
        textarea.setAttribute('readonly', '')
        textarea.style.position = 'fixed'
        textarea.style.left = '-9999px'
        textarea.style.top = '0'
        document.body.appendChild(textarea)
        textarea.focus()
        textarea.select()
        const success = document.execCommand('copy')
        textarea.remove()
        if (!success) throw new Error('Copy command was rejected')
        setCopied(label)
        window.setTimeout(() => setCopied(''), 2200)
      } catch {
        setCopied('Copy failed — select the snippet and copy manually')
        window.setTimeout(() => setCopied(''), 4500)
      }
    }
  }
  const showToast = () => {
    setToast(true)
    window.setTimeout(() => setToast(false), 2600)
  }
  const navItems = [
    { label: 'Overview' as Page, icon: Layers3 },
    { label: 'Components' as Page, icon: Sparkles },
    { label: 'Playground' as Page, icon: Code2 },
    { label: 'Documentation' as Page, icon: BookOpen }
  ]

  return <div className="app-shell">
    <div className="ambient ambient-one" /><div className="ambient ambient-two" /><div className="ambient ambient-three" />
    <aside className={'sidebar ' + (mobileNav ? 'sidebar-open' : '')}>
      <button className="brand" onClick={() => setPage('Overview')} aria-label="SpiderPanda home">
        <span className="brand-mark"><span /></span><span className="brand-text">spiderpanda<span>CREATIVE LAB</span></span>
      </button>
      <div className="side-caption">WORKSPACE</div>
      <nav className="side-nav">{navItems.map(({ label, icon: Icon }) =>
        <button key={label} className={page === label ? 'selected' : ''} onClick={() => { setPage(label); setMobileNav(false) }}>
          <Icon size={17} strokeWidth={1.8} /><span>{label}</span>{label === 'Components' && <small>{components.length}</small>}
        </button>
      )}</nav>
      <div className="side-caption side-caption-spaced">LIBRARY</div>
      <div className="side-nav compact">{categories.slice(1).map((name, i) =>
        <button key={name} onClick={() => { setCategory(name); setPage('Components') }}><span className={'category-dot dot-' + i} />{name}</button>
      )}</div>
      <div className="sidebar-bottom">
        <button className="version-card" onClick={() => setPage('Components')}><div className="version-icon"><Layers3 size={15} /></div><div><b>Explore components</b><p>Browse the full UI library</p></div><ArrowUpRight size={14} /></button>
        <div className="profile-row"><div className="profile-avatar">SP</div><div><b>SpiderPanda</b><span>Creative lab</span></div><button aria-label="Browse components" onClick={() => setPage('Components')}><Layers3 size={16} /></button></div>
      </div>
    </aside>
    {mobileNav && <button className="mobile-scrim" aria-label="Close navigation" onClick={() => setMobileNav(false)} />}
    <main className="main-area">
      <header className="topbar">
        <button className="mobile-menu" onClick={() => setMobileNav(!mobileNav)} aria-label="Toggle menu"><Menu size={20} /></button>
        <div className="breadcrumbs"><span>SpiderPanda</span><span className="crumb-slash">/</span><b>{page}</b></div>
        <div className="top-actions">
          <a className="top-icon" href="https://github.com/Soumyaranjan12/spider-liquid" target="_blank" rel="noreferrer" aria-label="GitHub repository"><Github size={17} /></a>
          <button className="top-code" onClick={() => { setCategory('All components'); setPage('Components') }}><Layers3 size={15} /> Browse library <ArrowUpRight size={14} /></button>
        </div>
      </header>
      <div className="page-content">
        {page === 'Overview' && <>
          <section className="hero-section studio-hero">
            <div className="hero-copy">
              <div className="eyebrow-line"><span className="eyebrow-icon"><Layers3 size={13} /></span> BUILD WITH BETTER BUILDING BLOCKS <span className="eyebrow-rule" /></div>
              <h1>Interfaces with<br /><span className="gradient-word">more feeling.</span></h1>
              <p className="hero-subtitle">A signature collection of animated liquid-glass components, with cursor-reactive light, spring physics, refraction, and interactive overlays. Try each piece, then copy the React code.</p>
              <div className="hero-actions"><GlassButton variant="primary" onClick={() => { setCategory('All components'); setPage('Components') }}>Explore components <ArrowRight size={16} /></GlassButton><button className="text-button" onClick={() => { setSelected('button'); setPage('Playground') }}>Open playground <ArrowUpRight size={15} /></button></div>
              <div className="hero-proof"><div className="proof-avatars"><span>SP</span><span>UI</span><span>↗</span></div><span><b>{components.length} reusable React components</b><br />Live previews · API docs · copy-ready code</span></div>
            </div>
            <div className="home-launch-panel glass-panel overview-toolkit">
              <div className="home-panel-top"><div><span className="mini-label">COMPONENT EXPLORER</span><h2>Find your starting point</h2></div><span className="home-panel-live"><i/> Ready to preview</span></div>
              <p className="overview-toolkit-copy">Start with the signature interactions: a cursor-lit action, a mercury switch, refractive glass, or a fluid navigation dock.</p>
              <div className="quick-game-grid">
                <button onClick={() => { setSelected('prism-button'); setPage('Playground') }}><span className="quick-game-icon component-icon">✧</span><span><b>Prism Button</b><small>Cursor-lit, spring-loaded action</small></span><ChevronRight size={15}/></button>
                <button onClick={() => { setSelected('mercury-switch'); setPage('Playground') }}><span className="quick-game-icon component-icon">◉</span><span><b>Mercury Switch</b><small>Elastic toggle with liquid-metal feel</small></span><ChevronRight size={15}/></button>
                <button onClick={() => { setSelected('refractive-card'); setPage('Playground') }}><span className="quick-game-icon component-icon">▱</span><span><b>Refractive Card</b><small>Cursor-tracked light and 3D tilt</small></span><ChevronRight size={15}/></button>
                <button onClick={() => { setSelected('liquid-dock'); setPage('Playground') }}><span className="quick-game-icon component-icon">⌘</span><span><b>Liquid Dock</b><small>Springing active navigation pill</small></span><ChevronRight size={15}/></button>
              </div>
              <div className="home-panel-foot"><div><Code2 size={15}/><span><b>Ready for your app</b><small>Copy the TSX examples into your project</small></span></div><button onClick={() => setPage('Documentation')}>Read the docs <ArrowUpRight size={13}/></button></div>
            </div>
          </section>
          <section className="stats-row studio-stats">
            <div><span className="stat-label">COMPONENTS</span><b>{components.length}</b><small>Reusable React building blocks</small></div>
            <div><span className="stat-label">CATEGORIES</span><b className="stat-word">2 collections</b><small>Signature glass + analytics</small></div>
            <div><span className="stat-label">PLAYGROUND</span><b className="stat-word">Live</b><small>Test component behavior before use</small></div>
            <div><span className="stat-label">CODE & DOCS</span><b className="stat-word">Ready</b><small>Copyable examples and API guidance</small></div>
          </section>
          <section className="section-block">
            <div className="section-heading"><div><div className="section-kicker">COMPONENT LIBRARY</div><h2>Useful pieces. <span>Ready to ship.</span></h2><p className="section-description">Browse the library by purpose, try each component, and copy the code you need.</p></div><button className="view-all" onClick={() => { setCategory('All components'); setPage('Components') }}>Browse all components <ArrowRight size={15} /></button></div>
            <div className="featured-grid">{components.filter(c => ['prism-button', 'mercury-switch', 'refractive-card', 'liquid-dock'].includes(c.id)).map((c, i) =>
              <motion.button whileHover={{ y: -4 }} key={c.id} className={'featured-card feature-' + i} onClick={() => { setSelected(c.id); setPage('Playground') }}>
                <div className="featured-card-top"><span className="component-index">0{i + 1}</span><span className="card-arrow"><ArrowUpRight size={15} /></span></div>
                <div className="featured-preview"><MiniPreview id={c.id} /></div>
                <div className="featured-info"><span>{c.category}</span><h3>{c.name}</h3><p>{c.description}</p></div>
              </motion.button>
            )}</div>
          </section>
        </> }
        {page === 'Components' && <section className="subpage">
          <div className="subpage-heading"><div className="section-kicker">THE LIBRARY</div><h1>Made to <span>compose.</span></h1><p>Explore the full collection of interactive liquid-glass building blocks.</p></div>
          <div className="library-toolbar"><GlassSearch placeholder="Search components…" value={search} onChange={setSearch} /><div className="category-pills">{categories.map(c => <button key={c} className={category === c ? 'active' : ''} onClick={() => setCategory(c)}>{c}</button>)}</div></div>
          <div className="component-grid">{filtered.map((c, i) => <motion.button key={c.id} whileHover={{ y: -3 }} className="library-card glass-panel" onClick={() => { setSelected(c.id); setPage('Playground') }}><div className="library-card-head"><span className="component-index">{String(i + 1).padStart(2, '0')}</span><GlassBadge tone={c.status === 'Signature' ? 'accent' : 'success'}>{c.status}</GlassBadge></div><div className="library-preview"><MiniPreview id={c.id} /></div><div className="featured-info"><span>{c.category}</span><h3>{c.name}</h3><p>{c.description}</p></div><div className="library-card-foot">Open in playground <ArrowUpRight size={14} /></div></motion.button>)}</div>
          {filtered.length === 0 && <div className="empty-state glass-panel"><Search size={24} /><h3>No components found</h3><p>Try another search or select a different category.</p><button onClick={() => { setSearch(''); setCategory('All components') }}>Clear filters</button></div>}
        </section>}
        {page === 'Playground' && <section className="subpage playground-page">
          <div className="subpage-heading compact-heading"><div className="section-kicker">LIVE LABORATORY</div><h1>Test it in the <span>studio.</span></h1><p>Choose a component, try its interactive preview, and copy the import plus JSX example.</p></div>
          <div className="playground-layout">
            <aside className="playground-list glass-panel"><div className="panel-heading"><div><b>Components</b><p>Choose a preview</p></div><span className="list-count">{components.length}</span></div><GlassSearch placeholder="Filter components…" value={search} onChange={setSearch} /><div className="playground-items">{components.filter(c => (c.name + c.category).toLowerCase().includes(search.toLowerCase())).map(c => <button key={c.id} className={selected === c.id ? 'active' : ''} onClick={() => setSelected(c.id)}><span className="item-icon"><Code2 size={15} /></span><span>{c.name}<small>{c.category}</small></span>{selected === c.id && <span className="item-active-dot" />}</button>)}</div></aside>
            <div className="playground-main">
              <div className="preview-panel glass-panel"><div className="preview-panel-head"><div><span className="mini-label">LIVE PREVIEW</span><h3>{current.name}</h3></div><div className="preview-head-actions"><GlassBadge tone="success">Interactive</GlassBadge><button type="button" className="top-icon copy-preview-button" aria-label={copied === 'Component code copied' ? 'Component code copied' : 'Copy component code'} title={copied === 'Component code copied' ? 'Copied to clipboard' : 'Copy component code'} onClick={() => copy(componentSnippet, 'Component code copied')}>{copied === 'Component code copied' ? <Check size={15} /> : <Copy size={15} />}</button></div></div>
                <div className="live-stage stage-aurora"><div className="stage-glow" /><div className="stage-content"><PlaygroundSample key={selected} id={selected} onToast={showToast} /></div><span className="stage-caption"><span /> POINTER-READY SURFACE</span></div>
                <div className="preview-panel-foot"><span><i /> Live component</span><span>Preview is illustrative</span></div>
              </div>
              <div className="code-panel glass-panel"><div className="code-panel-head"><div><span className="mini-label">QUICK START</span><b>React + TypeScript</b></div><button className="copy-button" onClick={() => copy(componentSnippet, 'Component code copied')}>{copied === 'Component code copied' ? <Check size={14} /> : <Copy size={14} />} {copied === 'Component code copied' ? 'Copied' : 'Copy code'}</button></div><pre><code>{componentSnippet}</code></pre><div className="code-panel-foot"><span><span className="code-dot" /> TSX</span><button onClick={openComponentDocs}>View API & usage <ArrowUpRight size={13} /></button></div></div>
            </div>
          </div>
        </section>}
        {page === 'Documentation' && <section className="subpage docs-page">
          <div className="subpage-heading"><div className="section-kicker">FIELD NOTES</div><h1>Designed with <span>intention.</span></h1><p>A practical guide to the Liquid Glass system — from install to the tiny details that make it feel right.</p></div>
          <article className="docs-article component-reference">
              <div className="reference-heading-row"><div><span className="article-number">COMPONENT REFERENCE / API</span><h2>{current.name}</h2><p>{current.description}</p></div><label className="docs-component-select"><span>Documented component</span><select value={selected} onChange={event => setSelected(event.target.value)}>{components.map(component => <option key={component.id} value={component.id}>{component.name}</option>)}</select></label></div>
              <p>{reference.summary}</p>
              <div className="reference-meta"><span>{current.category}</span><code>{reference.importName}</code><span>React + TypeScript</span></div>
              <h3>API reference</h3><div className="props-table"><div className="props-table-head"><span>Prop</span><span>Type</span><span>Description</span></div>{reference.props.map(prop => <div className="props-table-row" key={prop.name}><code>{prop.name}</code><span>{prop.type}</span><p>{prop.description}</p></div>)}</div>
              <h3>Usage guidance</h3><p>{reference.usage}</p>
              <h3>Example</h3><div className="code-block"><div><span>TSX SNIPPET</span><button type="button" onClick={() => copy(componentSnippet, 'Component example copied')}>{copied === 'Component example copied' ? <Check size={14} /> : <Copy size={14} />} {copied === 'Component example copied' ? 'Copied' : 'Copy example'}</button></div><pre><code>{componentSnippet}</code></pre></div>
              <h3>Accessibility</h3><p>{reference.accessibility}</p><div className="note-callout"><BookOpen size={17} /><p><b>Implementation notes</b><br />{reference.notes}</p></div>
              <div className="reference-actions"><button className="text-button" onClick={() => setPage('Playground')}>Back to live preview <ArrowRight size={14} /></button><button className="text-button" onClick={() => copy(componentSnippet, 'Component code copied')}>{copied === 'Component code copied' ? <Check size={14} /> : <Copy size={14} />} Copy this component</button></div>
            </article><div className="docs-layout"><nav className="docs-toc glass-panel"><span className="mini-label">ON THIS PAGE</span><a href="#install">Installation</a><a href="#usage">Usage</a><a href="#tokens">Design tokens</a><a href="#principles">Material principles</a><a href="#accessibility">Accessibility</a></nav>
            <div className="docs-content">
              <article id="install" className="docs-article"><span className="article-number">01 / GET STARTED</span><h2>Installation</h2><p>Start with a modern React app. This project uses Vite, TypeScript, Framer Motion, and Lucide icons.</p><div className="code-block"><div><span>TERMINAL</span><button onClick={() => copy('npm install\nnpm run dev', 'Install commands copied')}>{copied === 'Install commands copied' ? <Check size={14} /> : <Copy size={14} />} Copy</button></div><pre><code>{'npm install\nnpm run dev'}</code></pre></div></article>
              <article id="usage" className="docs-article"><span className="article-number">02 / COMPOSE</span><h2>Use a component</h2><p>Components are deliberately small. Compose them with your own content and keep application state in your app.</p><div className="code-block"><div><span>EXAMPLE.TSX</span><button onClick={() => copy(docsSnippet, 'Example snippet copied')}>{copied === 'Example snippet copied' ? <Check size={14} /> : <Copy size={14} />} Copy</button></div><pre><code>{docsSnippet}</code></pre></div><GlassButton variant="primary" onClick={() => setPage('Playground')}>Try it in the playground <ArrowRight size={15} /></GlassButton></article>
              <article id="tokens" className="docs-article"><span className="article-number">03 / THE FOUNDATION</span><h2>Design tokens</h2><p>Use CSS custom properties to tune the material without rewriting component styles.</p><div className="token-list"><div><span className="token-swatch token-black" /><span><b>--surface</b><small>Primary canvas</small></span><code>#09090B</code></div><div><span className="token-swatch" style={{background:'#ff414d'}} /><span><b>--accent</b><small>SpiderPanda action color</small></span><code>#FF414D</code></div><div><span className="token-swatch token-glass" /><span><b>--glass-fill</b><small>Translucent surface highlight</small></span><code>RGBA</code></div></div></article>
              <article id="principles" className="docs-article"><span className="article-number">04 / MATERIAL LOGIC</span><h2>Glass with restraint</h2><div className="principle-grid"><div><Activity size={18} /><b>Layer, don't stack</b><p>Use blur where it adds depth. Too many overlapping glass layers make interfaces muddy.</p></div><div><Activity size={18} /><b>Keep contrast</b><p>Pair translucent surfaces with clear text, deliberate edges, and readable states.</p></div><div><Sparkles size={18} /><b>Light with purpose</b><p>Use accent glow to guide attention, not as a permanent outline on everything.</p></div></div></article>
              <article id="accessibility" className="docs-article"><span className="article-number">05 / INCLUSIVE BY DEFAULT</span><h2>Accessibility</h2><ul className="docs-list"><li>Keep keyboard focus visible; don't rely on color alone to communicate state.</li><li>Use semantic buttons and labeled inputs for controls.</li><li>Respect <code>prefers-reduced-motion</code> and avoid essential information in animation.</li><li>Test glass surfaces against the actual backgrounds where they will be used.</li></ul><div className="note-callout"><Activity size={17} /><p><b>Browser note</b><br />Glass uses <code>backdrop-filter</code> when supported. Browsers without it fall back to a more opaque surface for legibility.</p></div></article>
            </div>
          </div>
        </section>}
        <footer className="page-footer"><div className="footer-brand"><span className="brand-mark mini"><span /></span><span>SPIDERPANDA <small>CREATIVE LAB</small></span></div><span>Useful components. Clear insights.</span><button onClick={() => { setCategory('Analytics'); setPage('Components') }}>Analytics components <ArrowUpRight size={13} /></button></footer>
      </div>
    </main>
    <AnimatePresence>{toast && <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="global-toast"><Check size={16} /><span>Interaction complete — looking good.</span><button onClick={() => setToast(false)}><X size={14} /></button></motion.div>}</AnimatePresence>
    {copied && <div className="copy-feedback" role="status" aria-live="polite">{copied === 'Component code copied' ? 'Component code copied to clipboard' : copied === 'Install commands copied' ? 'Install commands copied to clipboard' : copied === 'Example snippet copied' ? 'Example snippet copied to clipboard' : copied}</div>}
  </div>
}

function MiniPreview({ id }: { id: string }) {
  if (id === 'prism-button') return <div className="mini-sp-prism"><span>Launch sequence <b>↗</b></span></div>
  if (id === 'mercury-switch') return <div className="mini-sp-mercury"><span>Fluid motion</span><i><b /></i></div>
  if (id === 'refractive-card') return <div className="mini-sp-refract"><span>✧ SURFACE / 003</span><b>Glass, in motion.</b><i /></div>
  if (id === 'liquid-dock') return <div className="mini-sp-dock"><i>⌂</i><b>◉</b><i>▱</i><i>◌</i></div>
  if (id === 'fluid-segmented') return <div className="mini-sp-segment"><b>Glass</b><strong>Liquid</strong><b>Solid</b></div>
  if (id === 'command-palette') return <div className="mini-sp-palette"><i>⌕</i><span>Search commands…</span><b>⌘ K</b></div>
  if (id === 'elastic-sheet') return <div className="mini-sp-sheet"><i /><b>The space between.</b><span /></div>
  if (id === 'toast-stack') return <div className="mini-sp-toasts"><i>✓ Changes crystallized</i><b>✧ A fresh layer arrived</b></div>
  if (id === 'analytics') return <div className="mini-analytics"><div className="mini-analytics-metrics"><b>8.2k<small>Visitors</small></b><b>68%<small>Engagement</small></b></div><div className="mini-analytics-bars">{[38,60,45,75,58,91,72].map((height,i)=><i key={i} style={{height:height + '%'}} />)}</div></div>
  if (id === 'realtime-pulse') return <div className="mini-realtime"><span><i/> LIVE · 15M</span><b>248</b><div>{[25,44,34,58,45,76,61,88,73,96].map((height,i)=><i key={i} style={{height:height + '%'}} />)}</div></div>
  if (id === 'conversion-funnel') return <div className="mini-funnel"><b>CONVERSION FLOW</b><i/><i/><i/><i/><i/></div>
  if (id === 'metric-card') return <div className="mini-metric"><small>MONTHLY REVENUE</small><b>$24,680</b><i /></div>
  if (id === 'trend-chart') return <div className="mini-analytics"><small className="mini-chart-title">WEEKLY VISITORS</small><div className="mini-analytics-bars">{[28,44,36,67,52,86,70].map((height,i)=><i key={i} style={{height:height + '%'}} />)}</div></div>
  if (id === 'traffic-sources') return <div className="mini-sources"><i/><i/><i/><i/><div><span>Direct</span><b>38%</b></div><div><span>Search</span><b>29%</b></div><div><span>Social</span><b>21%</b></div></div>
  return <div className="mini-table"><div><b>PAGE</b><b>VISITORS</b></div><div><span>/dashboard</span><b>4,280</b></div><div><span>/pricing</span><b>2,310</b></div><div><span>/docs</span><b>1,940</b></div></div>
}
