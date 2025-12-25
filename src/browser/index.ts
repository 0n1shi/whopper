import { chromium, type Browser, type Page } from "playwright";
import type { Response } from "./types.js";

export type Context = {
  browser: Browser;
  page: Page;
  responses: Response[];
};

export async function openPage(url: string): Promise<Context> {
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

  await page.goto(url, { timeout: 10000 });

  return { browser, page, responses };
}
