import { readLines } from "https://deno.land/std@0.95.0/io/bufio.ts";

import { login, getAccountContracts } from './sources/bbva.ts';

async function main() {
    const creds = await askCredentials();
    const auth = await login(creds.username, creds.password);
    const contracts = await getAccountContracts(auth);
    console.log(contracts);
}

async function askCredentials() {
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
