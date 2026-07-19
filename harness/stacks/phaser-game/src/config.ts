/**
 * config.ts — the feel bible: single source of truth for every tuning value.
 *
 * Everything that affects how the game *feels* (speeds, cooldowns, colors,
 * juice amounts) lives here in grouped objects so a whole mechanic can be
 * retuned without hunting through logic files. Never scatter magic numbers
 * into domain code. Values are in pixels, pixels/second, pixels/second^2,
 * or milliseconds unless noted.
 */

/** Logical render size — the canvas scales to FIT the window around this. */
export const VIEW = {
  width: 960, // px — logical resolution, not CSS size
  height: 540,
  backgroundColor: 0x0e0f1a, // keep index.html <body> background in sync
};

/** Arena backdrop (drawn once in PlayScene). */
export const ARENA = {
  gridSpacing: 60, // px between grid lines
  gridColor: 0x1a1e2e,
  gridAlpha: 0.6, // 0..1
  borderColor: 0x2e3450,
  borderWidth: 2, // px
};

/** Player movement — tuned for a snappy top-down feel. */
export const PLAYER = {
  radius: 14, // px — body half-size (texture is a rounded square)
  speed: 300, // px/s top speed
  accel: 2600, // px/s^2 toward the input direction (reach top speed fast)
  drag: 2000, // px/s^2 toward zero when there is no input (stop crisply)
  color: 0x5ee6c8,
  glowAlpha: 0.3, // 0..1 — additive under-glow strength
  glowScale: 1.6, // multiplier on the glow texture
};

/** Dash — short burst of speed on Space / tap, gated by a cooldown. */
export const DASH = {
  speed: 780, // px/s while dashing (overrides normal movement)
  durationMs: 150,
  cooldownMs: 650, // measured from dash start
};

/** Collectible orbs. */
export const ORBS = {
  spawnEveryMs: 900, // spawn timer period
  max: 8, // cap of live orbs; the timer skips spawns beyond this
  radius: 9, // px — visual radius (texture is a soft dot 4x this wide)
  color: 0xffd35c,
  edgeMargin: 48, // px — keep spawn points away from the arena border
  popInMs: 260, // spawn scale-up tween duration
};

/** Juice — every impact effect is tuned here, fired via bus listeners. */
export const FX = {
  collectBurst: { count: 16, speed: 300, scale: 0.9, lifespanMs: 420 },
  collectRingRadius: 60, // px — shockwave end radius on orb pickup
  collectHitStopMs: 40, // freeze physics+tweens this long to sell the pickup
  dashShake: { intensity: 0.004, durationMs: 100 }, // camera shake on dash
};

export const AUDIO = {
  masterVolume: 0.5, // 0..1 — master gain when not muted
};

/** In-canvas text styling (swap the font when the game gets an identity). */
export const HUD = {
  font: '"Courier New", monospace',
  textColor: '#e8ecff',
  dimColor: '#8890b0',
  accentColor: '#ffd35c',
  margin: 16, // px from screen edges
};

/** Touch controls — a drag anywhere is a virtual stick, a quick tap dashes. */
export const TOUCH = {
  stickDeadzone: 12, // px of drag before movement registers
  stickRadius: 80, // px of drag for full speed
  tapMaxMs: 220, // press shorter than this ...
  tapMaxMove: 10, // ...that moved less than this = dash tap
};

/** localStorage keys — RENAME the prefix when copying this template. */
export const SAVE = {
  bestScore: 'phaser-template.best', // number — highest score in one run
  muted: 'phaser-template.muted', // boolean
};
