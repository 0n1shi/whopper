import { describe, it, expect } from "vitest";
import { applySignature } from "../../analyzer/apply.js";
import type { Context, Response } from "../../browser/types.js";
import { jqueryUiSignature } from "./jquery_ui.js";

function createMockContext(
  overrides: Partial<Pick<Context, "responses">> = {},
): Context {
  return {
    browser: {} as Context["browser"],
    page: {} as Context["page"],
    urls: [],
    responses: [],
    cookies: [],
    javascriptVariables: {},
    timeoutMs: 30000,
    timeoutOccurred: false,
    ...overrides,
  };
}

function createMockResponse(overrides: Partial<Response> = {}): Response {
  return {
    url: "https://example.com",
    host: "example.com",
    isFirstParty: true,
    status: 200,
    headers: { "content-type": "text/html" },
    body: "",
    ...overrides,
  };
}

describe("jqueryUiSignature", () => {
  describe("URL matching", () => {
    it("captures version from cdnjs (jqueryui) path", () => {
      const context = createMockContext({
        responses: [
          createMockResponse({
            url: "https://cdn.example.com/ajax/libs/jqueryui/1.13.2/jquery-ui.min.js",
          }),
        ],
      });

      const result = applySignature(context, jqueryUiSignature);
      expect(result).toBeDefined();
      expect(result?.evidences?.some((e) => e.version === "1.13.2")).toBe(true);
    });

    it("captures version from code.jquery.com/ui path", () => {
      const context = createMockContext({
        responses: [
          createMockResponse({
            url: "https://code.jquery.com/ui/1.13.2/jquery-ui.min.js",
          }),
        ],
      });

      const result = applySignature(context, jqueryUiSignature);
      expect(result).toBeDefined();
      expect(result?.evidences?.some((e) => e.version === "1.13.2")).toBe(true);
    });

    it("does not capture version from an unrelated parent directory", () => {
      const context = createMockContext({
        responses: [
          createMockResponse({
            url: "https://example.com/libs/5.6.7/jquery-ui/script.js",
          }),
        ],
      });

      const result = applySignature(context, jqueryUiSignature);
      expect(result).toBeDefined();
      expect(result?.evidences?.every((e) => e.version !== "5.6.7")).toBe(true);
    });

    it("detects self-hosted jquery-ui.js presence", () => {
      const context = createMockContext({
        responses: [
          createMockResponse({
            url: "https://example.com/js/jquery-ui.min.js",
          }),
        ],
      });

      const result = applySignature(context, jqueryUiSignature);
      expect(result).toBeDefined();
    });
  });
});
