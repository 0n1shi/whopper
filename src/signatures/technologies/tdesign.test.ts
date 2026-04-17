import { describe, it, expect } from "vitest";
import { applySignature } from "../../analyzer/apply.js";
import type { Context, Response } from "../../browser/types.js";
import { tdesignSignature } from "./tdesign.js";

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

describe("tdesignSignature", () => {
  describe("body matching", () => {
    it("detects TDesign from t-button__text class", () => {
      const context = createMockContext({
        responses: [
          createMockResponse({
            body: '<div class="t-button__text">Click</div>',
          }),
        ],
      });

      const result = applySignature(context, tdesignSignature);
      expect(result).toBeDefined();
    });

    it("detects TDesign from t-layout class", () => {
      const context = createMockContext({
        responses: [
          createMockResponse({
            body: '<section class="t-layout"></section>',
          }),
        ],
      });

      const result = applySignature(context, tdesignSignature);
      expect(result).toBeDefined();
    });

    it("does not detect TDesign from unrelated suffixed class names", () => {
      const context = createMockContext({
        responses: [
          createMockResponse({
            body: '<article class="post-layout post-button__text"></article>',
          }),
        ],
      });

      const result = applySignature(context, tdesignSignature);
      expect(result).toBeUndefined();
    });

    it("does not detect TDesign from hyphen-prefixed class names", () => {
      const context = createMockContext({
        responses: [
          createMockResponse({
            body: '<div class="post-t-layout-wrapper"></div>',
          }),
        ],
      });

      const result = applySignature(context, tdesignSignature);
      expect(result).toBeUndefined();
    });
  });

  describe("url matching", () => {
    it("detects TDesign from tdesign.gtimg.com CDN", () => {
      const context = createMockContext({
        responses: [
          createMockResponse({
            url: "https://tdesign.gtimg.com/cdn/tdesign.min.css",
          }),
        ],
      });

      const result = applySignature(context, tdesignSignature);
      expect(result).toBeDefined();
    });
  });
});
