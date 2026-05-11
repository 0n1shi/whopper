import { describe, it, expect } from "vitest";
import { applySignature } from "../../analyzer/apply.js";
import type { Context, Response } from "../../browser/types.js";
import { flyingPagesSignature } from "./flying_pages.js";

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

describe("flyingPagesSignature", () => {
  describe("body matching", () => {
    it("detects Flying Pages from a <link> tag under the plugin path", () => {
      const context = createMockContext({
        responses: [
          createMockResponse({
            body: '<link rel="preload" href="/wp-content/plugins/flying-pages/flying-pages.min.js" as="script">',
          }),
        ],
      });

      const result = applySignature(context, flyingPagesSignature);
      expect(result).toBeDefined();
    });
  });
});
