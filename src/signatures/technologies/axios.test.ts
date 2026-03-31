import { describe, it, expect } from "vitest";
import { applySignature } from "../../analyzer/apply.js";
import type { Context, Response } from "../../browser/types.js";
import { axiosSignature } from "./axios.js";

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

describe("axiosSignature", () => {
  describe("URL matching", () => {
    it("should detect Axios with version from @ notation", () => {
      const context = createMockContext({
        responses: [
          createMockResponse({
            url: "https://cdn.example.com/npm/axios@1.6.0/dist/axios.min.js",
          }),
        ],
      });

      const result = applySignature(context, axiosSignature);
      expect(result).toBeDefined();
      expect(result?.evidences?.[0]?.version).toBe("1.6.0");
    });

    it("should detect Axios with version from slash notation", () => {
      const context = createMockContext({
        responses: [
          createMockResponse({
            url: "https://cdn.example.com/npm/axios/1.6.0/dist/axios.min.js",
          }),
        ],
      });

      const result = applySignature(context, axiosSignature);
      expect(result).toBeDefined();
      expect(result?.evidences?.[0]?.version).toBe("1.6.0");
    });

});
});
