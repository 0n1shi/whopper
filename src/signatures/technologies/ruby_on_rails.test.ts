import { describe, it, expect } from "vitest";
import { applySignature } from "../../analyzer/apply.js";
import type { Context, Cookie, Response } from "../../browser/types.js";
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

function createMockCookie(overrides: Partial<Cookie> = {}): Cookie {
  return {
    name: "_session_id",
    value: "abc123",
    domain: "example.com",
    host: "example.com",
    isFirstParty: true,
    path: "/",
    expires: -1,
    httpOnly: true,
    secure: true,
    sameSite: "Lax",
    ...overrides,
  };
}

const propshaftDigest = "0a1b2c3d";
const md5Digest = "0123456789abcdef0123456789abcdef";
const sha256Digest =
  "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef";
// No Rails pipeline emits a full 40-char SHA-1; other stacks do.
const sha1Digest = "0123456789abcdef0123456789abcdef01234567";

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
    function detectFromUrl(url: string) {
      const context = createMockContext({
        responses: [createMockResponse({ url })],
      });
      return applySignature(context, rubyOnRailsSignature);
    }

    it("detects Rails from a Propshaft asset URL", () => {
      const result = detectFromUrl(
        `https://example.com/assets/application-${propshaftDigest}.js`,
      );
      expect(result?.name).toBe("Ruby on Rails");
    });

    it("detects Rails from a Sprockets MD5 asset URL", () => {
      const result = detectFromUrl(
        `https://example.com/assets/application-${md5Digest}.js`,
      );
      expect(result?.name).toBe("Ruby on Rails");
    });

    it("detects Rails from a Sprockets SHA-256 asset URL", () => {
      const result = detectFromUrl(
        `https://example.com/assets/application-${sha256Digest}.js`,
      );
      expect(result?.name).toBe("Ruby on Rails");
    });

    it("detects Rails from a fingerprinted stylesheet", () => {
      const result = detectFromUrl(
        `https://example.com/assets/application-${sha256Digest}.css`,
      );
      expect(result?.name).toBe("Ruby on Rails");
    });

    it("detects Rails from a fingerprinted sourcemap", () => {
      const result = detectFromUrl(
        `https://example.com/assets/application-${propshaftDigest}.js.map`,
      );
      expect(result?.name).toBe("Ruby on Rails");
    });

    it("detects Rails from an asset URL carrying the Sprockets debug query", () => {
      const result = detectFromUrl(
        `https://example.com/assets/application-${md5Digest}.js?body=1`,
      );
      expect(result?.name).toBe("Ruby on Rails");
    });

    it("does not match an unfingerprinted application.js", () => {
      const result = detectFromUrl("https://example.com/assets/application.js");
      expect(result).toBeUndefined();
    });

    it("does not match a full 40-char SHA-1 digest from another pipeline", () => {
      const result = detectFromUrl(
        `https://example.com/assets/application-${sha1Digest}.js`,
      );
      expect(result).toBeUndefined();
    });

    it("does not match a fingerprinted JSON manifest", () => {
      const result = detectFromUrl(
        `https://example.com/assets/application-${propshaftDigest}.json`,
      );
      expect(result).toBeUndefined();
    });

    it("does not match a fingerprinted .jsx source", () => {
      const result = detectFromUrl(
        `https://example.com/assets/application-${propshaftDigest}.jsx`,
      );
      expect(result).toBeUndefined();
    });

    it("does not match an asset path echoed back in a query string", () => {
      const result = detectFromUrl(
        `https://example.com/login?next=/assets/application-${propshaftDigest}.js`,
      );
      expect(result).toBeUndefined();
    });

    // Known limitation, not signature behaviour: this signature carries headers
    // and cookies, so inferRuntime() classifies it as "server" and the urls loop
    // skips third-party responses. Assets served from a CDN via
    // config.asset_host are therefore never evaluated.
    it("does not evaluate an asset URL served from a third-party CDN host", () => {
      const context = createMockContext({
        responses: [
          createMockResponse({
            url: `https://cdn.example.net/assets/application-${md5Digest}.js`,
            host: "cdn.example.net",
            isFirstParty: false,
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
