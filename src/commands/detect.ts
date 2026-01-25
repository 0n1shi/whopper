import { Command } from "commander";
import { openPage } from "../browser/index.js";
import { analyze } from "../analyzer/index.js";
import { signatures } from "../signatures/index.js";
import { logger, setLogLevel } from "../logger/index.js";
import { LogLevel } from "../logger/types.js";
import chalk from "chalk";
import { getJavascriptVariableNames } from "../signatures/utils.js";
import {
  makeDetectCommandOutput,
  printDetectCommandOutputAsJSON,
  printDetectCommandOutputAsText,
} from "./detect_utils.js";

export const detectCommand = (): Command => {
  return new Command("detect")
    .argument("<url>", "URL of the website to analyze")
    .description("Detects technologies used on the specified website URL.")
    .option(
      "-t, --timeout <ms>",
      "Timeout in milliseconds",
      (v) => Number(v),
      10000,
    )
    .option("-d, --debug", "Enable debug logging", false)
    .option("-e, --evidence", "Show evidence for detections", false)
    .option("-j, --json", "Output results in JSON format", false)
    .action(
      async (
        url: string,
        options: {
          timeout: number;
          debug: boolean;
          evidence: boolean;
          json: boolean;
        },
      ) => {
        if (options.debug) {
          setLogLevel(LogLevel.DEBUG);
        }
        logger.info(`Starting detection for ${chalk.cyan(url)}`);
        logger.info(
          "Timeout set to " +
          chalk.yellow(`${options.timeout.toLocaleString("en-US")}ms`),
        );

        let context: Awaited<ReturnType<typeof openPage>> | null = null;
        try {
          context = await openPage(
            url,
            options.timeout,
            getJavascriptVariableNames(signatures),
          );
          const detections = analyze(context, signatures);
          if (detections.length === 0) {
            logger.info("No technologies detected.");
          } else {
            const output = makeDetectCommandOutput(detections, signatures);
            if (options.json) {
              printDetectCommandOutputAsJSON(output);
            } else {
              printDetectCommandOutputAsText(output, options.evidence);
            }
          }
        } catch (error) {
          const message =
            error instanceof Error ? error.message : String(error);
          if (
            message.includes("Executable doesn't exist") ||
            message.includes("playwright install")
          ) {
            logger.error(
              "Playwright browsers are not installed. Please run: " +
              chalk.yellow("npx playwright install"),
            );
          } else {
            logger.error(`Detection failed: ${message.split("\n")[0]}`);
          }
          process.exitCode = 1;
          return;
        } finally {
          if (context) {
            await context.page.close();
            await context.browser.close();
          }
        }
      },
    );
};
