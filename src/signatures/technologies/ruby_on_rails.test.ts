import { describe, it, expect } from "vitest";
import { applySignature } from "../../analyzer/apply.js";
import type { Context, Response } from "../../browser/types.js";
import { rubyOnRailsSignature } from "./ruby_on_rails.js";

function createMockContext(
  overrides: Partial<
    Pick<Context, "responses" | "cookies" | "javascriptVariables">
  > = {},
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

function createMockCookie(
  overrides: Partial<Context["cookies"][number]> = {},
): Context["cookies"][number] {
  return {
    name: "_session_id",
    value: "abc123",
    host: "example.com",
    isFirstParty: true,
    ...overrides,
  } as Context["cookies"][number];
}

// Sprockets digests are hex: MD5 up to Rails 5.1, SHA-256 from Rails 5.2.
const md5Digest = "0123456789abcdef0123456789abcdef";
const sha256Digest =
  "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef";

describe("rubyOnRailsSignature", () => {
  describe("header matching", () => {
    it("detects Rails from a mod_rails Server header", () => {
      const context = createMockContext({
        responses: [
          createMockResponse({
            headers: {
              "content-type": "text/html",
              server: "Apache/2.4.6 mod_rails/4.0.60",
            },
          }),
        ],
      });

      const result = applySignature(context, rubyOnRailsSignature);
      expect(result?.name).toBe("Ruby on Rails");
    });

    it("detects Rails from a mod_rack X-Powered-By header", () => {
      const context = createMockContext({
        responses: [
          createMockResponse({
            headers: {
              "content-type": "text/html",
              "x-powered-by": "Phusion Passenger mod_rack",
            },
          }),
        ],
      });

      const result = applySignature(context, rubyOnRailsSignature);
      expect(result?.name).toBe("Ruby on Rails");
    });

    it("does not match an unrelated Server header", () => {
      const context = createMockContext({
        responses: [
          createMockResponse({
            headers: { "content-type": "text/html", server: "nginx/1.24.0" },
          }),
        ],
      });

      const result = applySignature(context, rubyOnRailsSignature);
      expect(result).toBeUndefined();
    });
  });

  describe("cookie matching", () => {
    it("detects Rails from the _session_id cookie", () => {
      const context = createMockContext({
        cookies: [createMockCookie({ value: "BAh7B0kiD3Nlc3Npb25faWQ" })],
      });

      const result = applySignature(context, rubyOnRailsSignature);
      expect(result?.name).toBe("Ruby on Rails");
    });

    it("does not match a cookie name that merely ends with _session_id", () => {
      const context = createMockContext({
        cookies: [
          createMockCookie({ name: "karte_session_id", value: "abc123" }),
        ],
      });

      const result = applySignature(context, rubyOnRailsSignature);
      expect(result).toBeUndefined();
    });

    it("does not match an empty _session_id cookie", () => {
      const context = createMockContext({
        cookies: [createMockCookie({ value: "" })],
      });

      const result = applySignature(context, rubyOnRailsSignature);
      expect(result).toBeUndefined();
    });
  });

  describe("body matching", () => {
    it("detects Rails from the csrf-param meta tag", () => {
      const context = createMockContext({
        responses: [
          createMockResponse({
            body: '<meta name="csrf-param" content="authenticity_token" />',
          }),
        ],
      });

      const result = applySignature(context, rubyOnRailsSignature);
      expect(result?.name).toBe("Ruby on Rails");
    });

    it("detects the csrf-param meta tag with single-quoted attributes", () => {
      const context = createMockContext({
        responses: [
          createMockResponse({
            body: "<meta name='csrf-param' content='authenticity_token' />",
          }),
        ],
      });

      const result = applySignature(context, rubyOnRailsSignature);
      expect(result?.name).toBe("Ruby on Rails");
    });

    it("does not match a csrf-token meta tag alone", () => {
      const context = createMockContext({
        responses: [
          createMockResponse({
            body: '<meta name="csrf-token" content="abcdef123456" />',
          }),
        ],
      });

      const result = applySignature(context, rubyOnRailsSignature);
      expect(result).toBeUndefined();
    });
  });

  describe("url matching", () => {
    it("detects Rails from a fingerprinted MD5 asset URL (Rails 4 to 5.1)", () => {
      const context = createMockContext({
        responses: [
          createMockResponse({
            url: `https://example.com/assets/application-${md5Digest}.js`,
            headers: { "content-type": "application/javascript" },
          }),
        ],
      });

      const result = applySignature(context, rubyOnRailsSignature);
      expect(result?.name).toBe("Ruby on Rails");
    });

    it("detects Rails from a fingerprinted SHA-256 asset URL (Rails 5.2+)", () => {
      const context = createMockContext({
        responses: [
          createMockResponse({
            url: `https://example.com/assets/application-${sha256Digest}.js`,
            headers: { "content-type": "application/javascript" },
          }),
        ],
      });

      const result = applySignature(context, rubyOnRailsSignature);
      expect(result?.name).toBe("Ruby on Rails");
    });

    it("does not match an unfingerprinted application.js", () => {
      const context = createMockContext({
        responses: [
          createMockResponse({
            url: "https://example.com/assets/application.js",
            headers: { "content-type": "application/javascript" },
          }),
        ],
      });

      const result = applySignature(context, rubyOnRailsSignature);
      expect(result).toBeUndefined();
    });
  });

  describe("javascript variable matching", () => {
    it("detects Rails from the ReactOnRails global", () => {
      const context = createMockContext({
        javascriptVariables: {
          ReactOnRails: {},
        },
      });

      const result = applySignature(context, rubyOnRailsSignature);
      expect(result?.name).toBe("Ruby on Rails");
    });

    it("detects Rails from the React on Rails event handler flag", () => {
      const context = createMockContext({
        javascriptVariables: {
          __REACT_ON_RAILS_EVENT_HANDLERS_RAN_ONCE__: true,
        },
      });

      const result = applySignature(context, rubyOnRailsSignature);
      expect(result?.name).toBe("Ruby on Rails");
    });
  });

  it("implies Ruby", () => {
    expect(rubyOnRailsSignature.impliedSoftwares).toContain("Ruby");
  });
});
