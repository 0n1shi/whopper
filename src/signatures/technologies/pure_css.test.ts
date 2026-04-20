import { describe, it, expect } from "vitest";
import { applySignature } from "../../analyzer/apply.js";
import type { Context, Response } from "../../browser/types.js";
import { pureCssSignature } from "./pure_css.js";

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

describe("pureCssSignature", () => {
  describe("body matching", () => {
    it("captures full version from npm (purecss@version) link", () => {
      const context = createMockContext({
        responses: [
          createMockResponse({
            body: '<link href="https://cdn.example.com/npm/purecss@2.0.6/build/pure-min.css">',
          }),
        ],
      });

      const result = applySignature(context, pureCssSignature);
      expect(result).toBeDefined();
      expect(result?.evidences?.some((e) => e.version === "2.0.6")).toBe(true);
    });

    it("captures version from cdnjs (/pure/version/) link", () => {
      const context = createMockContext({
        responses: [
          createMockResponse({
            body: '<link href="https://cdn.example.com/ajax/libs/pure/2.0.6/pure-min.css">',
          }),
        ],
      });

      const result = applySignature(context, pureCssSignature);
      expect(result).toBeDefined();
      expect(result?.evidences?.some((e) => e.version === "2.0.6")).toBe(true);
    });

    it("detects self-hosted presence without version", () => {
      const context = createMockContext({
        responses: [
          createMockResponse({
            body: '<link href="/css/pure-min.css">',
          }),
        ],
      });

      const result = applySignature(context, pureCssSignature);
      expect(result).toBeDefined();
    });

    it("detects presence via pure-u grid class", () => {
      const context = createMockContext({
        responses: [
          createMockResponse({
            body: '<div class="pure-u-1-2"></div>',
          }),
        ],
      });

      const result = applySignature(context, pureCssSignature);
      expect(result).toBeDefined();
    });
  });
});
