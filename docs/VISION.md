# Vision

**Goal:** a frontend development harness that lets AI models build web
platforms — consistently, on robust stacks, with automated feedback loops —
consolidated under the frontendienst brand as a living portfolio.

The premise: AI models are already good at writing frontend code, but output
quality is inconsistent because each session re-derives stack choices,
project structure, and conventions from scratch, and there is no automatic
"did it actually work?" signal. The harness fixes both:

- **Blueprints** (`harness/stacks/`) — one opinionated, battle-tested stack
  per domain. Not a framework; a scaffold plus conventions that a model can
  follow mechanically.
- **Skills** (`harness/skills/`) — portable instruction sets that encode
  domain expertise: how to structure a Phaser game, how to model
  double-entry accounting, how to lay out a block-programming canvas.
- **Verification** (`harness/verify/`) — a closed loop: start the dev
  server, wait for readiness, drive the page, collect console/page errors,
  screenshot, diff. The model iterates against this signal instead of
  guessing. Builds on `@fex/kit` (Playwright capture + pixelmatch diffing
  from the fex repo) and adds the missing pieces: server lifecycle,
  readiness polling, and runtime-error capture.

## Proving grounds

The harness is only real if it ships apps. Planned prototypes, each chosen
to stress a different domain:

| App | Domain it proves | Stack blueprint |
| :-- | :-- | :-- |
| **kakeibo** — manage your own finances while learning accounting principles (double-entry, chart of accounts, statements) | Data-heavy local-first app | `web-app` |
| **blocks** (working name) — Scratch-style block programming to learn harder CS concepts | Canvas/editor-heavy app | `web-app` + Blockly |
| **Phaser game tooling** — asset finding/management + common systems (RPG, arena brawler) | 2D games | `phaser-game` |

Each prototype ships as a live demo on the portfolio site — the portfolio
*is* the integration test.

## Non-goals

- Building a general-purpose framework or publishing npm packages (until a
  blueprint has survived at least two real apps).
- Backend/platform engineering beyond what static hosting + local-first
  storage can carry. Syncthing-style local-first is the default posture.
