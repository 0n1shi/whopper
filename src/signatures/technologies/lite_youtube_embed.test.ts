import { describe, it, expect } from "vitest";
import { applySignature } from "../../analyzer/apply.js";
import type { Context, Response } from "../../browser/types.js";
import { liteYoutubeEmbedSignature } from "./lite_youtube_embed.js";

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

describe("liteYoutubeEmbedSignature", () => {
  describe("body matching", () => {
    it("detects lite-youtube-embed from <lite-youtube> element with attrs", () => {
      const context = createMockContext({
        responses: [
          createMockResponse({
            body: '<lite-youtube videoid="abcd1234"></lite-youtube>',
          }),
        ],
      });

      const result = applySignature(context, liteYoutubeEmbedSignature);
      expect(result).toBeDefined();
    });

    it("detects lite-youtube-embed from self-closing element", () => {
      const context = createMockContext({
        responses: [
          createMockResponse({
            body: "<lite-youtube>fallback</lite-youtube>",
          }),
        ],
      });

      const result = applySignature(context, liteYoutubeEmbedSignature);
      expect(result).toBeDefined();
    });

    it("does not detect lite-youtube-embed from text mentions or class names", () => {
      const context = createMockContext({
        responses: [
          createMockResponse({
            body: '<div class="lite-youtube-wrapper">See lite-youtube in docs.</div>',
          }),
        ],
      });

      const result = applySignature(context, liteYoutubeEmbedSignature);
      expect(result).toBeUndefined();
    });
  });
});
