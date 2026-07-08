import { describe, it, expect } from "vitest";
import { applySignature } from "../../analyzer/apply.js";
import type { Context, Response } from "../../browser/types.js";
import { thinkPhpSignature } from "./thinkphp.js";

function createMockContext(
  overrides: Partial<Pick<Context, "responses" | "cookies">> = {},
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

describe("thinkPhpSignature", () => {
  it("detects ThinkPHP from the X-Powered-By header", () => {
    const context = createMockContext({
      responses: [
        createMockResponse({
          headers: { "content-type": "text/html", "x-powered-by": "ThinkPHP" },
        }),
      ],
    });
    const detection = applySignature(context, thinkPhpSignature);
    expect(detection?.name).toBe("ThinkPHP");
  });

  it("captures the version from X-Powered-By when present", () => {
    const context = createMockContext({
      responses: [
        createMockResponse({
          headers: {
            "content-type": "text/html",
            "x-powered-by": "ThinkPHP/6.0.12",
          },
        }),
      ],
    });
    const detection = applySignature(context, thinkPhpSignature);
    expect(detection?.evidences?.some((e) => e.version === "6.0.12")).toBe(
      true,
    );
  });

  it("detects ThinkPHP from the default welcome page body", () => {
    const context = createMockContext({
      responses: [
        createMockResponse({ body: "<h1>:)</h1><p> ThinkPHP V6<br/></p>" }),
      ],
    });
    const detection = applySignature(context, thinkPhpSignature);
    expect(detection?.name).toBe("ThinkPHP");
  });

  it("detects ThinkPHP from the legacy framework banner marker", () => {
    const context = createMockContext({
      responses: [
        createMockResponse({
          body: "<!-- Fast & Simple OOP PHP Framework -->",
        }),
      ],
    });
    const detection = applySignature(context, thinkPhpSignature);
    expect(detection?.name).toBe("ThinkPHP");
  });

  it("detects the legacy banner marker with an HTML-encoded ampersand", () => {
    const context = createMockContext({
      responses: [
        createMockResponse({
          body: "<!-- Fast &amp; Simple OOP PHP Framework -->",
        }),
      ],
    });
    const detection = applySignature(context, thinkPhpSignature);
    expect(detection?.name).toBe("ThinkPHP");
  });

  it("detects ThinkPHP from the page-trace cookie", () => {
    const context = createMockContext({
      cookies: [
        {
          name: "thinkphp_show_page_trace",
          value: "0|0",
          host: "example.com",
          isFirstParty: true,
        } as Context["cookies"][number],
      ],
    });
    const detection = applySignature(context, thinkPhpSignature);
    expect(detection?.name).toBe("ThinkPHP");
  });
});
