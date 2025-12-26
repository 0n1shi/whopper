import { chromium, type Browser, type Page } from "playwright";
import type { Response } from "./types.js";
import { sleep } from "./utils.js";
import { logger } from "../logger/index.js";

export type Context = {
  browser: Browser;
  page: Page;
  responses: Response[];
  timeoutMs: number;
  timeoutOccurred: boolean;
};

export async function openPage(
  url: string,
  timeoutMs: number,
): Promise<Context> {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  const responses: Response[] = [];
  page.on("response", (response) => {
    responses.push({
      url: response.url(),
      status: response.status(),
      headers: response.headers(),
    });
  });

  let timeoutOccurred = false;
  const goto = page.goto(url, { waitUntil: "networkidle" });

  const result = await Promise.race([
    goto.then(() => "loaded").catch((e) => e.message),
    sleep(timeoutMs).then(() => "timeout"),
  ]);

  if (result === "loaded") {
    logger.info(`Page loaded successfully: ${url}`);
  } else if (result === "timeout") {
    timeoutOccurred = true;
    logger.warn(`Timeout of ${timeoutMs}ms exceeded while loading ${url}`);
  } else {
    logger.error(`Error loading page ${url}: ${result.split("\n")[0]}`);
  }

  return {
    browser,
    page,
    responses,
    timeoutMs,
    timeoutOccurred,
  };
}
