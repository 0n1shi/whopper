import { describe, it, expect, vi } from "vitest";
import type { APIRequestContext } from "playwright";
import { applySignature } from "../../analyzer/apply.js";
import type { Detection } from "../../analyzer/types.js";
import type { Context, Response } from "../../browser/types.js";
import { applyActiveScans } from "../../commands/active_scan_runner.js";
import { baserCmsSignature } from "./basercms.js";

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

function createCookie(name: string, value: string): Context["cookies"][number] {
  return {
    name,
    value,
    host: "example.com",
    isFirstParty: true,
  } as Context["cookies"][number];
}

const makeRequest = (
  impl: (url: string) => { status: number; body: string },
) => {
  const get = vi.fn(async (url: string) => {
    const r = impl(url);
    return {
      status: () => r.status,
      headers: () => ({}),
      text: async () => r.body,
    };
  });
  return { get, request: { get } as unknown as APIRequestContext };
};

describe("baserCmsSignature", () => {
  it("detects baserCMS from the BASERCMS session cookie", () => {
    const context = createMockContext({
      cookies: [createCookie("BASERCMS", "0123456789abcdef0123456789abcdef")],
    });
    const detection = applySignature(context, baserCmsSignature);
    expect(detection?.name).toBe("baserCMS");
    expect(detection?.evidences?.[0]).toMatchObject({
      type: "cookie",
      confidence: "high",
    });
  });

  it("detects baserCMS from the generator meta tag regardless of case", () => {
    const context = createMockContext({
      responses: [
        createMockResponse({
          body: '<meta name="generator" content="baserCMS"/>',
        }),
      ],
    });
    const detection = applySignature(context, baserCmsSignature);
    expect(detection?.name).toBe("baserCMS");
  });

  it("does not detect baserCMS from a csrfToken cookie alone", () => {
    const context = createMockContext({
      cookies: [createCookie("csrfToken", "abc123")],
    });
    expect(applySignature(context, baserCmsSignature)).toBeUndefined();
  });

  it("does not detect baserCMS from a non-generator meta tag", () => {
    const context = createMockContext({
      responses: [
        createMockResponse({
          body: '<meta name="keywords" content="basercms">',
        }),
      ],
    });
    expect(applySignature(context, baserCmsSignature)).toBeUndefined();
  });

  it("confirms baserCMS via the /baser/admin/ login form", async () => {
    const detections: Detection[] = [{ name: "baserCMS", evidences: [] }];
    const { request } = makeRequest((url) =>
      url.endsWith("/baser/admin/")
        ? {
            status: 200,
            body: '<div id="Login" class="bca-login"><script src="/bc_admin_third/js/admin/users/login.bundle.js" defer="defer" id="AdminUsersLoginScript"></script></div>',
          }
        : { status: 404, body: "" },
    );

    await applyActiveScans(
      "https://example.com/",
      detections,
      [baserCmsSignature],
      request,
      5000,
    );

    expect(detections[0]!.evidences).toHaveLength(1);
    expect(detections[0]!.evidences![0]).toMatchObject({
      type: "body",
      confidence: "high",
      sourceUrl: "https://example.com/baser/admin/",
    });
  });
});
