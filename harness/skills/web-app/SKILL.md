---
name: web-app
description: Build a data-heavy local-first web app the frontendienst way — Vite + React + TS strict, Dexie behind repos, Tailwind v4, static-hostable, JSON export/import mandatory.
---

# Building a web app

The blueprint behind ADR 0002. Reference implementation: `apps/kakeibo`.

## Non-negotiables

1. **Stack:** Vite + React 19 + TypeScript strict (`noUncheckedIndexedAccess`,
   `noUnusedLocals/Parameters`), Tailwind CSS v4 via `@tailwindcss/vite`,
   workspace named `@frontendienst/<app>`.
2. **Static-hostable:** must build to static assets and work from a
   sub-path (`/apps/<name>/` on GitHub Pages). Use hash-based routing —
   no server rewrites exist. Vite `base: './'`.
3. **Domain logic is a pure module** (`src/domain/`): plain functions over
   plain types, zero React/Dexie imports, Vitest-tested. UI and storage
   are replaceable shells around it.
4. **Storage behind repositories:** Dexie (IndexedDB) accessed only from
   `src/data/` repo modules; components use `useLiveQuery` on repo
   functions, never raw table access. This keeps a later swap to
   per-file Syncthing-friendly storage contained.
5. **JSON export/import is a launch requirement,** not a nice-to-have:
   one button exports the full DB as a versioned JSON document; import
   validates and replaces. (Local-first data the user can't move is a
   trap.)
6. **Money and quantities are integers** (cents, not floats). Format at
   the edge with `Intl.NumberFormat`.

## Layout

```
apps/<name>/
  index.html            single mount div, dark-friendly body
  vite.config.ts        react() + tailwindcss(), base './'
  src/
    main.tsx            mount + router
    styles.css          @import "tailwindcss"; + design tokens
    domain/             pure logic + *.test.ts (Vitest)
    data/               db.ts (Dexie schema), repos, export/import, seed
    pages/              one file per route
    components/         shared presentational pieces
```

## Verify

- `bun run --filter @frontendienst/<app> test` (domain tests) and
  `bunx tsc --noEmit -p apps/<name>` must pass.
- `bun run verify -- --cmd "bun run --filter @frontendienst/<app> dev" --port 5173`
  must come back clean before declaring done.
- New app ⇒ add a project card in `apps/site/src/data/projects.ts` and
  wire the demo build into `.github/workflows/deploy.yml`.
