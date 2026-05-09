import { describe, it, expect } from "vitest";
import { applySignature } from "../../analyzer/apply.js";
import type { Context, Response } from "../../browser/types.js";
import { swiperSignature } from "./swiper.js";

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

describe("swiperSignature", () => {
  describe("body matching", () => {
    it("detects Swiper from the version banner comment", () => {
      const context = createMockContext({
        responses: [
          createMockResponse({
            body: "/**\n * Swiper 11.1.14\n * Most modern mobile touch slider\n */",
          }),
        ],
      });

      const result = applySignature(context, swiperSignature);
      expect(result).toBeDefined();
      expect(result?.evidences?.some((e) => e.version === "11.1.14")).toBe(
        true,
      );
    });

    it("does not detect Swiper from prose that merely mentions the product name", () => {
      const context = createMockContext({
        responses: [
          createMockResponse({
            body: "<p>We compared Swiper and other carousel libraries on our blog.</p>",
          }),
        ],
      });

      const result = applySignature(context, swiperSignature);
      expect(result).toBeUndefined();
    });
  });

  describe("URL matching", () => {
    it("detects Swiper from CDN URL with version", () => {
      const context = createMockContext({
        responses: [
          createMockResponse({
            url: "https://cdn.example.com/swiper@11.1.14/swiper-bundle.min.js",
          }),
        ],
      });

      const result = applySignature(context, swiperSignature);
      expect(result).toBeDefined();
      expect(result?.evidences?.some((e) => e.version === "11.1.14")).toBe(
        true,
      );
    });
  });
});
