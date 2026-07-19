# ADR 0004 — phaser-game stack blueprint

Date: 2026-07-19 · Status: accepted

## Context

The owner has shipped three Phaser games (spintop, kotodama, grimoire)
whose architectures converged independently — strong evidence for what the
blueprint should be. Full catalog: `docs/research/phaser-patterns.md`.

## Decision

- **Stack:** Phaser 3.9x + Vite + strict TypeScript (kotodama's tsconfig:
  `noUncheckedIndexedAccess`, `noUnused*`), Bun for scripts, `base: './'`,
  phaser in its own manual chunk, `tsc --noEmit && vite build`.
- **Template donor:** grimoire's architecture (systems directory, typed
  event bus, intent-based InputController + TouchControls, launched HUD
  overlay + shared Pause scene, data-driven ability registry).
- **Asset strategy:** kotodama's — attempt real assets, procedural
  fallback on failure, so the game renders at every stage of development.
  Procedural texture bakers (soft dot, ring, shard, body, pixel) ship in
  the template's Boot scene.
- **Shared library later, not now:** the extraction candidates (fx, audio,
  persist, input, bus, theme) go into the template as copyable modules
  first; they graduate to a shared package only after two template-built
  games prove the APIs (mirrors the repo-wide "no npm packages until two
  real apps" rule).
- **Testing:** `window.__game` debug handle is mandatory; harness/verify
  drives it headlessly (absorbing spintop's and grimoire's hand-rolled
  smoke harnesses).

## Consequences

- `harness/stacks/phaser-game/` holds the template; the skill at
  `harness/skills/phaser-game/SKILL.md` encodes the conventions and the
  genre-gated choices (Arcade physics, entity/ability model).
- Games deploy like any app: static build showcased at `/apps/<name>/`.
