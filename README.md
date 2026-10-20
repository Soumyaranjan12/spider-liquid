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
- **Interactive playground** with live component previews, import/JSX copy actions, and component-specific docs.
- **Analytics UI controls:** switch a trend metric/date range in the composed dashboard, select chart points, sort table columns, and export sample trend data to CSV.
- Responsive layout, visible keyboard focus, and reduced-motion support.

The analytics widgets use illustrative demo data so they can be tested without a backend. Replace the sample arrays with your API data before using them for real reporting.

## Project structure

- `src/App.tsx`: overview, component library, playground, and documentation
- `src/components/AnalyticsDashboard.tsx`: composed analytics dashboard example
- `src/components/AnalyticsComponents.tsx`: metric card, trend chart, source breakdown, and sortable table
- `src/components/GlassKit.tsx`: reusable UI primitives and live preview renderer
- `src/data/components.ts`: component catalogue and examples
- `src/styles.css`: theme, component visuals and responsive layout
- `.github/workflows/pages.yml`: automated GitHub Pages deployment
