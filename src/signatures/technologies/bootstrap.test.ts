import { describe, it, expect } from "vitest";
import { applySignature } from "../../analyzer/apply.js";
import type { Context, Response } from "../../browser/types.js";
import { bootstrapSignature } from "./bootstrap.js";

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
    headers: { "content-type": "text/html" },
    body: "",
    ...overrides,
  };
}

describe("bootstrapSignature", () => {
  describe("body matching", () => {
    it("captures version from bootstrap.min.css reference", () => {
      const context = createMockContext({
        responses: [
          createMockResponse({
            body: '<link href="/css/bootstrap-4.0.0.min.css">',
          }),
        ],
      });

      const result = applySignature(context, bootstrapSignature);
      expect(result).toBeDefined();
      expect(result?.evidences?.some((e) => e.version === "4.0.0")).toBe(true);
    });

    it("captures version from bootstrap.min.js reference", () => {
      const context = createMockContext({
        responses: [
          createMockResponse({
            body: '<script src="/js/bootstrap-4.0.0.min.js"></script>',
          }),
        ],
      });

      const result = applySignature(context, bootstrapSignature);
      expect(result).toBeDefined();
      expect(result?.evidences?.some((e) => e.version === "4.0.0")).toBe(true);
    });

    it("does not miscapture popper.js version when bootstrap CSS and popper JS coexist", () => {
      const context = createMockContext({
        responses: [
          createMockResponse({
            body: '<link rel="stylesheet" href="/css/bootstrap4.0.0-beta2.min.css"/><script src="/js/jquery-3.2.1.min.js"></script><script src="/js/popper-1.12.3.min.js"></script>',
          }),
        ],
      });

      const result = applySignature(context, bootstrapSignature);
      expect(result).toBeDefined();
      expect(result?.evidences?.every((e) => e.version !== "1.12.3")).toBe(true);
      expect(result?.evidences?.every((e) => e.version !== "3.2.1")).toBe(true);
    });

    it("captures version from Bootstrap v header comment", () => {
      const context = createMockContext({
        responses: [
          createMockResponse({
            body: "/*! Bootstrap v5.3.0 */",
          }),
        ],
      });

      const result = applySignature(context, bootstrapSignature);
      expect(result).toBeDefined();
      expect(result?.evidences?.some((e) => e.version === "5.3.0")).toBe(true);
    });

    it("captures pre-release version from Bootstrap v header comment", () => {
      const context = createMockContext({
        responses: [
          createMockResponse({
            body: "/*! Bootstrap v4.0.0-beta.2 */",
          }),
        ],
      });

      const result = applySignature(context, bootstrapSignature);
      expect(result).toBeDefined();
      expect(
        result?.evidences?.some((e) => e.version === "4.0.0-beta.2"),
      ).toBe(true);
    });

    it("captures pre-release version from bootstrap.min.css filename", () => {
      const context = createMockContext({
        responses: [
          createMockResponse({
            body: '<link rel="stylesheet" href="/css/bootstrap4.0.0-beta2.min.css"/>',
          }),
        ],
      });

      const result = applySignature(context, bootstrapSignature);
      expect(result).toBeDefined();
      expect(
        result?.evidences?.some((e) => e.version === "4.0.0-beta2"),
      ).toBe(true);
    });

    it("captures pre-release version from bootstrap.min.js filename", () => {
      const context = createMockContext({
        responses: [
          createMockResponse({
            body: '<script src="/js/bootstrap4.0.0-beta2.min.js"></script>',
          }),
        ],
      });

      const result = applySignature(context, bootstrapSignature);
      expect(result).toBeDefined();
      expect(
        result?.evidences?.some((e) => e.version === "4.0.0-beta2"),
      ).toBe(true);
    });

    it("captures SemVer pre-release identifier containing a hyphen", () => {
      const context = createMockContext({
        responses: [
          createMockResponse({
            body: "/*! Bootstrap v4.0.0-rc-1 */",
          }),
        ],
      });

      const result = applySignature(context, bootstrapSignature);
      expect(result).toBeDefined();
      expect(
        result?.evidences?.some((e) => e.version === "4.0.0-rc-1"),
      ).toBe(true);
    });
  });

  describe("javascript variable matching", () => {
    it("captures pre-release version from bootstrap.Alert.VERSION", () => {
      const context = createMockContext({
        javascriptVariables: {
          "bootstrap.Alert.VERSION": "4.0.0-beta.2",
        },
      });

      const result = applySignature(context, bootstrapSignature);
      expect(result).toBeDefined();
      expect(
        result?.evidences?.some((e) => e.version === "4.0.0-beta.2"),
      ).toBe(true);
    });

    it("captures pre-release version from jQuery.fn.tooltip.Constructor.VERSION", () => {
      const context = createMockContext({
        javascriptVariables: {
          "jQuery.fn.tooltip.Constructor.VERSION": "4.0.0-beta.2",
        },
      });

      const result = applySignature(context, bootstrapSignature);
      expect(result).toBeDefined();
      expect(
        result?.evidences?.some((e) => e.version === "4.0.0-beta.2"),
      ).toBe(true);
    });
  });
});
