import { describe, it, expect } from "vitest";
import { applySignature } from "../../analyzer/apply.js";
import type { Context, Response } from "../../browser/types.js";
import { recentPostsWidgetWithThumbnailsSignature } from "./recent_posts_widget_with_thumbnails.js";

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

describe("recentPostsWidgetWithThumbnailsSignature", () => {
  describe("body matching", () => {
    it("captures version from plugin CSS link", () => {
      const context = createMockContext({
        responses: [
          createMockResponse({
            body: '<link href="/wp-content/plugins/recent-posts-widget-with-thumbnails/style.css?ver=8.0.1">',
          }),
        ],
      });

      const result = applySignature(
        context,
        recentPostsWidgetWithThumbnailsSignature,
      );
      expect(result).toBeDefined();
      expect(result?.evidences?.some((e) => e.version === "8.0.1")).toBe(true);
    });

    it("does not miscapture version from an unrelated plugin loaded after", () => {
      const context = createMockContext({
        responses: [
          createMockResponse({
            body: '<link href="/wp-content/plugins/recent-posts-widget-with-thumbnails/style.css?ver=8.0.1"><link href="/wp-content/plugins/other/style.css?ver=9.9.9">',
          }),
        ],
      });

      const result = applySignature(
        context,
        recentPostsWidgetWithThumbnailsSignature,
      );
      expect(result).toBeDefined();
      expect(result?.evidences?.every((e) => e.version !== "9.9.9")).toBe(true);
    });
  });
});
