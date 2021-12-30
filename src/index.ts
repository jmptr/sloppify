import yargs from "yargs";
import { buildCommand } from "./commands";

yargs
  .scriptName("jute")
  .usage("$0 <cmd> [args]")
  .env("SHOPIFY")
  .command("*", "Default command", () => {
    console.info("Default command.  Use --help to see all commands");
  })
  .command({
    command: "build",
    describe: "build something",
    builder: {
      shop: {
        alias: "s",
        demandOption: true,
        describe: "Store name",
      },
      accessToken: {
        alias: "t",
        demandOption: true,
        describe: "Access Token",
      },
    },
    handler: buildCommand,
  })
  .help().argv;
