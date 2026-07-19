/**
 * audio.ts — procedural sound via the Web Audio API (no asset files).
 *
 * Everything is synthesised from oscillators + filtered noise, so the game
 * has audio from the first commit. If real samples arrive later, keep these
 * synth voices as per-slot fallbacks (see kotodama's audio system).
 *
 * Browsers block audio until a user gesture, so the context is created
 * lazily: installUnlock() arms one-shot window listeners, and tone()/noise()
 * silently no-op until the context exists. The system is Phaser-free and
 * listens on the event bus — gameplay just emits `sfx` events.
 */
import { AUDIO, SAVE } from '../config';
import { bus, EVENTS, type SfxName } from '../core/bus';
import { loadJSON, saveJSON } from '../core/persist';

type Wave = OscillatorType;

export class AudioSystem {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private noiseBuffer: AudioBuffer | null = null;
  private muted = loadJSON(SAVE.muted, false);

  constructor() {
    bus.on(EVENTS.sfx, ({ name, intensity }) => this.play(name, intensity ?? 1));
  }

  /** Arm one-shot gesture listeners (autoplay policy). Call once at boot. */
  installUnlock(): void {
    const unlock = () => this.ensure();
    window.addEventListener('pointerdown', unlock, { once: true });
    window.addEventListener('keydown', unlock, { once: true });
  }

  get isMuted(): boolean {
    return this.muted;
  }

  toggleMute(): boolean {
    this.muted = !this.muted;
    if (this.master) this.master.gain.value = this.muted ? 0 : AUDIO.masterVolume;
    saveJSON(SAVE.muted, this.muted);
    return this.muted;
  }

  // --- Synth primitives --------------------------------------------------

  /** One enveloped oscillator note; optional pitch slide to `slideTo` Hz. */
  tone(freq: number, durS: number, wave: Wave, vol: number, slideTo?: number): void {
    if (!this.ctx || !this.master) return; // not unlocked yet — drop silently
    const ctx = this.ctx;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = wave;
    osc.frequency.setValueAtTime(freq, now);
    if (slideTo !== undefined) {
      osc.frequency.exponentialRampToValueAtTime(Math.max(1, slideTo), now + durS);
    }
    g.gain.setValueAtTime(0.0001, now);
    g.gain.exponentialRampToValueAtTime(vol, now + 0.008);
    g.gain.exponentialRampToValueAtTime(0.0001, now + durS);
    osc.connect(g).connect(this.master);
    osc.start(now);
    osc.stop(now + durS + 0.02);
  }

  /** Filtered white-noise hit — the percussive half of most game sounds. */
  noise(durS: number, vol: number, filterHz: number, type: BiquadFilterType = 'lowpass'): void {
    if (!this.ctx || !this.master || !this.noiseBuffer) return;
    const ctx = this.ctx;
    const now = ctx.currentTime;
    const src = ctx.createBufferSource();
    src.buffer = this.noiseBuffer;
    const filter = ctx.createBiquadFilter();
    filter.type = type;
    filter.frequency.value = filterHz;
    const g = ctx.createGain();
    g.gain.setValueAtTime(vol, now);
    g.gain.exponentialRampToValueAtTime(0.0001, now + durS);
    src.connect(filter).connect(g).connect(this.master);
    src.start(now);
    src.stop(now + durS);
  }

  // --- Named sounds (the demo's sfx vocabulary — replace per game) --------

  private play(name: SfxName, intensity: number): void {
    switch (name) {
      case 'start': // little ascending confirmation
        this.tone(523, 0.1, 'sine', 0.15);
        window.setTimeout(() => this.tone(784, 0.16, 'sine', 0.15), 90);
        break;
      case 'collect': // bright rising ping
        this.tone(880, 0.1, 'sine', 0.16 * intensity, 1760);
        this.noise(0.05, 0.06 * intensity, 6000, 'highpass');
        break;
      case 'dash': // airy whoosh with a falling body
        this.noise(0.18, 0.14, 1400, 'bandpass');
        this.tone(300, 0.12, 'sawtooth', 0.07, 120);
        break;
      case 'denied': // dull "not yet" thunk (dash on cooldown)
        this.tone(150, 0.07, 'square', 0.08, 95);
        break;
      case 'pause': // soft descending blip
        this.tone(440, 0.08, 'sine', 0.1, 330);
        break;
    }
  }

  // --- Internals -----------------------------------------------------------

  private ensure(): AudioContext {
    if (!this.ctx) {
      const Ctor =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new Ctor();
      this.master = this.ctx.createGain();
      this.master.gain.value = this.muted ? 0 : AUDIO.masterVolume;
      this.master.connect(this.ctx.destination);

      // Pre-bake a short white-noise buffer for percussive sounds.
      const len = Math.floor(this.ctx.sampleRate * 0.4);
      this.noiseBuffer = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
      const data = this.noiseBuffer.getChannelData(0);
      for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
    }
    if (this.ctx.state === 'suspended') void this.ctx.resume();
    return this.ctx;
  }
}

/** The one global audio instance (constructed muted-state from storage). */
export const audio = new AudioSystem();
