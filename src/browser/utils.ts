export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Resolves a dot-notated path on an object (e.g., "window.jQuery.fn.jquery")
 */
export function resolvePath(root: unknown, path: string): unknown {
  const parts = path.split(".");
  let current: unknown = root;

  for (const part of parts) {
    if (current == null) return undefined;
    current = (current as Record<string, unknown>)[part];
  }
  return current;
}

/**
 * Extracts JavaScript variables from a window-like object.
 * Used inside page.evaluate() to extract values from the browser context.
 */
export function extractJsVariables(
  windowObj: unknown,
  varNames: string[],
): Record<string, unknown> {
  const vars: Record<string, unknown> = {};

  for (const name of varNames) {
    try {
      vars[name] = undefined;

      const val = resolvePath(windowObj, name);
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
}
