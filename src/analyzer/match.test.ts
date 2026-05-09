import { describe, it, expect } from "vitest";
import {
  buildEvidenceValue,
  extractMatchSnippet,
  matchString,
  truncateBodyForEvidence,
} from "./match.js";

describe("matchString", () => {
  describe("basic matching", () => {
    it("should return hit: true when regex matches", () => {
      const result = matchString("nginx/1.20.0", "nginx");
      expect(result.hit).toBe(true);
    });

    it("should return hit: false when regex does not match", () => {
      const result = matchString("apache/2.4.0", "nginx");
      expect(result.hit).toBe(false);
    });

    it("should be case insensitive", () => {
      const result = matchString("NGINX/1.20.0", "nginx");
      expect(result.hit).toBe(true);
    });
  });

  describe("version extraction", () => {
    it("should extract version from capture group", () => {
      const result = matchString("nginx/1.20.0", "nginx/(\\d+\\.\\d+\\.\\d+)");
      expect(result.hit).toBe(true);
      expect(result.version).toBe("1.20.0");
    });

    it("should return undefined version when no capture group", () => {
      const result = matchString("nginx/1.20.0", "nginx");
      expect(result.hit).toBe(true);
      expect(result.version).toBeUndefined();
    });

    it("should return undefined version when capture group does not match", () => {
      const result = matchString("nginx", "nginx/?(\\d+\\.\\d+\\.\\d+)?");
      expect(result.hit).toBe(true);
      expect(result.version).toBeUndefined();
    });

    it("should extract version with optional prefix", () => {
      const result = matchString("nginx/1.20.0", "^nginx/?(\\d+\\.\\d+\\.\\d+)?");
      expect(result.hit).toBe(true);
      expect(result.version).toBe("1.20.0");
    });
  });

  describe("edge cases", () => {
    it("should handle empty string input", () => {
      const result = matchString("", "nginx");
      expect(result.hit).toBe(false);
    });

    it("should handle regex with special characters", () => {
      const result = matchString("jQuery v3.6.0", "jQuery\\s+v(\\d+\\.\\d+\\.\\d+)");
      expect(result.hit).toBe(true);
      expect(result.version).toBe("3.6.0");
    });
  });
});

describe("extractMatchSnippet", () => {
  it("returns the value unchanged when shorter than maxValueLength", () => {
    expect(extractMatchSnippet("nginx/1.20.0", 0, 5)).toBe("nginx/1.20.0");
  });

  it("returns the value unchanged when length is exactly maxValueLength", () => {
    const value = "a".repeat(200);
    expect(extractMatchSnippet(value, 50, 5)).toBe(value);
  });

  it("truncates both sides with ellipsis when the match is in the middle", () => {
    const value = `${"a".repeat(60)}MATCH${"b".repeat(60)}`;
    expect(
      extractMatchSnippet(value, 60, 5, { context: 10, maxValueLength: 0 }),
    ).toBe(`...${"a".repeat(10)}MATCH${"b".repeat(10)}...`);
  });

  it("omits the leading ellipsis when the match is near the start", () => {
    const value = `MATCH${"b".repeat(60)}`;
    expect(
      extractMatchSnippet(value, 0, 5, { context: 10, maxValueLength: 0 }),
    ).toBe(`MATCH${"b".repeat(10)}...`);
  });

  it("compresses the match itself when it exceeds maxMatchLength", () => {
    const match = `${"x".repeat(100)}MIDDLE${"y".repeat(100)}`;
    const value = `${"a".repeat(20)}${match}${"b".repeat(20)}`;
    const snippet = extractMatchSnippet(value, 20, match.length, {
      context: 5,
      maxMatchLength: 20,
      maxValueLength: 0,
    });
    expect(snippet).toBe(
      `...${"a".repeat(5)}${"x".repeat(10)}...${"y".repeat(10)}${"b".repeat(5)}...`,
    );
  });

  it("does not compress when the match is within maxMatchLength", () => {
    const match = "M".repeat(100);
    const value = `${"a".repeat(20)}${match}${"b".repeat(20)}`;
    const snippet = extractMatchSnippet(value, 20, match.length, {
      context: 5,
      maxMatchLength: 200,
      maxValueLength: 0,
    });
    expect(snippet).toBe(`...${"a".repeat(5)}${match}${"b".repeat(5)}...`);
  });
});

describe("buildEvidenceValue", () => {
  it("returns the raw value as-is when short and no prefix is given", () => {
    expect(
      buildEvidenceValue("nginx/1.20.0", { index: 0, matchLength: 5 }),
    ).toBe("nginx/1.20.0");
  });

  it("attaches the prefix with a colon separator", () => {
    expect(
      buildEvidenceValue(
        "X-Inertia",
        { index: 0, matchLength: 9 },
        "Vary",
      ),
    ).toBe("Vary: X-Inertia");
  });

  it("applies snippet extraction when the raw value exceeds maxValueLength", () => {
    const rawValue = `${"a".repeat(300)}MATCH${"b".repeat(300)}`;
    const result = buildEvidenceValue(
      rawValue,
      { index: 300, matchLength: 5 },
      "Server",
    );
    expect(result.startsWith("Server: ...")).toBe(true);
    expect(result.endsWith("...")).toBe(true);
    expect(result).toContain("MATCH");
    expect(result.length).toBeLessThan(rawValue.length);
  });

  it("returns the raw value untouched when match info is missing", () => {
    const empty = { index: undefined, matchLength: undefined };
    expect(buildEvidenceValue("short", empty)).toBe("short");
    expect(buildEvidenceValue("short", empty, "Cookie")).toBe("Cookie: short");
  });
});

describe("truncateBodyForEvidence", () => {
  it("appends ellipsis when the body exceeds 100 characters", () => {
    const body = "a".repeat(120);
    expect(truncateBodyForEvidence(body)).toBe(`${"a".repeat(100)}...`);
  });

  it("returns the body unchanged when it is 100 characters or shorter", () => {
    expect(truncateBodyForEvidence("Magento/2.4 (Community)")).toBe(
      "Magento/2.4 (Community)",
    );
  });
});
