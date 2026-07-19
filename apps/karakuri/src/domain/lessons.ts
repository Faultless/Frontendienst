/**
 * Lessons are data (ADR 0005): a goal, a starter workspace (Blockly JSON),
 * a solution workspace (used by tests and the "show me" path), and a pure
 * validator over the turtle's drawn segments. No Blockly imports here —
 * workspace JSON is treated as an opaque payload.
 */

import type { Segment } from "./turtle";

/** Opaque Blockly serialization state. */
export type WorkspaceJson = Record<string, unknown>;

export interface LessonResult {
  readonly ok: boolean;
  readonly message: string;
}

export interface Lesson {
  readonly id: string;
  readonly title: string;
  readonly teaches: string;
  readonly goal: string;
  readonly hint: string;
  readonly starter: WorkspaceJson;
  readonly solution: WorkspaceJson;
  readonly validate: (segments: readonly Segment[]) => LessonResult;
}

// ---------------------------------------------------------------------------
// Geometry helpers (tolerant of sub-pixel float fuzz).

const EPS = 0.5;

function len(s: Segment): number {
  return Math.hypot(s.x2 - s.x1, s.y2 - s.y1);
}

function connected(a: Segment, b: Segment): boolean {
  return Math.abs(a.x2 - b.x1) <= EPS && Math.abs(a.y2 - b.y1) <= EPS;
}

function dir(s: Segment): { dx: number; dy: number } {
  const l = len(s);
  return l === 0 ? { dx: 0, dy: 0 } : { dx: (s.x2 - s.x1) / l, dy: (s.y2 - s.y1) / l };
}

function dot(a: Segment, b: Segment): number {
  const da = dir(a);
  const db = dir(b);
  return da.dx * db.dx + da.dy * db.dy;
}

const perpendicular = (a: Segment, b: Segment): boolean => Math.abs(dot(a, b)) < 0.01;
const sameDirection = (a: Segment, b: Segment): boolean => dot(a, b) > 0.99;

function fail(message: string): LessonResult {
  return { ok: false, message };
}

// ---------------------------------------------------------------------------
// Validators.

/** Exactly 4 equal, connected, perpendicular sides forming a closed loop. */
export function validateSquare(segments: readonly Segment[]): LessonResult {
  if (segments.length !== 4) {
    return fail(
      `A square has exactly 4 sides — the turtle drew ${segments.length} segment${
        segments.length === 1 ? "" : "s"
      }. One repeat ×4 around "move + turn" gets you there.`,
    );
  }
  const [s0, s1, s2, s3] = segments;
  if (!s0 || !s1 || !s2 || !s3) return fail("Something went wrong reading the drawing.");
  const sides = [s0, s1, s2, s3];

  const first = len(s0);
  if (first <= EPS) return fail("The sides have no length — move the turtle forward.");
  if (sides.some((s) => Math.abs(len(s) - first) > EPS)) {
    return fail("All 4 sides must be the same length — use the same distance every time.");
  }
  for (let i = 0; i < 3; i++) {
    const a = sides[i];
    const b = sides[i + 1];
    if (a && b && !connected(a, b)) {
      return fail("The sides don't connect — draw them one after another without jumping.");
    }
  }
  if (Math.abs(s3.x2 - s0.x1) > EPS || Math.abs(s3.y2 - s0.y1) > EPS) {
    return fail("The path doesn't close — after 4 sides the turtle should be back where it started.");
  }
  for (let i = 0; i < 4; i++) {
    const a = sides[i];
    const b = sides[(i + 1) % 4];
    if (a && b && !perpendicular(a, b)) {
      return fail("Square corners are right angles — turn exactly 90° between sides.");
    }
  }
  return { ok: true, message: "A perfect square — one loop doing four sides' worth of work. That's the point of repeat." };
}

/** 5 steps = 10 connected segments alternating between two perpendicular directions. */
export function validateStaircase(segments: readonly Segment[]): LessonResult {
  if (segments.length !== 10) {
    return fail(
      `5 steps need 10 segments (each step is a rise + a tread) — the turtle drew ${segments.length}. Repeat ×5 around one step.`,
    );
  }
  if (segments.some((s) => len(s) <= EPS)) {
    return fail("Every rise and tread needs a real length — move the turtle forward each time.");
  }
  for (let i = 0; i < segments.length - 1; i++) {
    const a = segments[i];
    const b = segments[i + 1];
    if (a && b && !connected(a, b)) {
      return fail("The steps don't connect — the staircase must be one unbroken line.");
    }
    if (a && b && !perpendicular(a, b)) {
      return fail("Each step turns a right angle — alternate 90° turns between rise and tread.");
    }
  }
  const evens = segments.filter((_, i) => i % 2 === 0);
  const odds = segments.filter((_, i) => i % 2 === 1);
  const firstEven = evens[0];
  const firstOdd = odds[0];
  if (!firstEven || !firstOdd) return fail("Something went wrong reading the drawing.");
  if (evens.some((s) => !sameDirection(s, firstEven)) || odds.some((s) => !sameDirection(s, firstOdd))) {
    return fail("Every step must climb the same way — all rises in one direction, all treads in another.");
  }
  return { ok: true, message: "Five identical steps from one repeated pair of moves — nesting and reuse in action." };
}

// ---------------------------------------------------------------------------
// Workspace JSON (Blockly serialization format).

const num = (n: number) => ({ shadow: { type: "math_number", fields: { NUM: n } } });

const squareStarter: WorkspaceJson = {
  blocks: {
    languageVersion: 0,
    blocks: [
      {
        type: "controls_repeat_ext",
        x: 24,
        y: 24,
        inputs: { TIMES: num(4) },
      },
    ],
  },
};

const squareSolution: WorkspaceJson = {
  blocks: {
    languageVersion: 0,
    blocks: [
      {
        type: "controls_repeat_ext",
        x: 24,
        y: 24,
        inputs: {
          TIMES: num(4),
          DO: {
            block: {
              type: "turtle_move",
              fields: { DIR: "FORWARD" },
              inputs: { DISTANCE: num(120) },
              next: {
                block: {
                  type: "turtle_turn",
                  fields: { DIR: "RIGHT" },
                  inputs: { DEGREES: num(90) },
                },
              },
            },
          },
        },
      },
    ],
  },
};

const staircaseStarter: WorkspaceJson = {
  blocks: {
    languageVersion: 0,
    blocks: [
      {
        type: "controls_repeat_ext",
        x: 24,
        y: 24,
        inputs: {
          TIMES: num(5),
          DO: {
            block: {
              type: "turtle_move",
              fields: { DIR: "FORWARD" },
              inputs: { DISTANCE: num(40) },
            },
          },
        },
      },
    ],
  },
};

const staircaseSolution: WorkspaceJson = {
  blocks: {
    languageVersion: 0,
    blocks: [
      {
        type: "controls_repeat_ext",
        x: 24,
        y: 24,
        inputs: {
          TIMES: num(5),
          DO: {
            block: {
              type: "turtle_move",
              fields: { DIR: "FORWARD" },
              inputs: { DISTANCE: num(40) },
              next: {
                block: {
                  type: "turtle_turn",
                  fields: { DIR: "RIGHT" },
                  inputs: { DEGREES: num(90) },
                  next: {
                    block: {
                      type: "turtle_move",
                      fields: { DIR: "FORWARD" },
                      inputs: { DISTANCE: num(40) },
                      next: {
                        block: {
                          type: "turtle_turn",
                          fields: { DIR: "LEFT" },
                          inputs: { DEGREES: num(90) },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    ],
  },
};

// ---------------------------------------------------------------------------

export const LESSONS: readonly Lesson[] = [
  {
    id: "square",
    title: "1 · The square",
    teaches: "loops",
    goal: "Draw a closed square using exactly one repeat block — four equal sides, four 90° turns.",
    hint: "A square is the same two moves four times: go forward, turn right 90°. Put them inside repeat ×4 instead of stacking them four times yourself.",
    starter: squareStarter,
    solution: squareSolution,
    validate: validateSquare,
  },
  {
    id: "staircase",
    title: "2 · The staircase",
    teaches: "nesting & reuse",
    goal: "Draw a staircase with 5 steps. Each step is a rise and a tread — one repeated pair of move-and-turn.",
    hint: "One step = forward, turn right 90°, forward, turn left 90°. Repeat that whole step ×5. Try a variable for the step size so you can resize the staircase in one place.",
    starter: staircaseStarter,
    solution: staircaseSolution,
    validate: validateStaircase,
  },
];

export function getLesson(id: string): Lesson {
  const lesson = LESSONS.find((l) => l.id === id);
  if (!lesson) throw new Error(`unknown lesson: ${id}`);
  return lesson;
}

export const FIRST_LESSON: Lesson = (() => {
  const first = LESSONS[0];
  if (!first) throw new Error("no lessons defined");
  return first;
})();
