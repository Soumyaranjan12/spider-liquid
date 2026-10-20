# SpiderPanda Liquid Glass UI

A dark, Apple-inspired glass component library with SpiderPanda's obsidian and red identity. Built with React, TypeScript, Vite, Framer Motion, and Lucide icons.

## Run locally

Requirements: Node.js 18+ and npm.

```bash
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

This repo includes a GitHub Actions workflow that builds and deploys the app to GitHub Pages. In GitHub, open **Settings → Pages**, set **Build and deployment → Source** to **GitHub Actions**, then push to `main` or run the **Deploy to GitHub Pages** workflow manually. Once the workflow succeeds, the site will be at:

https://soumyaranjan12.github.io/spider-liquid/

## Features

- Component documentation follows the selected live-preview component
- Component API pages include props, usage guidance, example snippets, accessibility notes, and implementation caveats
- Copy actions include a clipboard fallback and visible success/failure feedback
- 14-component showcase and category filtering
- Interactive playground with backdrop, transparency and palette controls
- Eight preset accent palettes plus custom color
- Reliable copy actions, component-specific API docs, prop references, examples and accessibility notes
- Responsive layout, keyboard focus styling, and reduced-motion support

## Project layout

- `src/App.tsx`: overview, components page, playground and documentation
- `src/components/GlassKit.tsx`: reusable glass components
- `src/data/components.ts`: component catalogue and examples
- `src/styles.css`: design tokens, liquid glass effects and responsive styling
- `.github/workflows/pages.yml`: GitHub Pages deployment workflow

No backend, account, API key, or environment variables required.
