import { describe, it, expect } from "vitest";
import { analyze } from "./index.js";
import type { Context } from "../browser/types.js";
import type { Signature } from "../signatures/_types.js";

function createMockContext(
  overrides: Partial<
    Pick<Context, "responses" | "cookies" | "javascriptVariables">
  > = {},
): Context {
  return {
    browser: {} as Context["browser"],
    page: {} as Context["page"],
    responses: [],
    cookies: [],
    javascriptVariables: {},
    timeoutMs: 30000,
    timeoutOccurred: false,
    ...overrides,
  };
}

describe("analyze", () => {
  it("should return empty array when no signatures match", () => {
    const context = createMockContext({
      responses: [
        {
          url: "https://example.com",
          host: "example.com",
          isFirstParty: true,
          status: 200,
          headers: { server: "Apache/2.4.0" },
        },
      ],
    });

    const signatures: Signature[] = [
      {
        name: "Nginx",
        rule: {
          confidence: "high",
          headers: { server: "^nginx" },
        },
      },
    ];

    const result = analyze(context, signatures);
    expect(result).toEqual([]);
  });

  it("should return detections for matching signatures", () => {
    const context = createMockContext({
      responses: [
        {
          url: "https://example.com",
          host: "example.com",
          isFirstParty: true,
          status: 200,
          headers: { server: "nginx/1.20.0" },
        },
      ],
    });

    const signatures: Signature[] = [
      {
        name: "Nginx",
        rule: {
          confidence: "high",
          headers: { server: "^nginx" },
        },
      },
      {
        name: "Apache",
        rule: {
          confidence: "high",
          headers: { server: "^Apache" },
        },
      },
    ];

    const result = analyze(context, signatures);

    expect(result).toHaveLength(1);
    expect(result[0]?.name).toBe("Nginx");
  });

  it("should detect multiple technologies", () => {
    const context = createMockContext({
      responses: [
        {
          url: "https://example.com/wp-content/style.css",
          host: "example.com",
          isFirstParty: true,
          status: 200,
          headers: {
            server: "nginx/1.20.0",
            "x-powered-by": "PHP/8.1",
          },
        },
      ],
      cookies: [
        {
          name: "PHPSESSID",
          value: "abc123",
          domain: "example.com",
          host: "example.com",
          isFirstParty: true,
          path: "/",
          expires: -1,
          httpOnly: true,
          secure: true,
          sameSite: "Lax",
        },
      ],
    });

    const signatures: Signature[] = [
      {
        name: "Nginx",
        rule: {
          confidence: "high",
          headers: { server: "^nginx" },
        },
      },
      {
        name: "PHP",
        rule: {
          confidence: "high",
          headers: { "x-powered-by": "PHP/(\\d+\\.\\d+)" },
        },
      },
      {
        name: "WordPress",
        rule: {
          confidence: "high",
          urls: ["/wp-content/"],
        },
      },
    ];

    const result = analyze(context, signatures);

    expect(result).toHaveLength(3);
    expect(result.map((d) => d.name).sort()).toEqual([
      "Nginx",
      "PHP",
      "WordPress",
    ]);
  });

  it("should handle empty signatures array", () => {
    const context = createMockContext({
      responses: [
        {
          url: "https://example.com",
          host: "example.com",
          isFirstParty: true,
          status: 200,
          headers: { server: "nginx" },
        },
      ],
    });

    const result = analyze(context, []);
    expect(result).toEqual([]);
  });

  it("should skip signatures without rules", () => {
    const context = createMockContext({
      responses: [
        {
          url: "https://example.com",
          host: "example.com",
          isFirstParty: true,
          status: 200,
          headers: { server: "nginx" },
        },
      ],
    });

    const signatures: Signature[] = [
      {
        name: "MySQL",
        description: "Implied by other technologies",
      },
      {
        name: "Nginx",
        rule: {
          confidence: "high",
          headers: { server: "^nginx" },
        },
      },
    ];

    const result = analyze(context, signatures);

    expect(result).toHaveLength(1);
    expect(result[0]?.name).toBe("Nginx");
  });

  it("should apply smart filtering for third-party responses", () => {
    const context = createMockContext({
      responses: [
        {
          url: "https://cdn.example.com",
          host: "cdn.example.com",
          isFirstParty: false,
          status: 200,
          headers: { "x-powered-by": "PHP/8.3" },
        },
        {
          url: "https://cdn.example.com/swiper@8.4.7/swiper-bundle.min.css",
          host: "cdn.example.com",
          isFirstParty: false,
          status: 200,
          headers: { "content-type": "text/css; charset=utf-8" },
          body: "/** Swiper 8.4.7 */",
        },
      ],
    });

    const signatures: Signature[] = [
      {
        name: "PHP",
        rule: {
          confidence: "high",
          headers: { "x-powered-by": "PHP/(\\d+\\.\\d+)" },
        },
      },
      {
        name: "Swiper",
        rule: {
          confidence: "high",
          urls: ["swiper[@.-](\\d+\\.\\d+\\.\\d+)?"],
        },
      },
    ];

    const result = analyze(context, signatures);
    expect(result).toHaveLength(1);
    expect(result[0]?.name).toBe("Swiper");
  });
});
