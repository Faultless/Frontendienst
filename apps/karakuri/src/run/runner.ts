/**
 * The stepped runner — the pedagogical heart of karakuri (ADR 0005).
 *
 * Blockly's javascriptGenerator emits ES5 with a `highlightBlock('<id>');`
 * prefix before every statement (STATEMENT_PREFIX). JS-Interpreter executes
 * that code sandboxed, micro-step by micro-step; each highlightBlock call is
 * a "block step" where we pause, light up the block, and repaint the stage —
 * so learners watch the program as a process, at slider speed.
 */

import * as Blockly from "blockly";
import { javascriptGenerator } from "blockly/javascript";
import Interpreter from "js-interpreter";
import {
  applyCommand,
  createTurtle,
  type Segment,
  type TurtleCommand,
  type TurtleState,
} from "../domain/turtle";

export type RunStatus = "idle" | "running" | "paused" | "done";

export interface RunnerCallbacks {
  /** Fired after every block step and on reset with the full drawing so far. */
  readonly onFrame: (segments: readonly Segment[], turtle: TurtleState) => void;
  readonly onStatus: (status: RunStatus) => void;
}

/** Interpreter micro-steps allowed between two block steps (guards value-only spins). */
const MAX_MICRO_STEPS = 20_000;
/** Total block steps allowed per run (guards `while (true)` from freezing the tab). */
const MAX_BLOCK_STEPS = 50_000;

export const MIN_SPEED = 1;
export const MAX_SPEED = 60;

let generatorWired = false;

/** One-time STATEMENT_PREFIX + reserved-word wiring for block highlighting. */
function wireGenerator(): void {
  if (generatorWired) return;
  javascriptGenerator.STATEMENT_PREFIX = "highlightBlock(%1);\n";
  javascriptGenerator.addReservedWords(
    "highlightBlock,moveForward,moveBackward,turnLeft,turnRight,penUp,penDown,setColor,setWidth",
  );
  generatorWired = true;
}

export class TurtleRunner {
  private interpreter: Interpreter | null = null;
  private timer: ReturnType<typeof setTimeout> | null = null;
  private status: RunStatus = "idle";
  private turtle: TurtleState = createTurtle();
  private segments: Segment[] = [];
  private hitBlockStep = false;
  private blockSteps = 0;
  private resolveDone: (() => void) | null = null;

  /** Block steps per second. May be pushed past MAX_SPEED by the test hook. */
  speed = 12;

  constructor(
    private readonly workspace: Blockly.WorkspaceSvg,
    private readonly cb: RunnerCallbacks,
  ) {
    wireGenerator();
  }

  getStatus(): RunStatus {
    return this.status;
  }

  getSegments(): readonly Segment[] {
    return this.segments;
  }

  getTurtle(): TurtleState {
    return this.turtle;
  }

  /**
   * Start a fresh run (or resume when paused). Resolves when the program
   * finishes or is stopped.
   */
  run(): Promise<void> {
    if (this.status === "paused" && this.interpreter) {
      this.setStatus("running");
      this.tick();
      return this.donePromise();
    }
    this.clearTimer();
    this.segments = [];
    this.turtle = createTurtle();
    this.blockSteps = 0;

    const code = javascriptGenerator.workspaceToCode(this.workspace);
    this.interpreter = new Interpreter(code, (interp, globalObject) => {
      const expose = (name: string, fn: (...args: never[]) => void): void => {
        interp.setProperty(globalObject, name, interp.createNativeFunction(fn));
      };
      expose("highlightBlock", (id: string) => {
        this.hitBlockStep = true;
        this.workspace.highlightBlock(String(id));
      });
      expose("moveForward", (d: number) => this.exec({ kind: "move", distance: Number(d) }));
      expose("moveBackward", (d: number) => this.exec({ kind: "move", distance: -Number(d) }));
      expose("turnRight", (deg: number) => this.exec({ kind: "turn", degrees: Number(deg) }));
      expose("turnLeft", (deg: number) => this.exec({ kind: "turn", degrees: -Number(deg) }));
      expose("penDown", () => this.exec({ kind: "pen", down: true }));
      expose("penUp", () => this.exec({ kind: "pen", down: false }));
      expose("setColor", (color: string) => this.exec({ kind: "color", color: String(color) }));
      expose("setWidth", (w: number) => this.exec({ kind: "width", width: Number(w) }));
    });

    this.setStatus("running");
    this.emitFrame();
    const done = this.donePromise();
    this.tick();
    return done;
  }

  pause(): void {
    if (this.status !== "running") return;
    this.clearTimer();
    this.setStatus("paused");
  }

  /** Abort the run; keeps whatever was drawn on the stage. */
  stop(): void {
    this.clearTimer();
    this.interpreter = null;
    this.workspace.highlightBlock(null);
    this.settleDone();
    if (this.status !== "idle") this.setStatus("idle");
  }

  /** Stop and wipe the stage back to the home turtle. */
  reset(): void {
    this.stop();
    this.segments = [];
    this.turtle = createTurtle();
    this.emitFrame();
  }

  // -------------------------------------------------------------------------

  private exec(cmd: TurtleCommand): void {
    const r = applyCommand(this.turtle, cmd);
    this.turtle = r.state;
    if (r.segment) this.segments.push(r.segment);
  }

  private tick = (): void => {
    if (this.status !== "running" || !this.interpreter) return;

    this.hitBlockStep = false;
    let hasMore = true;
    let micro = 0;
    while (hasMore && !this.hitBlockStep && micro < MAX_MICRO_STEPS) {
      try {
        hasMore = this.interpreter.step();
      } catch (e) {
        // Runtime error inside the learner's program: surface, don't crash.
        console.warn("karakuri program error:", e);
        hasMore = false;
      }
      micro++;
    }
    this.blockSteps++;
    this.emitFrame();

    if (!hasMore || this.blockSteps >= MAX_BLOCK_STEPS) {
      this.finish();
      return;
    }
    this.timer = setTimeout(this.tick, Math.max(0, 1000 / this.speed));
  };

  private finish(): void {
    this.clearTimer();
    this.interpreter = null;
    this.workspace.highlightBlock(null);
    this.setStatus("done");
    this.settleDone();
  }

  private donePromise(): Promise<void> {
    return new Promise((resolve) => {
      const prev = this.resolveDone;
      this.resolveDone = () => {
        prev?.();
        resolve();
      };
    });
  }

  private settleDone(): void {
    this.resolveDone?.();
    this.resolveDone = null;
  }

  private emitFrame(): void {
    this.cb.onFrame([...this.segments], this.turtle);
  }

  private setStatus(status: RunStatus): void {
    this.status = status;
    this.cb.onStatus(status);
  }

  private clearTimer(): void {
    if (this.timer !== null) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }
}
