import { Command } from "commander";
import { helloCommand } from "./commands/hello.js";

const NAME = "whopper";
const DESCRIPTION =
  "A CLI tool that discovers and detects web technologies used on websites.";
const VERSION = "0.1.0";

export const buildCommand = (): Command => {
  const program = new Command();
  program.name(NAME).description(DESCRIPTION).version(VERSION);

  program.addCommand(helloCommand());

  program.showHelpAfterError(true);
  program.showSuggestionAfterError(true);

  return program;
};

export const run = (argv: string[]): void => {
  buildCommand().parse(argv);
};
