# SpiderPanda Creative Lab

A React and TypeScript component studio with an interactive Analytics Dashboard, copy-ready examples, documentation, and privacy-friendly local workspace activity insights.

## Run locally

Requirements: Node.js 20+ and npm.

```bash
git clone https://github.com/Soumyaranjan12/spider-liquid.git
cd spider-liquid
npm install
npm run dev
```

Open the local URL printed by Vite (usually http://localhost:5173).

## Production build

```bash
npm run build
npm run preview
```

The static production output is generated in `dist/`.

## GitHub Pages

GitHub Actions builds and deploys the static app. In repository **Settings → Pages**, set **Build and deployment → Source** to **GitHub Actions**. Pushing to `main` triggers a build and deployment.

https://soumyaranjan12.github.io/spider-liquid/

## Features

- **Analytics Dashboard component:** interactive KPI cards, 7-day/30-day range, metric selector, traffic-source breakdown and CSV export.
- **Component studio:** browse 15 reusable components, interact with live previews, copy imports and JSX, and view component-specific API documentation.
- **Workspace analytics page:** local seven-day activity chart, page views, component previews, code copies, top components, latest events, and a clear-history action.
- **Private local history:** activity records remain in browser storage and are not sent to an analytics service.
- Responsive layout, visible keyboard focus, and reduced-motion support.

The Analytics Dashboard component uses illustrative demo data so it works without a backend. Replace its sample series with your own source before using it for business reporting.

## Project structure

- `src/App.tsx`: overview, component library, playground, docs and local analytics page
- `src/components/AnalyticsDashboard.tsx`: reusable interactive analytics component
- `src/components/AnalyticsPanel.tsx`: local workspace activity dashboard
- `src/components/GlassKit.tsx`: reusable component primitives and live preview renderer
- `src/data/components.ts`: component catalogue and examples
- `src/utils/analytics.ts`: privacy-friendly local tracking helpers
- `src/styles.css`: theme, component visuals and responsive layout
- `.github/workflows/pages.yml`: automated GitHub Pages deployment
