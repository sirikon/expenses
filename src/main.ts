import loginCommand from "@/commands/login.ts";
import collectCommand from "@/commands/collect.ts";
import indexCommand from "@/commands/index.ts";

const commands: { [key: string]: (args: string[]) => Promise<void> } = {
  login: loginCommand,
  collect: collectCommand,
  index: indexCommand,
};

async function main(args: string[]) {
  if (args.length === 0) {
    console.log("Usage: expenses <command>");
    console.log("Commands:");
    Object.keys(commands).forEach((c) => console.log(`  ${c}`));
    return;
  }

  const [command, ...commandArgs] = args;
  if (!commands[command]) {
    console.log(`Unknown command ${command}`);
    return;
  }
  await commands[command](commandArgs);
}

await main(Deno.args);
