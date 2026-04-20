import { describe, it, expect } from "vitest";
import { applySignature } from "../../analyzer/apply.js";
import type { Context, Response } from "../../browser/types.js";
import { mediaWikiSignature } from "./mediawiki.js";

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

describe("mediaWikiSignature", () => {
  describe("body matching", () => {
    it("captures clean version string from meta generator", () => {
      const context = createMockContext({
        responses: [
          createMockResponse({
            body: '<meta name="generator" content="MediaWiki 1.39.0" />',
          }),
        ],
      });

      const result = applySignature(context, mediaWikiSignature);
      expect(result).toBeDefined();
      expect(result?.evidences?.some((e) => e.version === "1.39.0")).toBe(true);
    });

    it("does not include trailing markup in captured version", () => {
      const context = createMockContext({
        responses: [
          createMockResponse({
            body: '<meta name="generator" content="MediaWiki 1.39.0"/><meta name="robots" content="foo">',
          }),
        ],
      });

      const result = applySignature(context, mediaWikiSignature);
      expect(result).toBeDefined();
      expect(
        result?.evidences?.every(
          (e) => e.version === undefined || !e.version.includes("<"),
        ),
      ).toBe(true);
      expect(
        result?.evidences?.every(
          (e) => e.version === undefined || !e.version.includes(">"),
        ),
      ).toBe(true);
    });

    it("detects MediaWiki by body class", () => {
      const context = createMockContext({
        responses: [
          createMockResponse({
            body: '<body class="mediawiki"></body>',
          }),
        ],
      });

      const result = applySignature(context, mediaWikiSignature);
      expect(result).toBeDefined();
    });
  });
});
