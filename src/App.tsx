import { useMemo, useState, type CSSProperties } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  Activity, ArrowRight, ArrowUpRight, BookOpen, Check, Code2, Copy, Droplets,
  Github, Layers3, Menu, Palette, Search, Settings2, Sparkles, X, Zap
} from 'lucide-react'
import { components } from './data/components'
import { GlassBadge, GlassButton, GlassCard, GlassSearch, PlaygroundSample } from './components/GlassKit'

type Page = 'Overview' | 'Components' | 'Playground' | 'Documentation'
const palettes = [
  { name: 'SpiderPanda', accent: '#ff414d' },
  { name: 'Arctic', accent: '#7dd3fc' },
  { name: 'Ultraviolet', accent: '#b49aff' },
  { name: 'Emerald', accent: '#52e0ae' },
  { name: 'Solar', accent: '#ffbd69' },
  { name: 'Rose', accent: '#ff8fbd' },
  { name: 'Cobalt', accent: '#6e9cff' },
  { name: 'Lime', accent: '#c4f36b' }
]
const categories = ['All components', 'Controls', 'Forms', 'Surfaces', 'Feedback', 'Navigation', 'Overlays']
const docsSnippet = "import { GlassButton, GlassCard, GlassToggle } from './components/GlassKit'\n\nexport function Example() {\n  return (\n    <GlassCard>\n      <h2>Welcome back</h2>\n      <p>Beautiful interfaces, with a little depth.</p>\n      <GlassButton variant=\"primary\">Continue</GlassButton>\n    </GlassCard>\n  )\n}"

export default function App() {
  const [page, setPage] = useState<Page>('Overview')
  const [selected, setSelected] = useState('button')
  const [category, setCategory] = useState('All components')
  const [search, setSearch] = useState('')
  const [palette, setPalette] = useState(palettes[0])
  const [customAccent, setCustomAccent] = useState('#ff414d')
  const [customOpen, setCustomOpen] = useState(false)
  const [blur, setBlur] = useState(22)
  const [glass, setGlass] = useState(58)
  const [backdrop, setBackdrop] = useState('aurora')
  const [copied, setCopied] = useState('')
  const [toast, setToast] = useState(false)
  const [mobileNav, setMobileNav] = useState(false)
  const [docsFor, setDocsFor] = useState('button')
  const current = components.find(c => c.id === selected) || components[0]
  const docsComponent = components.find(c => c.id === docsFor) || components[0]
  const componentReference: Record<string, { importName: string; props: string; behavior: string }> = {
    'button': { importName: 'GlassButton', props: 'variant?: "primary" | "secondary" | "quiet"; onClick?: () => void; children: ReactNode', behavior: 'A semantic button with a translucent surface. Use variant to change emphasis; native button props such as disabled and type are supported.' },
    'icon-button': { importName: 'GlassIconButton', props: 'label: string; children: ReactNode; native button props', behavior: 'A compact icon action. The label prop provides an accessible name for screen readers and keyboard users.' },
    'toggle': { importName: 'GlassToggle', props: 'checked: boolean; onChange: (checked: boolean) => void; label: string', behavior: 'A controlled switch. Keep the checked state in your app and provide a clear label.' },
    'slider': { importName: 'GlassSlider', props: 'label: string; value: number; onChange: (value: number) => void; min?: number; max?: number', behavior: 'A labeled range control. The displayed value updates as the user moves the slider.' },
    'segmented': { importName: 'SegmentedControl', props: 'options: string[]; value: string; onChange: (value: string) => void', behavior: 'A controlled single-selection control. The selected value must match one of the provided options.' },
    'input': { importName: 'GlassInput', props: 'label: string; native input props', behavior: 'A labeled text field that accepts standard input attributes such as value, onChange, type, and placeholder.' },
    'search': { importName: 'GlassSearch', props: 'value: string; onChange: (value: string) => void; placeholder?: string', behavior: 'A controlled search field. Connect its value to your list-filtering logic to make search functional.' },
    'card': { importName: 'GlassCard', props: 'children: ReactNode; className?: string', behavior: 'A presentational surface for grouping related content. Put semantic headings and content inside it.' },
    'badge': { importName: 'GlassBadge', props: 'children: ReactNode; tone?: "neutral" | "success" | "accent"', behavior: 'A compact status indicator. Keep the text meaningful rather than relying on color alone.' },
    'progress': { importName: 'GlassProgress', props: 'value: number; label?: string', behavior: 'Displays progress from 0 to 100. Values are clamped to that range.' },
    'toast': { importName: 'GlassToast', props: 'title: string; description: string', behavior: 'A visual confirmation notice. Production apps should also announce important feedback through an aria-live region.' },
    'avatar': { importName: 'GlassAvatar', props: 'initials: string; label?: string', behavior: 'A compact initials avatar with an accessible label. Replace it with an image avatar if your product supports profile photos.' },
    'nav': { importName: 'GlassNav', props: 'items: string[]; active: string; onChange: (value: string) => void', behavior: 'A controlled navigation dock for switching between a small set of local views.' },
    'dialog': { importName: 'GlassDialog', props: 'title: string; description: string', behavior: 'A presentational dialog preview. For a real modal, add focus trapping, Escape handling, and dialog semantics.' }
  }
  const reference = componentReference[docsComponent.id] || componentReference.button
  const openComponentDocs = () => {
    setDocsFor(selected)
    setPage('Documentation')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  const accent = customOpen ? customAccent : palette.accent
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
    { label: 'Playground' as Page, icon: Settings2 },
    { label: 'Documentation' as Page, icon: BookOpen }
  ]

  return <div className={'app-shell backdrop-' + backdrop} style={{
    '--accent': accent, '--accent-rgb': hexToRgb(accent),
    '--glass-opacity': glass / 100, '--glass-blur': blur + 'px',
    '--glass-fill': (glass / 100) * 0.24,
    '--glass-fill-soft': (glass / 100) * 0.07,
    '--glass-fill-strong': (glass / 100) * 0.32,
    '--glass-fill-dark': (glass / 100) * 0.3
  } as CSSProperties}>
    <div className="ambient ambient-one" /><div className="ambient ambient-two" /><div className="ambient ambient-three" />
    <aside className={'sidebar ' + (mobileNav ? 'sidebar-open' : '')}>
      <button className="brand" onClick={() => setPage('Overview')} aria-label="SpiderPanda home">
        <span className="brand-mark"><span /></span><span className="brand-text">spiderpanda<span>LIQUID GLASS</span></span>
      </button>
      <div className="side-caption">WORKSPACE</div>
      <nav className="side-nav">{navItems.map(({ label, icon: Icon }) =>
        <button key={label} className={page === label ? 'selected' : ''} onClick={() => { setPage(label); setMobileNav(false) }}>
          <Icon size={17} strokeWidth={1.8} /><span>{label}</span>{label === 'Components' && <small>14</small>}
        </button>
      )}</nav>
      <div className="side-caption side-caption-spaced">LIBRARY</div>
      <div className="side-nav compact">{categories.slice(1).map((name, i) =>
        <button key={name} onClick={() => { setCategory(name); setPage('Components') }}><span className={'category-dot dot-' + i} />{name}</button>
      )}</div>
      <div className="sidebar-bottom">
        <button className="version-card" onClick={() => { setDocsFor(selected); setPage('Documentation') }}><div className="version-icon"><BookOpen size={15} /></div><div><b>Component API & docs</b><p>Props, examples, accessibility</p></div><ArrowUpRight size={14} /></button>
        <div className="profile-row"><div className="profile-avatar">SP</div><div><b>SpiderPanda</b><span>Design system</span></div><button aria-label="Settings" onClick={() => setPage('Playground')}><Settings2 size={16} /></button></div>
      </div>
    </aside>
    {mobileNav && <button className="mobile-scrim" aria-label="Close navigation" onClick={() => setMobileNav(false)} />}
    <main className="main-area">
      <header className="topbar">
        <button className="mobile-menu" onClick={() => setMobileNav(!mobileNav)} aria-label="Toggle menu"><Menu size={20} /></button>
        <div className="breadcrumbs"><span>SpiderPanda</span><span className="crumb-slash">/</span><b>{page}</b></div>
        <div className="top-actions"><span className="live-status"><i /> All systems smooth</span>
          <a className="top-icon" href="https://github.com/Soumyaranjan12/spider-liquid" target="_blank" rel="noreferrer" aria-label="GitHub repository"><Github size={17} /></a>
          <button className="top-code" onClick={() => setPage('Documentation')}><Code2 size={15} /> Get started <ArrowUpRight size={14} /></button>
        </div>
      </header>
      <div className="page-content">
        {page === 'Overview' && <>
          <section className="hero-section">
            <div className="hero-copy">
              <div className="eyebrow-line"><span className="eyebrow-icon"><Sparkles size={13} /></span> A COMPONENT LIBRARY WITH DEPTH <span className="eyebrow-rule" /></div>
              <h1>Interfaces that<br />feel <span className="gradient-word">alive.</span></h1>
              <p className="hero-subtitle">Meet Liquid Glass — a thoughtful collection of translucent, tactile components made for the next generation of web experiences.</p>
              <div className="hero-actions"><GlassButton variant="primary" onClick={() => setPage('Playground')}>Explore the playground <ArrowRight size={16} /></GlassButton><button className="text-button" onClick={() => setPage('Documentation')}>Read the docs <ArrowUpRight size={15} /></button></div>
              <div className="hero-proof"><div className="proof-avatars"><span>SP</span><span>UI</span><span>✳</span></div><span><b>14 crafted components</b><br />One cohesive design language</span></div>
            </div>
            <div className="hero-art" aria-label="Abstract liquid glass artwork">
              <div className="orbit orbit-a" /><div className="orbit orbit-b" /><div className="orb-shadow" />
              <div className="glass-orb"><div className="orb-glint" /><div className="orb-core" /><div className="orb-shard shard-one" /><div className="orb-shard shard-two" /><div className="orb-rim" /></div>
              <div className="orb-label label-top"><span className="label-dot" /> REAL-TIME LIGHT <ArrowUpRight size={12} /></div>
              <div className="orb-label label-bottom"><Droplets size={13} /> REFRACTIVE BY NATURE</div>
              <div className="float-chip"><span className="float-chip-icon"><Layers3 size={15} /></span><span><b>Layered surfaces</b><small>Depth, without the noise</small></span><span className="chip-spark">✳</span></div>
            </div>
          </section>
          <section className="stats-row">
            <div><span className="stat-label">COMPONENTS</span><b>14<span>+</span></b><small>Ready to compose</small></div>
            <div><span className="stat-label">THEME PRESETS</span><b>08</b><small>Plus custom color</small></div>
            <div><span className="stat-label">DEPENDENCIES</span><b>03</b><small>React · Motion · Icons</small></div>
            <div><span className="stat-label">DESIGN INTENT</span><b className="stat-word">Clarity<span> × </span>Depth</b><small>Subtle, not shouty</small></div>
          </section>
          <section className="section-block">
            <div className="section-heading"><div><div className="section-kicker">THE COLLECTION</div><h2>Small details. <span>Big feeling.</span></h2></div><button className="view-all" onClick={() => setPage('Components')}>View all components <ArrowRight size={15} /></button></div>
            <div className="featured-grid">{components.slice(0, 4).map((c, i) =>
              <motion.button whileHover={{ y: -4 }} key={c.id} className={'featured-card feature-' + i} onClick={() => { setSelected(c.id); setPage('Playground') }}>
                <div className="featured-card-top"><span className="component-index">0{i + 1}</span><span className="card-arrow"><ArrowUpRight size={15} /></span></div>
                <div className="featured-preview"><MiniPreview id={c.id} /></div>
                <div className="featured-info"><span>{c.category}</span><h3>{c.name}</h3><p>{c.description}</p></div>
              </motion.button>
            )}</div>
          </section>
          <section className="section-block theme-section">
            <div className="section-heading"><div><div className="section-kicker">MAKE IT YOURS</div><h2>One system. <span>Your colors.</span></h2><p className="section-description">Every surface responds to your palette. Try a preset or dial in your own accent.</p></div><div className="palette-count"><Palette size={16} /> 08 presets</div></div>
            <PalettePanel palette={palette} setPalette={setPalette} customOpen={customOpen} setCustomOpen={setCustomOpen} customAccent={customAccent} setCustomAccent={setCustomAccent} />
          </section>
        </>}
        {page === 'Components' && <section className="subpage">
          <div className="subpage-heading"><div className="section-kicker">THE LIBRARY</div><h1>Made to <span>compose.</span></h1><p>Explore the full collection of interactive liquid-glass building blocks.</p></div>
          <div className="library-toolbar"><GlassSearch placeholder="Search components…" value={search} onChange={setSearch} /><div className="category-pills">{categories.map(c => <button key={c} className={category === c ? 'active' : ''} onClick={() => setCategory(c)}>{c}</button>)}</div></div>
          <div className="component-grid">{filtered.map((c, i) => <motion.button key={c.id} whileHover={{ y: -3 }} className="library-card glass-panel" onClick={() => { setSelected(c.id); setPage('Playground') }}><div className="library-card-head"><span className="component-index">{String(i + 1).padStart(2, '0')}</span><GlassBadge tone="success">{c.status}</GlassBadge></div><div className="library-preview"><MiniPreview id={c.id} /></div><div className="featured-info"><span>{c.category}</span><h3>{c.name}</h3><p>{c.description}</p></div><div className="library-card-foot">Open in playground <ArrowUpRight size={14} /></div></motion.button>)}</div>
          {filtered.length === 0 && <div className="empty-state glass-panel"><Search size={24} /><h3>No components found</h3><p>Try another search or select a different category.</p><button onClick={() => { setSearch(''); setCategory('All components') }}>Clear filters</button></div>}
        </section>}
        {page === 'Playground' && <section className="subpage playground-page">
          <div className="subpage-heading compact-heading"><div className="section-kicker">LIVE LABORATORY</div><h1>Dial in the <span>details.</span></h1><p>Change the material, pick a component and copy the snippet straight into your project.</p></div>
          <div className="playground-layout">
            <aside className="playground-list glass-panel"><div className="panel-heading"><div><b>Components</b><p>Choose a preview</p></div><span className="list-count">14</span></div><GlassSearch placeholder="Filter components…" value={search} onChange={setSearch} /><div className="playground-items">{components.filter(c => (c.name + c.category).toLowerCase().includes(search.toLowerCase())).map(c => <button key={c.id} className={selected === c.id ? 'active' : ''} onClick={() => setSelected(c.id)}><span className="item-icon"><Code2 size={15} /></span><span>{c.name}<small>{c.category}</small></span>{selected === c.id && <span className="item-active-dot" />}</button>)}</div></aside>
            <div className="playground-main">
              <div className="preview-panel glass-panel"><div className="preview-panel-head"><div><span className="mini-label">LIVE PREVIEW</span><h3>{current.name}</h3></div><div className="preview-head-actions"><GlassBadge tone="success">Interactive</GlassBadge><button className="top-icon" aria-label="Copy code" onClick={() => copy(current.code, 'Component code copied')}><Copy size={15} /></button></div></div>
                <div className={'live-stage stage-' + backdrop}><div className="stage-glow" /><div className="stage-content"><PlaygroundSample key={selected} id={selected} onToast={showToast} /></div><span className="stage-caption"><span /> POINTER-READY SURFACE</span></div>
                <div className="preview-panel-foot"><span><i /> Live component</span><span>Preview is illustrative</span></div>
              </div>
              <div className="playground-controls glass-panel"><div className="panel-heading"><div><b>Appearance</b><p>Adjust the material properties</p></div><Settings2 size={17} /></div>
                <label className="control-label">Backdrop</label><div className="backdrop-options">{[{ id: 'aurora', name: 'Aurora' }, { id: 'mesh', name: 'Mesh' }, { id: 'plain', name: 'Plain' }].map(b => <button key={b.id} className={'backdrop-option backdrop-' + b.id + (backdrop === b.id ? ' active' : '')} onClick={() => setBackdrop(b.id)}><span />{b.name}</button>)}</div>
                <label className="slider-control"><span>Blur radius <b>{blur}px</b></span><input type="range" min="0" max="40" value={blur} onChange={e => setBlur(Number(e.target.value))} /></label>
                <label className="slider-control"><span>Transparency <b>{glass}%</b></span><input type="range" min="15" max="90" value={glass} onChange={e => setGlass(Number(e.target.value))} /></label>
                <div className="control-divider" /><label className="control-label">Accent palette</label>
                <div className="compact-palettes">{palettes.map(p => <button key={p.name} title={p.name} aria-label={p.name} className={palette.name === p.name && !customOpen ? 'active' : ''} style={{ background: p.accent }} onClick={() => { setPalette(p); setCustomOpen(false) }} />)}<button className="custom-color-dot" title="Custom color" onClick={() => setCustomOpen(!customOpen)}><Palette size={13} /></button></div>
                {customOpen && <label className="inline-color">Custom accent <input type="color" value={customAccent} onChange={e => setCustomAccent(e.target.value)} /></label>}
              </div>
              <div className="code-panel glass-panel"><div className="code-panel-head"><div><span className="mini-label">QUICK START</span><b>React + TypeScript</b></div><button className="copy-button" onClick={() => copy(current.code, 'Component code copied')}>{copied === 'Component code copied' ? <Check size={14} /> : <Copy size={14} />} {copied === 'Component code copied' ? 'Copied' : 'Copy code'}</button></div><pre><code>{current.code}</code></pre><div className="code-panel-foot"><span><span className="code-dot" /> TSX</span><button onClick={openComponentDocs}>View API & usage <ArrowUpRight size={13} /></button></div></div>
            </div>
          </div>
        </section>}
        {page === 'Documentation' && <section className="subpage docs-page">
          <div className="subpage-heading"><div className="section-kicker">FIELD NOTES</div><h1>Designed with <span>intention.</span></h1><p>A practical guide to the Liquid Glass system — from install to the tiny details that make it feel right.</p></div>
          <article className="docs-article component-reference"><span className="article-number">COMPONENT REFERENCE / API</span><h2>{docsComponent.name}</h2><p>{docsComponent.description} {reference.behavior}</p><div className="reference-meta"><span>{docsComponent.category}</span><code>{reference.importName}</code></div><h3>Props</h3><pre className="props-code"><code>{reference.props}</code></pre><h3>Example</h3><div className="code-block"><div><span>TSX SNIPPET</span><button onClick={() => copy(`import { ${reference.importName} } from './components/GlassKit'\n\n${docsComponent.code}`, 'Component example copied')}>{copied === 'Component example copied' ? <Check size={14} /> : <Copy size={14} />} Copy example</button></div><pre><code>{`import { ${reference.importName} } from './components/GlassKit'\n\n${docsComponent.code}`}</code></pre></div><GlassButton variant="quiet" onClick={() => setPage('Playground')}>Back to playground <ArrowRight size={14} /></GlassButton></article><div className="docs-layout"><nav className="docs-toc glass-panel"><span className="mini-label">ON THIS PAGE</span><a href="#install">Installation</a><a href="#usage">Usage</a><a href="#tokens">Design tokens</a><a href="#principles">Material principles</a><a href="#accessibility">Accessibility</a></nav>
            <div className="docs-content">
              <article id="install" className="docs-article"><span className="article-number">01 / GET STARTED</span><h2>Installation</h2><p>Start with a modern React app. This project uses Vite, TypeScript, Framer Motion, and Lucide icons.</p><div className="code-block"><div><span>TERMINAL</span><button onClick={() => copy('npm install\nnpm run dev', 'Install commands copied')}>{copied === 'Install commands copied' ? <Check size={14} /> : <Copy size={14} />} Copy</button></div><pre><code>{'npm install\nnpm run dev'}</code></pre></div></article>
              <article id="usage" className="docs-article"><span className="article-number">02 / COMPOSE</span><h2>Use a component</h2><p>Components are deliberately small. Compose them with your own content and keep application state in your app.</p><div className="code-block"><div><span>EXAMPLE.TSX</span><button onClick={() => copy(docsSnippet, 'Example snippet copied')}>{copied === 'Example snippet copied' ? <Check size={14} /> : <Copy size={14} />} Copy</button></div><pre><code>{docsSnippet}</code></pre></div><GlassButton variant="primary" onClick={() => setPage('Playground')}>Try it in the playground <ArrowRight size={15} /></GlassButton></article>
              <article id="tokens" className="docs-article"><span className="article-number">03 / THE FOUNDATION</span><h2>Design tokens</h2><p>Use CSS custom properties to tune the material without rewriting component styles.</p><div className="token-list"><div><span className="token-swatch token-black" /><span><b>--surface</b><small>Primary canvas</small></span><code>#09090B</code></div><div><span className="token-swatch" style={{ background: accent }} /><span><b>--accent</b><small>Interactive highlight</small></span><code>{accent.toUpperCase()}</code></div><div><span className="token-swatch token-glass" /><span><b>--glass-opacity</b><small>Surface translucency</small></span><code>{(glass / 100).toFixed(2)}</code></div><div><span className="token-swatch token-blur" /><span><b>--glass-blur</b><small>Backdrop softness</small></span><code>{blur}px</code></div></div></article>
              <article id="principles" className="docs-article"><span className="article-number">04 / MATERIAL LOGIC</span><h2>Glass with restraint</h2><div className="principle-grid"><div><Droplets size={18} /><b>Layer, don't stack</b><p>Use blur where it adds depth. Too many overlapping glass layers make interfaces muddy.</p></div><div><Activity size={18} /><b>Keep contrast</b><p>Pair translucent surfaces with clear text, deliberate edges, and readable states.</p></div><div><Sparkles size={18} /><b>Light with purpose</b><p>Use accent glow to guide attention, not as a permanent outline on everything.</p></div></div></article>
              <article id="accessibility" className="docs-article"><span className="article-number">05 / INCLUSIVE BY DEFAULT</span><h2>Accessibility</h2><ul className="docs-list"><li>Keep keyboard focus visible; don't rely on color alone to communicate state.</li><li>Use semantic buttons and labeled inputs for controls.</li><li>Respect <code>prefers-reduced-motion</code> and avoid essential information in animation.</li><li>Test glass surfaces against the actual backgrounds where they will be used.</li></ul><div className="note-callout"><Activity size={17} /><p><b>Browser note</b><br />Glass uses <code>backdrop-filter</code> when supported. Browsers without it fall back to a more opaque surface for legibility.</p></div></article>
            </div>
          </div>
        </section>}
        <footer className="page-footer"><div className="footer-brand"><span className="brand-mark mini"><span /></span><span>SPIDERPANDA <small>LIQUID GLASS UI</small></span></div><span>Made with intention, shipped with a little glow.</span><button onClick={() => setPage('Documentation')}>Documentation <ArrowUpRight size={13} /></button></footer>
      </div>
    </main>
    <AnimatePresence>{toast && <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="global-toast"><Check size={16} /><span>Interaction complete — looking good.</span><button onClick={() => setToast(false)}><X size={14} /></button></motion.div>}</AnimatePresence>
    {copied && copied !== 'Component code copied' && copied !== 'Install commands copied' && copied !== 'Example snippet copied' && <div className="copy-feedback">{copied}</div>}
  </div>
}

function PalettePanel({ palette, setPalette, customOpen, setCustomOpen, customAccent, setCustomAccent }: {
  palette: typeof palettes[number]; setPalette: (v: typeof palettes[number]) => void;
  customOpen: boolean; setCustomOpen: (v: boolean) => void; customAccent: string; setCustomAccent: (v: string) => void
}) {
  return <div className="palette-panel glass-panel"><div className="palette-swatches">{palettes.map(p => <button key={p.name} className={'palette-swatch ' + (palette.name === p.name && !customOpen ? 'active' : '')} onClick={() => { setPalette(p); setCustomOpen(false) }} title={p.name} style={{ '--swatch': p.accent } as CSSProperties}><span /><small>{p.name}</small></button>)}<button className={'palette-swatch custom-swatch ' + (customOpen ? 'active' : '')} onClick={() => setCustomOpen(!customOpen)} title="Custom palette"><span><Palette size={17} /></span><small>Custom</small></button></div>{customOpen && <div className="custom-color-row"><label>Accent color <input type="color" value={customAccent} onChange={e => setCustomAccent(e.target.value)} /></label><code>{customAccent.toUpperCase()}</code><button onClick={() => setCustomAccent('#ff414d')}>Reset</button></div>}</div>
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
function hexToRgb(hex: string) {
  const clean = hex.replace('#', '')
  const n = parseInt(clean.length === 3 ? clean.split('').map(c => c + c).join('') : clean, 16)
  return ((n >> 16) & 255) + ',' + ((n >> 8) & 255) + ',' + (n & 255)
}
