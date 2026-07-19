/**
 * persist.ts — tiny localStorage JSON wrapper. All progression/settings go
 * through here so private-mode browsers (where storage throws) degrade to
 * "just doesn't persist" instead of crashing.
 *
 * Keys live in SAVE in config.ts — rename the prefix per game.
 */

export function loadJSON<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (raw !== null) return JSON.parse(raw) as T;
  } catch {
    // localStorage unavailable or corrupt value — fall through
  }
  return fallback;
}

export function saveJSON(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore — progress just won't persist this session
  }
}
