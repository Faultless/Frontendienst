export type AccountType =
  | "asset"
  | "liability"
  | "equity"
  | "income"
  | "expense";

export interface Account {
  id: string;
  name: string;
  type: AccountType;
  /** Free-form grouping label shown in lists (e.g. "Fixed costs"). */
  group?: string;
  archived?: boolean;
}

export type Side = "debit" | "credit";

export interface EntryLine {
  accountId: string;
  /** Amount in integer cents, always positive; direction comes from `side`. */
  amount: number;
  side: Side;
}

export interface JournalEntry {
  id: string;
  /** ISO date, e.g. "2026-07-19". */
  date: string;
  memo: string;
  lines: EntryLine[];
}
