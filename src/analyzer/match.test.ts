import { describe, it, expect } from "vitest";
import {
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
  it("returns the value unchanged when shorter than the context window", () => {
    expect(extractMatchSnippet("nginx/1.20.0", 0, 5)).toBe("nginx/1.20.0");
  });

  it("truncates both sides with ellipsis when the match is in the middle", () => {
    const value = `${"a".repeat(60)}MATCH${"b".repeat(60)}`;
    expect(extractMatchSnippet(value, 60, 5, 10)).toBe(
      `...${"a".repeat(10)}MATCH${"b".repeat(10)}...`,
    );
  });

  it("omits the leading ellipsis when the match is near the start", () => {
    const value = `MATCH${"b".repeat(60)}`;
    expect(extractMatchSnippet(value, 0, 5, 10)).toBe(
      `MATCH${"b".repeat(10)}...`,
    );
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
