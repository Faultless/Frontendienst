/**
 * TitleScene — name, "press to start", and the mute hint. Also the natural
 * place for the first user gesture, which unlocks the audio context.
 */
import Phaser from 'phaser';
import { HUD, PLAYER, VIEW } from '../config';
import { bus, EVENTS } from '../core/bus';
import { audio } from '../systems/audio';
import { isMobileLayout } from '../systems/input';
import { TEX } from '../fx/textures';

export class TitleScene extends Phaser.Scene {
  private started = false;
  private muteText!: Phaser.GameObjects.Text;

  constructor() {
    super('title');
  }

  create(): void {
    this.started = false;
    const cx = VIEW.width / 2;
    const mobile = isMobileLayout();

    // Decorative glow behind the title so the screen isn't flat text.
    this.add
      .image(cx, 168, TEX.glow)
      .setTint(PLAYER.color)
      .setBlendMode(Phaser.BlendModes.ADD)
      .setAlpha(0.5)
      .setScale(6);

    this.add
      .text(cx, 160, 'PHASER TEMPLATE', {
        fontFamily: HUD.font,
        fontSize: '52px',
        fontStyle: 'bold',
        color: HUD.textColor,
      })
      .setOrigin(0.5);

    this.add
      .text(
        cx,
        225,
        mobile ? 'drag to move · tap to dash · collect the orbs' : 'wasd / arrows to move · space to dash · collect the orbs',
        { fontFamily: HUD.font, fontSize: '16px', color: HUD.dimColor },
      )
      .setOrigin(0.5);

    const start = this.add
      .text(cx, 330, mobile ? 'tap to start' : 'click or press any key to start', {
        fontFamily: HUD.font,
        fontSize: '22px',
        color: HUD.accentColor,
      })
      .setOrigin(0.5);
    this.tweens.add({
      targets: start,
      alpha: { from: 1, to: 0.25 },
      duration: 700,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.InOut',
    });

    this.muteText = this.add
      .text(cx, VIEW.height - 36, '', {
        fontFamily: HUD.font,
        fontSize: '14px',
        color: HUD.dimColor,
      })
      .setOrigin(0.5);
    this.refreshMuteHint();

    this.input.on('pointerdown', () => this.start());
    this.input.keyboard!.on('keydown', (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === 'm') {
        audio.toggleMute();
        this.refreshMuteHint();
        return;
      }
      this.start();
    });
  }

  private refreshMuteHint(): void {
    this.muteText.setText(`m — sound: ${audio.isMuted ? 'off' : 'on'}`);
  }

  private start(): void {
    if (this.started) return;
    this.started = true;
    bus.emit(EVENTS.sfx, { name: 'start' });
    this.scene.start('play');
  }
}
