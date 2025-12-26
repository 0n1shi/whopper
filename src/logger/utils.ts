import chalk from "chalk";

export function timeStamp(): string {
  return new Date().toISOString();
}

export const LogLevel = {
  DEBUG: chalk.gray("DEBUG"),
  INFO: chalk.blue("INFO"),
  WARN: chalk.yellow("WARN"),
  ERROR: chalk.red("ERROR"),
} as const;
