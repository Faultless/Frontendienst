import { DEFAULT_ACCOUNTS } from "../domain/coa";
import { validateEntry } from "../domain/engine";
import type { Account, JournalEntry } from "../domain/types";
import { db } from "./db";

export async function seedIfEmpty(): Promise<void> {
  const count = await db.accounts.count();
  if (count === 0) await db.accounts.bulkAdd(DEFAULT_ACCOUNTS);
}

export const accountsRepo = {
  all: () => db.accounts.toArray(),
  active: async () =>
    (await db.accounts.toArray()).filter((a) => !a.archived),
  add: (account: Account) => db.accounts.add(account),
  update: (account: Account) => db.accounts.put(account),
};

export const entriesRepo = {
  all: () => db.entries.orderBy("date").reverse().toArray(),
  add: async (entry: JournalEntry) => {
    const result = validateEntry(entry.lines);
    if (!result.ok) {
      throw new Error(result.issues.map((i) => i.message).join(" "));
    }
    await db.entries.add(entry);
  },
  remove: (id: string) => db.entries.delete(id),
};

interface ExportDocument {
  app: "kakeibo";
  version: 1;
  exportedAt: string;
  accounts: Account[];
  entries: JournalEntry[];
}

export async function exportJson(): Promise<string> {
  const doc: ExportDocument = {
    app: "kakeibo",
    version: 1,
    exportedAt: new Date().toISOString(),
    accounts: await db.accounts.toArray(),
    entries: await db.entries.toArray(),
  };
  return JSON.stringify(doc, null, 2);
}

export async function importJson(json: string): Promise<void> {
  const doc = JSON.parse(json) as ExportDocument;
  if (doc.app !== "kakeibo" || doc.version !== 1) {
    throw new Error("Not a kakeibo v1 export file.");
  }
  for (const entry of doc.entries) {
    const result = validateEntry(entry.lines);
    if (!result.ok) throw new Error(`Entry "${entry.memo}" is invalid.`);
  }
  await db.transaction("rw", db.accounts, db.entries, async () => {
    await db.accounts.clear();
    await db.entries.clear();
    await db.accounts.bulkAdd(doc.accounts);
    await db.entries.bulkAdd(doc.entries);
  });
}
