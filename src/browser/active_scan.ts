import type { APIRequestContext } from "playwright";
import { logger } from "../logger/index.js";
import type { Response } from "./types.js";
import { getHostFromUrl, isFirstPartyHost } from "./utils.js";

export function isRelativePath(path: string): boolean {
  return !/^[a-z][a-z0-9+.-]*:/i.test(path) && !path.startsWith("//");
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
  logger.info(`Active scan request: ${url}`);
  try {
    const res = await request.get(url, {
      timeout: timeoutMs,
      maxRedirects: 0,
    });
    const host = getHostFromUrl(url) ?? "";
    const body = await res.text().catch(() => "");
    return {
      url,
      host,
      isFirstParty: host ? isFirstPartyHost(pageHost, host) : false,
      status: res.status(),
      headers: res.headers(),
      body,
    };
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    logger.warn(
      `Active scan fetch failed (${url}): ${message.split("\n")[0]}`,
    );
    return null;
  }
}
