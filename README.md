# Treadmill Tracker

Minimal React + TypeScript frontend (Vite, no backend).

## Setup

```bash
mise install
mise run install
```

## Commands

| Task | Description |
|------|-------------|
| `mise run dev` | Dev server |
| `mise run lint` | ESLint |
| `mise run build` | Production build |
| `mise run test:e2e` | Playwright E2E (run `mise run test:e2e:install` once) |

See **[AGENTS.md](./AGENTS.md)** for conventions (SCSS + BEM, ESLint rules, mise tasks).

## GitHub Pages

Pushes to `master` build and deploy to GitHub Pages at
**https://elc.github.io/treadmill-tracker/** (see `.github/workflows/pages.yml`).
