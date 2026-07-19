/**
 * Pure turtle-graphics engine. Plain functions over plain types — zero
 * DOM/React/Blockly imports (web-app skill rule 3). The runner feeds it
 * commands as the interpreter executes blocks; the stage merely draws the
 * segments it produces.
 *
 * Coordinate system: origin at the stage center, y grows downward (canvas
 * convention). Heading 0° points up; positive turns are clockwise.
 */

export interface TurtleState {
  readonly x: number;
  readonly y: number;
  /** Degrees in [0, 360). 0 = up, 90 = right (clockwise positive). */
  readonly headingDeg: number;
  readonly penDown: boolean;
  readonly color: string;
  readonly width: number;
}

export interface Segment {
  readonly x1: number;
  readonly y1: number;
  readonly x2: number;
  readonly y2: number;
  readonly color: string;
  readonly width: number;
}

export type TurtleCommand =
  | { readonly kind: "move"; readonly distance: number }
  | { readonly kind: "turn"; readonly degrees: number }
  | { readonly kind: "pen"; readonly down: boolean }
  | { readonly kind: "color"; readonly color: string }
  | { readonly kind: "width"; readonly width: number };

export interface ApplyResult {
  readonly state: TurtleState;
  readonly segment: Segment | null;
}

export const DEFAULT_COLOR = "#fbbf24"; // amber-400
export const MIN_WIDTH = 1;
export const MAX_WIDTH = 32;

export function createTurtle(): TurtleState {
  return { x: 0, y: 0, headingDeg: 0, penDown: true, color: DEFAULT_COLOR, width: 3 };
}

/** Normalize any angle into [0, 360). */
export function normalizeHeading(deg: number): number {
  const m = deg % 360;
  return m < 0 ? m + 360 : m;
}

/** Kill float fuzz so 4×90° turns land exactly back on the start point. */
function round6(n: number): number {
  return Math.round(n * 1e6) / 1e6;
}

export function applyCommand(state: TurtleState, cmd: TurtleCommand): ApplyResult {
  switch (cmd.kind) {
    case "move": {
      const rad = (state.headingDeg * Math.PI) / 180;
      const x = round6(state.x + Math.sin(rad) * cmd.distance);
      const y = round6(state.y - Math.cos(rad) * cmd.distance);
      const segment =
        state.penDown && cmd.distance !== 0
          ? { x1: state.x, y1: state.y, x2: x, y2: y, color: state.color, width: state.width }
          : null;
      return { state: { ...state, x, y }, segment };
    }
    case "turn":
      return {
        state: { ...state, headingDeg: normalizeHeading(state.headingDeg + cmd.degrees) },
        segment: null,
      };
    case "pen":
      return { state: { ...state, penDown: cmd.down }, segment: null };
    case "color":
      return { state: { ...state, color: cmd.color }, segment: null };
    case "width": {
      const width = Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, cmd.width));
      return { state: { ...state, width }, segment: null };
    }
  }
}

export interface RunResult {
  readonly state: TurtleState;
  readonly segments: readonly Segment[];
}

export function runCommands(
  commands: readonly TurtleCommand[],
  initial: TurtleState = createTurtle(),
): RunResult {
  let state = initial;
  const segments: Segment[] = [];
  for (const cmd of commands) {
    const r = applyCommand(state, cmd);
    state = r.state;
    if (r.segment) segments.push(r.segment);
  }
  return { state, segments };
}
