import { chromium } from "playwright";
import type { Context, Response } from "./types.js";
import { sleep } from "./utils.js";
import { logger } from "../logger/index.js";

export async function openPage(
  url: string,
  timeoutMs: number,
): Promise<Context> {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  const responses: Response[] = [];
  page.on("response", (response) => {
    logger.debug(`Received response: ${response.url()} - ${response.status()}`);
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

  const cookies = (await page.context().cookies()).map((cookie) => ({
    name: cookie.name,
    value: cookie.value,
    domain: cookie.domain,
    path: cookie.path,
    expires: cookie.expires,
    httpOnly: cookie.httpOnly,
    secure: cookie.secure,
    sameSite: cookie.sameSite,
  }));

  const javascriptVariables = await page.evaluate(() => {
    const vars: Record<string, any> = {};
    for (const path of Object.keys(window)) {
      try {
        const val = (window as any)[path];
        if (!val) continue;

        // Only capture primitive types and objects
        if (
          typeof val === "string" ||
          typeof val === "number" ||
          typeof val === "boolean"
        ) {
          vars[path] = val;
        }

        if (typeof val === "object") {
          try {
            JSON.stringify(val);
            vars[path] = val;
          } catch {
            // Skip non-serializable objects
          }
        }
      } catch (e) {
        // Some properties may throw errors when accessed
      }
    }
    return vars;
  });

  return {
    browser,
    page,
    responses,
    javascriptVariables,
    cookies,
    timeoutMs,
    timeoutOccurred,
  };
}
