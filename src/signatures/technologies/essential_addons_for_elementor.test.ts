import { describe, it, expect } from "vitest";
import { applySignature } from "../../analyzer/apply.js";
import type { Context, Response } from "../../browser/types.js";
import { essentialAddonsForElementorSignature } from "./essential_addons_for_elementor.js";

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

describe("essentialAddonsForElementorSignature", () => {
  describe("body matching", () => {
    it("detects Essential Addons for Elementor from a <link> stylesheet under the uploads path", () => {
      const context = createMockContext({
        responses: [
          createMockResponse({
            body: '<link rel="stylesheet" href="/wp-content/uploads/essential-addons-elementor/style.css">',
          }),
        ],
      });

      const result = applySignature(
        context,
        essentialAddonsForElementorSignature,
      );
      expect(result).toBeDefined();
    });
  });
});
