/**
 * textures.ts — procedural texture bakers. The game renders playably with
 * zero art assets: BootScene bakes every texture key once at startup.
 *
 * Every baker is guarded by `textures.exists(key)`, which is the graceful-
 * upgrade hook: when real art arrives, `this.load.image(key, url)` it in
 * BootScene.preload() over the SAME keys and the baker becomes the 404
 * fallback — nothing else in the game changes.
 *
 * All shapes are baked white so per-instance `setTint()` colors them.
 */
import Phaser from 'phaser';

/** Texture keys shared by fx/effects.ts and the scenes. */
export const TEX = {
  spark: 'tex-spark', // small soft dot — particle bursts
  glow: 'tex-glow', // large soft dot — glows, flashes
  ring: 'tex-ring', // hollow ring — shockwaves
  body: 'tex-body', // rounded square — entity bodies
  orb: 'tex-orb', // medium soft dot — collectibles
  pixel: 'tex-pixel', // 1x1 white pixel — bars, bolts, fills
} as const;

/** Radial-gradient soft dot (additive particle / glow base). */
export function makeSoftDot(scene: Phaser.Scene, key: string, size: number, color = 0xffffff): void {
  if (scene.textures.exists(key)) return;
  const tex = scene.textures.createCanvas(key, size, size);
  if (!tex) return;
  const ctx = tex.getContext();
  const r = size / 2;
  const grad = ctx.createRadialGradient(r, r, 0, r, r, r);
  const c = Phaser.Display.Color.IntegerToColor(color);
  grad.addColorStop(0, `rgba(${c.red},${c.green},${c.blue},1)`);
  grad.addColorStop(0.4, `rgba(${c.red},${c.green},${c.blue},0.6)`);
  grad.addColorStop(1, `rgba(${c.red},${c.green},${c.blue},0)`);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);
  tex.refresh();
}

/** Hollow ring used for shockwaves / cooldown indicators. */
export function makeRing(scene: Phaser.Scene, key: string, size: number, color = 0xffffff): void {
  if (scene.textures.exists(key)) return;
  const tex = scene.textures.createCanvas(key, size, size);
  if (!tex) return;
  const ctx = tex.getContext();
  const c = Phaser.Display.Color.IntegerToColor(color);
  ctx.strokeStyle = `rgba(${c.red},${c.green},${c.blue},1)`;
  ctx.lineWidth = size * 0.08;
  ctx.beginPath();
  ctx.arc(size / 2, size / 2, size / 2 - ctx.lineWidth, 0, Math.PI * 2);
  ctx.stroke();
  tex.refresh();
}

/** Rounded white rect with a dark outline; tint per-instance for entities. */
export function makeBody(scene: Phaser.Scene, key: string, w: number, h: number): void {
  if (scene.textures.exists(key)) return;
  const tex = scene.textures.createCanvas(key, w, h);
  if (!tex) return;
  const ctx = tex.getContext();
  const r = Math.min(w, h) * 0.28;
  const round = (x: number, y: number, ww: number, hh: number, rr: number) => {
    ctx.beginPath();
    ctx.moveTo(x + rr, y);
    ctx.arcTo(x + ww, y, x + ww, y + hh, rr);
    ctx.arcTo(x + ww, y + hh, x, y + hh, rr);
    ctx.arcTo(x, y + hh, x, y, rr);
    ctx.arcTo(x, y, x + ww, y, rr);
    ctx.closePath();
  };
  ctx.fillStyle = 'rgba(255,255,255,1)';
  round(0, 0, w, h, r);
  ctx.fill();
  // Darker outline ring for shape definition against bright backgrounds.
  ctx.lineWidth = 2;
  ctx.strokeStyle = 'rgba(0,0,0,0.35)';
  round(1, 1, w - 2, h - 2, r);
  ctx.stroke();
  tex.refresh();
}

/** 1x1 white pixel, tintable — handy for bars, bolts, flashes, grids. */
export function makePixel(scene: Phaser.Scene, key: string, color = 0xffffff): void {
  if (scene.textures.exists(key)) return;
  const g = scene.add.graphics();
  g.fillStyle(color, 1);
  g.fillRect(0, 0, 1, 1);
  g.generateTexture(key, 1, 1);
  g.destroy();
}

// --- Color helpers ----------------------------------------------------------

/** Move a 0xRRGGBB color toward black. amount 0 = unchanged, 1 = black. */
export function darken(color: number, amount: number): number {
  const r = Math.round(((color >> 16) & 0xff) * (1 - amount));
  const g = Math.round(((color >> 8) & 0xff) * (1 - amount));
  const b = Math.round((color & 0xff) * (1 - amount));
  return (r << 16) | (g << 8) | b;
}

/** Move a 0xRRGGBB color toward white. amount 0 = unchanged, 1 = white. */
export function lighten(color: number, amount: number): number {
  const ch = (c: number) => Math.round(c + (255 - c) * amount);
  const r = ch((color >> 16) & 0xff);
  const g = ch((color >> 8) & 0xff);
  const b = ch(color & 0xff);
  return (r << 16) | (g << 8) | b;
}
