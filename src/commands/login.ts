import { readLines } from "std/io/bufio.ts";

import { login, Credentials } from '@/sources/bbva.ts';

export default async function loginCommand() {
    const credentials = await askCredentials();
    const auth = await login(credentials);
    await setFileContent('./auth.json', JSON.stringify(auth, null, 2));
}

async function askCredentials(): Promise<Credentials> {
    const process = Deno.run({
        cmd: ['zenity', '--password', '--username', '--title=BBVA Credentials'],
        stdout: 'piped'
    })
    const processStatus = await process.status();
    if (processStatus.code > 0) {
        throw new Error(`Asking credentials failed with exit code ${processStatus.code}`);
    }
    const [username, password] = (new TextDecoder().decode(await process.output())).trim().split('|');
    return {
        username,
        password
    }
}

// async function askCredentials(): Promise<Credentials> {
//     return {
//         username: await ask('Username'),
//         password: await ask('Password')
//     }
// }

// async function ask(description: string): Promise<string> {
//     Deno.stdout.write(new TextEncoder().encode(`${description}: `));
//     for await (const line of readLines(Deno.stdin)) {
//         if (line === '') continue;
//         return line;
//     }
//     return '';
// }

async function setFileContent(path: string, content: string): Promise<void> {
    const encoder = new TextEncoder();
    const data = encoder.encode(content);
    await Deno.writeFile(path, data);
}
