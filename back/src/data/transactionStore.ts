import { ensureDir, exists } from "std/fs/mod.ts";
import { join as joinPath } from "std/path/mod.ts";
import { DB } from "sqlite/mod.ts";

import { Transaction } from "../core/models.ts";

const INDEX_DB_FILE = "./transactions_index.db";
let indexDb: DB | null = null;

export async function saveTransactionsData(
  source: string,
  transactions: { id: string; data: unknown }[],
) {
  await ensureDir(joinPath("transactions", source));
  for (const transaction of transactions) {
    await setFileContent(
      joinPath("transactions", source, transaction.id + ".json"),
      JSON.stringify(transaction.data, null, 2),
    );
  }
}

export function saveTransactionIndex(transaction: Transaction) {
  getIndexDb().query(
    `
      INSERT INTO transactions (id, source, shop, description, amount, timestamp)
      VALUES (?, ?, ?, ?, ?, ?)
    `,
    [
      transaction.id,
      transaction.source,
      transaction.shop,
      transaction.description,
      transaction.amount,
      transaction.timestamp,
    ],
  );
}

export async function resetIndexDatabase() {
  indexDb?.close(true);
  indexDb = null;
  if (await exists(INDEX_DB_FILE)) {
    await Deno.remove(INDEX_DB_FILE);
  }
  createIndexSchema();
}

async function setFileContent(path: string, content: string): Promise<void> {
  const encoder = new TextEncoder();
  const data = encoder.encode(content);
  await Deno.writeFile(path, data);
}

function getIndexDb(): DB {
  if (indexDb == null) {
    indexDb = new DB(INDEX_DB_FILE);
  }
  return indexDb;
}

function createIndexSchema() {
  getIndexDb().query(`
    CREATE TABLE transactions (
      id TEXT PRIMARY KEY,
      source TEXT,
      shop TEXT NULL,
      description TEXT,
      amount INTEGER,
      timestamp INTEGER
    )
  `);
}
