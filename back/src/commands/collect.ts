import { ensureDir, exists } from "std/fs/mod.ts";

import { Auth, getAccountContracts, getTransactions } from "@/sources/bbva.ts";

export default async function collectCommand() {
  const auth = await getAuth();
  const contracts = await getAccountContracts(auth);
  const transactions = await getTransactions(auth, contracts);
  await ensureDir("./transactions");
  for (const transaction of transactions) {
    await setFileContent(
      `./transactions/${transaction.id}.json`,
      JSON.stringify(transaction, null, 2),
    );
  }
}

async function getAuth(): Promise<Auth> {
  if (!await exists("./auth.json")) {
    throw new Error("Auth not found. Login first.");
  }
  return JSON.parse(await getFileContent("./auth.json"));
}

async function getFileContent(path: string): Promise<string> {
  const decoder = new TextDecoder("utf-8");
  const data = await Deno.readFile(path);
  return decoder.decode(data);
}

async function setFileContent(path: string, content: string): Promise<void> {
  const encoder = new TextEncoder();
  const data = encoder.encode(content);
  await Deno.writeFile(path, data);
}
