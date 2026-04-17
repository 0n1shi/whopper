import { describe, it, expect } from "vitest";
import { applySignature } from "../../analyzer/apply.js";
import type { Context, Response } from "../../browser/types.js";
import { wpRoyalAsheSignature } from "./wp_royal_ashe.js";

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

describe("wpRoyalAsheSignature", () => {
  describe("body matching", () => {
    it("detects WP-Royal Ashe from ashe-style-css id", () => {
      const context = createMockContext({
        responses: [
          createMockResponse({
            body: '<link rel="stylesheet" id="ashe-style-css" href="/style.css">',
          }),
        ],
      });

      const result = applySignature(context, wpRoyalAsheSignature);
      expect(result).toBeDefined();
    });

    it("does not detect WP-Royal Ashe from unrelated hyphen-suffixed names", () => {
      const context = createMockContext({
        responses: [
          createMockResponse({
            body: '<div id="my-ashe-style-css-wrapper"></div>',
          }),
        ],
      });

      const result = applySignature(context, wpRoyalAsheSignature);
      expect(result).toBeUndefined();
    });
  });

  describe("url matching", () => {
    it("detects WP-Royal Ashe from themes/ashe path", () => {
      const context = createMockContext({
        responses: [
          createMockResponse({
            url: "https://example.com/wp-content/themes/ashe/style.css",
          }),
        ],
      });

      const result = applySignature(context, wpRoyalAsheSignature);
      expect(result).toBeDefined();
    });
  });
});
