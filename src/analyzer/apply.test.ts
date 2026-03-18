import { describe, it, expect } from "vitest";
import { applySignature } from "./apply.js";
import type { Context, Response, Cookie } from "../browser/types.js";
import type { Signature } from "../signatures/_types.js";

// Helper to create a minimal Context for testing
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
    headers: {},
    body: "",
    ...overrides,
  };
}

function createMockCookie(overrides: Partial<Cookie> = {}): Cookie {
  return {
    name: "test",
    value: "value",
    domain: "example.com",
    host: "example.com",
    isFirstParty: true,
    path: "/",
    expires: -1,
    httpOnly: false,
    secure: false,
    sameSite: "Lax",
    ...overrides,
  };
}

describe("applySignature", () => {
  describe("header matching", () => {
    it("should detect technology from header", () => {
      const signature: Signature = {
        name: "Nginx",
        rule: {
          confidence: "high",
          headers: {
            server: "^nginx/?(\\d+\\.\\d+\\.\\d+)?",
          },
        },
      };

      const context = createMockContext({
        responses: [
          createMockResponse({
            headers: { server: "nginx/1.20.0" },
          }),
        ],
      });

      const result = applySignature(context, signature);

      expect(result).toBeDefined();
      expect(result?.name).toBe("Nginx");
      expect(result?.evidences).toHaveLength(1);
      expect(result?.evidences?.[0]).toMatchObject({
        type: "header",
        value: "server: nginx/1.20.0",
        version: "1.20.0",
        confidence: "high",
      });
    });

    it("should not detect when header does not match", () => {
      const signature: Signature = {
        name: "Nginx",
        rule: {
          confidence: "high",
          headers: {
            server: "^nginx",
          },
        },
      };

      const context = createMockContext({
        responses: [
          createMockResponse({
            headers: { server: "Apache/2.4.0" },
          }),
        ],
      });

      const result = applySignature(context, signature);
      expect(result).toBeUndefined();
    });

    it("should handle case-insensitive header names", () => {
      const signature: Signature = {
        name: "Nginx",
        rule: {
          confidence: "high",
          headers: {
            Server: "^nginx",
          },
        },
      };

      const context = createMockContext({
        responses: [
          createMockResponse({
            headers: { server: "nginx/1.20.0" },
          }),
        ],
      });

      const result = applySignature(context, signature);
      expect(result).toBeDefined();
    });

    it("should skip when response does not have the specified header", () => {
      const signature: Signature = {
        name: "Nginx",
        rule: {
          confidence: "high",
          headers: {
            "x-powered-by": "^nginx",
          },
        },
      };

      const context = createMockContext({
        responses: [
          createMockResponse({
            headers: { server: "Apache/2.4.0" },
          }),
        ],
      });

      const result = applySignature(context, signature);
      expect(result).toBeUndefined();
    });

  });

  describe("body matching", () => {
    it("should detect technology from body content", () => {
      const signature: Signature = {
        name: "jQuery",
        rule: {
          confidence: "medium",
          bodies: ["jquery[.-]([\\d.]+)(?:\\.min)?\\.js"],
        },
      };

      const context = createMockContext({
        responses: [
          createMockResponse({
            headers: { "content-type": "text/html" },
            body: '<script src="/js/jquery-3.6.0.min.js"></script>',
          }),
        ],
      });

      const result = applySignature(context, signature);

      expect(result).toBeDefined();
      expect(result?.name).toBe("jQuery");
      expect(result?.evidences?.[0]?.version).toBe("3.6.0");
    });

    it("should not match body when content-type is not text", () => {
      const signature: Signature = {
        name: "jQuery",
        rule: {
          confidence: "medium",
          bodies: ["jquery"],
        },
      };

      const context = createMockContext({
        responses: [
          createMockResponse({
            headers: { "content-type": "application/octet-stream" },
            body: "jquery-3.6.0.min.js",
          }),
        ],
      });

      const result = applySignature(context, signature);
      expect(result).toBeUndefined();
    });

    it("should not match when body content does not match pattern", () => {
      const signature: Signature = {
        name: "jQuery",
        rule: {
          confidence: "medium",
          bodies: ["jquery[.-]([\\d.]+)"],
        },
      };

      const context = createMockContext({
        responses: [
          createMockResponse({
            headers: { "content-type": "text/html" },
            body: "<script src='/js/react.min.js'></script>",
          }),
        ],
      });

      const result = applySignature(context, signature);
      expect(result).toBeUndefined();
    });
  });

  describe("URL matching", () => {
    it("should detect technology from URL", () => {
      const signature: Signature = {
        name: "WordPress",
        rule: {
          confidence: "high",
          urls: ["/wp-content/"],
        },
      };

      const context = createMockContext({
        responses: [
          createMockResponse({
            url: "https://example.com/wp-content/themes/style.css",
          }),
        ],
      });

      const result = applySignature(context, signature);

      expect(result).toBeDefined();
      expect(result?.name).toBe("WordPress");
      expect(result?.evidences?.[0]?.type).toBe("url");
    });
  });

  describe("cookie matching", () => {
    it("should detect technology from cookie name and value", () => {
      const signature: Signature = {
        name: "PHP",
        rule: {
          confidence: "high",
          cookies: {
            PHPSESSID: ".*",
          },
        },
      };

      const context = createMockContext({
        cookies: [
          createMockCookie({
            name: "PHPSESSID",
            value: "abc123",
          }),
        ],
      });

      const result = applySignature(context, signature);

      expect(result).toBeDefined();
      expect(result?.name).toBe("PHP");
      expect(result?.evidences?.[0]?.type).toBe("cookie");
    });

    it("should match cookie name with regex", () => {
      const signature: Signature = {
        name: "ASP.NET",
        rule: {
          confidence: "high",
          cookies: {
            "ASP\\.NET_SessionId": ".*",
          },
        },
      };

      const context = createMockContext({
        cookies: [
          createMockCookie({
            name: "ASP.NET_SessionId",
            value: "xyz789",
          }),
        ],
      });

      const result = applySignature(context, signature);
      expect(result).toBeDefined();
    });

    it("should not match partial cookie names", () => {
      const signature: Signature = {
        name: "Ruby on Rails",
        rule: {
          confidence: "high",
          cookies: {
            _session_id: ".+",
          },
        },
      };

      const context = createMockContext({
        cookies: [
          createMockCookie({
            name: "karte_session_id",
            value: "session|abc123",
          }),
        ],
      });

      const result = applySignature(context, signature);
      expect(result).toBeUndefined();
    });

    it("should skip when cookie name does not match", () => {
      const signature: Signature = {
        name: "PHP",
        rule: {
          confidence: "high",
          cookies: {
            PHPSESSID: ".*",
          },
        },
      };

      const context = createMockContext({
        cookies: [
          createMockCookie({
            name: "JSESSIONID",
            value: "abc123",
          }),
        ],
      });

      const result = applySignature(context, signature);
      expect(result).toBeUndefined();
    });

    it("should skip when cookie value does not match pattern", () => {
      const signature: Signature = {
        name: "CustomApp",
        rule: {
          confidence: "high",
          cookies: {
            session: "^secure_[a-z]+$",
          },
        },
      };

      const context = createMockContext({
        cookies: [
          createMockCookie({
            name: "session",
            value: "insecure_123",
          }),
        ],
      });

      const result = applySignature(context, signature);
      expect(result).toBeUndefined();
    });
  });

  describe("JavaScript variable matching", () => {
    it("should detect technology from JavaScript variable", () => {
      const signature: Signature = {
        name: "jQuery",
        rule: {
          confidence: "high",
          javascriptVariables: {
            "jQuery.fn.jquery": "^([\\d.]+)",
          },
        },
      };

      const context = createMockContext({
        javascriptVariables: {
          "jQuery.fn.jquery": "3.6.0",
        },
      });

      const result = applySignature(context, signature);

      expect(result).toBeDefined();
      expect(result?.name).toBe("jQuery");
      expect(result?.evidences?.[0]?.type).toBe("script");
      expect(result?.evidences?.[0]?.version).toBe("3.6.0");
    });

    it("should handle non-string JavaScript variable values", () => {
      const signature: Signature = {
        name: "TestLib",
        rule: {
          confidence: "medium",
          javascriptVariables: {
            "TestLib.config": "enabled.*true",
          },
        },
      };

      const context = createMockContext({
        javascriptVariables: {
          "TestLib.config": { enabled: true, version: "1.0" },
        },
      });

      const result = applySignature(context, signature);

      expect(result).toBeDefined();
      expect(result?.evidences?.[0]?.type).toBe("script");
    });

    it("should skip when JavaScript variable is not present", () => {
      const signature: Signature = {
        name: "jQuery",
        rule: {
          confidence: "high",
          javascriptVariables: {
            "jQuery.fn.jquery": "^([\\d.]+)",
          },
        },
      };

      const context = createMockContext({
        javascriptVariables: {
          "React.version": "18.0.0",
        },
      });

      const result = applySignature(context, signature);
      expect(result).toBeUndefined();
    });

    it("should skip when JavaScript variable value does not match pattern", () => {
      const signature: Signature = {
        name: "CustomLib",
        rule: {
          confidence: "medium",
          javascriptVariables: {
            "CustomLib.version": "^2\\.",
          },
        },
      };

      const context = createMockContext({
        javascriptVariables: {
          "CustomLib.version": "1.5.0",
        },
      });

      const result = applySignature(context, signature);
      expect(result).toBeUndefined();
    });
  });

  describe("smart filtering", () => {
    it("should include third-party URL matches", () => {
      const signature: Signature = {
        name: "Swiper",
        rule: {
          confidence: "high",
          urls: ["swiper[@.-](\\d+\\.\\d+\\.\\d+)?"],
        },
      };

      const context = createMockContext({
        responses: [
          createMockResponse({
            url: "https://cdn.example.com/swiper@8.4.7/swiper-bundle.min.css",
            host: "cdn.example.com",
            isFirstParty: false,
          }),
        ],
      });

      const result = applySignature(context, signature);
      expect(result).toBeDefined();
      expect(result?.evidences?.[0]?.type).toBe("url");
      expect(result?.evidences?.[0]?.version).toBe("8.4.7");
    });

    it("should skip third-party URL matches for server runtime signatures", () => {
      const signature: Signature = {
        name: "ServerFramework",
        runtime: "server",
        rule: {
          confidence: "high",
          urls: ["framework-(\\d+\\.\\d+\\.\\d+)\\.js"],
        },
      };

      const context = createMockContext({
        responses: [
          createMockResponse({
            url: "https://cdn.example.com/framework-1.2.3.js",
            host: "cdn.example.com",
            isFirstParty: false,
          }),
        ],
      });

      const result = applySignature(context, signature);
      expect(result).toBeUndefined();
    });

    it("should skip third-party header matches", () => {
      const signature: Signature = {
        name: "PHP",
        rule: {
          confidence: "high",
          headers: {
            "x-powered-by": "php/?(\\d+\\.\\d+\\.\\d+)?",
          },
        },
      };

      const context = createMockContext({
        responses: [
          createMockResponse({
            headers: { "x-powered-by": "PHP/8.3.0" },
            host: "third-party.example",
            isFirstParty: false,
          }),
        ],
      });

      const result = applySignature(context, signature);
      expect(result).toBeUndefined();
    });

    it("should skip third-party cookie matches", () => {
      const signature: Signature = {
        name: "Ruby on Rails",
        rule: {
          confidence: "high",
          cookies: {
            _session_id: ".+",
          },
        },
      };

      const context = createMockContext({
        cookies: [
          createMockCookie({
            name: "_session_id",
            value: "abc123",
            host: "third-party.example",
            isFirstParty: false,
          }),
        ],
      });

      const result = applySignature(context, signature);
      expect(result).toBeUndefined();
    });

    it("should skip third-party HTML body matches", () => {
      const signature: Signature = {
        name: "WordPress",
        rule: {
          confidence: "high",
          bodies: ["wp-content"],
        },
      };

      const context = createMockContext({
        responses: [
          createMockResponse({
            headers: { "content-type": "text/html; charset=utf-8" },
            body: "<html><body>/wp-content/</body></html>",
            host: "third-party.example",
            isFirstParty: false,
          }),
        ],
      });

      const result = applySignature(context, signature);
      expect(result).toBeUndefined();
    });

    it("should include third-party CSS body matches", () => {
      const signature: Signature = {
        name: "Swiper",
        rule: {
          confidence: "high",
          bodies: ["Swiper (\\d+\\.\\d+\\.\\d+)?"],
        },
      };

      const context = createMockContext({
        responses: [
          createMockResponse({
            headers: { "content-type": "text/css; charset=utf-8" },
            body: "/** Swiper 8.4.7 */",
            host: "cdn.example.com",
            isFirstParty: false,
          }),
        ],
      });

      const result = applySignature(context, signature);
      expect(result).toBeDefined();
      expect(result?.evidences?.[0]?.type).toBe("body");
      expect(result?.evidences?.[0]?.version).toBe("8.4.7");
    });

    it("should include third-party JavaScript body matches", () => {
      const signature: Signature = {
        name: "Swiper",
        rule: {
          confidence: "high",
          bodies: ["Swiper (\\d+\\.\\d+\\.\\d+)?"],
        },
      };

      const context = createMockContext({
        responses: [
          createMockResponse({
            headers: { "content-type": "application/javascript; charset=utf-8" },
            body: "/*! Swiper 8.4.7 */",
            host: "cdn.example.com",
            isFirstParty: false,
          }),
        ],
      });

      const result = applySignature(context, signature);
      expect(result).toBeDefined();
      expect(result?.evidences?.[0]?.type).toBe("body");
      expect(result?.evidences?.[0]?.version).toBe("8.4.7");
    });

    it("should skip third-party JavaScript body matches for server runtime signatures", () => {
      const signature: Signature = {
        name: "WordPress",
        runtime: "server",
        rule: {
          confidence: "high",
          bodies: ["wp-content"],
        },
      };

      const context = createMockContext({
        responses: [
          createMockResponse({
            headers: { "content-type": "application/javascript; charset=utf-8" },
            body: "var config = { path: '/wp-content/plugins/foo.js' };",
            host: "www.googletagmanager.com",
            isFirstParty: false,
          }),
        ],
      });

      const result = applySignature(context, signature);
      expect(result).toBeUndefined();
    });
  });

  describe("signature without rule", () => {
    it("should return undefined for signature without rule", () => {
      const signature: Signature = {
        name: "MySQL",
        description: "An open source database",
      };

      const context = createMockContext();
      const result = applySignature(context, signature);

      expect(result).toBeUndefined();
    });
  });

  describe("multiple evidences", () => {
    it("should collect multiple evidences from different sources", () => {
      const signature: Signature = {
        name: "WordPress",
        rule: {
          confidence: "high",
          headers: {
            "x-powered-by": "WordPress",
          },
          urls: ["/wp-content/"],
        },
      };

      const context = createMockContext({
        responses: [
          createMockResponse({
            url: "https://example.com/",
            headers: { "x-powered-by": "WordPress" },
          }),
          createMockResponse({
            url: "https://example.com/wp-content/style.css",
          }),
        ],
      });

      const result = applySignature(context, signature);

      expect(result).toBeDefined();
      expect(result?.evidences?.length).toBeGreaterThanOrEqual(2);
    });
  });
});
