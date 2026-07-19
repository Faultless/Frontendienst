import { describe, expect, it } from "vitest";
import {
  applyCommand,
  createTurtle,
  normalizeHeading,
  runCommands,
  type TurtleCommand,
} from "./turtle";

describe("turtle engine", () => {
  it("moves forward along its heading and draws a segment while the pen is down", () => {
    const { state, segment } = applyCommand(createTurtle(), { kind: "move", distance: 100 });
    // heading 0 = up = negative y
    expect(state.x).toBeCloseTo(0, 5);
    expect(state.y).toBeCloseTo(-100, 5);
    expect(segment).not.toBeNull();
    expect(segment).toMatchObject({ x1: 0, y1: 0, x2: 0, y2: -100 });
  });

  it("moves without drawing when the pen is up, then draws again after pen down", () => {
    const { segments, state } = runCommands([
      { kind: "pen", down: false },
      { kind: "move", distance: 50 },
      { kind: "pen", down: true },
      { kind: "move", distance: 25 },
    ]);
    expect(segments).toHaveLength(1);
    expect(segments[0]).toMatchObject({ x1: 0, y1: -50, x2: 0, y2: -75 });
    expect(state.y).toBeCloseTo(-75, 5);
  });

  it("turns clockwise for positive degrees and normalizes the heading", () => {
    const turned = applyCommand(createTurtle(), { kind: "turn", degrees: 90 }).state;
    expect(turned.headingDeg).toBe(90);
    const moved = applyCommand(turned, { kind: "move", distance: 10 }).state;
    expect(moved.x).toBeCloseTo(10, 5); // 90° = east
    expect(moved.y).toBeCloseTo(0, 5);

    expect(normalizeHeading(-90)).toBe(270);
    expect(applyCommand(turned, { kind: "turn", degrees: 630 }).state.headingDeg).toBe(0);
  });

  it("moves backward via a negative distance", () => {
    const { state, segment } = applyCommand(createTurtle(), { kind: "move", distance: -40 });
    expect(state.y).toBeCloseTo(40, 5);
    expect(segment).toMatchObject({ x2: 0, y2: 40 });
  });

  it("applies color and width to subsequent segments only, clamping width", () => {
    const { segments } = runCommands([
      { kind: "move", distance: 10 },
      { kind: "color", color: "#38bdf8" },
      { kind: "width", width: 999 },
      { kind: "move", distance: 10 },
    ]);
    expect(segments).toHaveLength(2);
    expect(segments[0]?.color).not.toBe("#38bdf8");
    expect(segments[1]).toMatchObject({ color: "#38bdf8", width: 32 });
  });

  it("does not emit a segment for a zero-distance move", () => {
    const { segments } = runCommands([{ kind: "move", distance: 0 }]);
    expect(segments).toHaveLength(0);
  });

  it("draws a closed square from a loop-shaped command sequence", () => {
    const side: TurtleCommand[] = [
      { kind: "move", distance: 120 },
      { kind: "turn", degrees: 90 },
    ];
    const program = [...side, ...side, ...side, ...side];
    const { state, segments } = runCommands(program);

    expect(segments).toHaveLength(4);
    // Each side connects to the next…
    for (let i = 0; i < 3; i++) {
      expect(segments[i]?.x2).toBeCloseTo(segments[i + 1]?.x1 ?? NaN, 5);
      expect(segments[i]?.y2).toBeCloseTo(segments[i + 1]?.y1 ?? NaN, 5);
    }
    // …and the path closes exactly back at the origin, facing up again.
    expect(segments[3]?.x2).toBeCloseTo(0, 5);
    expect(segments[3]?.y2).toBeCloseTo(0, 5);
    expect(state.x).toBeCloseTo(0, 5);
    expect(state.y).toBeCloseTo(0, 5);
    expect(state.headingDeg).toBe(0);
    // All four sides have equal length.
    for (const s of segments) {
      expect(Math.hypot(s.x2 - s.x1, s.y2 - s.y1)).toBeCloseTo(120, 5);
    }
  });
});
