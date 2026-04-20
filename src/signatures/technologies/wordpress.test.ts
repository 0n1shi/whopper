import { describe, it, expect } from "vitest";
import { applySignature } from "../../analyzer/apply.js";
import type { Context, Response } from "../../browser/types.js";
import { wordpressSignature } from "./wordpress.js";

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

describe("wordpressSignature", () => {
  describe("body matching", () => {
    it("captures version from meta generator with space separator", () => {
      const context = createMockContext({
        responses: [
          createMockResponse({
            body: '<meta name="generator" content="WordPress 6.4.2">',
          }),
        ],
      });

      const result = applySignature(context, wordpressSignature);
      expect(result).toBeDefined();
      expect(result?.evidences?.some((e) => e.version === "6.4.2")).toBe(true);
    });

    it("captures version from slash-separated form (e.g. WordPress/6.4.2)", () => {
      const context = createMockContext({
        responses: [
          createMockResponse({
            body: "Powered by WordPress/6.4.2",
          }),
        ],
      });

      const result = applySignature(context, wordpressSignature);
      expect(result).toBeDefined();
      expect(result?.evidences?.some((e) => e.version === "6.4.2")).toBe(true);
    });

    it("captures version with v prefix (WordPress v6.4.2)", () => {
      const context = createMockContext({
        responses: [
          createMockResponse({
            body: "WordPress v6.4.2",
          }),
        ],
      });

      const result = applySignature(context, wordpressSignature);
      expect(result).toBeDefined();
      expect(result?.evidences?.some((e) => e.version === "6.4.2")).toBe(true);
    });

    it("does not miscapture version from an unrelated script on the same page", () => {
      const context = createMockContext({
        responses: [
          createMockResponse({
            body: '<link href="/wp-content/themes/foo/style.css"><script src="/jquery-3.2.1.min.js"></script>',
          }),
        ],
      });

      const result = applySignature(context, wordpressSignature);
      expect(result).toBeDefined();
      expect(result?.evidences?.every((e) => e.version !== "3.2.1")).toBe(true);
    });

    it("detects WordPress by wp-content reference alone (no version)", () => {
      const context = createMockContext({
        responses: [
          createMockResponse({
            body: '<link href="/wp-content/themes/twentytwentyfour/style.css">',
          }),
        ],
      });

      const result = applySignature(context, wordpressSignature);
      expect(result).toBeDefined();
    });
  });
});
