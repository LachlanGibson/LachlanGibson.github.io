# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

Personal portfolio/blog site (https://www.lachlangibson.dev), deployed to GitHub Pages. Articles are mostly interactive games with AI/algorithm write-ups.

## Commands

```sh
npm run dev        # React Router dev server
npm run build      # static prerender into build/client
npm run preview    # serve build/client locally (scripts/preview.mjs, port 4173 or $PORT)
npm run typecheck  # tsc --noEmit
npm run lint       # eslint over src/
npm run deploy     # build + push build/client to gh-pages
```

There is no test suite.

## Pinned dependencies

- `typescript` is held at 6.x because typescript-eslint does not yet support TypeScript 7 (peer `<6.1.0`).
- `primeicons` is held at 7.x: v8+ (like all PrimeUI packages, including PrimeReact v11) is under the PrimeUI License and needs a license key. PrimeReact was removed for this reason; don't reintroduce PrimeUI packages.

## Architecture

- **React Router v8 framework mode as a static site generator.** `react-router.config.ts` sets `appDirectory: "src"`, `ssr: false`, and a `prerender()` list built from static routes plus `src/blog/articleSlugs.ts`. Every page is prerendered to HTML at build time, so components must not touch `window`/`document`/`localStorage` during render — do it inside `useEffect` (or guard with `typeof window === "undefined"`).
- **Routing:** `src/routes.ts` defines routes; files in `src/routes/` are thin route modules (exporting `meta`/`links`) that render feature components from `src/home`, `src/about`, `src/blog`. `src/root.tsx` holds the HTML shell and global stylesheets.
- **Articles** are served by the single `articles/:slug` route. Adding an article requires:
  1. A component folder under `src/blog/articles/<Name>/`.
  2. The slug in `src/blog/articleSlugs.ts` (drives prerendering).
  3. An entry in `src/blog/articleMetaData.tsx` (title, dates, thumbnail, SEO meta, and `articleElement`). `src/routes/article.tsx` builds all OG/Twitter meta from this. `wip: true` marks unfinished articles.
  4. Thumbnails in `public/images/blog/thumbnail/{svg,webp}/`. `public/sitemap.xml` is maintained by hand.
- **Interactive games** follow a pattern of an article wrapper component (`<Name>.tsx`) plus a `Game<Name>.tsx`. The Tower Defense game (`src/blog/articles/TowerDefense/`) is the most complex: a canvas + `requestAnimationFrame` loop with game state in `useRef`s mutated directly, React state only for HUD values, and pure logic split into modules under `game/` (pathfinding/A*, map gen, waves, towers, enemies, projectiles, renderer). `PLANS.md`/`PLANS2.md` (untracked) hold its design plans.
- **Styling:** Tailwind v4 (via `@tailwindcss/vite`); CSS modules for per-article styles. Site colours are CSS variables in `src/index.css` (`--site-*` for page colours, `--ui-*` for component colours, both redefined for light mode) used as e.g. `bg-(--site-surface-alt)`. Shared form controls (`Button`, `Switch`, `Slider`, `NumberInput`) live in `src/ui/`; icons are PrimeIcons font classes (`pi pi-*`).
- **Theming:** `src/theme/ThemeProvider.tsx` + `useTheme()`. Sets `data-theme` (and the `app-dark` class in dark mode) on `<html>`; `:root` holds the dark values and `:root[data-theme="light"]` overrides them. Preference persisted in localStorage.
