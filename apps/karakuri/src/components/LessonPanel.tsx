import type { Lesson, LessonResult } from "../domain/lessons";

export function LessonPanel({
  lessons,
  activeId,
  result,
  onSelect,
  onLoadStarter,
  onCheck,
}: {
  readonly lessons: readonly Lesson[];
  readonly activeId: string;
  readonly result: LessonResult | null;
  readonly onSelect: (id: string) => void;
  readonly onLoadStarter: () => void;
  readonly onCheck: () => void;
}) {
  const lesson = lessons.find((l) => l.id === activeId) ?? lessons[0];
  if (!lesson) return null;

  return (
    <div className="flex h-full flex-col gap-2 p-3 text-sm">
      <div className="flex items-center gap-1">
        {lessons.map((l) => (
          <button
            key={l.id}
            type="button"
            onClick={() => onSelect(l.id)}
            className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
              l.id === lesson.id
                ? "bg-stone-800 text-white"
                : "text-stone-400 hover:bg-stone-900 hover:text-stone-200"
            }`}
          >
            {l.title}
          </button>
        ))}
        <span className="ml-auto rounded-full border border-stone-800 px-2 py-0.5 text-[10px] uppercase tracking-wider text-stone-500">
          {lesson.teaches}
        </span>
      </div>

      <p className="text-stone-300">{lesson.goal}</p>
      <p className="text-xs leading-relaxed text-stone-500">{lesson.hint}</p>

      <div className="mt-auto flex items-center gap-2">
        <button
          type="button"
          onClick={onLoadStarter}
          className="rounded-md border border-stone-700 px-2.5 py-1 text-xs text-stone-300 hover:bg-stone-800"
        >
          Load starter blocks
        </button>
        <button
          type="button"
          data-testid="btn-check"
          onClick={onCheck}
          className="rounded-md bg-amber-500 px-3 py-1 text-xs font-semibold text-stone-950 hover:bg-amber-400"
        >
          Check drawing
        </button>
      </div>

      {result && (
        <div
          data-testid={result.ok ? "lesson-success" : "lesson-failure"}
          className={`rounded-md border px-3 py-2 text-xs leading-relaxed ${
            result.ok
              ? "border-emerald-700 bg-emerald-950/60 text-emerald-300"
              : "border-rose-800 bg-rose-950/50 text-rose-300"
          }`}
        >
          <span className="mr-1 font-semibold">{result.ok ? "Cleared!" : "Not yet —"}</span>
          {result.message}
        </div>
      )}
    </div>
  );
}
