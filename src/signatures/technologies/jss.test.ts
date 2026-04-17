import { describe, it, expect } from "vitest";
import { applySignature } from "../../analyzer/apply.js";
import type { Context, Response } from "../../browser/types.js";
import { jssSignature } from "./jss.js";

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

describe("jssSignature", () => {
  describe("body matching", () => {
    it("detects JSS from data-jss attribute", () => {
      const context = createMockContext({
        responses: [
          createMockResponse({
            body: '<style data-jss="">.foo{}</style>',
          }),
        ],
      });

      const result = applySignature(context, jssSignature);
      expect(result).toBeDefined();
    });

    it("does not detect JSS from unrelated hyphenated attribute names", () => {
      const context = createMockContext({
        responses: [
          createMockResponse({
            body: '<div class="my-data-jss-wrapper" other-data-jss-x="y"></div>',
          }),
        ],
      });

      const result = applySignature(context, jssSignature);
      expect(result).toBeUndefined();
    });
  });
});
