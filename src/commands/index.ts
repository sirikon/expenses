import { exists } from "std/fs/mod.ts";
import { DB } from "sqlite/mod.ts";

export default async function indexCommand() {
  const config = await getConfig();
  await removeDatabase();
  const db = createDatabase();
  createTransactionsTable(db);

  for await (const file of Deno.readDir("transactions")) {
    const transaction = JSON.parse(
      await readFile(`./transactions/${file.name}`),
    );

    db.query(
      `
        INSERT INTO transactions (id, description, shop_id, amount, date)
        VALUES (?, ?, ?, ?, ?)
        `,
      [
        transaction.id,
        getDescription(transaction),
        matchShop(config, getDescription(transaction)),
        transaction.amount.amount,
        new Date(transaction.transactionDate).toISOString(),
      ],
    );
  }
}

const DB_FILE_NAME = "./transactions_index.db";
async function removeDatabase() {
  if (!await exists(DB_FILE_NAME)) return;
  await Deno.remove(DB_FILE_NAME);
}

function createDatabase(): DB {
  return new DB(DB_FILE_NAME);
}

function createTransactionsTable(db: DB) {
  db.query(`
    CREATE TABLE transactions (
        id TEXT PRIMARY KEY,
        description TEXT,
        shop_id TEXT NULL,
        amount REAL,
        date TEXT
    )
    `);
}

function getDescription(transaction: any) {
  return transaction.cardTransactionDetail?.shop.name ||
    transaction.humanConceptName ||
    transaction.name;
}

function matchShop(config: any, description: string): string | null {
  for (const shopId of Object.keys(config.match.shop)) {
    const shopMatchers = config.match.shop[shopId];
    for (const shopMatcher of shopMatchers) {
      if (new RegExp(shopMatcher, "i").test(description)) {
        return shopId;
      }
    }
  }
  return null;
}

async function readFile(path: string): Promise<string> {
  const decoder = new TextDecoder("utf-8");
  const data = await Deno.readFile(path);
  return decoder.decode(data);
}

async function getConfig(): Promise<any> {
  return JSON.parse(await readFile("./config.json"));
}
