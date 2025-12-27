import chalk from "chalk";

export const LogLevel = {
  DEBUG: 10,
  INFO: 20,
  WARN: 30,
  ERROR: 40,
} as const;

export type LogLevelName = keyof typeof LogLevel;

export const LogLevelLabels: { [key in LogLevelName]: string } = {
  DEBUG: chalk.green("DEBUG"),
  INFO: chalk.blue("INFO"),
  WARN: chalk.yellow("WARN"),
  ERROR: chalk.red("ERROR"),
};
