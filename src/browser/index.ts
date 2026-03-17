import chalk from "chalk";
import { chromium } from "playwright";
import { logger } from "../logger/index.js";
import type { Context, Response } from "./types.js";
import {
  extractJsVariables,
  getHostFromUrl,
  isFirstPartyHost,
  isSameHost,
  sleep,
} from "./utils.js";

const MAX_REDIRECT_HOPS = 20;

function colorizeStatusCode(statusCode: number): string {
  const code = String(statusCode);

  if (statusCode >= 100 && statusCode < 200) {
    return chalk.cyan(code);
  }
  if (statusCode >= 200 && statusCode < 300) {
    return chalk.green(code);
  }
  if (statusCode >= 300 && statusCode < 400) {
    return chalk.blue(code);
  }
  if (statusCode >= 400 && statusCode < 500) {
    return chalk.yellow(code);
  }
  if (statusCode >= 500 && statusCode < 600) {
    return chalk.red(code);
  }

  return chalk.gray(code);
}

export async function openPage(
  url: string,
  timeoutMs: number,
  javascriptVariableNames: string[],
  userAgent?: string,
  blockCrossDomainRedirect: boolean = false,
): Promise<Context> {
  const pageHost = getHostFromUrl(url);
  if (!pageHost) {
    throw new Error(`Invalid URL: ${url}`);
  }

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    ignoreHTTPSErrors: true,
    ...(userAgent ? { userAgent } : {}),
  });
  const page = await context.newPage();

  let blockedByRedirectPolicy = false;
  let lastNavigationUrl = url;
  let inspectedUrls = new Set<string>();
  let reentryCount = 0;
  const preInspectedUrls = new Set<string>();

  await page.route("**/*", async (route) => {
    const request = route.request();
    if (
      !request.isNavigationRequest() ||
      request.frame() !== page.mainFrame()
    ) {
      await route.continue();
      return;
    }

    const targetUrl = request.url();
    const targetHost = getHostFromUrl(targetUrl);
    if (!targetHost) {
      await route.continue();
      return;
    }

    // Skip URLs already inspected by the pre-inspection loop to prevent
    // infinite re-entry: fulfill(301) may cause the browser to re-invoke
    // this handler, and without this guard a circular redirect chain
    // would loop indefinitely outside the MAX_REDIRECT_HOPS limit.
    if (inspectedUrls.has(targetUrl)) {
      reentryCount++;
      if (reentryCount > MAX_REDIRECT_HOPS) {
        logger.warn("Too many redirect re-entries, aborting");
        await route.abort("failed");
        return;
      }
      await route.continue();
      return;
    }

    if (
      blockCrossDomainRedirect &&
      !isSameHost(pageHost, targetHost)
    ) {
      logger.warn(
        `Blocked cross-domain redirect: ${targetUrl}`,
      );
      blockedByRedirectPolicy = true;
      await route.abort("blockedbyclient");
      return;
    }

    // Log client-side redirects (JS / meta refresh)
    if (targetUrl !== lastNavigationUrl) {
      logger.info(
        `Following redirect: ${lastNavigationUrl} -> ${targetUrl}`,
      );
    }
    lastNavigationUrl = targetUrl;

    // New set per navigation so previous chains don't interfere,
    // but re-entry from the same chain still hits the guard above.
    inspectedUrls = new Set<string>();
    reentryCount = 0;

    // Fetch without following redirects so we can inspect each hop
    let currentUrl = targetUrl;
    let response;
    try {
      response = await route.fetch({ maxRedirects: 0 });
    } catch {
      await route.abort("failed");
      return;
    }

    // Pre-inspect the 3xx chain to log each hop and enforce the redirect
    // policy before the browser sees any response. After inspection we
    // fulfill with the *first* response so the browser follows the real
    // chain itself, preserving Set-Cookie headers, origin, and URL state.
    // URLs captured here are added to preInspectedUrls so that the
    // page.on("response") listener can skip them and avoid duplicates.
    const firstResponse = response;
    for (let hop = 0; hop < MAX_REDIRECT_HOPS && response.status() >= 300 && response.status() < 400; hop++) {
      // Capture intermediate 3xx responses so their headers (e.g. server,
      // x-powered-by) are available for analysis even though the browser
      // never sees these responses directly.
      const hopHost = getHostFromUrl(currentUrl) ?? "";
      preInspectedUrls.add(currentUrl);
      const hopBody = await response.text().catch(() => null);
      const hopResponse: Response = {
        url: currentUrl,
        host: hopHost,
        isFirstParty: hopHost ? isFirstPartyHost(pageHost, hopHost) : false,
        status: response.status(),
        headers: response.headers(),
      };
      if (hopBody) {
        hopResponse.body = hopBody;
      }
      responses.push(hopResponse);

      const location = response.headers()["location"];
      if (!location) break;

      let redirectUrl: string;
      try {
        redirectUrl = new URL(location, currentUrl).href;
      } catch {
        break;
      }

      const redirectHost = getHostFromUrl(redirectUrl);
      if (
        blockCrossDomainRedirect &&
        redirectHost &&
        !isSameHost(pageHost, redirectHost)
      ) {
        logger.warn(
          `Blocked cross-domain redirect: ${redirectUrl}`,
        );
        blockedByRedirectPolicy = true;
        await route.abort("blockedbyclient");
        return;
      }

      logger.info(`Following redirect: ${currentUrl} -> ${redirectUrl}`);
      lastNavigationUrl = redirectUrl;
      currentUrl = redirectUrl;
      inspectedUrls.add(redirectUrl);

      try {
        response = await route.fetch({ url: redirectUrl, maxRedirects: 0 });
      } catch {
        await route.abort("failed");
        return;
      }
    }

    await route.fulfill({ response: firstResponse });
  });

  const responses: Response[] = [];
  page.on("response", async (response) => {
    const responseUrl = response.url();
    const statusCode = response.status();

    // Skip responses already captured by the pre-inspection loop to
    // avoid duplicates.
    if (preInspectedUrls.has(responseUrl) && statusCode >= 300 && statusCode < 400) {
      logger.debug(
        `Skipping already captured response [${colorizeStatusCode(statusCode)}] ${responseUrl}`,
      );
      return;
    }

    const responseHost = getHostFromUrl(responseUrl) ?? "";
    logger.debug(
      `Received response [${colorizeStatusCode(statusCode)}] ${responseUrl}`,
    );
    const res: Response = {
      url: responseUrl,
      host: responseHost,
      isFirstParty: responseHost
        ? isFirstPartyHost(pageHost, responseHost)
        : false,
      status: statusCode,
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
  } else if (blockedByRedirectPolicy) {
    // Already logged by the route handler as "Blocked redirect by policy"
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
