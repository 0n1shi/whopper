import { describe, it, expect } from "vitest";
import { matchString } from "./match.js";

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
