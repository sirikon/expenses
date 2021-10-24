import { dirname, join as joinPath } from "std/path/mod.ts";

export async function save(sourceId: string, auth: unknown) {
  const path = joinPath("credentials", `${sourceId}.json`);

  const encoder = new TextEncoder();
  const data = encoder.encode(JSON.stringify(auth, null, 2));

  await Deno.mkdir(dirname(path), { recursive: true });
  await Deno.writeFile(path, data);
}
