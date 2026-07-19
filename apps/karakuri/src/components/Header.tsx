import { MAX_SPEED, MIN_SPEED, type RunStatus } from "../run/runner";

function ControlButton({
  label,
  onClick,
  testId,
  primary = false,
  disabled = false,
}: {
  readonly label: string;
  readonly onClick: () => void;
  readonly testId: string;
  readonly primary?: boolean;
  readonly disabled?: boolean;
}) {
  return (
    <button
      type="button"
      data-testid={testId}
      onClick={onClick}
      disabled={disabled}
      className={
        primary
          ? "rounded-md bg-emerald-600 px-3.5 py-1.5 text-sm font-semibold text-white hover:bg-emerald-500 disabled:opacity-40"
          : "rounded-md border border-stone-700 px-3 py-1.5 text-sm text-stone-300 hover:bg-stone-800 disabled:opacity-40"
      }
    >
      {label}
    </button>
  );
}

export function Header({
  status,
  speed,
  onSpeedChange,
  onRun,
  onPause,
  onStop,
  onReset,
  onExport,
  onImport,
}: {
  readonly status: RunStatus;
  readonly speed: number;
  readonly onSpeedChange: (speed: number) => void;
  readonly onRun: () => void;
  readonly onPause: () => void;
  readonly onStop: () => void;
  readonly onReset: () => void;
  readonly onExport: () => void;
  readonly onImport: () => void;
}) {
  const running = status === "running";
  return (
    <header className="flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-stone-800 bg-stone-950 px-4 py-2.5">
      <h1 className="text-base font-bold tracking-tight">
        からくり <span className="font-normal text-stone-400">karakuri</span>
        <span className="ml-3 hidden text-xs font-normal text-stone-600 lg:inline">
          programming, one block at a time
        </span>
      </h1>

      <div className="flex items-center gap-1.5">
        {running ? (
          <ControlButton label="Pause" testId="btn-pause" onClick={onPause} primary />
        ) : (
          <ControlButton
            label={status === "paused" ? "Resume" : "Run"}
            testId="btn-run"
            onClick={onRun}
            primary
          />
        )}
        <ControlButton
          label="Stop"
          testId="btn-stop"
          onClick={onStop}
          disabled={status === "idle" || status === "done"}
        />
        <ControlButton label="Reset" testId="btn-reset" onClick={onReset} />
      </div>

      <label className="flex items-center gap-2 text-xs text-stone-400">
        speed
        <input
          type="range"
          min={MIN_SPEED}
          max={MAX_SPEED}
          value={Math.min(speed, MAX_SPEED)}
          onChange={(e) => onSpeedChange(Number(e.target.value))}
          className="h-1.5 w-28 accent-amber-500"
          data-testid="speed-slider"
        />
        <span className="w-14 tabular-nums text-stone-500">{speed} st/s</span>
      </label>

      <div className="ml-auto flex gap-1 text-xs text-stone-500">
        <button
          type="button"
          onClick={onExport}
          className="px-2 py-1 hover:text-stone-200"
          data-testid="btn-export"
        >
          export
        </button>
        <button
          type="button"
          onClick={onImport}
          className="px-2 py-1 hover:text-stone-200"
          data-testid="btn-import"
        >
          import
        </button>
      </div>
    </header>
  );
}
