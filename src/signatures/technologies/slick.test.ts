import { describe, it, expect } from "vitest";
import { applySignature } from "../../analyzer/apply.js";
import type { Context, Response } from "../../browser/types.js";
import { slickSignature } from "./slick.js";

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
    headers: {},
    body: "",
    ...overrides,
  };
}

describe("slickSignature", () => {
  describe("URL matching", () => {
    it("should detect Slick with version from slick-carousel CDN path", () => {
      const context = createMockContext({
        responses: [
          createMockResponse({
            url: "https://cdn.example.com/libs/slick-carousel/1.8.1/slick.min.js",
          }),
        ],
      });

      const result = applySignature(context, slickSignature);
      expect(result).toBeDefined();
      expect(result?.evidences?.some((e) => e.version === "1.8.1")).toBe(true);
    });

    it("should detect Slick with version from slick-carousel npm path", () => {
      const context = createMockContext({
        responses: [
          createMockResponse({
            url: "https://cdn.example.com/npm/slick-carousel@1.8.1/slick/slick.min.js",
          }),
        ],
      });

      const result = applySignature(context, slickSignature);
      expect(result).toBeDefined();
      expect(result?.evidences?.some((e) => e.version === "1.8.1")).toBe(true);
    });

    it("should detect Slick presence without capturing unrelated parent-directory version", () => {
      const context = createMockContext({
        responses: [
          createMockResponse({
            url: "https://cdn.example.com/libs/1.8.1/slick.min.js",
          }),
        ],
      });

      const result = applySignature(context, slickSignature);
      expect(result).toBeDefined();
      expect(result?.evidences?.every((e) => e.version === undefined)).toBe(true);
    });

    it("should detect Slick without version", () => {
      const context = createMockContext({
        responses: [
          createMockResponse({
            url: "https://example.com/js/slick.min.js",
          }),
        ],
      });

      const result = applySignature(context, slickSignature);
      expect(result).toBeDefined();
      expect(result?.evidences?.[0]?.version).toBeUndefined();
    });

    it("should detect Slick from non-minified file", () => {
      const context = createMockContext({
        responses: [
          createMockResponse({
            url: "https://example.com/js/slick.js",
          }),
        ],
      });

      const result = applySignature(context, slickSignature);
      expect(result).toBeDefined();
    });

    it("should not detect Slick from plugin URLs", () => {
      const context = createMockContext({
        responses: [
          createMockResponse({
            url: "https://cdn.example.com/libs/some-plugin/1.0.0/slick-lightbox.min.js",
          }),
        ],
      });

      const result = applySignature(context, slickSignature);
      expect(result).toBeUndefined();
    });
  });

  describe("body matching", () => {
    it("captures version from slick-carousel CDN link", () => {
      const context = createMockContext({
        responses: [
          createMockResponse({
            url: "https://example.com",
            headers: { "content-type": "text/html" },
            body: '<link rel="stylesheet" href="https://cdn.example.com/npm/slick-carousel@1.8.1/slick/slick-theme.css">',
          }),
        ],
      });

      const result = applySignature(context, slickSignature);
      expect(result).toBeDefined();
      expect(result?.evidences?.some((e) => e.version === "1.8.1")).toBe(true);
    });

    it("captures slick-carousel version without miscapturing jQuery version from earlier in the body", () => {
      const context = createMockContext({
        responses: [
          createMockResponse({
            url: "https://example.com",
            headers: { "content-type": "text/html" },
            body: '<script src="/js/jquery-3.2.1.min.js"></script><link rel="stylesheet" href="https://cdn.example.com/slick-carousel/1.8.1/slick-theme.css">',
          }),
        ],
      });

      const result = applySignature(context, slickSignature);
      expect(result).toBeDefined();
      expect(result?.evidences?.some((e) => e.version === "1.8.1")).toBe(true);
      expect(result?.evidences?.every((e) => e.version !== "3.2.1")).toBe(true);
    });
  });
});
