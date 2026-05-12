import { describe, it, expect } from "vitest";
import { applySignature } from "../../analyzer/apply.js";
import type { Context, Response } from "../../browser/types.js";
import { cyberchimpsResponsiveSignature } from "./cyberchimps_responsive.js";

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

describe("cyberchimpsResponsiveSignature", () => {
  describe("body matching", () => {
    it("detects CyberChimps Responsive from a <link> stylesheet under the theme path", () => {
      const context = createMockContext({
        responses: [
          createMockResponse({
            body: '<link rel="stylesheet" href="/wp-content/themes/responsive/style.css">',
          }),
        ],
      });

      const result = applySignature(context, cyberchimpsResponsiveSignature);
      expect(result).toBeDefined();
    });

    it("detects CyberChimps Responsive Pro from a <link> stylesheet under the responsivepro path", () => {
      const context = createMockContext({
        responses: [
          createMockResponse({
            body: '<link rel="stylesheet" href="/wp-content/themes/responsivepro/style.css">',
          }),
        ],
      });

      const result = applySignature(context, cyberchimpsResponsiveSignature);
      expect(result).toBeDefined();
    });
  });
});
