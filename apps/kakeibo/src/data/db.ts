import Dexie, { type EntityTable } from "dexie";
import type { Account, JournalEntry } from "../domain/types";

export const db = new Dexie("kakeibo") as Dexie & {
  accounts: EntityTable<Account, "id">;
  entries: EntityTable<JournalEntry, "id">;
};

db.version(1).stores({
  accounts: "id, type, name",
  entries: "id, date",
});
