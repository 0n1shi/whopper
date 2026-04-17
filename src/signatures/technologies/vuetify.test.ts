import { describe, it, expect } from "vitest";
import { applySignature } from "../../analyzer/apply.js";
import type { Context, Response } from "../../browser/types.js";
import { vuetifySignature } from "./vuetify.js";

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

describe("vuetifySignature", () => {
  describe("body matching", () => {
    it("detects Vuetify from v-application class", () => {
      const context = createMockContext({
        responses: [
          createMockResponse({
            body: '<div class="v-application"></div>',
          }),
        ],
      });

      const result = applySignature(context, vuetifySignature);
      expect(result).toBeDefined();
    });

    it("detects Vuetify from vuetify-theme-stylesheet id", () => {
      const context = createMockContext({
        responses: [
          createMockResponse({
            body: '<style id="vuetify-theme-stylesheet">...</style>',
          }),
        ],
      });

      const result = applySignature(context, vuetifySignature);
      expect(result).toBeDefined();
    });

    it("does not detect Vuetify from unrelated suffixed class names", () => {
      const context = createMockContext({
        responses: [
          createMockResponse({
            body: '<div class="post-v-application-wrapper"></div>',
          }),
        ],
      });

      const result = applySignature(context, vuetifySignature);
      expect(result).toBeUndefined();
    });
  });
});
