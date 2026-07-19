import { describe, expect, it } from "vitest";
import {
  accountBalance,
  accountingEquation,
  normalBalance,
  simpleTransfer,
  trialBalance,
  validateEntry,
} from "./engine";
import type { Account, JournalEntry } from "./types";

const cash: Account = { id: "cash", name: "Cash", type: "asset" };
const card: Account = { id: "card", name: "Credit card", type: "liability" };
const opening: Account = { id: "open", name: "Opening balance", type: "equity" };
const salary: Account = { id: "salary", name: "Salary", type: "income" };
const rent: Account = { id: "rent", name: "Rent", type: "expense" };
const accounts = [cash, card, opening, salary, rent];

const entries: JournalEntry[] = [
  // Opening: €1000 cash
  simpleTransfer({
    id: "e1",
    date: "2026-07-01",
    memo: "Opening balance",
    fromAccountId: "open",
    toAccountId: "cash",
    amount: 100_000,
  }),
  // Salary: €2500 into cash
  simpleTransfer({
    id: "e2",
    date: "2026-07-02",
    memo: "July salary",
    fromAccountId: "salary",
    toAccountId: "cash",
    amount: 250_000,
  }),
  // Rent €900 paid from cash
  simpleTransfer({
    id: "e3",
    date: "2026-07-03",
    memo: "July rent",
    fromAccountId: "cash",
    toAccountId: "rent",
    amount: 90_000,
  }),
  // Dinner €60 on the credit card
  simpleTransfer({
    id: "e4",
    date: "2026-07-05",
    memo: "Dinner",
    fromAccountId: "card",
    toAccountId: "rent",
    amount: 6_000,
  }),
];

describe("normalBalance", () => {
  it("matches the accounting equation sides", () => {
    expect(normalBalance("asset")).toBe("debit");
    expect(normalBalance("expense")).toBe("debit");
    expect(normalBalance("liability")).toBe("credit");
    expect(normalBalance("equity")).toBe("credit");
    expect(normalBalance("income")).toBe("credit");
  });
});

describe("validateEntry", () => {
  it("accepts a balanced two-line entry", () => {
    expect(validateEntry(entries[0]!.lines).ok).toBe(true);
  });
  it("rejects single-line entries with a teaching message", () => {
    const result = validateEntry([
      { accountId: "cash", amount: 100, side: "debit" },
    ]);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.issues[0]?.code).toBe("single-line");
  });
  it("rejects unbalanced entries", () => {
    const result = validateEntry([
      { accountId: "cash", amount: 100, side: "debit" },
      { accountId: "salary", amount: 90, side: "credit" },
    ]);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.issues[0]?.code).toBe("unbalanced");
  });
  it("rejects non-integer and non-positive amounts", () => {
    for (const amount of [0, -5, 10.5]) {
      const result = validateEntry([
        { accountId: "cash", amount, side: "debit" },
        { accountId: "salary", amount, side: "credit" },
      ]);
      expect(result.ok).toBe(false);
    }
  });
});

describe("balances", () => {
  it("computes signed balances on the normal side", () => {
    expect(accountBalance(cash, entries)).toBe(100_000 + 250_000 - 90_000);
    expect(accountBalance(card, entries)).toBe(6_000);
    expect(accountBalance(rent, entries)).toBe(96_000);
    expect(accountBalance(salary, entries)).toBe(250_000);
  });

  it("trial balance always balances", () => {
    const tb = trialBalance(accounts, entries);
    expect(tb.totalDebit).toBe(tb.totalCredit);
    expect(tb.rows.length).toBe(5);
  });

  it("accounting equation holds: A = L + E", () => {
    const { assets, liabilities, equity } = accountingEquation(accounts, entries);
    expect(assets).toBe(liabilities + equity);
    expect(assets).toBe(260_000);
  });
});

describe("simpleTransfer", () => {
  it("debits the destination and credits the source", () => {
    const entry = simpleTransfer({
      id: "x",
      date: "2026-07-19",
      memo: "Groceries",
      fromAccountId: "cash",
      toAccountId: "rent",
      amount: 4_200,
    });
    expect(entry.lines).toEqual([
      { accountId: "rent", amount: 4_200, side: "debit" },
      { accountId: "cash", amount: 4_200, side: "credit" },
    ]);
    expect(validateEntry(entry.lines).ok).toBe(true);
  });
});
