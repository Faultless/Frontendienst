/**
 * bus.ts — typed, Phaser-free event bus decoupling the simulation from
 * presentation. Gameplay emits; HUD, audio, and fx listen. Keeping it free
 * of Phaser imports means core game logic can be unit-tested in isolation.
 *
 * Scene-lifetime subscriptions MUST be released on scene SHUTDOWN:
 *   const off = bus.on(EVENTS.score, handler);
 *   this.events.once(Phaser.Scenes.Events.SHUTDOWN, off);
 */

type Handler<T> = (payload: T) => void;

export class Emitter<Events extends Record<string, unknown>> {
  private handlers = new Map<keyof Events, Set<Handler<never>>>();

  /** Subscribe. Returns an unsubscribe function. */
  on<K extends keyof Events>(event: K, fn: Handler<Events[K]>): () => void {
    let set = this.handlers.get(event);
    if (!set) {
      set = new Set();
      this.handlers.set(event, set);
    }
    set.add(fn as Handler<never>);
    return () => {
      set.delete(fn as Handler<never>);
    };
  }

  off<K extends keyof Events>(event: K, fn: Handler<Events[K]>): void {
    this.handlers.get(event)?.delete(fn as Handler<never>);
  }

  emit<K extends keyof Events>(event: K, payload: Events[K]): void {
    this.handlers.get(event)?.forEach((fn) => (fn as Handler<Events[K]>)(payload));
  }

  removeAllListeners(): void {
    this.handlers.clear();
  }
}

/** Synth sfx slots understood by systems/audio.ts. */
export type SfxName = 'start' | 'collect' | 'dash' | 'denied' | 'pause';

/** Event name map — always emit/subscribe through these constants. */
export const EVENTS = {
  score: 'score',
  orbCollected: 'orb-collected',
  sfx: 'sfx',
} as const;

/** Payload types, keyed by event name. Extend this as the game grows. */
export type BusEvents = {
  /** Score changed (gameplay → HUD). */
  score: { score: number; best: number };
  /** An orb was picked up at world (x, y) (gameplay → fx listeners). */
  'orb-collected': { x: number; y: number };
  /** Play a synth sound (anyone → audio). */
  sfx: { name: SfxName; intensity?: number };
};

/** The one global bus instance. */
export const bus = new Emitter<BusEvents>();
