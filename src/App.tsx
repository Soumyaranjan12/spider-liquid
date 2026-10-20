import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  Activity, ArrowRight, ArrowUpRight, BarChart3, BookOpen, Check, Code2, Copy,
  ChevronRight, Gamepad2, Github, Layers3, Menu, Search, Settings2, Sparkles, X
} from 'lucide-react'
import { components } from './data/components'
import AnalyticsPanel from './components/AnalyticsPanel'
import GamesHub, { type MiniGameId } from './components/GamesHub'
import { trackEvent } from './utils/analytics'
import { GlassBadge, GlassButton, GlassCard, GlassSearch, PlaygroundSample } from './components/GlassKit'

type Page = 'Overview' | 'Components' | 'Playground' | 'Documentation' | 'Analytics' | 'Games'
const categories = ['All components', 'Controls', 'Forms', 'Surfaces', 'Feedback', 'Navigation', 'Overlays']
const docsSnippet = "import { GlassButton, GlassCard, GlassToggle } from './components/GlassKit'\n\nexport function Example() {\n  return (\n    <GlassCard>\n      <h2>Welcome back</h2>\n      <p>Beautiful interfaces, with a little depth.</p>\n      <GlassButton variant=\"primary\">Continue</GlassButton>\n    </GlassCard>\n  )\n}"

export default function App() {
  const initialParams = new URLSearchParams(window.location.search)
  const [page, setPage] = useState<Page>(() => initialParams.get('game') === 'games' ? 'Games' : 'Overview')
  const [requestedGame, setRequestedGame] = useState<MiniGameId>(() => {
    const query = initialParams.get('mini')
    return query === 'chess' || query === 'pen' ? query : 'snake'
  })
  const initialRoom = initialParams.get('room') || ''
  const [selected, setSelected] = useState('button')
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
    'button': {
      importName: 'GlassButton',
      summary: 'A semantic, tactile button for primary actions, secondary actions, and low-emphasis controls.',
      props: [
        { name: 'variant', type: '"primary" | "secondary" | "quiet"', description: 'Visual emphasis. Defaults to "secondary".' },
        { name: 'children', type: 'ReactNode', description: 'Button label and optional inline content.' },
        { name: 'onClick', type: '() => void', description: 'Optional activation handler.' },
        { name: 'disabled', type: 'boolean', description: 'Uses the native button disabled state.' },
        { name: 'type', type: '"button" | "submit" | "reset"', description: 'Native button type; set explicitly inside forms.' }
      ],
      usage: 'Choose primary for the most important action in a view. Keep the label short and use one primary button per decision area when possible.',
      accessibility: 'Uses a native button, so keyboard activation and focus semantics are built in. The visible label should describe the action.',
      notes: 'The component forwards native button attributes. It does not add application logic; pass your own onClick handler.'
    },
    'icon-button': {
      importName: 'GlassIconButton',
      summary: 'A small glass action button for toolbars, close actions, and compact controls.',
      props: [
        { name: 'label', type: 'string', description: 'Required accessible name, also used as the title.' },
        { name: 'children', type: 'ReactNode', description: 'Icon or compact content displayed inside the control.' },
        { name: 'onClick', type: '() => void', description: 'Action performed when activated.' },
        { name: 'disabled', type: 'boolean', description: 'Optional native disabled state.' }
      ],
      usage: 'Use for familiar, single-purpose actions. Keep the icon visually simple and ensure the label explains what it does.',
      accessibility: 'Always provide a meaningful label; an icon alone does not communicate its purpose to assistive technology.',
      notes: 'Native button attributes are forwarded. Import an icon from lucide-react or supply any ReactNode.'
    },
    'toggle': {
      importName: 'GlassToggle',
      summary: 'A controlled on/off switch with a tactile thumb and clearly visible state.',
      props: [
        { name: 'checked', type: 'boolean', description: 'Current on/off state, controlled by the parent.' },
        { name: 'onChange', type: '(checked: boolean) => void', description: 'Called with the next state after activation.' },
        { name: 'label', type: 'string', description: 'Text explaining the setting being toggled.' }
      ],
      usage: 'Store checked in React state and update it in onChange. Switches are best for settings that take effect immediately.',
      accessibility: 'The control exposes role="switch" and aria-checked. Keep the label specific, for example "Enable notifications".',
      notes: 'This is a controlled component: it will not retain a new value unless the parent updates checked.'
    },
    'slider': {
      importName: 'GlassSlider',
      summary: 'A labeled range input for adjusting a numeric value.',
      props: [
        { name: 'label', type: 'string', description: 'Visible and accessible label for the range input.' },
        { name: 'value', type: 'number', description: 'Current numeric value.' },
        { name: 'onChange', type: '(value: number) => void', description: 'Receives the new numeric value.' },
        { name: 'min', type: 'number', description: 'Lower bound; defaults to 0.' },
        { name: 'max', type: 'number', description: 'Upper bound; defaults to 100.' }
      ],
      usage: 'Use for values that have a sensible numeric range. Show the current value and explain what low and high values mean when that is not obvious.',
      accessibility: 'Uses a native range input with a label. Keyboard users can adjust the value using the standard arrow keys.',
      notes: 'onChange receives a number, not a browser event. A parent should own the value state.'
    },
    'segmented': {
      importName: 'SegmentedControl',
      summary: 'A compact, single-choice control for a small set of related options.',
      props: [
        { name: 'options', type: 'string[]', description: 'Visible labels for all available options.' },
        { name: 'value', type: 'string', description: 'Currently selected option.' },
        { name: 'onChange', type: '(value: string) => void', description: 'Called when an option is selected.' }
      ],
      usage: 'Keep the number of options small and labels concise. Use tabs instead when each option switches between larger independent content panels.',
      accessibility: 'Each option is a button. For production use in forms, consider adding more explicit radio-group or tab semantics to match the interaction.',
      notes: 'The component is controlled. Ensure value matches one of options.'
    },
    'input': {
      importName: 'GlassInput',
      summary: 'A labeled text input with support for standard HTML input attributes.',
      props: [
        { name: 'label', type: 'string', description: 'Visible label placed above the field.' },
        { name: 'value', type: 'string | number', description: 'Optional controlled input value.' },
        { name: 'onChange', type: 'ChangeEventHandler', description: 'Standard React input change handler.' },
        { name: 'placeholder', type: 'string', description: 'Optional short hint; not a replacement for the label.' },
        { name: 'type', type: 'string', description: 'Any supported HTML input type, such as email or password.' }
      ],
      usage: 'Use the native value/onChange pair for controlled forms, or pass defaultValue for an uncontrolled field. Add required and autocomplete where appropriate.',
      accessibility: 'A visible label is rendered automatically. Keep validation text associated with the field when you add validation.',
      notes: 'Standard InputHTMLAttributes are forwarded to the input element.'
    },
    'search': {
      importName: 'GlassSearch',
      summary: 'A controlled search field with a built-in leading search icon.',
      props: [
        { name: 'value', type: 'string', description: 'Current query string.' },
        { name: 'onChange', type: '(value: string) => void', description: 'Called with the updated query, not the native event.' },
        { name: 'placeholder', type: 'string', description: 'Optional hint; also supplies the field’s accessible label.' }
      ],
      usage: 'Connect the query to filtering, search requests, or suggestions. Debounce expensive remote searches in the parent component.',
      accessibility: 'The input receives an accessible name from placeholder. If the placeholder is vague, provide a descriptive value such as "Search components".',
      notes: 'This component only collects text; filtering and empty states belong to the application.'
    },
    'card': {
      importName: 'GlassCard',
      summary: 'A reusable glass surface that groups related content without prescribing a layout.',
      props: [
        { name: 'children', type: 'ReactNode', description: 'Content rendered inside the surface.' },
        { name: 'className', type: 'string', description: 'Optional extra CSS class for app-specific styling.' }
      ],
      usage: 'Use cards to group information with a clear relationship. Avoid nesting many blurred surfaces, which can reduce contrast and add rendering cost.',
      accessibility: 'The card is a presentational div, not an interactive control. Use real buttons or links for clickable actions and semantic headings for structure.',
      notes: 'You can add a className to extend the surface style in your own stylesheet.'
    },
    'badge': {
      importName: 'GlassBadge',
      summary: 'A small capsule for status, category, and concise metadata.',
      props: [
        { name: 'children', type: 'ReactNode', description: 'Short status text.' },
        { name: 'tone', type: '"neutral" | "success" | "accent"', description: 'Visual tone; defaults to neutral.' }
      ],
      usage: 'Use one or two words where possible. Reserve success for genuinely positive or completed states.',
      accessibility: 'The label should communicate the status by itself. Color is supplementary and should not be the only distinction.',
      notes: 'This is a non-interactive span; do not use it as a button.'
    },
    'progress': {
      importName: 'GlassProgress',
      summary: 'A compact progress indicator with an optional label and percentage.',
      props: [
        { name: 'value', type: 'number', description: 'Progress value clamped visually to the 0–100 range.' },
        { name: 'label', type: 'string', description: 'Optional text shown next to the percentage.' }
      ],
      usage: 'Use for work with a meaningful start and finish, such as uploads or setup. Avoid indeterminate or arbitrary values when progress is unknown.',
      accessibility: 'For production applications, add progressbar semantics and aria-valuenow, aria-valuemin, and aria-valuemax to the track.',
      notes: 'The current component is visual only; add live announcements if the changing progress is important to users.'
    },
    'toast': {
      importName: 'GlassToast',
      summary: 'A compact notification surface for confirmations and short updates.',
      props: [
        { name: 'title', type: 'string', description: 'Short headline describing the result.' },
        { name: 'description', type: 'string', description: 'Supporting detail, ideally one short sentence.' }
      ],
      usage: 'Use for brief feedback that should not interrupt a task. Keep critical errors in persistent context so users can recover.',
      accessibility: 'The current preview is visual. In production, give notifications an appropriate aria-live role and ensure dismissal is keyboard accessible.',
      notes: 'The preview dismiss button demonstrates behavior; connect it to your notification lifecycle in a full application.'
    },
    'avatar': {
      importName: 'GlassAvatar',
      summary: 'A compact initials avatar for people or teams.',
      props: [
        { name: 'initials', type: 'string', description: 'One or two initials displayed in the avatar.' },
        { name: 'label', type: 'string', description: 'Accessible name; defaults to "Avatar".' }
      ],
      usage: 'Use initials when a profile photo is unavailable. Keep initials consistent with the name or entity represented.',
      accessibility: 'Provide a useful label describing the person or entity. If an image is used, supply meaningful alternative text.',
      notes: 'The component does not fetch or manage profile data; pass already available content.'
    },
    'nav': {
      importName: 'GlassNav',
      summary: 'A floating navigation dock for switching between a small set of app views.',
      props: [
        { name: 'items', type: 'string[]', description: 'Navigation item labels.' },
        { name: 'active', type: 'string', description: 'Currently active item label.' },
        { name: 'onChange', type: '(value: string) => void', description: 'Called with the selected label.' }
      ],
      usage: 'Use for a small number of top-level destinations or local modes. Connect onChange to your router or application view state.',
      accessibility: 'The dock has an accessible nav label and buttons. In a routed app, add current-page indication such as aria-current.',
      notes: 'The component does not navigate by itself. The parent owns routing and active state.'
    },
    'dialog': {
      importName: 'GlassDialog',
      summary: 'A presentational modal-style surface with a heading, description, and actions.',
      props: [
        { name: 'title', type: 'string', description: 'Dialog heading.' },
        { name: 'description', type: 'string', description: 'Supporting explanation.' }
      ],
      usage: 'Use as a visual starting point for confirmation and focused tasks. Connect actions to meaningful decisions before using it as a real modal.',
      accessibility: 'This component is only a visual preview, not a production modal. Add role="dialog", aria-modal, focus trapping, Escape handling, and focus restoration when implementing the full behavior.',
      notes: 'The preview buttons are illustrative. Add an overlay and manage open/close state in the parent application.'
    }
  }
  const reference = componentReference[current.id] || componentReference.button
  const componentSnippet = `import { ${reference.importName} } from './components/GlassKit'\n\n${current.code}`
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
  useEffect(() => { trackEvent('page_view', page) }, [page])
  useEffect(() => { if (page === 'Playground') trackEvent('component_preview', selected) }, [page, selected])
  const navItems = [
    { label: 'Overview' as Page, icon: Layers3 },
    { label: 'Analytics' as Page, icon: BarChart3 },
    { label: 'Games' as Page, icon: Gamepad2 },
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
          <Icon size={17} strokeWidth={1.8} /><span>{label}</span>{label === 'Components' && <small>14</small>}
        </button>
      )}</nav>
      <div className="side-caption side-caption-spaced">COMPONENTS</div>
      <div className="side-nav compact">{categories.slice(1).map((name, i) =>
        <button key={name} onClick={() => { setCategory(name); setPage('Components') }}><span className={'category-dot dot-' + i} />{name}</button>
      )}</div>
      <div className="sidebar-bottom">
        <button className="version-card" onClick={() => setPage('Games')}><div className="version-icon"><Gamepad2 size={15} /></div><div><b>Take a break</b><p>Snake · Chess · Pen Fight</p></div><ArrowUpRight size={14} /></button>
        <div className="profile-row"><div className="profile-avatar">SP</div><div><b>SpiderPanda</b><span>Creative lab</span></div><button aria-label="Open analytics" onClick={() => setPage('Analytics')}><BarChart3 size={16} /></button></div>
      </div>
    </aside>
    {mobileNav && <button className="mobile-scrim" aria-label="Close navigation" onClick={() => setMobileNav(false)} />}
    <main className="main-area">
      <header className="topbar">
        <button className="mobile-menu" onClick={() => setMobileNav(!mobileNav)} aria-label="Toggle menu"><Menu size={20} /></button>
        <div className="breadcrumbs"><span>SpiderPanda</span><span className="crumb-slash">/</span><b>{page}</b></div>
        <div className="top-actions">
          <a className="top-icon" href="https://github.com/Soumyaranjan12/spider-liquid" target="_blank" rel="noreferrer" aria-label="GitHub repository"><Github size={17} /></a>
          <button className="top-code" onClick={() => setPage('Analytics')}><BarChart3 size={15} /> Your activity <ArrowUpRight size={14} /></button>
        </div>
      </header>
      <div className="page-content">
        {page === 'Overview' && <>
          <section className="hero-section studio-hero">
            <div className="hero-copy">
              <div className="eyebrow-line"><span className="eyebrow-icon"><Activity size={13} /></span> PLAY · BUILD · ANALYSE <span className="eyebrow-rule" /></div>
              <h1>Your next idea<br />starts <span className="gradient-word">here.</span></h1>
              <p className="hero-subtitle">A practical creative lab for interactive components, local activity insights, and mini games. No decorative controls pretending to do a job.</p>
              <div className="hero-actions"><GlassButton variant="primary" onClick={() => { setRequestedGame('snake'); setPage('Games') }}>Launch a game <Gamepad2 size={16} /></GlassButton><button className="text-button" onClick={() => setPage('Analytics')}>View analytics <ArrowUpRight size={15} /></button></div>
              <div className="hero-proof"><div className="proof-avatars"><span>🐼</span><span>🕷️</span><span>✎</span></div><span><b>3 mini games · 14 pen classics</b><br />Single player and invite-link multiplayer</span></div>
            </div>
            <div className="home-launch-panel glass-panel">
              <div className="home-panel-top"><div><span className="mini-label">QUICK LAUNCH</span><h2>Choose your mode</h2></div><span className="home-panel-live"><i/> Ready</span></div>
              <div className="quick-game-grid">
                <button onClick={() => { setRequestedGame('snake'); setPage('Games') }}><span className="quick-game-icon snake-icon">◉</span><span><b>Snake</b><small>Beat your best score</small></span><ChevronRight size={15}/></button>
                <button onClick={() => { setRequestedGame('chess'); setPage('Games') }}><span className="quick-game-icon chess-icon">♟</span><span><b>Panda vs Spider</b><small>Chess · solo or online</small></span><ChevronRight size={15}/></button>
                <button onClick={() => { setRequestedGame('pen'); setPage('Games') }}><span className="quick-game-icon pen-icon">✎</span><span><b>Pen Fight</b><small>Physics · unlock 14 pens</small></span><ChevronRight size={15}/></button>
              </div>
              <div className="home-panel-foot"><div><BarChart3 size={15}/><span><b>Local insights</b><small>See what you play and explore</small></span></div><button onClick={() => setPage('Analytics')}>Open analytics <ArrowUpRight size={13}/></button></div>
            </div>
          </section>
          <section className="stats-row studio-stats">
            <div><span className="stat-label">MINI GAMES</span><b>03</b><small>Snake · Chess · Pen Fight</small></div>
            <div><span className="stat-label">INDIAN PENS</span><b>14</b><small>Campaign unlocks and online picks</small></div>
            <div><span className="stat-label">CHESS RULES</span><b className="stat-word">Full rules</b><small>Legal moves, check, and mate</small></div>
            <div><span className="stat-label">ANALYTICS</span><b className="stat-word">Local</b><small>Stored only in this browser</small></div>
          </section>
          <section className="section-block">
            <div className="section-heading"><div><div className="section-kicker">COMPONENT STUDIO</div><h2>Useful pieces. <span>Ready to test.</span></h2><p className="section-description">The component library stays here, without a separate appearance-design section.</p></div><button className="view-all" onClick={() => setPage('Components')}>Browse components <ArrowRight size={15} /></button></div>
            <div className="featured-grid">{components.slice(0, 4).map((c, i) =>
              <motion.button whileHover={{ y: -4 }} key={c.id} className={'featured-card feature-' + i} onClick={() => { setSelected(c.id); setPage('Playground') }}>
                <div className="featured-card-top"><span className="component-index">0{i + 1}</span><span className="card-arrow"><ArrowUpRight size={15} /></span></div>
                <div className="featured-preview"><MiniPreview id={c.id} /></div>
                <div className="featured-info"><span>{c.category}</span><h3>{c.name}</h3><p>{c.description}</p></div>
              </motion.button>
            )}</div>
          </section>
        </>}
        {page === 'Analytics' && <AnalyticsPanel onNavigate={destination => setPage(destination)} />}
        {page === 'Games' && <GamesHub initialGame={requestedGame} initialRoom={initialRoom} />}
        {page === 'Components' && <section className="subpage">
          <div className="subpage-heading"><div className="section-kicker">THE LIBRARY</div><h1>Made to <span>compose.</span></h1><p>Explore the full collection of interactive liquid-glass building blocks.</p></div>
          <div className="library-toolbar"><GlassSearch placeholder="Search components…" value={search} onChange={setSearch} /><div className="category-pills">{categories.map(c => <button key={c} className={category === c ? 'active' : ''} onClick={() => setCategory(c)}>{c}</button>)}</div></div>
          <div className="component-grid">{filtered.map((c, i) => <motion.button key={c.id} whileHover={{ y: -3 }} className="library-card glass-panel" onClick={() => { setSelected(c.id); setPage('Playground') }}><div className="library-card-head"><span className="component-index">{String(i + 1).padStart(2, '0')}</span><GlassBadge tone="success">{c.status}</GlassBadge></div><div className="library-preview"><MiniPreview id={c.id} /></div><div className="featured-info"><span>{c.category}</span><h3>{c.name}</h3><p>{c.description}</p></div><div className="library-card-foot">Open in playground <ArrowUpRight size={14} /></div></motion.button>)}</div>
          {filtered.length === 0 && <div className="empty-state glass-panel"><Search size={24} /><h3>No components found</h3><p>Try another search or select a different category.</p><button onClick={() => { setSearch(''); setCategory('All components') }}>Clear filters</button></div>}
        </section>}
        {page === 'Playground' && <section className="subpage playground-page">
          <div className="subpage-heading compact-heading"><div className="section-kicker">LIVE LABORATORY</div><h1>Test it in the <span>studio.</span></h1><p>Choose a component, try its interactive preview, and copy the import plus JSX example.</p></div>
          <div className="playground-layout">
            <aside className="playground-list glass-panel"><div className="panel-heading"><div><b>Components</b><p>Choose a preview</p></div><span className="list-count">14</span></div><GlassSearch placeholder="Filter components…" value={search} onChange={setSearch} /><div className="playground-items">{components.filter(c => (c.name + c.category).toLowerCase().includes(search.toLowerCase())).map(c => <button key={c.id} className={selected === c.id ? 'active' : ''} onClick={() => setSelected(c.id)}><span className="item-icon"><Code2 size={15} /></span><span>{c.name}<small>{c.category}</small></span>{selected === c.id && <span className="item-active-dot" />}</button>)}</div></aside>
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
              <article id="principles" className="docs-article"><span className="article-number">04 / MATERIAL LOGIC</span><h2>Glass with restraint</h2><div className="principle-grid"><div><Droplets size={18} /><b>Layer, don't stack</b><p>Use blur where it adds depth. Too many overlapping glass layers make interfaces muddy.</p></div><div><Activity size={18} /><b>Keep contrast</b><p>Pair translucent surfaces with clear text, deliberate edges, and readable states.</p></div><div><Sparkles size={18} /><b>Light with purpose</b><p>Use accent glow to guide attention, not as a permanent outline on everything.</p></div></div></article>
              <article id="accessibility" className="docs-article"><span className="article-number">05 / INCLUSIVE BY DEFAULT</span><h2>Accessibility</h2><ul className="docs-list"><li>Keep keyboard focus visible; don't rely on color alone to communicate state.</li><li>Use semantic buttons and labeled inputs for controls.</li><li>Respect <code>prefers-reduced-motion</code> and avoid essential information in animation.</li><li>Test glass surfaces against the actual backgrounds where they will be used.</li></ul><div className="note-callout"><Activity size={17} /><p><b>Browser note</b><br />Glass uses <code>backdrop-filter</code> when supported. Browsers without it fall back to a more opaque surface for legibility.</p></div></article>
            </div>
          </div>
        </section>}
        <footer className="page-footer"><div className="footer-brand"><span className="brand-mark mini"><span /></span><span>SPIDERPANDA <small>CREATIVE LAB</small></span></div><span>Useful tools. Clear feedback. A little play.</span><button onClick={() => setPage('Games')}>Mini games <ArrowUpRight size={13} /></button></footer>
      </div>
    </main>
    <AnimatePresence>{toast && <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="global-toast"><Check size={16} /><span>Interaction complete — looking good.</span><button onClick={() => setToast(false)}><X size={14} /></button></motion.div>}</AnimatePresence>
    {copied && <div className="copy-feedback" role="status" aria-live="polite">{copied === 'Component code copied' ? 'Component code copied to clipboard' : copied === 'Install commands copied' ? 'Install commands copied to clipboard' : copied === 'Example snippet copied' ? 'Example snippet copied to clipboard' : copied}</div>}
  </div>
}

function MiniPreview({ id }: { id: string }) {
  if (id === 'button') return <div className="mini-buttons"><span className="mini-primary">Continue <ArrowUpRight size={11} /></span><span className="mini-secondary">Cancel</span></div>
  if (id === 'icon-button') return <div className="mini-icon-buttons"><span><Settings2 size={15} /></span><span><X size={15} /></span><span><Check size={15} /></span></div>
  if (id === 'toggle') return <div className="mini-toggle"><span>Enable glass</span><i><b /></i></div>
  if (id === 'slider') return <div className="mini-slider"><span /><i /></div>
  if (id === 'segmented') return <div className="mini-segment"><b>Glass</b><span>Liquid</span><span>Solid</span></div>
  if (id === 'input') return <div className="mini-input">Display name <b>SpiderPanda</b></div>
  if (id === 'search') return <div className="mini-input"><Search size={13} /> Search components…</div>
  if (id === 'card') return <div className="mini-metric"><small>WEEKLY ACTIVITY</small><b>12,480</b><i /></div>
  if (id === 'badge') return <div className="mini-badges"><i>● Draft</i><b>● Ready</b></div>
  if (id === 'progress') return <div className="mini-progress"><span /><i /></div>
  if (id === 'toast') return <div className="mini-toast"><Check size={15} /><span><b>Saved</b><small>Changes are live</small></span></div>
  if (id === 'avatar') return <div className="mini-avatars"><i>SP</i><i>AL</i><i>MK</i></div>
  if (id === 'nav') return <div className="mini-nav"><b>Home</b><span>Explore</span><span>Saved</span></div>
  return <div className="mini-dialog"><i /><b>Ready to launch?</b><span /><span /></div>
}
