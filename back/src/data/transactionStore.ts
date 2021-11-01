import { ensureDir, exists } from "std/fs/mod.ts";
import { join as joinPath } from "std/path/mod.ts";
import { DB } from "sqlite/mod.ts";

import { Transaction, TransactionLabels } from "../core/models.ts";

const RAW_TRANSACTIONS_FOLDER = "raw_transactions";
const DB_FILE = "./transactions.db";
let db: DB | null = null;

export async function saveRawTransactions(
  source: string,
  transactions: { id: string; data: unknown }[],
) {
  await ensureDir(joinPath(RAW_TRANSACTIONS_FOLDER, source));
  for (const transaction of transactions) {
    await setFileContent(
      joinPath(RAW_TRANSACTIONS_FOLDER, source, transaction.id + ".json"),
      JSON.stringify(transaction.data, null, 2),
    );
  }
}

export async function getRawTransactionIds(source: string): Promise<string[]> {
  const folderPath = joinPath(RAW_TRANSACTIONS_FOLDER, source);
  if (!await exists(folderPath)) return [];
  const result: string[] = [];
  for await (const entry of Deno.readDir(folderPath)) {
    if (entry.isFile && entry.name.endsWith(".json")) {
      result.push(entry.name.substring(0, entry.name.length - ".json".length));
    }
  }
  return result;
}

export async function getRawTransactionData(source: string, id: string): Promise<unknown> {
  const filePath = joinPath(RAW_TRANSACTIONS_FOLDER, source, id + ".json");
  const decoder = new TextDecoder();
  const data = decoder.decode(await Deno.readFile(filePath));
  return JSON.parse(data);
}

export function saveTransaction(source: string, labels: TransactionLabels, transaction: Transaction) {
  getDb().query(
    `
      INSERT INTO transactions (source, shop, category, id, description, amount, timestamp)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `,
    [
      source,
      labels.shop,
      labels.category,
      transaction.id,
      transaction.description,
      transaction.amount,
      transaction.timestamp,
    ],
  );
}

export async function resetDb() {
  db?.close(true);
  db = null;
  if (await exists(DB_FILE)) {
    await Deno.remove(DB_FILE);
  }
  createDbSchema();
}

async function setFileContent(path: string, content: string): Promise<void> {
  const encoder = new TextEncoder();
  const data = encoder.encode(content);
  await Deno.writeFile(path, data);
}

function getDb(): DB {
  if (db == null) {
    db = new DB(DB_FILE);
  }
  return db;
}

function createDbSchema() {
  getDb().query(`
    CREATE TABLE transactions (
      source TEXT,
      shop TEXT NULL,
      category TEXT NULL,
      id TEXT,
      description TEXT,
      amount INTEGER,
      timestamp INTEGER
    )
  `);
}
