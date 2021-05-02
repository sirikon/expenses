import { exists } from "std/fs/mod.ts";

import { Auth, getAccountContracts } from "@/sources/bbva.ts";

export default async function collectCommand() {
    const auth = await getAuth();
    const contracts = await getAccountContracts(auth);
    console.log(contracts);
}

async function getAuth(): Promise<Auth> {
    if (!await exists('./auth.json')) {
        throw new Error('Auth not found. Login first.');
    }
    return JSON.parse(await getFileContent('./auth.json'));
}

async function getFileContent(path: string): Promise<string> {
    const decoder = new TextDecoder("utf-8");
    const data = await Deno.readFile(path);
    return decoder.decode(data);
}
