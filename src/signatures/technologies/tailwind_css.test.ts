import { describe, it, expect } from "vitest";
import { applySignature } from "../../analyzer/apply.js";
import type { Context, Response } from "../../browser/types.js";
import { tailwindCssSignature } from "./tailwind_css.js";

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

describe("tailwindCssSignature", () => {
  describe("body matching", () => {
    it("detects Tailwind from --tw-* CSS custom properties", () => {
      const context = createMockContext({
        responses: [
          createMockResponse({
            body: ".foo{--tw-rotate: 45deg; transform: rotate(var(--tw-rotate));}",
          }),
        ],
      });

      const result = applySignature(context, tailwindCssSignature);
      expect(result).toBeDefined();
    });

    it("detects Tailwind from CDN link with version", () => {
      const context = createMockContext({
        responses: [
          createMockResponse({
            body: '<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/tailwindcss@3.4.0/base.min.css">',
          }),
        ],
      });

      const result = applySignature(context, tailwindCssSignature);
      expect(result).toBeDefined();
      expect(result?.evidences?.some((e) => e.version === "3.4.0")).toBe(true);
    });

    it("detects Tailwind from href containing 'tailwind'", () => {
      const context = createMockContext({
        responses: [
          createMockResponse({
            body: '<link rel="stylesheet" href="/assets/tailwind.min.css">',
          }),
        ],
      });

      const result = applySignature(context, tailwindCssSignature);
      expect(result).toBeDefined();
    });

    it("does not detect Tailwind from a generic stylesheet link", () => {
      const context = createMockContext({
        responses: [
          createMockResponse({
            body: '<link rel="stylesheet" id="wp-block-library-css" href="/assets/block-library.css">',
          }),
        ],
      });

      const result = applySignature(context, tailwindCssSignature);
      expect(result).toBeUndefined();
    });
  });
});
