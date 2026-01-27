import { Command } from "commander";
import { detectCommand } from "./commands/detect.js";
import { versionCommand } from "./commands/version.js";
import { banner } from "./commands/banner.js";

const NAME = "whopper";
const DESCRIPTION =
  "A CLI tool that discovers and detects web technologies used on websites.";
export const VERSION = "0.1.1";

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
