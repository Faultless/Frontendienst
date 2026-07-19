import { useLiveQuery } from "dexie-react-hooks";
import { Money } from "../components/Money";
import { accountsRepo, entriesRepo } from "../data/repo";

export function JournalPage() {
  const entries = useLiveQuery(() => entriesRepo.all(), [], []);
  const accounts = useLiveQuery(() => accountsRepo.all(), [], []);
  const nameOf = (id: string) =>
    accounts.find((a) => a.id === id)?.name ?? id;

  if (entries.length === 0) {
    return (
      <p className="text-stone-400">
        No entries yet — record your first one under{" "}
        <span className="text-stone-200">New entry</span>. Every entry you
        make is a small accounting lesson.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {entries.map((entry) => (
        <article
          key={entry.id}
          className="rounded-lg border border-stone-800 p-4"
        >
          <header className="mb-3 flex items-baseline justify-between">
            <div>
              <span className="mr-3 text-xs text-stone-500 tabular-nums">
                {entry.date}
              </span>
              <span className="font-medium">{entry.memo}</span>
            </div>
            <button
              type="button"
              onClick={() => entriesRepo.remove(entry.id)}
              className="text-xs text-stone-500 hover:text-rose-400"
            >
              delete
            </button>
          </header>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wider text-stone-500">
                <th className="pb-1 font-normal">Account</th>
                <th className="pb-1 text-right font-normal">Debit</th>
                <th className="pb-1 text-right font-normal">Credit</th>
              </tr>
            </thead>
            <tbody>
              {entry.lines.map((line, i) => (
                <tr key={i} className="border-t border-stone-800/60">
                  <td className="py-1">{nameOf(line.accountId)}</td>
                  <td className="py-1 text-right">
                    {line.side === "debit" ? <Money cents={line.amount} /> : ""}
                  </td>
                  <td className="py-1 text-right">
                    {line.side === "credit" ? <Money cents={line.amount} /> : ""}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </article>
      ))}
    </div>
  );
}
