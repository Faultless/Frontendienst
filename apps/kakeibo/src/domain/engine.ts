import type {
  Account,
  AccountType,
  EntryLine,
  JournalEntry,
  Side,
} from "./types";

/**
 * The side on which an account type *increases*. This single table is most
 * of double-entry bookkeeping:
 *
 *   Assets = Liabilities + Equity   (and Equity grows via Income − Expenses)
 *
 * Left side of the equation grows on the left (debit); right side grows on
 * the right (credit). Expenses reduce equity, so they grow on debit.
 */
export function normalBalance(type: AccountType): Side {
  switch (type) {
    case "asset":
    case "expense":
      return "debit";
    case "liability":
    case "equity":
    case "income":
      return "credit";
  }
}

export interface ValidationIssue {
  code: "no-lines" | "single-line" | "bad-amount" | "unbalanced";
  message: string;
}

export function validateEntry(
  lines: EntryLine[],
): { ok: true } | { ok: false; issues: ValidationIssue[] } {
  const issues: ValidationIssue[] = [];
  if (lines.length === 0) {
    issues.push({ code: "no-lines", message: "An entry needs at least two lines." });
  } else if (lines.length === 1) {
    issues.push({
      code: "single-line",
      message:
        "Double-entry means every movement has two sides: value comes FROM somewhere and goes TO somewhere.",
    });
  }
  for (const line of lines) {
    if (!Number.isInteger(line.amount) || line.amount <= 0) {
      issues.push({
        code: "bad-amount",
        message: "Amounts are positive integer cents; direction comes from the side.",
      });
      break;
    }
  }
  const debits = sumSide(lines, "debit");
  const credits = sumSide(lines, "credit");
  if (lines.length >= 2 && debits !== credits) {
    issues.push({
      code: "unbalanced",
      message: `Debits (${debits}) must equal credits (${credits}) — that balance is what keeps the books honest.`,
    });
  }
  return issues.length === 0 ? { ok: true } : { ok: false, issues };
}

export function sumSide(lines: EntryLine[], side: Side): number {
  return lines
    .filter((l) => l.side === side)
    .reduce((sum, l) => sum + l.amount, 0);
}

/**
 * Signed balance of an account: positive when the account holds a balance
 * on its normal side (a positive expense balance = money spent).
 */
export function accountBalance(
  account: Account,
  entries: JournalEntry[],
): number {
  const normal = normalBalance(account.type);
  let balance = 0;
  for (const entry of entries) {
    for (const line of entry.lines) {
      if (line.accountId !== account.id) continue;
      balance += line.side === normal ? line.amount : -line.amount;
    }
  }
  return balance;
}

export interface TrialBalanceRow {
  account: Account;
  debit: number;
  credit: number;
}

/** Classic trial balance: every non-zero account with its normal-side column filled. */
export function trialBalance(
  accounts: Account[],
  entries: JournalEntry[],
): { rows: TrialBalanceRow[]; totalDebit: number; totalCredit: number } {
  const rows: TrialBalanceRow[] = [];
  for (const account of accounts) {
    const balance = accountBalance(account, entries);
    if (balance === 0) continue;
    const normal = normalBalance(account.type);
    const onNormalSide = balance > 0;
    const abs = Math.abs(balance);
    const side: Side = onNormalSide
      ? normal
      : normal === "debit"
        ? "credit"
        : "debit";
    rows.push({
      account,
      debit: side === "debit" ? abs : 0,
      credit: side === "credit" ? abs : 0,
    });
  }
  return {
    rows,
    totalDebit: rows.reduce((s, r) => s + r.debit, 0),
    totalCredit: rows.reduce((s, r) => s + r.credit, 0),
  };
}

/** The accounting equation, live from the books. */
export function accountingEquation(
  accounts: Account[],
  entries: JournalEntry[],
): { assets: number; liabilities: number; equity: number } {
  const byType = (type: AccountType) =>
    accounts
      .filter((a) => a.type === type)
      .reduce((sum, a) => sum + accountBalance(a, entries), 0);
  const income = byType("income");
  const expenses = byType("expense");
  return {
    assets: byType("asset"),
    liabilities: byType("liability"),
    // Retained earnings live inside equity until a formal close: I − E.
    equity: byType("equity") + income - expenses,
  };
}

/**
 * The teaching bridge: a plain "money moved from X to Y" becomes a proper
 * journal entry. Debit where value arrived, credit where it came from.
 */
export function simpleTransfer(input: {
  id: string;
  date: string;
  memo: string;
  fromAccountId: string;
  toAccountId: string;
  amount: number;
}): JournalEntry {
  return {
    id: input.id,
    date: input.date,
    memo: input.memo,
    lines: [
      { accountId: input.toAccountId, amount: input.amount, side: "debit" },
      { accountId: input.fromAccountId, amount: input.amount, side: "credit" },
    ],
  };
}
