import { describe, it, expect } from "vitest";
import { demoteConfidence, maxConfidence } from "./utils.js";

describe("maxConfidence", () => {
  it("returns high when any confidence is high", () => {
    expect(maxConfidence(["low", "high", "medium"])).toBe("high");
  });

  it("returns medium when the highest is medium", () => {
    expect(maxConfidence(["low", "medium", "low"])).toBe("medium");
  });

  it("returns low when all are low", () => {
    expect(maxConfidence(["low", "low"])).toBe("low");
  });

  it("returns low for an empty list", () => {
    expect(maxConfidence([])).toBe("low");
  });
});

describe("demoteConfidence", () => {
  it("demotes high to medium", () => {
    expect(demoteConfidence("high")).toBe("medium");
  });

  it("demotes medium to low", () => {
    expect(demoteConfidence("medium")).toBe("low");
  });

  it("keeps low at low", () => {
    expect(demoteConfidence("low")).toBe("low");
  });
});
