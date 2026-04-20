import { describe, it, expect } from "vitest";
import { applySignature } from "../../analyzer/apply.js";
import type { Context, Response } from "../../browser/types.js";
import { materialDesignLiteSignature } from "./material_design_lite.js";

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

describe("materialDesignLiteSignature", () => {
  describe("URL matching", () => {
    it("captures version from getmdl.io CDN", () => {
      const context = createMockContext({
        responses: [
          createMockResponse({
            url: "https://code.getmdl.io/1.3.0/material.min.js",
          }),
        ],
      });

      const result = applySignature(context, materialDesignLiteSignature);
      expect(result).toBeDefined();
      expect(result?.evidences?.some((e) => e.version === "1.3.0")).toBe(true);
    });

    it("captures version from npm-style path (material-design-lite@version)", () => {
      const context = createMockContext({
        responses: [
          createMockResponse({
            url: "https://cdn.example.com/npm/material-design-lite@1.3.0/material.min.js",
          }),
        ],
      });

      const result = applySignature(context, materialDesignLiteSignature);
      expect(result).toBeDefined();
      expect(result?.evidences?.some((e) => e.version === "1.3.0")).toBe(true);
    });

    it("does not capture version from unrelated parent directory", () => {
      const context = createMockContext({
        responses: [
          createMockResponse({
            url: "https://example.com/libs/5.6.7/material.min.js",
          }),
        ],
      });

      const result = applySignature(context, materialDesignLiteSignature);
      expect(result).toBeDefined();
      expect(result?.evidences?.every((e) => e.version !== "5.6.7")).toBe(true);
    });

    it("detects self-hosted presence without version", () => {
      const context = createMockContext({
        responses: [
          createMockResponse({
            url: "https://example.com/js/material.min.js",
          }),
        ],
      });

      const result = applySignature(context, materialDesignLiteSignature);
      expect(result).toBeDefined();
    });
  });
});
