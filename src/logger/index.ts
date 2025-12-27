import { LogLevel, LogLevelLabels } from "./types.js";
import { timeStamp } from "./utils.js";

export let currentLogLevel: number = LogLevel.INFO;

export function setLogLevel(level: number): void {
  currentLogLevel = level;
}

function shouldLog(level: number): boolean {
  return level >= currentLogLevel;
}

export const logger = {
  debug: (msg: string) => {
    if (!shouldLog(LogLevel.DEBUG)) return;
    console.error(`${timeStamp()} [${LogLevelLabels.DEBUG}] ${msg}`);
  },
  info: (msg: string) => {
    if (!shouldLog(LogLevel.INFO)) return;
    console.error(`${timeStamp()} [${LogLevelLabels.INFO}] ${msg}`);
  },
  warn: (msg: string) => {
    if (!shouldLog(LogLevel.WARN)) return;
    console.error(`${timeStamp()} [${LogLevelLabels.WARN}] ${msg}`);
  },
  error: (msg: string) => {
    if (!shouldLog(LogLevel.ERROR)) return;
    console.error(`${timeStamp()} [${LogLevelLabels.ERROR}] ${msg}`);
  },
};
