import { describe, it, expect } from "vitest";
import { applySignature } from "../../analyzer/apply.js";
import type { Context, Response } from "../../browser/types.js";
import { fooGallerySignature } from "./foogallery.js";

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

describe("fooGallerySignature", () => {
  describe("body matching", () => {
    it("captures version from FooGallery CSS link", () => {
      const context = createMockContext({
        responses: [
          createMockResponse({
            body: '<link href="/wp-content/plugins/foogallery/assets/gallery.css?ver=2.3.1">',
          }),
        ],
      });

      const result = applySignature(context, fooGallerySignature);
      expect(result).toBeDefined();
      expect(result?.evidences?.some((e) => e.version === "2.3.1")).toBe(true);
    });

    it("does not miscapture version from a different plugin loaded after FooGallery", () => {
      const context = createMockContext({
        responses: [
          createMockResponse({
            body: '<link href="/wp-content/plugins/foogallery/assets/gallery.css?ver=2.3.1"><link href="/wp-content/plugins/other-plugin/style.css?ver=9.9.9">',
          }),
        ],
      });

      const result = applySignature(context, fooGallerySignature);
      expect(result).toBeDefined();
      expect(result?.evidences?.every((e) => e.version !== "9.9.9")).toBe(true);
      expect(result?.evidences?.some((e) => e.version === "2.3.1")).toBe(true);
    });

    it("detects presence when no version query is present", () => {
      const context = createMockContext({
        responses: [
          createMockResponse({
            body: '<link href="/wp-content/plugins/foogallery/gallery.css">',
          }),
        ],
      });

      const result = applySignature(context, fooGallerySignature);
      expect(result).toBeDefined();
    });
  });
});
