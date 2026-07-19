/**
 * BootScene — bakes every procedural texture, then hands off to the title.
 *
 * Assets are procedural-first with graceful upgrade: when real art arrives,
 * load it in preload() over the SAME keys (`this.load.image(TEX.body, url)`);
 * the bakers below are `textures.exists`-guarded, so they automatically
 * become the 404 fallback and the game stays playable at every stage.
 */
import Phaser from 'phaser';
import { ORBS, PLAYER } from '../config';
import { TEX, makeBody, makePixel, makeRing, makeSoftDot } from '../fx/textures';

export class BootScene extends Phaser.Scene {
  constructor() {
    super('boot');
  }

  // preload(): void {
  //   Real art goes here, keyed by TEX.* — bakers in create() are fallback.
  //   this.load.image(TEX.body, 'assets/player.png');
  // }

  create(): void {
    makeSoftDot(this, TEX.spark, 16);
    makeSoftDot(this, TEX.glow, 64);
    makeRing(this, TEX.ring, 128);
    makeSoftDot(this, TEX.orb, ORBS.radius * 4);
    makeBody(this, TEX.body, PLAYER.radius * 2, PLAYER.radius * 2);
    makePixel(this, TEX.pixel);

    this.scene.start('title');
  }
}
