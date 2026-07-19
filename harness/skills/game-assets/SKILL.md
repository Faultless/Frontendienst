---
name: game-assets
description: Source, manage, and attribute assets for frontendienst games — CC0-first sourcing, a tracked asset manifest, procedural fallbacks, and grid-sheet conventions.
---

# Game asset pipeline

How assets enter a frontendienst game. Complements `phaser-game` (which
mandates procedural-first rendering with graceful upgrade to real assets).

## Sourcing order

1. **Procedural** — always first. The game must be playable with zero
   asset files (see the phaser-game skill's texture bakers).
2. **CC0 libraries** — no attribution burden, safe for commercial
   portfolio use:
   - Kenney (kenney.nl) — sprites/UI/audio, consistent style, the default.
   - OpenGameArt (opengameart.org, filter license = CC0).
   - itch.io asset packs filtered to CC0 (itch.io/game-assets/assets-cc0).
   - Freesound (freesound.org, filter CC0) for samples; prefer synthesized
     SFX (WebAudio tone/noise) before reaching for files.
3. **Attribution-required (CC-BY / OFL)** — allowed, but only via the
   manifest below so credit ships automatically. Google Fonts (OFL) fall
   here.
4. **Never:** unlicensed rips, "free for personal use" packs (portfolio =
   commercial), AI-generated assets of ambiguous provenance without a
   stated license.

## The manifest — `public/assets/manifest.json`

Every non-procedural asset is recorded when added (one entry per pack is
fine). No manifest entry ⇒ the asset doesn't ship. Shape:

```json
{
  "assets": [
    {
      "path": "sprites/samurai.png",
      "source": "https://kenney.nl/assets/...",
      "author": "Kenney",
      "license": "CC0",
      "attributionRequired": false,
      "notes": "recolored hat"
    }
  ]
}
```

The game's credits/about screen renders every `attributionRequired: true`
entry. A tiny check script (or the verify loop) can assert every file
under `public/assets/` has a manifest entry.

## Conventions

- **Sprite sheets:** fixed-grid only (uniform `frameWidth`/`frameHeight`,
  loadable with Phaser's `spritesheet` loader). No TexturePacker atlases
  until a game actually needs them — grid sheets are AI-legible and
  hand-editable.
- **Loading with fallback:** load real assets over the same texture keys
  the procedural bakers used, inside a `loader.on('loaderror')` guard that
  keeps the baked stand-in (kotodama's pattern —
  `~/Projects/kotodama/src/assets.ts`).
- **Naming:** `public/assets/<kind>/<name>.<ext>` where kind ∈ sprites,
  bg, audio, fonts. Texture keys match filenames.
- **Fetch scripts, not manual downloads:** when pulling a pack, write a
  small `tools/fetch-<pack>.ts` (Bun) that downloads, unpacks the needed
  files, and updates the manifest — reproducible and reviewable
  (prior art: `~/Projects/kotodama/tools/fetch-kyoto.ts`).
- **Budget:** a Phaser game targets < 5 MB of assets for itch/Pages
  hosting; check with `du -sh public/assets` before adding a pack.
