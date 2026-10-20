# SpiderPanda Creative Lab

A browser-based creative hub for reusable React components, privacy-friendly analytics, and mini games. Built with React, TypeScript, Vite, and CSS.

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

- **Games:** Snake with saved personal best, panda-vs-spider chess with legal move validation and a lightweight single-player opponent, and a physics-based Pen Fight arena.
- **Pen Fight campaign:** 14 familiar Indian stationery pen designs; earn three direct-hit points to clear each level and unlock/equip the next pen.
- **Online games:** shareable room links and peer-to-peer move/score synchronization using PeerJS/WebRTC. Multiplayer depends on browser WebRTC/network connectivity; PeerJS Cloud provides signaling, not a hosted game database.
- **Analytics:** local activity event timeline, component visits, game starts, chess moves, Snake points, Pen Fight points and levels. Data remains in local browser storage.
- **Component studio:** interactive component previews, copyable import/JSX, selected-component API documentation, props, examples, implementation notes and accessibility notes.
- Responsive layout and keyboard support.

## Project structure

- `src/App.tsx`: overview, navigation, component library, playground and docs
- `src/components/GamesHub.tsx`: Snake, themed chess, online room UI, Pen Fight physics and campaign
- `src/components/AnalyticsPanel.tsx`: local analytics dashboard
- `src/components/GlassKit.tsx`: reusable component primitives
- `src/data/components.ts`: component catalogue and examples
- `src/utils/analytics.ts`: privacy-friendly local tracking helpers
- `src/styles.css`: global styles, responsive layout and game styles
- `.github/workflows/pages.yml`: automated GitHub Pages deployment

## Multiplayer notes

The match creator generates a room ID and a link to the selected game. The joining player opens that link and connects through PeerJS Cloud signaling. After setup, moves and shot events are shared peer-to-peer. Some network combinations may prevent WebRTC from connecting; a relay/TURN service or a self-hosted signaling setup may be required for broader reliability.

No application database or paid API is configured. Analytics and campaign unlocks are stored in the local browser, not synced between devices.
