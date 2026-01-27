import { describe, it, expect } from "vitest";
import { banner } from "./banner.js";

describe("banner", () => {
  it("should return a string containing the version", () => {
    const result = banner("1.0.0");
    expect(result).toContain("1.0.0");
  });

  it("should return a string containing Whopper", () => {
    const result = banner("1.0.0");
    expect(result).toContain("Whopper");
  });

  it("should return ASCII art banner", () => {
    const result = banner("1.0.0");
    // Check for presence of ASCII art characters
    expect(result).toContain("██");
    expect(result).toContain("╔");
    expect(result).toContain("╝");
  });

  it("should include description text", () => {
    const result = banner("1.0.0");
    expect(result).toContain("web technology detection tool");
  });
});
