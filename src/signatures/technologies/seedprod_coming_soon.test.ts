import { describe, it, expect } from "vitest";
import { applySignature } from "../../analyzer/apply.js";
import type { Context, Response } from "../../browser/types.js";
import { seedprodComingSoonSignature } from "./seedprod_coming_soon.js";

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

describe("seedprodComingSoonSignature", () => {
  describe("body matching", () => {
    it("detects SeedProd Coming Soon from a <link> stylesheet under the plugin path", () => {
      const context = createMockContext({
        responses: [
          createMockResponse({
            body: '<link rel="stylesheet" href="/wp-content/plugins/coming-soon/public/css/coming-soon.css">',
          }),
        ],
      });

      const result = applySignature(context, seedprodComingSoonSignature);
      expect(result).toBeDefined();
    });
  });
});
