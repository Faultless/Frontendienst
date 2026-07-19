import { useLiveQuery } from "dexie-react-hooks";
import { accountBalance, normalBalance } from "../domain/engine";
import type { Account, AccountType } from "../domain/types";
import { accountsRepo, entriesRepo } from "../data/repo";
import { Money } from "../components/Money";

const TYPE_ORDER: AccountType[] = [
  "asset",
  "liability",
  "equity",
  "income",
  "expense",
];

const TYPE_LABEL: Record<AccountType, string> = {
  asset: "Assets — what you own",
  liability: "Liabilities — what you owe",
  equity: "Equity — what's truly yours",
  income: "Income — where value comes from",
  expense: "Expenses — where value goes",
};

export function AccountsPage() {
  const accounts = useLiveQuery(() => accountsRepo.active(), [], []);
  const entries = useLiveQuery(() => entriesRepo.all(), [], []);

  return (
    <div className="space-y-8">
      {TYPE_ORDER.map((type) => {
        const group = accounts.filter((a) => a.type === type);
        if (group.length === 0) return null;
        return (
          <section key={type}>
            <h2 className="mb-1 text-sm font-semibold uppercase tracking-wider text-stone-400">
              {TYPE_LABEL[type]}
            </h2>
            <p className="mb-3 text-xs text-stone-500">
              Grows on the <em>{normalBalance(type)}</em> side.
            </p>
            <ul className="divide-y divide-stone-800 rounded-lg border border-stone-800">
              {group.map((account: Account) => (
                <li
                  key={account.id}
                  className="flex items-center justify-between px-4 py-2.5"
                >
                  <span>
                    {account.name}
                    {account.group && (
                      <span className="ml-2 text-xs text-stone-500">
                        {account.group}
                      </span>
                    )}
                  </span>
                  <Money cents={accountBalance(account, entries)} signed />
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
