import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { sleep } from "./utils.js";

describe("sleep", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should resolve after specified milliseconds", async () => {
    const sleepPromise = sleep(1000);
    vi.advanceTimersByTime(1000);
    await expect(sleepPromise).resolves.toBeUndefined();
  });

  it("should not resolve before specified time", async () => {
    let resolved = false;
    sleep(1000).then(() => {
      resolved = true;
    });

    vi.advanceTimersByTime(500);
    await Promise.resolve(); // Flush microtasks
    expect(resolved).toBe(false);

    vi.advanceTimersByTime(500);
    await Promise.resolve(); // Flush microtasks
    expect(resolved).toBe(true);
  });

  it("should handle zero milliseconds", async () => {
    const sleepPromise = sleep(0);
    vi.advanceTimersByTime(0);
    await expect(sleepPromise).resolves.toBeUndefined();
  });
});
