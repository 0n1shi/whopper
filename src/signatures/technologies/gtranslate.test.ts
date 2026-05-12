import { describe, it, expect } from "vitest";
import { applySignature } from "../../analyzer/apply.js";
import type { Context, Response } from "../../browser/types.js";
import { gtranslateSignature } from "./gtranslate.js";

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

describe("gtranslateSignature", () => {
  describe("body matching", () => {
    it("detects GTranslate from a <link> stylesheet under the plugin path", () => {
      const context = createMockContext({
        responses: [
          createMockResponse({
            body: '<link rel="stylesheet" href="/wp-content/plugins/gtranslate/gtranslate-style24.css">',
          }),
        ],
      });

      const result = applySignature(context, gtranslateSignature);
      expect(result).toBeDefined();
    });

    it("detects GTranslate from a <script> tag under the plugin path", () => {
      const context = createMockContext({
        responses: [
          createMockResponse({
            body: '<script src="/wp-content/plugins/gtranslate/main.js"></script>',
          }),
        ],
      });

      const result = applySignature(context, gtranslateSignature);
      expect(result).toBeDefined();
    });

    it("detects GTranslate from an <img> tag under the plugin path", () => {
      const context = createMockContext({
        responses: [
          createMockResponse({
            body: '<img src="/wp-content/plugins/gtranslate/flags.png" alt="flags">',
          }),
        ],
      });

      const result = applySignature(context, gtranslateSignature);
      expect(result).toBeDefined();
    });
  });
});
