export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
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
