# ADR 0002 — web-app stack blueprint

Date: 2026-07-19 · Status: accepted

## Context

Data-heavy apps (first: kakeibo, the learn-accounting finance app) need one
opinionated stack an AI model can follow mechanically. Constraints: static
hosting (GitHub Pages), local-first data (no cloud backend; user syncs
devices with Syncthing), AI-legibility (conventions that survive being
re-derived by a model mid-session).

## Decision

- **Build:** Vite + React 19 + TypeScript strict. The owner's professional
  stack — maximum familiarity and ecosystem depth.
- **Routing:** TanStack Router (file-less, typed route tree in code —
  easier for a model to extend than file conventions it can't see listed).
- **State:** Zustand for app state; TanStack Query only when a real
  network boundary exists (kakeibo has none).
- **Storage:** Dexie (IndexedDB) with a repository layer — every entity
  behind a small `*Repo` module so storage can later swap to per-file
  Syncthing-friendly export without touching UI. Export/import to JSON is a
  blueprint requirement, not an afterthought.
- **Styling:** Tailwind CSS v4 + a tiny set of headless primitives
  (Radix). Inline utility classes are the most AI-legible styling system:
  no cross-file cascade to reconstruct.
- **Charts:** Recharts (follow the dataviz skill for design).
- **Tests:** Vitest for domain logic (the accounting engine must be
  test-first); the harness verify loop covers runtime/UI smoke.

## Consequences

- The blueprint lives in `harness/stacks/web-app/` as a scaffold + a
  CONVENTIONS.md the skill points at.
- No SSR/backends in v1 — everything must build to static assets.
