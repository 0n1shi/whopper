import { describe, it, expect } from "vitest";
import { applySignature } from "../../analyzer/apply.js";
import type { Context, Response } from "../../browser/types.js";
import { animateCssSignature } from "./animate_css.js";

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
    headers: { "content-type": "text/css" },
    body: "",
    ...overrides,
  };
}

describe("animateCssSignature", () => {
  describe("URL matching", () => {
    it("captures version from cdnjs (animate.css/version/) URL", () => {
      const context = createMockContext({
        responses: [
          createMockResponse({
            url: "https://cdn.example.com/ajax/libs/animate.css/4.1.1/animate.min.css",
          }),
        ],
      });

      const result = applySignature(context, animateCssSignature);
      expect(result).toBeDefined();
      expect(result?.evidences?.some((e) => e.version === "4.1.1")).toBe(true);
    });

    it("captures version from npm animate.css@version path", () => {
      const context = createMockContext({
        responses: [
          createMockResponse({
            url: "https://cdn.example.com/npm/animate.css@4.1.1/animate.min.css",
          }),
        ],
      });

      const result = applySignature(context, animateCssSignature);
      expect(result).toBeDefined();
      expect(result?.evidences?.some((e) => e.version === "4.1.1")).toBe(true);
    });

    it("does not capture version from an unrelated parent directory", () => {
      const context = createMockContext({
        responses: [
          createMockResponse({
            url: "https://example.com/libs/5.6.7/animate.min.css",
          }),
        ],
      });

      const result = applySignature(context, animateCssSignature);
      expect(result).toBeDefined();
      expect(result?.evidences?.every((e) => e.version !== "5.6.7")).toBe(true);
    });

    it("detects self-hosted presence without version", () => {
      const context = createMockContext({
        responses: [
          createMockResponse({
            url: "https://example.com/css/animate.min.css",
          }),
        ],
      });

      const result = applySignature(context, animateCssSignature);
      expect(result).toBeDefined();
    });
  });
});
