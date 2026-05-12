import { describe, it, expect } from "vitest";
import { applySignature } from "../../analyzer/apply.js";
import type { Context, Response } from "../../browser/types.js";
import { intercomSignature } from "./intercom.js";

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

describe("intercomSignature", () => {
  describe("body matching", () => {
    it("detects Intercom from a <link> preconnect to widget.intercom.io", () => {
      const context = createMockContext({
        responses: [
          createMockResponse({
            body: '<link rel="preconnect" href="https://widget.intercom.io">',
          }),
        ],
      });

      const result = applySignature(context, intercomSignature);
      expect(result).toBeDefined();
    });

    it("detects Intercom from an <a> link to widget.intercom.io", () => {
      const context = createMockContext({
        responses: [
          createMockResponse({
            body: '<a href="https://widget.intercom.io/widget/abc123">Chat</a>',
          }),
        ],
      });

      const result = applySignature(context, intercomSignature);
      expect(result).toBeDefined();
    });
  });
});
