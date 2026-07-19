/**
 * PlayScene — the demo gameplay proving every template module end to end:
 *
 * - movement through the InputController intent struct (keyboard + touch)
 * - dash on Space / tap with a cooldown, denied sfx when not ready
 * - orbs spawning on a timer; pickup = burst + shockwave + hit-stop + tone
 * - score on the event bus (HudScene listens), best score via persist.ts
 * - Esc/P launches the shared PauseScene overlay and pauses this scene
 *
 * The simulation emits events; juice and sound happen in bus listeners.
 * Everything numeric is tuned from config.ts. Replace this scene's guts
 * with your game; the wiring pattern is what the template teaches.
 */
import Phaser from 'phaser';
import { ARENA, DASH, FX, ORBS, PLAYER, SAVE, VIEW } from '../config';
import { bus, EVENTS } from '../core/bus';
import { loadJSON, saveJSON } from '../core/persist';
import { burst, hitStop, shake, shockwave } from '../fx/effects';
import { TEX } from '../fx/textures';
import { InputController } from '../systems/input';

/** Move `current` toward `target` by at most `maxDelta` (crisp accel/drag). */
function approach(current: number, target: number, maxDelta: number): number {
  return current < target
    ? Math.min(current + maxDelta, target)
    : Math.max(current - maxDelta, target);
}

export class PlayScene extends Phaser.Scene {
  private inputCtl!: InputController;
  private player!: Phaser.Physics.Arcade.Image;
  private playerGlow!: Phaser.GameObjects.Image;
  private orbs!: Phaser.Physics.Arcade.Group;

  private score = 0;
  private best = 0;
  private dashUntil = 0; // time.now (ms) when the current dash ends
  private dashReadyAt = 0; // time.now (ms) when the next dash may start
  private dashDir = { x: 1, y: 0 }; // last dash direction (fallback facing)

  constructor() {
    super('play');
  }

  create(): void {
    this.score = 0;
    this.best = loadJSON(SAVE.bestScore, 0);
    this.dashUntil = 0;
    this.dashReadyAt = 0;
    this.registry.set('score', 0);
    this.registry.set('best', this.best);

    this.drawArena();
    this.inputCtl = new InputController(this);

    // Player — additive under-glow + tinted body.
    this.playerGlow = this.add
      .image(VIEW.width / 2, VIEW.height / 2, TEX.glow)
      .setTint(PLAYER.color)
      .setBlendMode(Phaser.BlendModes.ADD)
      .setAlpha(PLAYER.glowAlpha)
      .setScale(PLAYER.glowScale)
      .setDepth(9);
    this.player = this.physics.add
      .image(VIEW.width / 2, VIEW.height / 2, TEX.body)
      .setTint(PLAYER.color)
      .setDepth(10);
    this.player.setCollideWorldBounds(true);

    // Orbs — spawn on a timer, capped; overlap with the player collects.
    this.orbs = this.physics.add.group();
    this.physics.add.overlap(this.player, this.orbs, (_player, orb) => {
      this.collect(orb as Phaser.Physics.Arcade.Image);
    });
    this.time.addEvent({ delay: ORBS.spawnEveryMs, loop: true, callback: () => this.spawnOrb() });
    this.spawnOrb(); // something to chase immediately

    // Juice lives in bus listeners, not in the simulation code above.
    const offOrb = bus.on(EVENTS.orbCollected, ({ x, y }) => {
      burst(this, x, y, ORBS.color, FX.collectBurst);
      shockwave(this, x, y, ORBS.color, FX.collectRingRadius);
      hitStop(this, FX.collectHitStopMs);
    });
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, offOrb);

    // HUD is a *launched* overlay scene — it renders above and never blocks.
    this.scene.launch('hud');

    // Pause routing — the shared PauseScene knows how to come back here.
    const pause = () => this.pauseGame();
    this.input.keyboard!.on('keydown-ESC', pause);
    this.input.keyboard!.on('keydown-P', pause);
  }

  update(_time: number, deltaMs: number): void {
    this.inputCtl.update();
    const input = this.inputCtl.state;
    const now = this.time.now;
    const body = this.player.body as Phaser.Physics.Arcade.Body;

    // --- Dash -------------------------------------------------------------
    if (input.dashJustPressed) {
      if (now >= this.dashReadyAt) {
        const len = Math.hypot(input.moveX, input.moveY);
        if (len > 0.01) {
          this.dashDir = { x: input.moveX / len, y: input.moveY / len };
        } // else: reuse last direction
        this.dashUntil = now + DASH.durationMs;
        this.dashReadyAt = now + DASH.cooldownMs;
        bus.emit(EVENTS.sfx, { name: 'dash' });
        shake(this, FX.dashShake.intensity, FX.dashShake.durationMs);
      } else {
        bus.emit(EVENTS.sfx, { name: 'denied' });
      }
    }

    // --- Movement (velocity-steered, no gravity) ----------------------------
    if (now < this.dashUntil) {
      body.setVelocity(this.dashDir.x * DASH.speed, this.dashDir.y * DASH.speed);
    } else {
      const dt = deltaMs / 1000;
      const targetX = input.moveX * PLAYER.speed;
      const targetY = input.moveY * PLAYER.speed;
      const rate = (target: number) => (target === 0 ? PLAYER.drag : PLAYER.accel) * dt;
      body.setVelocity(
        approach(body.velocity.x, targetX, rate(targetX)),
        approach(body.velocity.y, targetY, rate(targetY)),
      );
    }

    this.playerGlow.setPosition(this.player.x, this.player.y);
  }

  // --- Orbs ------------------------------------------------------------------

  private spawnOrb(): void {
    if (this.orbs.countActive(true) >= ORBS.max) return;
    const m = ORBS.edgeMargin;
    const x = Phaser.Math.Between(m, VIEW.width - m);
    const y = Phaser.Math.Between(m, VIEW.height - m);
    const orb = this.physics.add.image(x, y, TEX.orb).setTint(ORBS.color).setDepth(5);
    orb.setBlendMode(Phaser.BlendModes.ADD);
    this.orbs.add(orb);
    // Tighter circular body than the soft-dot texture, so pickups feel fair.
    const half = orb.width / 2;
    const r = orb.width * 0.3;
    (orb.body as Phaser.Physics.Arcade.Body).setCircle(r, half - r, half - r);
    orb.setScale(0);
    this.tweens.add({ targets: orb, scale: 1, duration: ORBS.popInMs, ease: 'Back.Out' });
  }

  private collect(orb: Phaser.Physics.Arcade.Image): void {
    if (!orb.active) return;
    const { x, y } = orb;
    orb.destroy();

    this.score += 1;
    if (this.score > this.best) {
      this.best = this.score;
      saveJSON(SAVE.bestScore, this.best);
    }
    this.registry.set('score', this.score);
    this.registry.set('best', this.best);

    // Presentation reacts via the bus: fx listener above, audio system, HUD.
    bus.emit(EVENTS.orbCollected, { x, y });
    bus.emit(EVENTS.sfx, { name: 'collect' });
    bus.emit(EVENTS.score, { score: this.score, best: this.best });
  }

  // --- Pause / backdrop --------------------------------------------------------

  private pauseGame(): void {
    bus.emit(EVENTS.sfx, { name: 'pause' });
    this.scene.launch('pause', { from: 'play' });
    this.scene.pause();
  }

  /** Static backdrop: faint grid + arena border, drawn once. */
  private drawArena(): void {
    const g = this.add.graphics().setDepth(0);
    g.lineStyle(1, ARENA.gridColor, ARENA.gridAlpha);
    for (let x = ARENA.gridSpacing; x < VIEW.width; x += ARENA.gridSpacing) {
      g.lineBetween(x, 0, x, VIEW.height);
    }
    for (let y = ARENA.gridSpacing; y < VIEW.height; y += ARENA.gridSpacing) {
      g.lineBetween(0, y, VIEW.width, y);
    }
    g.lineStyle(ARENA.borderWidth, ARENA.borderColor, 1);
    g.strokeRect(1, 1, VIEW.width - 2, VIEW.height - 2);
  }
}
