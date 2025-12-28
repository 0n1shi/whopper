import { Command } from "commander";
import { openPage } from "../browser/index.js";
import { analyze } from "../analyzer/index.js";
import { signatures } from "../signatures/index.js";
import { logger, setLogLevel } from "../logger/index.js";
import { LogLevel } from "../logger/types.js";
import chalk from "chalk";
import type { Confidence } from "../signatures/_types.js";
import { getJavascriptVariableNames } from "../signatures/utils.js";

function colorizeConfidence(confidence: Confidence): string {
  switch (confidence) {
    case "high":
      return chalk.green(confidence);
    case "medium":
      return chalk.yellow(confidence);
    case "low":
      return chalk.red(confidence);
    default:
      return confidence;
  }
}

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
    .action(
      async (url: string, options: { timeout: number; debug: boolean }) => {
        if (options.debug) {
          setLogLevel(LogLevel.DEBUG);
        }
        logger.info(
          `Starting detection for ${url} with timeout ${options.timeout}ms`,
        );
        const context = await openPage(
          url,
          options.timeout,
          getJavascriptVariableNames(signatures),
        );
        const detections = analyze(context, signatures);

        if (detections.length === 0) {
          logger.info("No technologies detected.");
        }

        console.log();
        for (const detection of detections) {
          let message = `* ${chalk.green(detection.name)}`;
          const versions = [
            ...new Set(
              detection.evidences.map((e) => e.version).filter((v) => v),
            ),
          ];
          if (versions.length > 0) {
            message += ` ${chalk.green(versions.join(", "))}`;
          }
          message += ` (Confidence: ${colorizeConfidence(detection.confidence)})`;
          console.log(message);
          for (const evidence of detection.evidences) {
            console.log(`  [${evidence.type}] ${evidence.value}`);
          }
        }
        await context.page.close();
        await context.browser.close();
      },
    );
};
