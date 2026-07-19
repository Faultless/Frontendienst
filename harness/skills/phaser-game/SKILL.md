---
name: phaser-game
description: Build a Phaser 3 HTML5 2D game the frontendienst way — boot/menu/gameplay/HUD scene topology, procedural-fallback assets, intent-based input, juice/audio systems, and a headless-verifiable game handle.
---

# Building a Phaser game

Conventions distilled from three shipped games (see
`docs/research/phaser-patterns.md` for exemplars with file references).
Scaffold from `harness/stacks/phaser-game/` when it exists; otherwise
follow this layout by hand.

## Non-negotiables

1. **Stack:** Phaser 3.9x + Vite + strict TS (`noUncheckedIndexedAccess`,
   `noUnusedLocals/Parameters`), `base: './'` in vite config, phaser in a
   manual chunk, `build` script = `tsc --noEmit && vite build`.
2. **One boot block** in `main.ts`: `type: AUTO`, `scale: { mode: FIT,
   autoCenter: CENTER_BOTH }`, fixed logical size (pick per genre, e.g.
   960×540), `pixelArt: true` for sprite games. Expose the game as
   `window.__game` — the verify loop and smoke tests depend on it.
3. **`src/config.ts` is the feel bible.** Every tuning constant (speeds,
   cooldowns, colors, camera lerp) lives here in grouped objects with a
   unit comment per value. Never scatter magic numbers into domain files.
4. **Scene topology:** `BootScene` (bake/load assets) → `TitleScene` →
   gameplay scene(s) + a *launched* (not started) `HudScene` overlay + one
   shared `PauseScene` that knows how to route back (`launch('pause',
   { from })` + `scene.pause()`). Per-transition data goes through
   `scene.start(key, data)` → `init(data)`; cross-scene globals through
   `this.registry`.
5. **Assets are procedural-first with graceful upgrade:** every texture
   key gets a procedural baker in BootScene (guarded by
   `if (textures.exists(key)) return`); real art, when it arrives, loads
   over the same keys with the baker as 404 fallback. The game must render
   playably from the first commit.
6. **UI in-canvas** (Text/Graphics/NineSlice; bake 9-slice panel textures
   in Boot). DOM only for toasts/overlays that outlive scene changes.

## Standard modules

Create these as needed — copy from the stack template or the exemplar
files in the research doc rather than re-deriving:

- `core/bus.ts` — typed, Phaser-free event emitter. Gameplay emits,
  HUD/audio listen; unsubscribe on scene `SHUTDOWN`.
- `core/persist.ts` — `loadJSON(key, fallback)` / `saveJSON(key, value)`
  with try/catch. All progression goes through it.
- `systems/input.ts` — intent struct (`InputState` with
  `justPressed`/`justReleased` edge detection computed per frame).
  Gameplay never reads key codes. Touch controls write the *same* struct.
  Mobile detection: `matchMedia('(pointer: coarse)')` with a `?ui=` query
  override.
- `systems/audio.ts` — lazy WebAudio context unlocked on first gesture,
  `tone()`/`noise()` synth primitives, master gain + mute. If using
  samples, keep a per-slot synth fallback.
- `fx/effects.ts` — burst, shockwave, shake, hitStop, hitFlash. Additive
  blend for glows. This is where juice lives; call it from event-bus
  listeners, not inline in gameplay logic.

## Genre gates

- **Platformer / brawler / anything with gravity+collisions:** use Arcade
  physics (groups, colliders, overlaps). **Kinematic/custom motion**
  (top-down orbiting, lane scrolling): integrate by hand in `update(dt)`;
  don't fight Arcade.
- **Content-heavy genres (RPG, brawler movesets):** data-driven registry —
  one interface with lifecycle hooks (`onBegin/onUpdate/onRelease/...`),
  a `REGISTRY` map, and a single dispatcher keyed on a mode field. Player
  and AI drive the same entity class through an intent struct
  (`MoveIntent`), never through separate code paths.

## Verify

- `bun run verify -- --cmd "bun run dev" --port 5173 --cwd apps/<game>`
  must pass clean (zero console/page errors) before declaring any change
  done.
- For behavioral checks, drive `window.__game` from Playwright: wait for
  `window.__game.scene.keys.<key>`, inject input, poll game state.
