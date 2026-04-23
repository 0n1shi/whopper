import { describe, it, expect } from "vitest";
import { applySignature } from "../../analyzer/apply.js";
import type { Context, Response } from "../../browser/types.js";
import { lodashSignature } from "./lodash.js";

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

describe("lodashSignature", () => {
  describe("URL matching", () => {
    it("should detect Lodash from CDN URL", () => {
      const context = createMockContext({
        responses: [
          createMockResponse({
            url: "https://cdn.example.com/libs/lodash/4.17.21/lodash.min.js",
          }),
        ],
      });

      const result = applySignature(context, lodashSignature);
      expect(result).toBeDefined();
      expect(result?.evidences?.[0]?.type).toBe("url");
    });

    it("should detect Lodash from filename", () => {
      const context = createMockContext({
        responses: [
          createMockResponse({
            url: "https://example.com/js/lodash.min.js",
          }),
        ],
      });

      const result = applySignature(context, lodashSignature);
      expect(result).toBeDefined();
    });
  });

  describe("JavaScript variable matching", () => {
    it("should detect Lodash when a lodash-only marker and _.VERSION are present", () => {
      const context = createMockContext({
        javascriptVariables: {
          "_.forOwn": "[Function]",
          "_.VERSION": "4.17.21",
        },
      });

      const result = applySignature(context, lodashSignature);
      expect(result).toBeDefined();
      expect(result?.evidences?.some((e) => e.version === "4.17.21")).toBe(
        true,
      );
    });

    it("should not detect Lodash when only _.VERSION is present", () => {
      const context = createMockContext({
        javascriptVariables: {
          "_.VERSION": "4.17.21",
        },
      });

      const result = applySignature(context, lodashSignature);
      expect(result).toBeUndefined();
    });

    it("should detect Lodash with version when URL matches and only _.VERSION is present", () => {
      const context = createMockContext({
        responses: [
          createMockResponse({
            url: "https://example.com/js/lodash.min.js",
          }),
        ],
        javascriptVariables: {
          "_.VERSION": "4.17.21",
        },
      });

      const result = applySignature(context, lodashSignature);
      expect(result).toBeDefined();
      expect(result?.evidences?.some((e) => e.type === "url")).toBe(true);
      expect(
        result?.evidences?.some(
          (e) => e.type === "script" && e.version === "4.17.21",
        ),
      ).toBe(true);
    });

    it("should detect Lodash when only the required lodash-only marker is present", () => {
      const context = createMockContext({
        javascriptVariables: {
          "_.forOwn": "[Function]",
        },
      });

      const result = applySignature(context, lodashSignature);
      expect(result).toBeDefined();
      expect(result?.evidences?.some((e) => e.type === "script")).toBe(true);
    });

    it("should detect Lodash core build when only core-build markers are present", () => {
      // lodash 4.x core build strips forOwn/forIn/merge but keeps thru/flattenDeep/concat/assignIn.
      const context = createMockContext({
        javascriptVariables: {
          "_.thru": "[Function]",
          "_.flattenDeep": "[Function]",
          "_.concat": "[Function]",
          "_.assignIn": "[Function]",
          "_.VERSION": "4.17.21",
        },
      });

      const result = applySignature(context, lodashSignature);
      expect(result).toBeDefined();
      expect(result?.evidences?.some((e) => e.version === "4.17.21")).toBe(
        true,
      );
    });
  });
});
