import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { sleep, extractJsVariables } from "./utils.js";

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

describe("extractJsVariables", () => {
  it("should extract string variables", () => {
    const windowObj = { jQuery: { fn: { jquery: "3.6.0" } } };
    const result = extractJsVariables(windowObj, ["jQuery.fn.jquery"]);
    expect(result["jQuery.fn.jquery"]).toBe("3.6.0");
  });

  it("should extract number variables", () => {
    const windowObj = { version: 42 };
    const result = extractJsVariables(windowObj, ["version"]);
    expect(result["version"]).toBe(42);
  });

  it("should extract boolean variables", () => {
    const windowObj = { isEnabled: true };
    const result = extractJsVariables(windowObj, ["isEnabled"]);
    expect(result["isEnabled"]).toBe(true);
  });

  it("should extract serializable objects", () => {
    const windowObj = { config: { debug: true, name: "test" } };
    const result = extractJsVariables(windowObj, ["config"]);
    expect(result["config"]).toEqual({ debug: true, name: "test" });
  });

  it("should mark non-serializable objects (circular references) as [Object]", () => {
    const circular: Record<string, unknown> = { name: "circular" };
    circular.self = circular;
    const windowObj = { circular };
    const result = extractJsVariables(windowObj, ["circular"]);
    expect(result["circular"]).toBe("[Object]");
  });

  it("should mark functions as [Function]", () => {
    const windowObj = { jQuery: () => {} };
    const result = extractJsVariables(windowObj, ["jQuery"]);
    expect(result["jQuery"]).toBe("[Function]");
  });

  it("should set undefined for non-existent variables", () => {
    const windowObj = {};
    const result = extractJsVariables(windowObj, ["nonExistent"]);
    expect(result["nonExistent"]).toBeUndefined();
  });

  it("should handle multiple variables", () => {
    const windowObj = { a: "valueA", b: 123, c: { nested: true } };
    const result = extractJsVariables(windowObj, ["a", "b", "c"]);
    expect(result["a"]).toBe("valueA");
    expect(result["b"]).toBe(123);
    expect(result["c"]).toEqual({ nested: true });
  });

  it("should handle properties that throw errors when accessed", () => {
    const windowObj = {
      get dangerous() {
        throw new Error("Access denied");
      },
    };
    const result = extractJsVariables(windowObj, ["dangerous"]);
    expect(result["dangerous"]).toBeUndefined();
  });

  it("should handle falsy values appropriately", () => {
    const windowObj = { nullVal: null, zero: 0, empty: "" };
    const result = extractJsVariables(windowObj, ["nullVal", "zero", "empty"]);
    // null is skipped, but 0 and empty string are valid values
    expect(result["nullVal"]).toBeUndefined();
    expect(result["zero"]).toBe(0);
    expect(result["empty"]).toBe("");
  });
});
