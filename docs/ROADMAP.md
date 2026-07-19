# Roadmap

Last updated: 2026-07-19

## Now

- [x] Restructure frontendienst into the company monorepo (site moved to `apps/site`)
- [x] `harness/verify` — verify loop v1 (server spawn, readiness poll, error capture, screenshot); self-contained Playwright, see ADR 0003 amendment
- [x] `skills/web-app` blueprint conventions (stack template dir still to extract from kakeibo)
- [x] `apps/kakeibo` vertical slice: chart of accounts + simple-transfer entries + Lesson 1 (accounting equation + trial balance, live from user data)
- [x] `skills/phaser-game` distilled from spintop / kotodama / grimoire
- [x] Wire kakeibo as a live demo into the portfolio site + deploy workflow
- [ ] `stacks/phaser-game` runnable template (in progress)
- [ ] Real screenshots for all portfolio project cards (in progress)

## Next

- [ ] kakeibo Lessons 2–5 (T-accounts, trial balance deep-dive, statements, closing the books) + reports page with charts
- [ ] `stacks/web-app` as a copyable template extracted from kakeibo
- [ ] Blocks app spike: evaluate Blockly vs custom canvas for the Scratch-style app
- [ ] Asset pipeline for games: sourcing (Kenney/OpenGameArt/itch CC0), manifest, attribution tracking

## Later

- [ ] RPG / arena-brawler system libraries for Phaser (state machines, spawning, health/combat)
- [ ] Portfolio site: per-project case-study pages generated from app metadata
- [ ] Harness self-test: can a fresh AI session scaffold + verify an app from a one-line brief using only the skills?

## Decision log

See `docs/decisions/` — one ADR per stack/tooling choice.
