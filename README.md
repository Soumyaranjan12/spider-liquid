# SpiderPanda Creative Lab

A React and TypeScript component library for refined glass UI, practical controls, live previews, and copy-ready examples.

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

- **27 reusable components** across signature interactions, controls, forms, surfaces, feedback, navigation, overlays, and analytics.
- **Eight signature glass components:** Prism Button, Mercury Switch, Refractive Card, Liquid Dock, Fluid Segmented Control, Glass Command Palette, Elastic Glass Sheet, and Liquid Toast Stack.
- **Pointer-aware details and spring animations:** specular cursor light, perspective tilt, shared-layout pill transitions, keyboard-opened command palette, draggable sheet, and animated toast stacking.
- **Overview focused on the component library:** no dashboard preview. It highlights useful components across categories and links to the complete collection.
- **Five editable analytics UI components:** complete Analytics Dashboard, metric card, trend chart, traffic-source breakdown, and analytics data table.
- **Animated flip-to-edit UI:** click **Edit data** on any analytics component to flip it to its own editor; **Confirm & preview** saves your values and flips back to the updated component.
- **Per-component browser persistence:** each analytics component saves its own demo data in local storage so you can revisit and edit values without affecting the other widgets.
- **Live data visualizations:** edits to KPI values, trend points, source counts, and table rows are reflected in the preview once confirmed.
- **CSV export** from the complete Analytics Dashboard.
- **Interactive playground** with live component previews, import/JSX copy actions, and component-specific docs.

The analytics widgets use illustrative demo data so they can be explored without a backend. Replace demo values with your API data before using them for real reporting.

## Project structure

- `src/App.tsx`: overview, component library, playground, and documentation
- `src/components/AnalyticsFlipCard.tsx`: shared animated flip-to-edit wrapper and confirm/persist interaction
- `src/components/AnalyticsDashboard.tsx`: editable composed analytics dashboard
- `src/components/EditableAnalyticsPreviews.tsx`: editable metric card, trend chart, source breakdown, and data table previews
- `src/components/AnalyticsComponents.tsx`: analytics UI building blocks
- `src/components/GlassKit.tsx`: reusable UI primitives and live preview renderer
- `src/components/SignatureComponents.tsx`: eight interactive signature components built with Framer Motion
- `src/data/components.ts`: component catalogue and examples
- `src/styles.css`: theme, component visuals, flip animation, and responsive layout
- `.github/workflows/pages.yml`: automated GitHub Pages deployment
