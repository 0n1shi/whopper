import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { timeStamp } from "./utils.js";

describe("timeStamp", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should return ISO 8601 formatted timestamp", () => {
    vi.setSystemTime(new Date("2024-01-15T10:30:00.000Z"));
    expect(timeStamp()).toBe("2024-01-15T10:30:00.000Z");
  });

  it("should return current time", () => {
    const now = new Date("2024-06-20T15:45:30.123Z");
    vi.setSystemTime(now);
    expect(timeStamp()).toBe(now.toISOString());
  });
});
