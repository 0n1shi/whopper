import { describe, it, expect } from "vitest";
import { applySignature } from "../../analyzer/apply.js";
import type { Context, Response } from "../../browser/types.js";
import { theEventsCalendarSignature } from "./the_events_calendar.js";

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

describe("theEventsCalendarSignature", () => {
  describe("body matching", () => {
    it("detects The Events Calendar from a <link> stylesheet under the plugin path", () => {
      const context = createMockContext({
        responses: [
          createMockResponse({
            body: '<link rel="stylesheet" href="/wp-content/plugins/the-events-calendar/src/resources/css/tribe-events-full.css">',
          }),
        ],
      });

      const result = applySignature(context, theEventsCalendarSignature);
      expect(result).toBeDefined();
    });
  });
});
