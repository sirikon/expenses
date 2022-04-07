import { exists } from "std/fs/mod.ts";
import { dirname } from "std/path/mod.ts";
import { Categorization } from "../core/models.ts";

export async function get(): Promise<Categorization> {
  const path = "categorization.json";
  if (!await exists(path)) return [];

  const decoder = new TextDecoder();
  const data = decoder.decode(await Deno.readFile(path));

  return JSON.parse(data);
}

export async function save(categorization: Categorization) {
  const path = "categorization.json";

  const encoder = new TextEncoder();
  const data = encoder.encode(JSON.stringify(categorization, null, 2));

  await Deno.mkdir(dirname(path), { recursive: true });
  await Deno.writeFile(path, data);
}
