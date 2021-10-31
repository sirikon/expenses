import { dirname, join as joinPath } from "std/path/mod.ts";
import { SourceAuth } from "../core/models.ts";

export async function get(sourceId: string): Promise<SourceAuth> {
  const path = joinPath("credentials", `${sourceId}.json`);

  const decoder = new TextDecoder();
  const data = decoder.decode(await Deno.readFile(path))

  return JSON.parse(data)
}

export async function save(sourceId: string, auth: SourceAuth) {
  const path = joinPath("credentials", `${sourceId}.json`);

  const encoder = new TextEncoder();
  const data = encoder.encode(JSON.stringify(auth, null, 2));

  await Deno.mkdir(dirname(path), { recursive: true });
  await Deno.writeFile(path, data);
}
