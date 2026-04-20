import { describe, it, expect } from "vitest";
import { applySignature } from "../../analyzer/apply.js";
import type { Context, Response } from "../../browser/types.js";
import { firebaseSignature } from "./firebase.js";

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

describe("firebaseSignature", () => {
  describe("URL matching", () => {
    it("captures version from gstatic firebasejs URL", () => {
      const context = createMockContext({
        responses: [
          createMockResponse({
            url: "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js",
          }),
        ],
      });

      const result = applySignature(context, firebaseSignature);
      expect(result).toBeDefined();
      expect(result?.evidences?.some((e) => e.version === "9.22.0")).toBe(true);
    });

    it("captures version from cdnjs firebase path", () => {
      const context = createMockContext({
        responses: [
          createMockResponse({
            url: "https://cdn.example.com/ajax/libs/firebase/8.10.1/firebase.min.js",
          }),
        ],
      });

      const result = applySignature(context, firebaseSignature);
      expect(result).toBeDefined();
      expect(result?.evidences?.some((e) => e.version === "8.10.1")).toBe(true);
    });

    it("does not capture version from an unrelated parent directory", () => {
      const context = createMockContext({
        responses: [
          createMockResponse({
            url: "https://example.com/libs/5.6.7/firebase.min.js",
          }),
        ],
      });

      const result = applySignature(context, firebaseSignature);
      expect(result).toBeDefined();
      expect(result?.evidences?.every((e) => e.version !== "5.6.7")).toBe(true);
    });

    it("detects self-hosted presence without version", () => {
      const context = createMockContext({
        responses: [
          createMockResponse({
            url: "https://example.com/js/firebase.min.js",
          }),
        ],
      });

      const result = applySignature(context, firebaseSignature);
      expect(result).toBeDefined();
    });
  });
});
