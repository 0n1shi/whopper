import { RedirectPolicy } from "./types.js";

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function normalizeHostname(hostname: string): string {
  return hostname.toLowerCase().replace(/\.$/, "");
}

const commonSecondLevelTlds = new Set([
  "co.jp",
  "ne.jp",
  "or.jp",
  "go.jp",
  "ac.jp",
  "co.uk",
  "org.uk",
  "gov.uk",
  "co.kr",
  "com.au",
  "com.br",
  "co.nz",
]);

function toRegistrableDomain(hostname: string): string {
  const parts = hostname.split(".").filter((part) => part.length > 0);
  if (parts.length <= 2) {
    return hostname;
  }

  const lastTwo = parts.slice(-2).join(".");

  if (commonSecondLevelTlds.has(lastTwo) && parts.length >= 3) {
    return parts.slice(-3).join(".");
  }

  return lastTwo;
}

export function getHostFromUrl(url: string): string | undefined {
  try {
    return normalizeHostname(new URL(url).hostname);
  } catch {
    return undefined;
  }
}

export function isFirstPartyHost(
  pageHost: string,
  candidateHost: string,
): boolean {
  const base = normalizeHostname(pageHost);
  const candidate = normalizeHostname(candidateHost);
  if (!base || !candidate) {
    return false;
  }

  if (base === candidate) {
    return true;
  }

  return toRegistrableDomain(base) === toRegistrableDomain(candidate);
}

export function isRedirectAllowed(
  sourceHost: string,
  targetHost: string,
  policy: RedirectPolicy,
): boolean {
  if (policy === RedirectPolicy.Any) {
    return true;
  }
  if (policy === RedirectPolicy.SameHost) {
    return normalizeHostname(sourceHost) === normalizeHostname(targetHost);
  }

  return isFirstPartyHost(sourceHost, targetHost);
}

/**
 * Extracts JavaScript variables from a window-like object.
 * Used inside page.evaluate() to extract values from the browser context.
 * NOTE: This function must be self-contained (no external dependencies)
 * because it gets serialized and executed in the browser context.
 */
export function extractJsVariables(
  windowObj: unknown,
  varNames: string[],
): Record<string, unknown> {
  // Inline resolvePath to make this function self-contained for browser context
  function resolvePathInline(root: unknown, path: string): unknown {
    const parts = path.split(".");
    let current: unknown = root;

    for (const part of parts) {
      if (current == null) return undefined;
      current = (current as Record<string, unknown>)[part];
    }
    return current;
  }

  const vars: Record<string, unknown> = {};

  for (const name of varNames) {
    try {
      vars[name] = undefined;

      const val = resolvePathInline(windowObj, name);
      if (val === undefined || val === null) continue;

      if (
        typeof val === "string" ||
        typeof val === "number" ||
        typeof val === "boolean"
      ) {
        vars[name] = val;
      } else if (typeof val === "function") {
        // For functions like jQuery, try to get version info or mark as present
        vars[name] = "[Function]";
      } else if (typeof val === "object") {
        try {
          JSON.stringify(val);
          vars[name] = val;
        } catch {
          // Non-serializable object, mark as present
          vars[name] = "[Object]";
        }
      }
    } catch {
      // Some properties may throw errors when accessed
    }
  }
  return vars;
}
