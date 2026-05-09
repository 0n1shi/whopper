import { describe, it, expect } from "vitest";
import { applySignature } from "../../analyzer/apply.js";
import type { Context, Response } from "../../browser/types.js";
import { underscoreJsSignature } from "./underscore_js.js";

function createMockContext(
  overrides: Partial<Pick<Context, "responses" | "javascriptVariables">> = {},
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

describe("underscoreJsSignature", () => {
  describe("URL matching", () => {
    it("should detect Underscore.js from CDN URL", () => {
      const context = createMockContext({
        responses: [
          createMockResponse({
            url: "https://cdn.example.com/libs/underscore.min.js",
          }),
        ],
      });

      const result = applySignature(context, underscoreJsSignature);
      expect(result).toBeDefined();
      expect(result?.evidences?.[0]?.type).toBe("url");
    });

    it("should detect Underscore.js with version from query parameter", () => {
      const context = createMockContext({
        responses: [
          createMockResponse({
            url: "https://example.com/js/underscore.min.js?ver=1.13.6",
          }),
        ],
      });

      const result = applySignature(context, underscoreJsSignature);
      expect(result).toBeDefined();
      expect(result?.evidences?.some((e) => e.version === "1.13.6")).toBe(true);
    });
  });

  describe("JavaScript variable matching", () => {
    it("should detect Underscore.js when an underscore-only marker and _.VERSION are present", () => {
      const context = createMockContext({
        javascriptVariables: {
          "_.mapObject": "[Function]",
          "_.VERSION": "1.13.6",
        },
      });

      const result = applySignature(context, underscoreJsSignature);
      expect(result).toBeDefined();
      expect(result?.evidences?.some((e) => e.version === "1.13.6")).toBe(true);
    });

    it("should detect Underscore.js with version when URL matches and only _.VERSION is present", () => {
      const context = createMockContext({
        responses: [
          createMockResponse({
            url: "https://example.com/js/underscore.min.js",
          }),
        ],
        javascriptVariables: {
          "_.VERSION": "1.13.6",
        },
      });

      const result = applySignature(context, underscoreJsSignature);
      expect(result).toBeDefined();
      expect(result?.evidences?.some((e) => e.type === "url")).toBe(true);
      expect(
        result?.evidences?.some(
          (e) => e.type === "script" && e.version === "1.13.6",
        ),
      ).toBe(true);
    });

    it("should not detect Underscore.js when only _.VERSION is present", () => {
      const context = createMockContext({
        javascriptVariables: {
          "_.VERSION": "1.13.6",
        },
      });

      const result = applySignature(context, underscoreJsSignature);
      expect(result).toBeUndefined();
    });

    it("should detect Underscore.js when only the required underscore-only marker is present", () => {
      const context = createMockContext({
        javascriptVariables: {
          "_.mapObject": "[Function]",
        },
      });

      const result = applySignature(context, underscoreJsSignature);
      expect(result).toBeDefined();
      expect(result?.evidences?.some((e) => e.type === "script")).toBe(true);
    });
  });
});
