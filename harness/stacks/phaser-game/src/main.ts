/**
 * main.ts — the one boot block. Fixed logical size, FIT scaling, and the
 * `window.__game` handle that the verify loop and smoke tests depend on.
 */
import Phaser from 'phaser';
import { VIEW } from './config';
import { audio } from './systems/audio';
import { BootScene } from './scenes/BootScene';
import { TitleScene } from './scenes/TitleScene';
import { PlayScene } from './scenes/PlayScene';
import { HudScene } from './scenes/HudScene';
import { PauseScene } from './scenes/PauseScene';

declare global {
  interface Window {
    /** Test handle — smoke tests and the verify loop drive the game via this. */
    __game: Phaser.Game;
  }
}

// Audio contexts need a user gesture; arm the one-shot unlock listeners now.
audio.installUnlock();

const game = new Phaser.Game({
  type: Phaser.AUTO,
  parent: 'app',
  backgroundColor: VIEW.backgroundColor,
  pixelArt: true,
  roundPixels: true,
  width: VIEW.width,
  height: VIEW.height,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  physics: {
    default: 'arcade',
    // Top-down demo: no gravity. For a platformer, set y here (see the
    // phaser-game skill's genre gates).
    arcade: { gravity: { x: 0, y: 0 }, debug: false },
  },
  scene: [BootScene, TitleScene, PlayScene, HudScene, PauseScene],
});

window.__game = game;
