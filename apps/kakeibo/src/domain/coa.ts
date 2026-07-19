import type { Account } from "./types";

/** Default chart of accounts seeded on first run. Editable afterwards. */
export const DEFAULT_ACCOUNTS: Account[] = [
  { id: "cash", name: "Cash", type: "asset", group: "Money" },
  { id: "checking", name: "Checking account", type: "asset", group: "Money" },
  { id: "savings", name: "Savings", type: "asset", group: "Money" },
  { id: "credit-card", name: "Credit card", type: "liability", group: "Owed" },
  { id: "opening", name: "Opening balances", type: "equity", group: "Equity" },
  { id: "salary", name: "Salary", type: "income", group: "Income" },
  { id: "other-income", name: "Other income", type: "income", group: "Income" },
  { id: "rent", name: "Rent", type: "expense", group: "Fixed costs" },
  { id: "utilities", name: "Utilities", type: "expense", group: "Fixed costs" },
  { id: "groceries", name: "Groceries", type: "expense", group: "Living" },
  { id: "transport", name: "Transport", type: "expense", group: "Living" },
  { id: "dining", name: "Dining out", type: "expense", group: "Fun" },
  { id: "fun", name: "Entertainment", type: "expense", group: "Fun" },
];
