import { chromium } from "playwright";
import type { Context, Response } from "./types.js";
import { sleep } from "./utils.js";
import { logger } from "../logger/index.js";

export async function openPage(
  url: string,
  timeoutMs: number,
  javascriptVariableNames: string[],
): Promise<Context> {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    ignoreHTTPSErrors: true,
  });
  const page = await context.newPage();

  const responses: Response[] = [];
  page.on("response", async (response) => {
    logger.debug(`Received response: ${response.url()} - ${response.status()}`);
    const res: Response = {
      url: response.url(),
      status: response.status(),
      headers: response.headers(),
    };

    const body = await response.text().catch(() => null);
    if (body) {
      res.body = body;
    }

    responses.push(res);
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

  const javascriptVariables = await page.evaluate((jsVarNames: string[]) => {
    const vars: Record<string, any> = {};
    const resolvePath = (root: any, path: string): unknown => {
      const parts = path.split(".");
      let current = root;

      for (const part of parts) {
        if (current == null) return undefined;
        current = current[part];
      }
      return current;
    };

    for (const name of jsVarNames) {
      try {
        vars[name] = undefined; // Default to undefined

        const val = resolvePath(window, name);
        if (!val) continue;

        if (
          typeof val === "string" ||
          typeof val === "number" ||
          typeof val === "boolean"
        ) {
          vars[name] = val;
        }

        if (typeof val === "object") {
          try {
            JSON.stringify(val);
            vars[name] = val;
          } catch {
            // Skip non-serializable objects
          }
        }
      } catch {
        // Some properties may throw errors when accessed
      }
    }
    return vars;
  }, javascriptVariableNames);

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
