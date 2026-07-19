import { describe, expect, it } from "vitest";
import { validateSquare, validateStaircase } from "./lessons";
import { runCommands, type TurtleCommand } from "./turtle";

const side: TurtleCommand[] = [
  { kind: "move", distance: 120 },
  { kind: "turn", degrees: 90 },
];

const step: TurtleCommand[] = [
  { kind: "move", distance: 40 },
  { kind: "turn", degrees: 90 },
  { kind: "move", distance: 40 },
  { kind: "turn", degrees: -90 },
];

describe("lesson validators", () => {
  it("accepts a closed 4-side square", () => {
    const { segments } = runCommands([...side, ...side, ...side, ...side]);
    expect(validateSquare(segments)).toMatchObject({ ok: true });
  });

  it("rejects a square attempt with the wrong side count", () => {
    const { segments } = runCommands([...side, ...side, ...side]);
    const result = validateSquare(segments);
    expect(result.ok).toBe(false);
    expect(result.message).toContain("3");
  });

  it("rejects an open path with unequal sides", () => {
    const { segments } = runCommands([
      { kind: "move", distance: 120 },
      { kind: "turn", degrees: 90 },
      { kind: "move", distance: 60 },
      { kind: "turn", degrees: 90 },
      { kind: "move", distance: 120 },
      { kind: "turn", degrees: 90 },
      { kind: "move", distance: 120 },
      { kind: "turn", degrees: 90 },
    ]);
    expect(validateSquare(segments).ok).toBe(false);
  });

  it("rejects non-right-angle corners (a closed rhombus is not a square)", () => {
    const { segments } = runCommands([
      { kind: "move", distance: 100 },
      { kind: "turn", degrees: 60 },
      { kind: "move", distance: 100 },
      { kind: "turn", degrees: 120 },
      { kind: "move", distance: 100 },
      { kind: "turn", degrees: 60 },
      { kind: "move", distance: 100 },
      { kind: "turn", degrees: 120 },
    ]);
    expect(segments).toHaveLength(4);
    expect(validateSquare(segments).ok).toBe(false);
  });

  it("accepts a 5-step staircase", () => {
    const { segments } = runCommands([...step, ...step, ...step, ...step, ...step]);
    expect(validateStaircase(segments)).toMatchObject({ ok: true });
  });

  it("rejects a staircase with too few steps or inconsistent direction", () => {
    const fourSteps = runCommands([...step, ...step, ...step, ...step]).segments;
    expect(validateStaircase(fourSteps).ok).toBe(false);

    const wobbly = runCommands([
      ...step,
      ...step,
      { kind: "move", distance: 40 },
      { kind: "turn", degrees: -90 }, // rises then turns the wrong way
      { kind: "move", distance: 40 },
      { kind: "turn", degrees: 90 },
      ...step,
      ...step,
    ]).segments;
    expect(validateStaircase(wobbly).ok).toBe(false);
  });
});
