import { useLiveQuery } from "dexie-react-hooks";
import { Money, formatCents } from "../components/Money";
import { accountsRepo, entriesRepo } from "../data/repo";
import { accountingEquation, trialBalance } from "../domain/engine";

const UPCOMING = [
  "Lesson 2 — T-accounts: reading an account like an accountant",
  "Lesson 3 — The trial balance: how errors reveal themselves",
  "Lesson 4 — Income statement & balance sheet from your own year",
  "Lesson 5 — Closing the books: where income and expenses go to rest",
];

export function LearnPage() {
  const accounts = useLiveQuery(() => accountsRepo.all(), [], []);
  const entries = useLiveQuery(() => entriesRepo.all(), [], []);
  const eq = accountingEquation(accounts, entries);
  const tb = trialBalance(accounts, entries);
  const balances = eq.assets === eq.liabilities + eq.equity;

  return (
    <div className="max-w-2xl space-y-10">
      <section>
        <h2 className="mb-3 text-lg font-semibold">
          Lesson 1 — The accounting equation
        </h2>
        <p className="mb-4 text-sm leading-relaxed text-stone-400">
          Everything you own was financed by someone: either by other people
          (liabilities) or by you (equity). Bookkeeping is the discipline of
          never letting that identity break. Here it is,{" "}
          <em className="text-stone-200">live from your own books</em>:
        </p>
        <div className="rounded-lg border border-stone-800 bg-stone-900/50 p-5 text-center">
          <p className="text-xl tabular-nums">
            <span title="Assets">{formatCents(eq.assets)}</span>
            <span className="mx-3 text-stone-500">=</span>
            <span title="Liabilities">{formatCents(eq.liabilities)}</span>
            <span className="mx-3 text-stone-500">+</span>
            <span title="Equity (incl. income − expenses)">
              {formatCents(eq.equity)}
            </span>
          </p>
          <p className="mt-2 text-xs uppercase tracking-wider text-stone-500">
            assets = liabilities + equity
          </p>
          <p
            className={`mt-3 text-sm ${balances ? "text-emerald-400" : "text-rose-400"}`}
          >
            {balances
              ? "✓ Your books balance. They always will — the entry form won't let you break the equation."
              : "✗ Your books don't balance — this should be impossible; export your data and file a bug."}
          </p>
        </div>
        <p className="mt-4 text-sm leading-relaxed text-stone-400">
          Note the equity number includes your{" "}
          <em className="text-stone-200">retained result</em>: every euro of
          income raises it, every expense lowers it. That's why "profit" and
          "what's truly yours" are the same idea.
        </p>
      </section>

      <section>
        <h2 className="mb-3 text-lg font-semibold">
          Your trial balance, right now
        </h2>
        {tb.rows.length === 0 ? (
          <p className="text-sm text-stone-500">
            Record a few entries and your first trial balance appears here.
          </p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wider text-stone-500">
                <th className="pb-2 font-normal">Account</th>
                <th className="pb-2 text-right font-normal">Debit</th>
                <th className="pb-2 text-right font-normal">Credit</th>
              </tr>
            </thead>
            <tbody>
              {tb.rows.map((row) => (
                <tr key={row.account.id} className="border-t border-stone-800/60">
                  <td className="py-1.5">{row.account.name}</td>
                  <td className="py-1.5 text-right">
                    {row.debit > 0 ? <Money cents={row.debit} /> : ""}
                  </td>
                  <td className="py-1.5 text-right">
                    {row.credit > 0 ? <Money cents={row.credit} /> : ""}
                  </td>
                </tr>
              ))}
              <tr className="border-t-2 border-stone-600 font-semibold">
                <td className="py-2">Totals</td>
                <td className="py-2 text-right">
                  <Money cents={tb.totalDebit} />
                </td>
                <td className="py-2 text-right">
                  <Money cents={tb.totalCredit} />
                </td>
              </tr>
            </tbody>
          </table>
        )}
      </section>

      <section>
        <h2 className="mb-3 text-lg font-semibold">Coming up</h2>
        <ul className="space-y-1.5 text-sm text-stone-500">
          {UPCOMING.map((lesson) => (
            <li key={lesson}>{lesson}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}
