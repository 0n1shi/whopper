import { describe, it, expect } from "vitest";
import { applySignature } from "../../analyzer/apply.js";
import type { Context, Response } from "../../browser/types.js";
import { metismenuSignature } from "./metismenu.js";

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

describe("metismenuSignature", () => {
  describe("URL matching", () => {
    it("captures version from cdnjs URL", () => {
      const context = createMockContext({
        responses: [
          createMockResponse({
            url: "https://cdn.example.com/ajax/libs/metisMenu/3.0.7/metisMenu.min.js",
          }),
        ],
      });

      const result = applySignature(context, metismenuSignature);
      expect(result).toBeDefined();
      expect(result?.evidences?.some((e) => e.version === "3.0.7")).toBe(true);
    });

    it("captures version from metismenujs@version npm path", () => {
      const context = createMockContext({
        responses: [
          createMockResponse({
            url: "https://cdn.example.com/npm/metismenujs@3.0.7/dist/metismenujs.min.js",
          }),
        ],
      });

      const result = applySignature(context, metismenuSignature);
      expect(result).toBeDefined();
      expect(result?.evidences?.some((e) => e.version === "3.0.7")).toBe(true);
    });

    it("does not treat cache-buster query string as version", () => {
      const context = createMockContext({
        responses: [
          createMockResponse({
            url: "https://example.com/js/metisMenu.min.js?20240101",
          }),
        ],
      });

      const result = applySignature(context, metismenuSignature);
      expect(result).toBeDefined();
      expect(
        result?.evidences?.every((e) => e.version !== "20240101"),
      ).toBe(true);
    });

    it("detects self-hosted presence without version", () => {
      const context = createMockContext({
        responses: [
          createMockResponse({
            url: "https://example.com/js/metisMenu.min.js",
          }),
        ],
      });

      const result = applySignature(context, metismenuSignature);
      expect(result).toBeDefined();
    });
  });
});
