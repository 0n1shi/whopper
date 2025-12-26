import { LogLevel, timeStamp } from "./utils.js";

export const logger = {
  debug: (msg: string) => {
    console.error(`${timeStamp()} [${LogLevel.DEBUG}] ${msg}`);
  },
  info: (msg: string) => {
    console.error(`${timeStamp()} [${LogLevel.INFO}] ${msg}`);
  },
  warn: (msg: string) => {
    console.error(`${timeStamp()} [${LogLevel.WARN}] ${msg}`);
  },
  error: (msg: string) => {
    console.error(`${timeStamp()} [${LogLevel.ERROR}] ${msg}`);
  },
};
