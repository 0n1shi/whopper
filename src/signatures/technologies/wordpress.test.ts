import { describe, it, expect } from "vitest";
import { applySignature } from "../../analyzer/apply.js";
import type { Context, Response } from "../../browser/types.js";
import { wordpressSignature } from "./wordpress.js";

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

describe("wordpressSignature", () => {
  describe("body matching", () => {
    it("captures version from meta generator with space separator", () => {
      const context = createMockContext({
        responses: [
          createMockResponse({
            body: '<meta name="generator" content="WordPress 6.4.2">',
          }),
        ],
      });

      const result = applySignature(context, wordpressSignature);
      expect(result).toBeDefined();
      expect(result?.evidences?.some((e) => e.version === "6.4.2")).toBe(true);
    });

    it("captures version from slash-separated form (e.g. WordPress/6.4.2)", () => {
      const context = createMockContext({
        responses: [
          createMockResponse({
            body: "Powered by WordPress/6.4.2",
          }),
        ],
      });

      const result = applySignature(context, wordpressSignature);
      expect(result).toBeDefined();
      expect(result?.evidences?.some((e) => e.version === "6.4.2")).toBe(true);
    });

    it("captures version with v prefix (WordPress v6.4.2)", () => {
      const context = createMockContext({
        responses: [
          createMockResponse({
            body: "WordPress v6.4.2",
          }),
        ],
      });

      const result = applySignature(context, wordpressSignature);
      expect(result).toBeDefined();
      expect(result?.evidences?.some((e) => e.version === "6.4.2")).toBe(true);
    });

    it("does not miscapture version from an unrelated script on the same page", () => {
      const context = createMockContext({
        responses: [
          createMockResponse({
            body: '<link href="/wp-content/themes/foo/style.css"><script src="/jquery-3.2.1.min.js"></script>',
          }),
        ],
      });

      const result = applySignature(context, wordpressSignature);
      expect(result).toBeDefined();
      expect(result?.evidences?.every((e) => e.version !== "3.2.1")).toBe(true);
    });

    it("detects WordPress by wp-content reference alone (no version)", () => {
      const context = createMockContext({
        responses: [
          createMockResponse({
            body: '<link href="/wp-content/themes/twentytwentyfour/style.css">',
          }),
        ],
      });

      const result = applySignature(context, wordpressSignature);
      expect(result).toBeDefined();
    });

    it("does not detect WordPress from a third-party URL quoted inside a first-party script", () => {
      const context = createMockContext({
        responses: [
          createMockResponse({
            url: "https://example.com/js/app.min.js",
            host: "example.com",
            headers: { "content-type": "application/javascript" },
            body: '"https://external.example/wp-content/plugins/foo/bar.js"',
          }),
        ],
      });

      const result = applySignature(context, wordpressSignature);
      expect(result).toBeUndefined();
    });

    it("detects WordPress from an in-scope absolute wp-content URL", () => {
      const context = createMockContext({
        responses: [
          createMockResponse({
            body: '<link href="https://example.com/wp-content/themes/foo/style.css">',
          }),
        ],
      });

      const result = applySignature(context, wordpressSignature);
      expect(result).toBeDefined();
    });

    it("does not read a version across an out-of-scope URL between the tokens", () => {
      // "WordPress" and "6.4.2" are separated by an out-of-scope URL. Because
      // the URL is excluded by span (not replaced with whitespace), the version
      // pattern must not bridge the two into a spurious 6.4.2 detection. An
      // in-scope relative path still yields a WordPress detection.
      const context = createMockContext({
        responses: [
          createMockResponse({
            body: '<link href="/wp-content/style.css"> WordPress https://external.example/a/b.js 6.4.2',
          }),
        ],
      });

      const result = applySignature(context, wordpressSignature);
      expect(result).toBeDefined();
      expect(result?.evidences?.every((e) => e.version !== "6.4.2")).toBe(true);
    });
  });
});
