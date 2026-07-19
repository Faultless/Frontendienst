# Phaser pattern catalog — survey of spintop, kotodama, grimoire

Date: 2026-07-19. Source: full-code survey of the owner's three Phaser
games (`~/Projects/spintop`, `~/Projects/kotodama`, `~/Projects/grimoire`).
This backs ADR 0004 and `harness/skills/phaser-game`. File references point
into those repos.

## Roles

- **grimoire** — most architecturally mature; primary template donor
  (systems layout, event bus, intent-based input, data-driven spells, PWA).
- **spintop** — best procedural vector rendering (`src/topRender.ts`,
  cached-per-part Graphics→texture) and pooled hitstop-aware particles.
- **kotodama** — best asset pipeline with graceful procedural fallback
  (`src/assets.ts`), in-canvas 9-slice UI kit (`src/ui/theme.ts`), and
  sample-with-synth-fallback audio (`src/systems/audio.ts`).

## Consensus skeleton (all three)

- Vite + strict TS + Phaser 3.9x, `base: './'` (itch/Pages portability),
  phaser split into its own manual chunk (`spintop/vite.config.ts:1-20`),
  `tsc --noEmit && vite build`.
- One `new Phaser.Game` in `main.ts`: `type: AUTO`, `scale: { mode: FIT,
  autoCenter: CENTER_BOTH }`, fixed logical size, game stashed on
  `window.__game` for headless test hooks (`grimoire/src/main.ts:9-30`).
- `src/config.ts` as the single "feel bible": grouped, unit-commented
  constant objects (`grimoire/src/config.ts:1-230`). Spintop scatters
  tuning into domain files — the anti-pattern to avoid.
- Scene topology: `Boot` (generate/load assets) → `Menu/Title` →
  gameplay + a **launched** HUD overlay scene + a shared `Pause` scene.
  Per-transition data via `scene.start(key, data)` → `init(data)`;
  cross-scene globals via `registry`. Cleanest pause routing:
  `kotodama/src/scenes/PauseScene.ts:141-161`.
- In-canvas UI (Phaser Text/Graphics/NineSlice), DOM only for toasts that
  must survive scene changes (`kotodama/src/main.ts:60-80`).
- Headless-Chrome smoke tests driving `window.__game`
  (`spintop/tools/smoke/*.mjs`, `grimoire/scripts/playtest.mjs`) —
  independently reinvented twice; harness/verify should absorb this.

## Extraction candidates (duplicated ≥2×, often 3×)

| Module | Contents | Best exemplar |
| :-- | :-- | :-- |
| `proceduralTextures` | makeSoftDot/Ring/Shard/Body/Pixel canvas bakers with `textures.exists` guards; darken/lighten color helpers | `grimoire/src/scenes/BootScene.ts:37-165`, `spintop/src/topRender.ts:14-16` |
| `fx` | burst, shockwave, muzzleFlash, dust, shake, hitStop, hitFlash | `grimoire/src/fx/effects.ts:17-100` |
| `audio` | lazy-unlocked WebAudio, `tone`/`noise` primitives, master gain + mute; optional sample manifest w/ synth fallback | `grimoire/src/systems/AudioSystem.ts`, fallback: `kotodama/src/systems/audio.ts:1-90` |
| `input` | intent-struct InputController with per-frame edge detection + parallel TouchControls feeding the same struct; `isMobileLayout()` via pointer-coarse | `grimoire/src/systems/InputController.ts:11-120`, `spintop/src/device.ts:1-13` |
| `bus` | typed event emitter decoupling sim from UI/audio; Phaser-free version is unit-testable | `kotodama/src/core/emitter.ts:1-30`, `grimoire/src/systems/bus.ts` |
| `persist` | `loadJSON/saveJSON` localStorage try/catch — duplicated ~9× across the three repos | `spintop/src/progress.ts:12-27` |
| `ui/theme` | 9-slice panel textures via `generateTexture`, makePanel, icon kit | `kotodama/src/ui/theme.ts:24-70` |

## Genre-divergent choices (skill should gate by genre)

- **Physics:** Arcade only where genre fits (grimoire's
  brawler/platformer shape: `grimoire/src/scenes/ArenaScene.ts:106-122`);
  spintop/kotodama hand-integrate kinematics.
- **Entity/ability model:** grimoire's `Combatant` interface + one body
  class driven by a `MoveIntent` struct (player and AI share it), and its
  data-driven `Spell` registry with lifecycle hooks dispatched by
  `castMode` (`grimoire/src/spells/types.ts:88-125`,
  `src/spells/registry.ts:16-50`) — the extensibility pattern to copy for
  RPG/brawler content.
- **Assets:** default strategy is kotodama's — try real assets, fall back
  to procedural stand-ins on 404, so the game is playable at every stage.

## Pain points a template must fix

- tsconfig strictness drift between projects (standardize on kotodama's:
  `noUncheckedIndexedAccess` + `noUnused*`).
- `main.ts` boot block and `window.__game` glue copy-pasted verbatim.
- AudioSystem/persist/fx boilerplate re-derived per project (see table).
