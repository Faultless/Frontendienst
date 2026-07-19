# ADR 0001 — Consolidate under the frontendienst monorepo

Date: 2026-07-19 · Status: accepted

## Context

The harness effort (AI-buildable web platforms) needed a home. A standalone
repo was scaffolded first, but the owner's intent is for all of this work to
consolidate into a portfolio showcase under **frontendienst**, the personal
company. The existing frontendienst repo was a flat Astro portfolio site.

## Decision

frontendienst becomes a Bun-workspaces monorepo:

- `apps/site` — the existing Astro portfolio, moved as-is.
- `apps/<prototype>` — each app the harness produces; every app is also a
  portfolio piece with a live demo.
- `harness/` — skills, stack blueprints, and the verify loop.

Bun is the runtime (matches fex; enables `@fex/kit` reuse, which is
Bun-only — it exports raw `.ts` with `Bun.$`/`Bun.file`).

## Consequences

- One deploy pipeline: the site build can pull in app demo builds under
  `/apps/<name>/` sub-paths on GitHub Pages.
- `@fex/kit` is consumed as a local path/git dependency (it is private,
  unpublished, and Bun-only) — acceptable since this repo is Bun-native.
- Prototypes stay browser-only / local-first (GitHub Pages hosting; aligns
  with the owner's Syncthing-first, no-cloud-backend posture).
