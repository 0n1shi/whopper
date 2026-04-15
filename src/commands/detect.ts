import { Command } from "commander";
import { openPage } from "../browser/index.js";
import { analyze } from "../analyzer/index.js";
import { signatures } from "../signatures/index.js";
import { applyActiveScans } from "./active_scan_runner.js";
import { logger, setLogLevel } from "../logger/index.js";
import { LogLevel } from "../logger/types.js";
import chalk from "chalk";
import { getJavascriptVariableNames } from "../signatures/utils.js";
import {
  makeDetectCommandOutput,
  printDetectCommandOutputAsJSON,
  printDetectCommandOutputAsText,
} from "./detect_utils.js";

const HTTP_TOKEN = /^[!#$%&'*+\-.^_`|~0-9A-Za-z]+$/;

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
    .option("-u, --user-agent <string>", "Custom User-Agent string")
    .option("-l, --locale <locale>", "Browser locale (e.g. ja-JP, en-US)")
    .option(
      "-H, --header <header>",
      "Extra HTTP header (e.g. -H \"X-Custom: value\"), can be specified multiple times",
      (value: string, prev: string[]) => [...prev, value],
      [] as string[],
    )
    .option(
      "-b, --block-cross-domain-redirect",
      "Block redirects to a different host",
      false,
    )
    .option(
      "--idle-timeout <ms>",
      "Network idle threshold in milliseconds (default: 2000)",
      (v: string) => Number(v),
      2000,
    )
    .option(
      "-a, --active",
      "Enable active scanning (sends additional requests to technology-specific paths)",
      false,
    )
    .action(
      async (
        url: string,
        options: {
          timeout: number;
          debug: boolean;
          evidence: boolean;
          json: boolean;
          userAgent?: string;
          locale?: string;
          header: string[];
          blockCrossDomainRedirect: boolean;
          idleTimeout: number;
          active: boolean;
        },
      ) => {
        if (options.debug) {
          logger.info("Debug mode enabled");
          setLogLevel(LogLevel.DEBUG);
        }
        logger.info(`Starting detection for ${chalk.cyan(url)}`);
        logger.info(
          "Timeout set to " +
          chalk.yellow(`${options.timeout.toLocaleString("en-US")}ms`),
        );

        let context: Awaited<ReturnType<typeof openPage>> | null = null;
        try {
          const extraHTTPHeaders: Record<string, string> = {};
          for (const h of options.header) {
            const idx = h.indexOf(":");
            if (idx === -1) {
              logger.warn(`Invalid header (missing ':'): ${h}`);
              continue;
            }
            const name = h.slice(0, idx).trim();
            if (!HTTP_TOKEN.test(name)) {
              logger.warn(`Invalid header name: ${h}`);
              continue;
            }
            extraHTTPHeaders[name] = h.slice(idx + 1).trim();
          }

          context = await openPage(
            url,
            options.timeout,
            getJavascriptVariableNames(signatures),
            {
              userAgent: options.userAgent,
              locale: options.locale,
              extraHTTPHeaders: Object.keys(extraHTTPHeaders).length > 0
                ? extraHTTPHeaders
                : undefined,
              blockCrossDomainRedirect: options.blockCrossDomainRedirect,
              networkIdleThresholdMs: options.idleTimeout,
            },
          );
          const detections = analyze(context, signatures);

          if (options.active && detections.length > 0) {
            await applyActiveScans(
              context.page.url(),
              detections,
              signatures,
              context.page.context().request,
              options.timeout,
            );
          }

          const output = makeDetectCommandOutput(
            context.urls,
            detections,
            signatures,
          );
          if (detections.length === 0) {
            logger.info("No technologies detected.");
          }
          if (options.json) {
            printDetectCommandOutputAsJSON(output);
          } else if (detections.length > 0) {
            printDetectCommandOutputAsText(output, options.evidence);
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
