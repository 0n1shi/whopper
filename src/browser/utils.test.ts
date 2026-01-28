import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { sleep, resolvePath, extractJsVariables } from "./utils.js";

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

describe("resolvePath", () => {
  it("should resolve simple property path", () => {
    const obj = { foo: "bar" };
    expect(resolvePath(obj, "foo")).toBe("bar");
  });

  it("should resolve nested property path", () => {
    const obj = { a: { b: { c: "deep" } } };
    expect(resolvePath(obj, "a.b.c")).toBe("deep");
  });

  it("should return undefined for non-existent path", () => {
    const obj = { foo: "bar" };
    expect(resolvePath(obj, "baz")).toBeUndefined();
  });

  it("should return undefined when intermediate is null", () => {
    const obj = { a: null };
    expect(resolvePath(obj, "a.b.c")).toBeUndefined();
  });

  it("should return undefined when intermediate is undefined", () => {
    const obj = { a: undefined };
    expect(resolvePath(obj, "a.b")).toBeUndefined();
  });

  it("should return undefined for null root", () => {
    expect(resolvePath(null, "foo")).toBeUndefined();
  });

  it("should return undefined for undefined root", () => {
    expect(resolvePath(undefined, "foo")).toBeUndefined();
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

  it("should skip non-serializable objects (circular references)", () => {
    const circular: Record<string, unknown> = { name: "circular" };
    circular.self = circular;
    const windowObj = { circular };
    const result = extractJsVariables(windowObj, ["circular"]);
    expect(result["circular"]).toBeUndefined();
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

  it("should skip falsy values (null, 0, empty string) appropriately", () => {
    const windowObj = { nullVal: null, zero: 0, empty: "" };
    const result = extractJsVariables(windowObj, ["nullVal", "zero", "empty"]);
    // All falsy values get skipped after resolvePath because of `if (!val) continue;`
    expect(result["nullVal"]).toBeUndefined();
    expect(result["zero"]).toBeUndefined();
    expect(result["empty"]).toBeUndefined();
  });
});
