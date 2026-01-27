import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { run, VERSION } from "./cli.js";

describe("cli", () => {
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>;
  let stdoutWriteSpy: ReturnType<typeof vi.spyOn>;
  let processExitSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    stdoutWriteSpy = vi
      .spyOn(process.stdout, "write")
      .mockImplementation(() => true);
    processExitSpy = vi
      .spyOn(process, "exit")
      .mockImplementation(() => undefined as never);
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
    stdoutWriteSpy.mockRestore();
    processExitSpy.mockRestore();
  });

  describe("VERSION", () => {
    it("should be a valid semver string", () => {
      expect(VERSION).toMatch(/^\d+\.\d+\.\d+$/);
    });
  });

  describe("run", () => {
    it("should print banner on startup", () => {
      run(["node", "whopper", "--help"]);
      const output = consoleErrorSpy.mock.calls
        .map((c: unknown[]) => c[0])
        .join("\n");
      expect(output).toContain("Whopper");
      expect(output).toContain(VERSION);
    });

    it("should show help with --help flag", () => {
      run(["node", "whopper", "--help"]);
      const output = stdoutWriteSpy.mock.calls
        .map((c: unknown[]) => String(c[0]))
        .join("");
      expect(output).toContain("Usage:");
      expect(output).toContain("detect");
    });

    it("should show version with --version flag", () => {
      run(["node", "whopper", "--version"]);
      const output = stdoutWriteSpy.mock.calls
        .map((c: unknown[]) => String(c[0]))
        .join("");
      expect(output).toContain(VERSION);
    });
  });
});
