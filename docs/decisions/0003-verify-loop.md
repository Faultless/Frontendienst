# ADR 0003 — verification loop on top of @fex/kit

Date: 2026-07-19 · Status: accepted

## Context

The single biggest gap when AI models build frontends is the missing "did
it actually work?" signal. A survey of `~/Projects/fex` (2026-07-19) found
`@fex/kit` already provides the page half of the loop:

- `browser.capture(url, out, opts)` — Chromium screenshot with animation
  stabilization and masking (`packages/kit/src/browser.ts:85`).
- `browser.withPage(url, opts, fn)` — raw Playwright `Page` access with
  guaranteed teardown (`browser.ts:112`).
- `visual.diffImages(a, b, out, opts)` — pixelmatch diff with pass/fail
  ratio (`packages/kit/src/visual.ts:47`).

Missing from fex (confirmed by survey): dev-server lifecycle (spawn +
teardown), port/readiness polling, and console/pageerror/requestfailed
collection.

## Decision

`harness/verify` is a small Bun package that imports `@fex/kit` (local path
dependency) and adds exactly the missing pieces:

1. `startServer(cmd, { port, cwd })` — spawn dev server, poll until the
   port answers, return a handle with `stop()`.
2. `collectErrors(page)` — subscribe `pageerror` / `console[type=error]` /
   `requestfailed` inside `withPage`, return a structured report.
3. `verify(url | serverCmd)` — the loop: ready → open → settle → errors →
   screenshot → optional baseline diff. Exit code + JSON report designed to
   be read by a model, not a human.

Heavier assertions (flows, multi-viewport) defer to `fex vr` via
subprocess rather than reimplementing.

## Consequences

- This repo requires Bun and a local checkout of fex at `~/Projects/fex`
  (documented in AGENTS.md). If that coupling ever hurts, vendor the two
  small modules — they have no fex-internal dependencies beyond Playwright.
- Playwright + pixelmatch + pngjs become devDependencies of
  `harness/verify` (they're optional peers of `@fex/kit`).
