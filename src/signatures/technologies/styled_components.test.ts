import { describe, it, expect } from "vitest";
import { applySignature } from "../../analyzer/apply.js";
import type { Context, Response } from "../../browser/types.js";
import { styledComponentsSignature } from "./styled_components.js";

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

describe("styledComponentsSignature", () => {
  describe("body matching", () => {
    it("detects styled-components from data-styled attribute", () => {
      const context = createMockContext({
        responses: [
          createMockResponse({
            body: '<style data-styled="active">.sc-abc{}</style>',
          }),
        ],
      });

      const result = applySignature(context, styledComponentsSignature);
      expect(result).toBeDefined();
    });

    it("detects styled-components from sc-component-id attribute", () => {
      const context = createMockContext({
        responses: [
          createMockResponse({
            body: '<div sc-component-id="Button-abc123"></div>',
          }),
        ],
      });

      const result = applySignature(context, styledComponentsSignature);
      expect(result).toBeDefined();
    });

    it("does not detect styled-components from unrelated hyphenated names", () => {
      const context = createMockContext({
        responses: [
          createMockResponse({
            body: '<div my-data-styled-attr="x" class="prefix-sc-component-id-wrap"></div>',
          }),
        ],
      });

      const result = applySignature(context, styledComponentsSignature);
      expect(result).toBeUndefined();
    });
  });
});
