import { describe, it, expect } from "vitest";
import { applySignature } from "../../analyzer/apply.js";
import type { Context, Response } from "../../browser/types.js";
import { astraSignature } from "./astra.js";

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

describe("astraSignature", () => {
  describe("body matching", () => {
    it("detects Astra from astra-theme class", () => {
      const context = createMockContext({
        responses: [
          createMockResponse({
            body: '<body class="astra-theme"></body>',
          }),
        ],
      });

      const result = applySignature(context, astraSignature);
      expect(result).toBeDefined();
    });

    it("does not detect Astra from unrelated class substrings", () => {
      const context = createMockContext({
        responses: [
          createMockResponse({
            body: '<div class="my-astra-theme-wrapper"></div>',
          }),
        ],
      });

      const result = applySignature(context, astraSignature);
      expect(result).toBeUndefined();
    });
  });

  describe("url matching", () => {
    it("detects Astra from themes/astra JS URL with version", () => {
      const context = createMockContext({
        responses: [
          createMockResponse({
            url: "https://example.com/wp-content/themes/astra/assets/js/frontend.js?ver=3.0.0",
          }),
        ],
      });

      const result = applySignature(context, astraSignature);
      expect(result).toBeDefined();
      expect(result?.evidences?.some((e) => e.version === "3.0.0")).toBe(true);
    });
  });
});
