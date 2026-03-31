import { describe, it, expect } from "vitest";
import { applySignature } from "../../analyzer/apply.js";
import type { Context, Response } from "../../browser/types.js";
import { jquerySignature } from "./jquery.js";

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

describe("jquerySignature", () => {
  describe("URL matching", () => {
    it("should detect jQuery with version from CDN path", () => {
      const context = createMockContext({
        responses: [
          createMockResponse({
            url: "https://cdn.example.com/libs/jquery/3.6.0/jquery.min.js",
          }),
        ],
      });

      const result = applySignature(context, jquerySignature);
      expect(result).toBeDefined();
      expect(result?.evidences?.some((e) => e.version === "3.6.0")).toBe(true);
    });

    it("should detect jQuery with version from filename", () => {
      const context = createMockContext({
        responses: [
          createMockResponse({
            url: "https://example.com/js/jquery-3.6.0.min.js",
          }),
        ],
      });

      const result = applySignature(context, jquerySignature);
      expect(result).toBeDefined();
      expect(result?.evidences?.[0]?.version).toBe("3.6.0");
    });

    it("should detect jQuery without version", () => {
      const context = createMockContext({
        responses: [
          createMockResponse({
            url: "https://example.com/js/jquery.min.js",
          }),
        ],
      });

      const result = applySignature(context, jquerySignature);
      expect(result).toBeDefined();
      expect(result?.evidences?.[0]?.version).toBeUndefined();
    });

    it("should detect jQuery slim variant", () => {
      const context = createMockContext({
        responses: [
          createMockResponse({
            url: "https://example.com/js/jquery.slim.min.js",
          }),
        ],
      });

      const result = applySignature(context, jquerySignature);
      expect(result).toBeDefined();
    });

    it("should not detect jQuery from plugin URLs", () => {
      const context = createMockContext({
        responses: [
          createMockResponse({
            url: "https://cdn.example.com/libs/some-plugin/1.1.0/jquery.some-plugin.min.js",
          }),
        ],
      });

      const result = applySignature(context, jquerySignature);
      expect(result).toBeUndefined();
    });

    it("should not detect jQuery from jQuery plugin URL with dot notation", () => {
      const context = createMockContext({
        responses: [
          createMockResponse({
            url: "https://example.com/js/jquery.some-plugin.min.js",
          }),
        ],
      });

      const result = applySignature(context, jquerySignature);
      expect(result).toBeUndefined();
    });

    it("should not detect jQuery from jQuery plugin URL with hyphen notation", () => {
      const context = createMockContext({
        responses: [
          createMockResponse({
            url: "https://example.com/js/jquery-some-plugin-1.12.0.min.js",
          }),
        ],
      });

      const result = applySignature(context, jquerySignature);
      expect(result).toBeUndefined();
    });
  });
});
