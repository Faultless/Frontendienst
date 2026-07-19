# frontendienst

Monorepo for **frontendienst** — a personal frontend company. Two things live
here, and they feed each other:

1. **The harness** (`harness/`) — tooling, skills, and stack blueprints that
   let AI models build web platforms consistently: pick the right stack per
   domain, scaffold it, and verify the result end-to-end (dev server →
   console errors → screenshots) without a human in the loop.
2. **The portfolio** (`apps/`) — real products built *with* the harness.
   Every prototype doubles as a showcase piece on the frontendienst site.

## Layout

```
apps/
  site/        Astro portfolio site (deployed to GitHub Pages)
  kakeibo/     Finance app that teaches accounting through your own money
harness/
  skills/      Portable Claude skills, one per domain (web-app, phaser-game, …)
  stacks/      Scaffolding blueprints — the opinionated stack per domain
  verify/      Automated verify loop (server readiness, console errors, screenshots)
docs/
  VISION.md    Why this exists and where it's going
  ROADMAP.md   Current state and next steps
  decisions/   Architecture decision records (stack choices per domain)
```

## Commands

| Command             | Action                                    |
| :------------------ | :---------------------------------------- |
| `bun install`       | Install all workspace dependencies        |
| `bun run site:dev`  | Portfolio site dev server (localhost:4321) |
| `bun run site:build`| Build the portfolio site                  |
| `bun run verify -- <url>` | Run the verify loop against a running app |

Each app under `apps/` has its own `dev`/`build` scripts — run them with
`bun run --filter @frontendienst/<app> dev`.

## Deploying

`.github/workflows/deploy.yml` builds the site (and any apps wired into it as
live demos) and deploys to GitHub Pages on every push to `main`.
