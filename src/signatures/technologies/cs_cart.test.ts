import { describe, it, expect } from "vitest";
import { applySignature } from "../../analyzer/apply.js";
import type { Context, Response } from "../../browser/types.js";
import { csCartSignature } from "./cs_cart.js";

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

describe("csCartSignature", () => {
  describe("body matching", () => {
    it("detects CS Cart from an <a> footer credit link to cs-cart.com", () => {
      const context = createMockContext({
        responses: [
          createMockResponse({
            body: '<a href="https://www.cs-cart.com/" target="_blank">Powered by CS-Cart</a>',
          }),
        ],
      });

      const result = applySignature(context, csCartSignature);
      expect(result).toBeDefined();
    });
  });
});
