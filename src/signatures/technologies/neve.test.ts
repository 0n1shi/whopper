import { describe, it, expect } from "vitest";
import { applySignature } from "../../analyzer/apply.js";
import type { Context, Response } from "../../browser/types.js";
import { neveSignature } from "./neve.js";

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

describe("neveSignature", () => {
  describe("body matching", () => {
    it("detects Neve from neve-theme class", () => {
      const context = createMockContext({
        responses: [
          createMockResponse({
            body: '<body class="neve-theme"></body>',
          }),
        ],
      });

      const result = applySignature(context, neveSignature);
      expect(result).toBeDefined();
    });

    it("detects Neve from neve*.css reference", () => {
      const context = createMockContext({
        responses: [
          createMockResponse({
            body: '<link rel="stylesheet" href="/wp-content/themes/neve/style.min.css">',
          }),
        ],
      });

      const result = applySignature(context, neveSignature);
      expect(result).toBeDefined();
    });

    it("does not detect Neve from unrelated hyphen-suffixed class names", () => {
      const context = createMockContext({
        responses: [
          createMockResponse({
            body: '<div class="my-neve-theme-wrapper"></div>',
          }),
        ],
      });

      const result = applySignature(context, neveSignature);
      expect(result).toBeUndefined();
    });
  });

  describe("url matching", () => {
    it("detects Neve from themes/neve JS URL with version", () => {
      const context = createMockContext({
        responses: [
          createMockResponse({
            url: "https://example.com/wp-content/themes/neve/assets/js/frontend.js?ver=3.5.0",
          }),
        ],
      });

      const result = applySignature(context, neveSignature);
      expect(result).toBeDefined();
      expect(result?.evidences?.some((e) => e.version === "3.5.0")).toBe(true);
    });
  });
});
