# frontendienst — agent guide

Bun-workspaces monorepo for the frontendienst company: an AI frontend-dev
harness (`harness/`) plus the apps it produces (`apps/`), showcased on the
portfolio site (`apps/site`). Read `docs/VISION.md` for intent and
`docs/ROADMAP.md` for current state before starting new work.

## Ground rules

- **Runtime is Bun** (>= 1.3). Use `bun install` / `bun run`; there is one
  lockfile at the repo root. Prefer Bun natives (`Bun.$`, `Bun.Glob`,
  `Bun.file`) over shell-outs and dep additions.
- **Every stack choice needs an ADR** in `docs/decisions/` (numbered,
  dated, with the "why"). Don't introduce a new framework/library category
  without one.
- **Apps must build to static assets** — GitHub Pages is the only hosting.
  Local-first storage (IndexedDB via Dexie) instead of backends; JSON
  export/import is mandatory in every data app.
- **When building an app, follow its domain skill** under `harness/skills/`
  (e.g. `web-app`, `phaser-game`) and scaffold from `harness/stacks/`.
  If you deviate, update the skill — the skills are the product.
- **Verify before declaring done:** run the verify loop
  (`bun run verify -- <url>`, see `harness/verify/`) — it checks server
  readiness, console/page errors, and takes screenshots.
- `@fex/kit` comes from a local checkout at `~/Projects/fex` (unpublished,
  Bun-only). If it's missing, clone `github.com:Faultless/fex` there.

## Workspace map

- `apps/site` — Astro portfolio. Project cards live in
  `src/data/projects.ts`; new prototypes get a card + live demo link.
- `apps/<name>` — one workspace per prototype, named `@frontendienst/<name>`.
- `harness/verify` — verify-loop package (`bun run verify`).
- `harness/skills/<domain>/SKILL.md` — buildable-domain playbooks.
- `harness/stacks/<domain>/` — scaffold blueprints the skills reference.
- `docs/research/` — survey reports and pattern catalogs that back the ADRs.
