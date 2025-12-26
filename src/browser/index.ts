import { chromium, type Browser, type Page } from "playwright";
import type { Response } from "./types.js";
import { sleep } from "./utils.js";

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

  await Promise.race([
    goto.catch(() => {
      timeoutOccurred = true;
    }),
    sleep(timeoutMs),
  ]);

  return {
    browser,
    page,
    responses,
    timeoutMs,
    timeoutOccurred,
  };
}
