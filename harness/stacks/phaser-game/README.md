# phaser-game stack template

The reference scaffold for frontendienst Phaser games — the runnable
embodiment of `harness/skills/phaser-game/SKILL.md` (patterns distilled in
`docs/research/phaser-patterns.md`). It ships a tiny top-down demo (move,
dash, collect orbs) whose only purpose is to prove every module end to end;
replace the demo, keep the wiring.

```
bun run dev        # vite dev server
bun run build      # tsc --noEmit && vite build (static, base './')
bun run typecheck
```

## Copying it into a new game

1. `cp -r harness/stacks/phaser-game apps/<name>` (drop `docs/` and any
   `node_modules`).
2. In `apps/<name>/package.json` rename to `@frontendienst/<name>`.
3. In `index.html` set the `<title>` (and keep the body background in sync
   with `VIEW.backgroundColor`).
4. In `src/config.ts` rename the `SAVE.*` localStorage key prefix.
5. `bun install` from the repo root, then verify:
   `bun run verify -- --cmd "bun run dev" --port 5173 --cwd apps/<name>`.

Then gut `PlayScene` and grow your game inside the same skeleton. If you
deviate from the skill, update the skill.

## Module map

| Path | What it is |
| :-- | :-- |
| `src/main.ts` | The one boot block: 960×540 FIT/CENTER_BOTH, arcade physics, scene list, `window.__game` test handle. |
| `src/config.ts` | The feel bible — every tuning constant, grouped and unit-commented. No magic numbers in domain files. |
| `src/core/bus.ts` | Typed, Phaser-free event emitter + `EVENTS` name map. Gameplay emits; HUD/audio/fx listen; unsubscribe on scene `SHUTDOWN`. |
| `src/core/persist.ts` | `loadJSON`/`saveJSON` localStorage wrappers (try/catch). All progression goes through here. |
| `src/systems/input.ts` | `InputController` intent struct with per-frame `justPressed`/`justReleased` edges; touch (drag = stick, tap = dash) feeds the same struct; `isMobileLayout()` (`pointer: coarse` + `?ui=` override). |
| `src/systems/audio.ts` | Lazy-unlocked WebAudio synth: `tone()`/`noise()` primitives, master gain, persisted mute; plays named sfx from bus events. |
| `src/fx/textures.ts` | Procedural texture bakers (`makeSoftDot`/`makeRing`/`makeBody`/`makePixel`) with `textures.exists` guards + `darken`/`lighten`. Real art later loads over the same keys; bakers become the 404 fallback. |
| `src/fx/effects.ts` | Juice: `burst`, `shockwave`, `shake`, `hitStop`. Call from bus listeners, not inline in gameplay. |
| `src/scenes/BootScene.ts` | Bakes all textures → starts title. Real-asset `preload()` stub included. |
| `src/scenes/TitleScene.ts` | Title, press-to-start (first gesture unlocks audio), mute hint. |
| `src/scenes/PlayScene.ts` | Demo gameplay: intent-driven movement, dash + cooldown, orb spawner, score → bus + registry, best → persist. Launches the HUD. |
| `src/scenes/HudScene.ts` | Launched (not started) overlay; renders score/best from bus events, seeds from registry. |
| `src/scenes/PauseScene.ts` | Shared pause overlay: `launch('pause', { from })` + `scene.pause()`; resumes/restarts/routes to title by that key. |

## Conventions worth keeping

- **Fixed logical size** (`VIEW` in config); the canvas letterboxes to fit.
- **Scene keys are lowercase strings** (`'boot'`, `'title'`, `'play'`,
  `'hud'`, `'pause'`).
- **Cross-scene data:** transient handoff via `scene.start(key, data)`;
  globals via `this.registry` (the demo mirrors `score`/`best` there so
  headless tests can poll them).
- **Verify hooks:** `window.__game` is always set; smoke tests wait on
  `window.__game.scene.isActive('play')` and read the registry.
