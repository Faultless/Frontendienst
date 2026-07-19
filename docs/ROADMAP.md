# Roadmap

Last updated: 2026-07-19

## Now

- [x] Restructure frontendienst into the company monorepo (site moved to `apps/site`)
- [ ] `harness/verify` — verify loop v1 (server spawn, readiness poll, error capture, screenshot) on top of `@fex/kit`
- [ ] `stacks/web-app` blueprint (Vite + React + TS + local-first storage)
- [ ] `apps/kakeibo` vertical slice: chart of accounts + journal entries + one guided lesson
- [ ] `skills/phaser-game` distilled from spintop / kotodama / grimoire

## Next

- [ ] Wire kakeibo as a live demo into the portfolio site + deploy workflow
- [ ] `stacks/phaser-game` template (extract the best of the three existing games)
- [ ] Blocks app spike: evaluate Blockly vs custom canvas for the Scratch-style app
- [ ] Asset pipeline for games: sourcing (Kenney/OpenGameArt/itch CC0), manifest, attribution tracking

## Later

- [ ] RPG / arena-brawler system libraries for Phaser (state machines, spawning, health/combat)
- [ ] Portfolio site: per-project case-study pages generated from app metadata
- [ ] Harness self-test: can a fresh AI session scaffold + verify an app from a one-line brief using only the skills?

## Decision log

See `docs/decisions/` — one ADR per stack/tooling choice.
