/**
 * HudScene — transparent overlay *launched* (not started) by PlayScene, so
 * it renders above gameplay without ever blocking it. It listens to the
 * event bus and reads nothing from the gameplay scene directly; initial
 * values come from the shared registry (set by PlayScene before launch).
 *
 * The bus subscription is released on SHUTDOWN — the pattern every
 * scene-lifetime listener must follow.
 */
import Phaser from 'phaser';
import { HUD, VIEW } from '../config';
import { bus, EVENTS } from '../core/bus';
import { isMobileLayout } from '../systems/input';

export class HudScene extends Phaser.Scene {
  private scoreText!: Phaser.GameObjects.Text;

  constructor() {
    super('hud');
  }

  create(): void {
    const score = Number(this.registry.get('score') ?? 0);
    const best = Number(this.registry.get('best') ?? 0);

    this.scoreText = this.add
      .text(HUD.margin, HUD.margin - 4, '', {
        fontFamily: HUD.font,
        fontSize: '20px',
        color: HUD.textColor,
      })
      .setDepth(100);
    this.renderScore(score, best);

    this.add
      .text(
        VIEW.width - HUD.margin,
        HUD.margin - 2,
        isMobileLayout() ? 'tap = dash' : 'esc — pause',
        { fontFamily: HUD.font, fontSize: '14px', color: HUD.dimColor },
      )
      .setOrigin(1, 0)
      .setDepth(100);

    const off = bus.on(EVENTS.score, ({ score: s, best: b }) => this.renderScore(s, b));
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, off);
  }

  private renderScore(score: number, best: number): void {
    this.scoreText.setText(`score ${score}   best ${best}`);
  }
}
