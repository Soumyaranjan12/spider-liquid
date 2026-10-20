# SpiderPanda Creative Lab

A React and TypeScript UI component library with interactive component previews, component-specific API docs, and reusable analytics UI building blocks.

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

- **19 reusable components**, including five analytics UI pieces: complete dashboard, KPI metric card, trend chart, traffic-source breakdown, and sortable analytics table.
- **Overview shortcuts:** browse analytics building blocks without embedding the full analytics dashboard in the Overview page.
- **Editable dashboard demo data:** maintain KPI values and percent changes, edit the selected trend series as comma-separated values, and change traffic-source counts. KPI cards, graph bars, and source percentages recalculate as you type.
- **Local persistence:** analytics demo settings are stored in this browser under `spiderpanda.analytics-dashboard.v1`. Use **Reset demo** to restore default values.
- **CSV export:** export the current range's trend values, KPI values, and traffic-source breakdown.
- **Interactive playground** with live component previews, import/JSX copy actions, and component-specific docs.

The analytics widgets use illustrative demo data so they can be tested without a backend. Replace the demo configuration with your API data before using them for real reporting.

## Project structure

- `src/App.tsx`: overview, component library, playground, and documentation
- `src/components/AnalyticsDashboard.tsx`: editable composed analytics dashboard
- `src/components/AnalyticsComponents.tsx`: metric card, trend chart, source breakdown, and sortable table
- `src/components/GlassKit.tsx`: reusable UI primitives and live preview renderer
- `src/data/components.ts`: component catalogue and examples
- `src/styles.css`: theme, component visuals and responsive layout
- `.github/workflows/pages.yml`: automated GitHub Pages deployment
