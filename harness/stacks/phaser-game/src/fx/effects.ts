/**
 * effects.ts — shared "juice" helpers: bursts, shockwaves, screen shake,
 * hit-stop. Keeping these in one place makes it cheap to make every impact
 * feel good.
 *
 * Call these from event-bus listeners (see PlayScene wiring), not inline in
 * gameplay logic — the simulation shouldn't know how impacts are presented.
 */
import Phaser from 'phaser';
import { TEX } from './textures';

/** A quick radial particle burst at a point. Additive so it glows. */
export function burst(
  scene: Phaser.Scene,
  x: number,
  y: number,
  color: number,
  opts: { count?: number; speed?: number; scale?: number; lifespanMs?: number } = {},
): void {
  const { count = 14, speed = 280, scale = 0.9, lifespanMs = 420 } = opts;
  const emitter = scene.add.particles(x, y, TEX.spark, {
    speed: { min: speed * 0.3, max: speed },
    angle: { min: 0, max: 360 },
    scale: { start: scale, end: 0 },
    lifespan: { min: lifespanMs * 0.5, max: lifespanMs },
    quantity: count,
    blendMode: Phaser.BlendModes.ADD,
    tint: color,
    emitting: false,
  });
  emitter.setDepth(50);
  emitter.explode(count);
  scene.time.delayedCall(lifespanMs + 80, () => emitter.destroy());
}

/** Expanding ring shockwave (impacts, pickups, charge releases). */
export function shockwave(
  scene: Phaser.Scene,
  x: number,
  y: number,
  color: number,
  radius = 80,
  durationMs = 280,
): void {
  const ring = scene.add.image(x, y, TEX.ring).setTint(color).setDepth(49);
  ring.setBlendMode(Phaser.BlendModes.ADD);
  ring.setScale(0.1);
  scene.tweens.add({
    targets: ring,
    scale: radius / 64, // ring texture is 128px wide → scale = radius / 64
    alpha: { from: 0.9, to: 0 },
    duration: durationMs,
    ease: 'Cubic.Out',
    onComplete: () => ring.destroy(),
  });
}

/** Brief camera shake — keep it subtle to stay crisp, not nauseating. */
export function shake(scene: Phaser.Scene, intensity = 0.006, durationMs = 120): void {
  scene.cameras.main.shake(durationMs, intensity);
}

/** Hit-stop: freeze physics + tweens for a few ms to sell heavy impacts. */
export function hitStop(scene: Phaser.Scene, ms = 45): void {
  const physics = (scene as Phaser.Scene & { physics?: Phaser.Physics.Arcade.ArcadePhysics })
    .physics;
  if (physics) physics.world.pause();
  scene.tweens.pauseAll();
  scene.time.delayedCall(ms, () => {
    if (physics) physics.world.resume();
    scene.tweens.resumeAll();
  });
}
