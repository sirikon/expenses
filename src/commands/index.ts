import { DB } from "sqlite/mod.ts";

export default async function indexCommand() {
    await removeDatabase();
    const db = createDatabase();
    createTransactionsTable(db);

    for await (const file of Deno.readDir('transactions')) {
        const transaction = JSON.parse(await readFile(`./transactions/${file.name}`));

        db.query(`
            INSERT INTO transactions (id, description, shop_id, shop_name, amount, date)
            VALUES (?, ?, ?, ?, ?, ?)
        `, [
            transaction.id,
            transaction.humanConceptName || transaction.name,
            parseInt(transaction.cardTransactionDetail?.shop.id) || null,
            transaction.cardTransactionDetail?.shop.name,
            transaction.amount.amount,
            new Date(transaction.transactionDate).toISOString()
        ]);
    }
}

const DB_FILE_NAME = "./transactions_index.db"
async function removeDatabase() {
    await Deno.remove(DB_FILE_NAME)
}

function createDatabase(): DB {
    return new DB(DB_FILE_NAME);
}

function createTransactionsTable(db: DB) {
    db.query(`
        CREATE TABLE transactions (
            id TEXT PRIMARY KEY,
            description TEXT,
            shop_id INTEGER NULL,
            shop_name TEXT NULL,
            amount REAL,
            date TEXT
        )
    `);
}

async function readFile(path: string): Promise<string> {
    const decoder = new TextDecoder("utf-8");
    const data = await Deno.readFile(path);
    return decoder.decode(data);
}
