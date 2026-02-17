import { chromium } from "playwright";
import type { Context, Response } from "./types.js";
import {
  sleep,
  extractJsVariables,
  getHostFromUrl,
  isFirstPartyHost,
} from "./utils.js";
import { logger } from "../logger/index.js";

export async function openPage(
  url: string,
  timeoutMs: number,
  javascriptVariableNames: string[],
): Promise<Context> {
  const pageHost = getHostFromUrl(url);
  if (!pageHost) {
    throw new Error(`Invalid URL: ${url}`);
  }

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    ignoreHTTPSErrors: true,
  });
  const page = await context.newPage();

  const responses: Response[] = [];
  page.on("response", async (response) => {
    const responseUrl = response.url();
    const responseHost = getHostFromUrl(responseUrl) ?? "";
    logger.debug(`Received response: ${responseUrl} - ${response.status()}`);
    const res: Response = {
      url: responseUrl,
      host: responseHost,
      isFirstParty: responseHost
        ? isFirstPartyHost(pageHost, responseHost)
        : false,
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
    logger.info("Page loaded successfully");
  } else if (result === "timeout") {
    timeoutOccurred = true;
    logger.warn(`Timeout of ${timeoutMs}ms exceeded while loading ${url}`);
  } else {
    logger.error(`Error loading page ${url}: ${result.split("\n")[0]}`);
  }

  let cookies: Context["cookies"] = [];
  let javascriptVariables: Record<string, unknown> = {};

  try {
    cookies = (await page.context().cookies()).map((cookie) => {
      const cookieHost = cookie.domain.replace(/^\./, "").toLowerCase();
      return {
        host: cookieHost,
        isFirstParty: isFirstPartyHost(pageHost, cookieHost),
        name: cookie.name,
        value: cookie.value,
        domain: cookie.domain,
        path: cookie.path,
        expires: cookie.expires,
        httpOnly: cookie.httpOnly,
        secure: cookie.secure,
        sameSite: cookie.sameSite,
      };
    });

    javascriptVariables = await page.evaluate(
      ({ varNames, extractFn }) => {
        // Re-create the function in browser context
        const fn = new Function("return " + extractFn)();
        return fn(window, varNames);
      },
      {
        varNames: javascriptVariableNames,
        extractFn: extractJsVariables.toString(),
      },
    );
  } catch {
    logger.warn(
      "Failed to extract cookies or JavaScript variables (page context may have been destroyed)",
    );
  }

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
