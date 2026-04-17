import { describe, it, expect } from "vitest";
import { applySignature } from "../../analyzer/apply.js";
import type { Context, Response } from "../../browser/types.js";
import { helixUltimateSignature } from "./helix_ultimate.js";

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

describe("helixUltimateSignature", () => {
  describe("body matching", () => {
    it("detects Helix Ultimate from sp-header class", () => {
      const context = createMockContext({
        responses: [
          createMockResponse({
            body: '<header class="sp-header"></header>',
          }),
        ],
      });

      const result = applySignature(context, helixUltimateSignature);
      expect(result).toBeDefined();
    });

    it("detects Helix Ultimate from helix-ultimate class", () => {
      const context = createMockContext({
        responses: [
          createMockResponse({
            body: '<body class="helix-ultimate"></body>',
          }),
        ],
      });

      const result = applySignature(context, helixUltimateSignature);
      expect(result).toBeDefined();
    });

    it("does not detect Helix Ultimate from unrelated hyphen-suffixed names", () => {
      const context = createMockContext({
        responses: [
          createMockResponse({
            body: '<div class="group-sp-header-item my-helix-ultimate-v2"></div>',
          }),
        ],
      });

      const result = applySignature(context, helixUltimateSignature);
      expect(result).toBeUndefined();
    });
  });
});
