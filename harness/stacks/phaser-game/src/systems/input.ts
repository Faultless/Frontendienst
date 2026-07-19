/**
 * input.ts — abstracts raw keyboard + touch into game *intents*.
 *
 * Gameplay code only ever reads the InputState struct — never key codes or
 * pointer events — so control schemes can change (and touch can coexist with
 * keyboard) without touching game logic. Edge detection (justPressed /
 * justReleased) is computed once per frame so consumers don't manage their
 * own previous-frame state.
 *
 * Touch scheme: press-and-drag anywhere acts as a virtual stick (movement),
 * a quick tap is a dash. Both write into the SAME struct as the keyboard.
 */
import Phaser from 'phaser';
import { TOUCH } from '../config';

export interface InputState {
  /** Movement axes, -1..+1 (already normalised — diagonals aren't faster). */
  moveX: number;
  moveY: number;
  dashHeld: boolean;
  dashJustPressed: boolean;
  dashJustReleased: boolean;
}

/**
 * True when the device should get the touch-first layout. `?ui=mobile` /
 * `?ui=desktop` overrides for testing either layout from a desktop browser.
 */
export function isMobileLayout(): boolean {
  const override = new URLSearchParams(window.location.search).get('ui');
  if (override === 'mobile') return true;
  if (override === 'desktop') return false;
  return window.matchMedia('(pointer: coarse)').matches;
}

export class InputController {
  readonly state: InputState = {
    moveX: 0,
    moveY: 0,
    dashHeld: false,
    dashJustPressed: false,
    dashJustReleased: false,
  };

  private keys: Record<
    'up' | 'down' | 'left' | 'right' | 'upArrow' | 'downArrow' | 'leftArrow' | 'rightArrow' | 'dash',
    Phaser.Input.Keyboard.Key
  >;
  private prevDash = false;

  // Virtual-stick touch state (single pointer; first one down wins).
  private touchPointer: Phaser.Input.Pointer | null = null;
  private touchOrigin = { x: 0, y: 0 };
  private touchDownAt = 0; // performance.now() ms
  private touchMaxDist = 0; // px — farthest the pointer strayed from origin
  private touchDashQueued = false; // tap detected on pointerup → dash pulse

  constructor(scene: Phaser.Scene) {
    const kb = scene.input.keyboard!;
    const K = Phaser.Input.Keyboard.KeyCodes;
    this.keys = {
      up: kb.addKey(K.W),
      down: kb.addKey(K.S),
      left: kb.addKey(K.A),
      right: kb.addKey(K.D),
      upArrow: kb.addKey(K.UP),
      downArrow: kb.addKey(K.DOWN),
      leftArrow: kb.addKey(K.LEFT),
      rightArrow: kb.addKey(K.RIGHT),
      dash: kb.addKey(K.SPACE),
    };
    // Don't let space/arrows scroll the page.
    kb.addCapture([K.SPACE, K.UP, K.DOWN, K.LEFT, K.RIGHT]);

    // Touch / pointer — listeners live on the scene's InputPlugin, which is
    // torn down automatically on scene shutdown.
    scene.input.on('pointerdown', (p: Phaser.Input.Pointer) => {
      if (this.touchPointer) return; // ignore extra fingers
      this.touchPointer = p;
      this.touchOrigin = { x: p.x, y: p.y };
      this.touchDownAt = performance.now();
      this.touchMaxDist = 0;
    });
    scene.input.on('pointerup', (p: Phaser.Input.Pointer) => {
      if (this.touchPointer?.id !== p.id) return;
      const heldMs = performance.now() - this.touchDownAt;
      if (heldMs <= TOUCH.tapMaxMs && this.touchMaxDist <= TOUCH.tapMaxMove) {
        this.touchDashQueued = true; // quick tap = dash
      }
      this.touchPointer = null;
    });
  }

  /** Recompute the intent struct. Call once per frame, early in update(). */
  update(): void {
    const k = this.keys;
    let x =
      (k.right.isDown || k.rightArrow.isDown ? 1 : 0) -
      (k.left.isDown || k.leftArrow.isDown ? 1 : 0);
    let y =
      (k.down.isDown || k.downArrow.isDown ? 1 : 0) -
      (k.up.isDown || k.upArrow.isDown ? 1 : 0);

    // Virtual stick overrides the keyboard while a drag is active.
    const p = this.touchPointer;
    if (p) {
      const dx = p.x - this.touchOrigin.x;
      const dy = p.y - this.touchOrigin.y;
      const dist = Math.hypot(dx, dy);
      this.touchMaxDist = Math.max(this.touchMaxDist, dist);
      if (dist > TOUCH.stickDeadzone) {
        // 0 at the deadzone edge → 1 at stickRadius, along the drag direction.
        const strength = Math.min(
          1,
          (dist - TOUCH.stickDeadzone) / (TOUCH.stickRadius - TOUCH.stickDeadzone),
        );
        x = (dx / dist) * strength;
        y = (dy / dist) * strength;
      }
    }

    // Normalise so keyboard diagonals aren't ~41% faster.
    const len = Math.hypot(x, y);
    if (len > 1) {
      x /= len;
      y /= len;
    }
    this.state.moveX = x;
    this.state.moveY = y;

    const dash = k.dash.isDown || this.touchDashQueued;
    this.state.dashHeld = dash;
    this.state.dashJustPressed = dash && !this.prevDash;
    this.state.dashJustReleased = !dash && this.prevDash;
    this.prevDash = dash;
    this.touchDashQueued = false; // tap pulse lasts exactly one frame
  }
}
