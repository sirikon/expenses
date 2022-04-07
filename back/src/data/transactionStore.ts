import { ensureDir, exists } from "std/fs/mod.ts";
import { join as joinPath } from "std/path/mod.ts";
import { DB } from "sqlite/mod.ts";

import {
  Categorization,
  CategorizedTransaction,
  Transaction,
} from "../core/models.ts";

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

export async function getRawTransactionData(
  source: string,
  id: string,
): Promise<unknown> {
  const filePath = joinPath(RAW_TRANSACTIONS_FOLDER, source, id + ".json");
  const decoder = new TextDecoder();
  const data = decoder.decode(await Deno.readFile(filePath));
  return JSON.parse(data);
}

export function saveTransaction(
  source: string,
  transaction: Transaction,
) {
  getDb().query(
    `
      INSERT INTO transactions (source, id, description, amount, timestamp, data)
      VALUES (?, ?, ?, ?, ?, ?)
    `,
    [
      source,
      transaction.id,
      transaction.description,
      transaction.amount,
      transaction.timestamp,
      JSON.stringify(transaction.data),
    ],
  );
}

export function queryTransactions(categorization: Categorization) {
  const caseLines: string[] = [];
  const placeholders: string[] = [];

  for (const c of categorization) {
    for (const m of c.matchers) {
      caseLines.push(
        `WHEN json_extract("data", ?) ${
          m.condition === "equals" ? "=" : "LIKE"
        } ? THEN ?`,
      );
      placeholders.push(m.query, m.value, c.categoryName);
    }
  }

  const categorySection = caseLines.length > 0
    ? `
    CASE
      ${caseLines.join("\n")}
    END as category
  `
    : "null as category";

  const query = `
    SELECT
      id, description, amount, timestamp, data,
      ${categorySection}
    FROM transactions
    ORDER BY "timestamp" desc
  `;

  return getDb().query(query, placeholders).map((r) => ({
    id: r[0],
    description: r[1],
    amount: r[2],
    timestamp: r[3],
    data: JSON.parse(r[4] as string),
    category: r[5],
  } as CategorizedTransaction));
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
      id TEXT,
      description TEXT,
      amount INTEGER,
      timestamp INTEGER,
      data TEXT
    )
  `);
}
