# SpiderPanda Creative Lab

**Liquid glass with a little more life.**

SpiderPanda Creative Lab is a React + TypeScript playground for expressive glass UI and animated analytics. Explore cursor-reactive surfaces, spring-driven controls, draggable overlays, live-feeling charts, and interactive dashboards — then inspect the code and copy examples into your own project.

<p align="left">
  <a href="https://components.spiderpanda.online"><strong>Open the live playground ↗</strong></a>
</p>

---

## What is inside?

The current library is deliberately focused: **15 components in two collections**. Open the live playground to interact with them; the analytics dashboards use sample data and do not require an account or backend.

### Signature glass components

| Component | What it does |
| --- | --- |
| **Prism Button** | Cursor-following highlights, spring lift, and a tactile press. |
| **Mercury Switch** | A minimal pill switch with a satisfying bouncing thumb. |
| **Refractive Card** | Pointer-responsive light, subtle 3D tilt, and glass-like edge highlights. |
| **Liquid Dock** | A floating navigation dock with a smoothly moving active pill. |
| **Fluid Segmented Control** | A shared selection capsule that springs between options. |
| **Glass Command Palette** | Searchable commands, an animated overlay, and a `Ctrl/Cmd + K` shortcut. |
| **Elastic Glass Sheet** | A spring-loaded bottom sheet you can drag down to dismiss. |
| **Liquid Toast Stack** | Layered notifications with animated entry, dismissal, and clear-all. |

### Interactive analytics

| Dashboard / widget | What you can try |
| --- | --- |
| **Product Analytics** | Edit demo KPIs, trend values, and traffic counts; view animated charts and export CSV. |
| **Realtime Pulse** | Pause or resume a simulated event stream, change the time range, and filter channels and metrics. |
| **Conversion Studio** | Explore signup and checkout funnels, filter by date/device, and inspect stage-level drop-off. |
| **Animated Metric Card** | Inspect an animated KPI value, period change, and sparkline. |
| **Interactive Trend Chart** | Hover, focus, or select chart points to reveal values. |
| **Traffic Source Explorer** | Compare totals and percentage shares with animated bars. |
| **Analytics Table** | Sort demo records and preview editable table data. |

### Made for exploring

- **Live previews:** test the component directly in the playground.
- **Motion with purpose:** Framer Motion powers spring transitions, layout changes, and animated values.
- **Copy-ready examples:** each catalogue item has an import/JSX snippet and usage notes.
- **Editable analytics:** use **Edit data**, change the values, and choose **Confirm & preview** to see your changes.
- **Browser persistence:** analytics editor values are stored in local storage in your browser.
- **Responsive styling:** layouts adapt for narrower screens.
- **Reduced-motion support:** key motion effects respect the user's reduced-motion preference where implemented.

## Try it online

Visit **[components.spiderpanda.online](https://components.spiderpanda.online)**.

1. Open **Components** to browse the catalogue.
2. Choose **Signature** to see the animated glass components, or **Analytics** to explore dashboards and widgets.
3. Select a component to open its interactive preview.
4. Try its controls, then use **Copy code** or open the documentation for the example and usage notes.

For the most animated analytics demos, start with **Realtime Pulse** and **Conversion Studio**.

## Run it on your computer

### Requirements

- Node.js 20 or newer
- npm

### 1. Clone the repository

```bash
git clone https://github.com/Soumyaranjan12/spider-liquid.git
cd spider-liquid
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start the development server

```bash
npm run dev
```

Open the local URL shown by Vite, usually `http://localhost:5173`.

### Useful commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the local development server. |
| `npm run build` | Run TypeScript checks and create the production build. |
| `npm run preview` | Preview the built app locally. |

The static build is generated in `dist/`.

## Use a component in React

The repository is currently an **interactive source-code playground, not a published npm package**. The snippets below show the source imports used in this project; when using the components in a different app, copy the component source and its required styles, or adapt them to your own design system.

### A signature component

```tsx
import { PrismButton } from './components/SignatureComponents'

export function LaunchAction() {
  return (
    <PrismButton onClick={() => console.log('Launch')}>
      Launch sequence
    </PrismButton>
  )
}
```

### An animated analytics dashboard

```tsx
import { RealtimePulseDashboard } from './components/AnalyticsExperiences'

export function AnalyticsDemo() {
  return <RealtimePulseDashboard />
}
```

### Dependencies and styling

This project uses **React**, **TypeScript**, **Framer Motion**, **Lucide React**, and **Vite**. The visual system lives in `src/styles.css`; the showcase components rely on its CSS classes and design tokens. When moving a component into another project, bring over the relevant styles as well.

## Analytics data and privacy

- Dashboard values, events, funnels, and charts are **illustrative demo data**. They are not connected to your website, product, or analytics provider.
- The Realtime Pulse event stream is simulated locally to demonstrate motion and interactions.
- Analytics editor values are saved in your browser's local storage. They are not automatically sent to a server.
- CSV export from Product Analytics exports the displayed demo values.
- Replace the sample data and connect your own validated data source before using these components for real business reporting.

## Accessibility and motion

The project uses semantic buttons and labeled controls where appropriate. Some effects are decorative; essential information should remain readable without animation or color alone. Check keyboard focus and contrast in your own app, and test your chosen motion settings with real users. Reduced-motion handling is included for key animation effects, but should still be reviewed when adapting components.

## Project structure

```text
src/
├── components/
│   ├── SignatureComponents.tsx       # Eight signature glass interactions
│   ├── AnalyticsExperiences.tsx      # Realtime Pulse + Conversion Studio
│   ├── AnalyticsDashboard.tsx        # Editable Product Analytics dashboard
│   ├── AnalyticsComponents.tsx       # Reusable chart and data components
│   ├── EditableAnalyticsPreviews.tsx # Editable analytics playground previews
│   ├── AnalyticsFlipCard.tsx         # Flip-to-edit wrapper and persistence
│   └── GlassKit.tsx                  # Preview renderer for the current catalogue
├── data/
│   └── components.ts                 # Visible component catalogue and examples
├── App.tsx                           # Overview, library, playground, documentation
├── main.tsx                          # React entry point
└── styles.css                        # Visual system, effects, and responsive styling
.github/workflows/pages.yml           # Automated GitHub Pages build and deploy
```

---

Built as **SpiderPanda Creative Lab** — a focused playground for liquid-glass UI, intentional motion, and animated analytics.
