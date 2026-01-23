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
});
