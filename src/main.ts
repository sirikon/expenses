import { readLines } from "std/io/bufio.ts";

import { login, getAccountContracts, Credentials } from '@/sources/bbva.ts';

async function main() {
    const credentials = await askCredentials();
    const auth = await login(credentials);
    const contracts = await getAccountContracts(auth);
    console.log(contracts);
}

async function askCredentials(): Promise<Credentials> {
    return {
        username: await ask('Username'),
        password: await ask('Password')
    }
}

async function ask(description: string): Promise<string> {
    Deno.stdout.write(new TextEncoder().encode(`${description}: `));
    for await (const line of readLines(Deno.stdin)) {
        if (line === '') continue;
        return line;
    }
    return '';
}

await main();
