# Roadmap

Last updated: 2026-07-19

## Now

- [x] Restructure frontendienst into the company monorepo (site moved to `apps/site`)
- [x] `harness/verify` — verify loop v1 (server spawn, readiness poll, error capture, screenshot); self-contained Playwright, see ADR 0003 amendment
- [x] `skills/web-app` blueprint conventions (stack template dir still to extract from kakeibo)
- [x] `apps/kakeibo` vertical slice: chart of accounts + simple-transfer entries + Lesson 1 (accounting equation + trial balance, live from user data)
- [x] `skills/phaser-game` distilled from spintop / kotodama / grimoire
- [x] Wire kakeibo as a live demo into the portfolio site + deploy workflow
- [x] `stacks/phaser-game` runnable template (`@frontendienst/phaser-template`: intent input, bus, persist, WebAudio synth, procedural textures, Boot/Title/Play/Hud/Pause; verified + headless behavioral smoke test)
- [x] Real screenshots for all portfolio project cards (Playwright captures of live gameplay)
- [x] Portfolio sections aligned to services: Business / Mobile / Gaming

- [x] Case studies (SpinTop / LinguaPop / Chronomap) with live links; SaaS-credible copy
- [x] Product sites: LinguaPop (Pages workflow: landing / + web app /app/, Netlify-ready) and Chronomap (same; awaiting `Faultless/chronomap` repo creation on GitHub to push)
- [x] `skills/game-assets` (CC0-first sourcing, license manifest, fetch scripts)

## Next

- [ ] karakuri (Blockly + JS-Interpreter turtle-graphics teaching app, ADR 0005) — build agent died at session limit; only a package.json stub exists in apps/karakuri, restart the build
- [ ] kakeibo Lessons 2–5 (T-accounts, trial balance deep-dive, statements, closing the books) + reports page with charts
- [ ] `stacks/web-app` as a copyable template extracted from kakeibo

## Later

- [ ] RPG / arena-brawler system libraries for Phaser (state machines, spawning, health/combat)
- [ ] Portfolio site: per-project case-study pages generated from app metadata
- [ ] Harness self-test: can a fresh AI session scaffold + verify an app from a one-line brief using only the skills?

## Decision log

See `docs/decisions/` — one ADR per stack/tooling choice.
