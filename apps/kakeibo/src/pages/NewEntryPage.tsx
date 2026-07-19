import { useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { useNavigate } from "@tanstack/react-router";
import { Money, parseEuros } from "../components/Money";
import { accountsRepo, entriesRepo } from "../data/repo";
import { simpleTransfer } from "../domain/engine";

export function NewEntryPage() {
  const accounts = useLiveQuery(() => accountsRepo.active(), [], []);
  const navigate = useNavigate();
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [memo, setMemo] = useState("");
  const [amountText, setAmountText] = useState("");
  const [fromId, setFromId] = useState("");
  const [toId, setToId] = useState("");
  const [error, setError] = useState<string | null>(null);

  const amount = parseEuros(amountText);
  const from = accounts.find((a) => a.id === fromId);
  const to = accounts.find((a) => a.id === toId);
  const preview =
    amount !== null && from && to && from.id !== to.id
      ? simpleTransfer({
          id: "preview",
          date,
          memo: memo || "(no memo)",
          fromAccountId: from.id,
          toAccountId: to.id,
          amount,
        })
      : null;

  const nameOf = (id: string) => accounts.find((a) => a.id === id)?.name ?? id;

  async function submit() {
    if (!preview) return;
    setError(null);
    try {
      await entriesRepo.add({ ...preview, id: crypto.randomUUID() });
      await navigate({ to: "/journal" });
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }

  const selectClass =
    "w-full rounded-md border border-stone-700 bg-stone-900 px-3 py-2 text-sm";

  return (
    <div className="grid gap-8 md:grid-cols-2">
      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          void submit();
        }}
      >
        <div className="grid grid-cols-2 gap-3">
          <label className="block text-sm">
            <span className="mb-1 block text-stone-400">Date</span>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className={selectClass}
            />
          </label>
          <label className="block text-sm">
            <span className="mb-1 block text-stone-400">Amount (€)</span>
            <input
              type="text"
              inputMode="decimal"
              placeholder="12,50"
              value={amountText}
              onChange={(e) => setAmountText(e.target.value)}
              className={selectClass}
            />
          </label>
        </div>
        <label className="block text-sm">
          <span className="mb-1 block text-stone-400">Memo</span>
          <input
            type="text"
            placeholder="Groceries at the market"
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            className={selectClass}
          />
        </label>
        <label className="block text-sm">
          <span className="mb-1 block text-stone-400">
            Money moved <strong>from</strong> (value left…)
          </span>
          <select
            value={fromId}
            onChange={(e) => setFromId(e.target.value)}
            className={selectClass}
          >
            <option value="">— choose an account —</option>
            {accounts.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name} ({a.type})
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm">
          <span className="mb-1 block text-stone-400">
            …<strong>to</strong> (value arrived)
          </span>
          <select
            value={toId}
            onChange={(e) => setToId(e.target.value)}
            className={selectClass}
          >
            <option value="">— choose an account —</option>
            {accounts.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name} ({a.type})
              </option>
            ))}
          </select>
        </label>
        {fromId !== "" && fromId === toId && (
          <p className="text-sm text-amber-400">
            Value has to move between two different accounts.
          </p>
        )}
        {error && <p className="text-sm text-rose-400">{error}</p>}
        <button
          type="submit"
          disabled={!preview}
          className="rounded-md bg-emerald-700 px-4 py-2 text-sm font-medium text-white enabled:hover:bg-emerald-600 disabled:opacity-40"
        >
          Record entry
        </button>
      </form>

      <aside className="rounded-lg border border-stone-800 bg-stone-900/50 p-4">
        <h2 className="mb-2 text-sm font-semibold uppercase tracking-wider text-stone-400">
          The journal entry you're really making
        </h2>
        {preview ? (
          <>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wider text-stone-500">
                  <th className="pb-1 font-normal">Account</th>
                  <th className="pb-1 text-right font-normal">Debit</th>
                  <th className="pb-1 text-right font-normal">Credit</th>
                </tr>
              </thead>
              <tbody>
                {preview.lines.map((line, i) => (
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
            <p className="mt-4 text-sm leading-relaxed text-stone-400">
              You <em className="text-stone-200">debit {nameOf(toId)}</em>{" "}
              because value arrived there, and{" "}
              <em className="text-stone-200">credit {nameOf(fromId)}</em>{" "}
              because value left it. Debits always equal credits — that's the
              whole trick of double-entry.
            </p>
          </>
        ) : (
          <p className="text-sm text-stone-500">
            Fill in the form and the double-entry version of your transaction
            appears here — every expense is secretly two movements.
          </p>
        )}
      </aside>
    </div>
  );
}
