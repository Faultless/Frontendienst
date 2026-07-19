/**
 * PauseScene — the one shared pause overlay. Gameplay scenes launch it with
 * `scene.launch('pause', { from: <their key> })` then pause themselves; this
 * scene routes back using that `from` key, so any number of gameplay scenes
 * can share it (kotodama's pattern).
 */
import Phaser from 'phaser';
import { HUD, VIEW } from '../config';
import { audio } from '../systems/audio';

interface PauseSceneData {
  from: string;
}

export class PauseScene extends Phaser.Scene {
  private from = 'play';
  private soundText!: Phaser.GameObjects.Text;

  constructor() {
    super('pause');
  }

  create(data: PauseSceneData): void {
    this.from = data.from ?? 'play';
    const cx = VIEW.width / 2;

    this.add.rectangle(cx, VIEW.height / 2, VIEW.width, VIEW.height, 0x05060c, 0.72);
    this.add
      .text(cx, 150, 'PAUSED', {
        fontFamily: HUD.font,
        fontSize: '44px',
        fontStyle: 'bold',
        color: HUD.textColor,
      })
      .setOrigin(0.5);

    const line = (y: number, label: string, color = HUD.textColor) =>
      this.add
        .text(cx, y, label, { fontFamily: HUD.font, fontSize: '19px', color })
        .setOrigin(0.5);

    line(250, 'esc / p — resume', HUD.accentColor);
    this.soundText = line(290, '');
    line(330, 'r — restart');
    line(370, 't — back to title');
    line(VIEW.height - 40, 'tap anywhere to resume', HUD.dimColor);
    this.refreshSound();

    const kb = this.input.keyboard!;
    kb.on('keydown-ESC', () => this.resume());
    kb.on('keydown-P', () => this.resume());
    kb.on('keydown-M', () => {
      audio.toggleMute();
      this.refreshSound();
    });
    kb.on('keydown-R', () => this.restart());
    kb.on('keydown-T', () => this.toTitle());
    this.input.once('pointerdown', () => this.resume());
  }

  private refreshSound(): void {
    this.soundText.setText(`m — sound: ${audio.isMuted ? 'off' : 'on'}`);
  }

  private resume(): void {
    this.scene.stop();
    this.scene.resume(this.from);
  }

  private restart(): void {
    this.scene.stop(this.from);
    this.scene.stop('hud');
    this.scene.start(this.from); // also stops this scene
  }

  private toTitle(): void {
    this.scene.stop(this.from);
    this.scene.stop('hud');
    this.scene.start('title');
  }
}
