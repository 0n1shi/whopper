import { Command } from "commander";
import { createRequire } from "module";
import { detectCommand } from "./commands/detect.js";
import { versionCommand } from "./commands/version.js";
import { banner } from "./commands/banner.js";

const require = createRequire(import.meta.url);
const pkg = require("../package.json") as { version: string };

const NAME = "whopper";
const DESCRIPTION =
  "A CLI tool that discovers and detects web technologies used on websites.";
export const VERSION = pkg.version;

function buildCLI(): Command {
  const program = new Command()
    .name(NAME)
    .description(DESCRIPTION)
    .version(VERSION)
    .showHelpAfterError()
    .showSuggestionAfterError();

  // Register commands here
  program.addCommand(detectCommand());
  program.addCommand(versionCommand());

  return program;
}

export function run(argv: string[]): void {
  console.error(banner(VERSION));
  buildCLI().parse(argv);
}
