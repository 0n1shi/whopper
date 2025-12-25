import { Command } from "commander";
import { VERSION } from "../cli.js";

export const versionCommand = (): Command => {
  return new Command("version")
    .description("Displays the current version of the CLI tool.")
    .action(() => {
      console.log(VERSION);
    });
};
