import type { APIRequestContext } from "playwright";
import { logger } from "../logger/index.js";
import type { Response } from "./types.js";
import { getHostFromUrl, isFirstPartyHost, isSameHost } from "./utils.js";

export function isRelativePath(path: string): boolean {
  return !/^[a-z][a-z0-9+.-]*:/i.test(path) && !path.startsWith("//");
}

const MAX_REDIRECT_HOPS = 3;

function isRedirectStatus(status: number): boolean {
  return status >= 300 && status < 400;
}

export async function fetchActiveRule(
  baseUrl: string,
  path: string,
  request: APIRequestContext,
  timeoutMs: number,
): Promise<Response | null> {
  if (!isRelativePath(path)) {
    logger.warn(`Active scan path must be relative: ${path}`);
    return null;
  }

  let url: string;
  try {
    url = new URL(path, baseUrl).toString();
  } catch {
    logger.warn(`Invalid active scan baseUrl or path: baseUrl=${baseUrl}, path=${path}`);
    return null;
  }

  const pageHost = getHostFromUrl(baseUrl) ?? "";
  try {
    for (let hop = 0; hop <= MAX_REDIRECT_HOPS; hop++) {
      logger.info(`Active scan request: ${url}`);
      const res = await request.get(url, {
        timeout: timeoutMs,
        maxRedirects: 0,
      });
      const status = res.status();
      const location = res.headers()["location"];
      if (isRedirectStatus(status) && location) {
        if (hop === MAX_REDIRECT_HOPS) {
          logger.warn(`Active scan exceeded redirect limit: ${url}`);
          return null;
        }
        let nextUrl: string;
        try {
          nextUrl = new URL(location, url).toString();
        } catch {
          logger.warn(`Active scan invalid redirect location: ${location}`);
          return null;
        }
        const nextHost = getHostFromUrl(nextUrl) ?? "";
        if (!nextHost || !isSameHost(pageHost, nextHost)) {
          logger.warn(
            `Active scan redirect to non-same-host blocked: ${nextUrl}`,
          );
          return null;
        }
        url = nextUrl;
        continue;
      }

      const host = getHostFromUrl(url) ?? "";
      const body = await res.text().catch(() => "");
      return {
        url,
        host,
        isFirstParty: host ? isFirstPartyHost(pageHost, host) : false,
        status,
        headers: res.headers(),
        body,
      };
    }
    return null;
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    logger.warn(
      `Active scan fetch failed (${url}): ${message.split("\n")[0]}`,
    );
    return null;
  }
}
