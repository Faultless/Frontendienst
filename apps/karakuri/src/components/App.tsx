import { useCallback, useEffect, useRef, useState } from "react";
import type * as Blockly from "blockly";
import { createTurtle, type Segment, type TurtleState } from "../domain/turtle";
import {
  FIRST_LESSON,
  getLesson,
  LESSONS,
  type Lesson,
  type LessonResult,
  type WorkspaceJson,
} from "../domain/lessons";
import {
  exportWorkspaceJson,
  importWorkspaceJson,
  loadWorkspaceJson,
  saveWorkspace,
} from "../data/workspaceStore";
import { TurtleRunner, type RunStatus } from "../run/runner";
import { BlocklyPane } from "./BlocklyPane";
import { Header } from "./Header";
import { LessonPanel } from "./LessonPanel";
import { Stage } from "./Stage";

/** Programmatic hook for the behavioral smoke test — dragging blocks headless
 * is not feasible, so the harness drives the app through `window.__karakuri`. */
export interface KarakuriTestHook {
  readonly lessons: readonly Lesson[];
  readonly loadWorkspaceJson: (json: WorkspaceJson) => void;
  readonly getSegments: () => readonly Segment[];
  readonly setSpeed: (stepsPerSec: number) => void;
  readonly run: () => Promise<void>;
  readonly check: () => LessonResult;
  readonly setLesson: (id: string) => void;
}

declare global {
  interface Window {
    __karakuri?: KarakuriTestHook;
  }
}

export function App() {
  const [workspace, setWorkspace] = useState<Blockly.WorkspaceSvg | null>(null);
  const [segments, setSegments] = useState<readonly Segment[]>([]);
  const [turtle, setTurtle] = useState<TurtleState>(createTurtle());
  const [status, setStatus] = useState<RunStatus>("idle");
  const [speed, setSpeed] = useState(12);
  const [lessonId, setLessonId] = useState(FIRST_LESSON.id);
  const [checkResult, setCheckResult] = useState<LessonResult | null>(null);

  const runnerRef = useRef<TurtleRunner | null>(null);
  const lessonIdRef = useRef(lessonId);
  lessonIdRef.current = lessonId;
  const speedRef = useRef(speed);
  speedRef.current = speed;

  const handleWorkspace = useCallback((ws: Blockly.WorkspaceSvg | null) => {
    setWorkspace(ws);
  }, []);

  /** Validate the active lesson against what the turtle actually drew. */
  const checkLesson = useCallback((): LessonResult => {
    const lesson = getLesson(lessonIdRef.current);
    const drawn = runnerRef.current?.getSegments() ?? [];
    const result = lesson.validate(drawn);
    setCheckResult(result);
    return result;
  }, []);

  // Runner + test hook lifecycle, bound to the injected workspace.
  useEffect(() => {
    if (!workspace) return;
    const runner = new TurtleRunner(workspace, {
      onFrame: (segs, t) => {
        setSegments(segs);
        setTurtle(t);
      },
      onStatus: setStatus,
    });
    runner.speed = speedRef.current;
    runnerRef.current = runner;

    window.__karakuri = {
      lessons: LESSONS,
      loadWorkspaceJson: (json) => {
        loadWorkspaceJson(workspace, json);
        saveWorkspace(workspace);
      },
      getSegments: () => runner.getSegments(),
      setSpeed: (stepsPerSec) => {
        runner.speed = stepsPerSec;
      },
      run: () => runner.run(),
      check: checkLesson,
      setLesson: (id) => {
        setLessonId(id);
        setCheckResult(null);
      },
    };

    return () => {
      runner.stop();
      runnerRef.current = null;
      delete window.__karakuri;
    };
  }, [workspace, checkLesson]);

  useEffect(() => {
    if (runnerRef.current) runnerRef.current.speed = speed;
  }, [speed]);

  const handleRun = useCallback(() => {
    void runnerRef.current?.run();
  }, []);
  const handlePause = useCallback(() => runnerRef.current?.pause(), []);
  const handleStop = useCallback(() => runnerRef.current?.stop(), []);
  const handleReset = useCallback(() => {
    runnerRef.current?.reset();
    setCheckResult(null);
  }, []);

  const handleExport = useCallback(() => {
    if (!workspace) return;
    const blob = new Blob([exportWorkspaceJson(workspace)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `karakuri-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
  }, [workspace]);

  const handleImport = useCallback(() => {
    if (!workspace) return;
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "application/json";
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;
      try {
        importWorkspaceJson(workspace, await file.text());
      } catch (e) {
        alert(e instanceof Error ? e.message : String(e));
      }
    };
    input.click();
  }, [workspace]);

  const handleSelectLesson = useCallback((id: string) => {
    setLessonId(id);
    setCheckResult(null);
  }, []);

  const handleLoadStarter = useCallback(() => {
    if (!workspace) return;
    const lesson = getLesson(lessonIdRef.current);
    loadWorkspaceJson(workspace, lesson.starter);
    saveWorkspace(workspace);
    runnerRef.current?.reset();
    setCheckResult(null);
  }, [workspace]);

  return (
    <div className="flex h-dvh flex-col">
      <Header
        status={status}
        speed={speed}
        onSpeedChange={setSpeed}
        onRun={handleRun}
        onPause={handlePause}
        onStop={handleStop}
        onReset={handleReset}
        onExport={handleExport}
        onImport={handleImport}
      />
      <div className="flex min-h-0 flex-1">
        <div className="min-w-0 flex-1">
          <BlocklyPane onWorkspace={handleWorkspace} />
        </div>
        <div className="flex w-[400px] shrink-0 flex-col border-l border-stone-800">
          <div className="min-h-0 flex-1 border-b border-stone-800">
            <Stage segments={segments} turtle={turtle} />
          </div>
          <div className="h-[264px] shrink-0">
            <LessonPanel
              lessons={LESSONS}
              activeId={lessonId}
              result={checkResult}
              onSelect={handleSelectLesson}
              onLoadStarter={handleLoadStarter}
              onCheck={checkLesson}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
