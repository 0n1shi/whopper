import { describe, it, expect } from "vitest";
import { applySignature } from "../../analyzer/apply.js";
import type { Context, Response } from "../../browser/types.js";
import { highlightSignature } from "./highlight_js.js";

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

describe("highlightSignature", () => {
  describe("URL matching", () => {
    it("captures full version from cdnjs URL", () => {
      const context = createMockContext({
        responses: [
          createMockResponse({
            url: "https://cdn.example.com/ajax/libs/highlight.js/11.9.0/highlight.min.js",
          }),
        ],
      });

      const result = applySignature(context, highlightSignature);
      expect(result).toBeDefined();
      expect(result?.evidences?.some((e) => e.version === "11.9.0")).toBe(true);
    });

    it("captures version from cdn-release URL (highlightjs/cdn-release@version)", () => {
      const context = createMockContext({
        responses: [
          createMockResponse({
            url: "https://cdn.example.com/gh/highlightjs/cdn-release@11.9.0/build/highlight.min.js",
          }),
        ],
      });

      const result = applySignature(context, highlightSignature);
      expect(result).toBeDefined();
      expect(result?.evidences?.some((e) => e.version === "11.9.0")).toBe(true);
    });

    it("does not capture version from unrelated parent directory", () => {
      const context = createMockContext({
        responses: [
          createMockResponse({
            url: "https://example.com/libs/5.6.7/highlight.min.js",
          }),
        ],
      });

      const result = applySignature(context, highlightSignature);
      expect(result).toBeDefined();
      expect(result?.evidences?.every((e) => e.version !== "5.6.7")).toBe(true);
    });

    it("detects self-hosted presence without version", () => {
      const context = createMockContext({
        responses: [
          createMockResponse({
            url: "https://example.com/js/highlight.min.js",
          }),
        ],
      });

      const result = applySignature(context, highlightSignature);
      expect(result).toBeDefined();
    });
  });
});
