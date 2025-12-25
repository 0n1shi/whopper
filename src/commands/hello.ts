import { Command } from "commander";
import chalk from "chalk";

type Options = {
  name?: string;
};

export const helloCommand = (): Command => {
  return new Command("hello")
    .description("Prints a greeting message")
    .option("-n, --name <name>", "Name to greet")
    .action((options: Options) => {
      const name = options.name || "World";
      console.log(chalk.green(`Hello, ${name}!`));
    });
};
