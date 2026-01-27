import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { versionCommand } from "./version.js";
import { VERSION } from "../cli.js";

describe("versionCommand", () => {
  let consoleLogSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    consoleLogSpy = vi.spyOn(console, "log").mockImplementation(() => {});
  });

  afterEach(() => {
    consoleLogSpy.mockRestore();
  });

  it("should create a command named version", () => {
    const command = versionCommand();
    expect(command.name()).toBe("version");
  });

  it("should have a description", () => {
    const command = versionCommand();
    expect(command.description()).toContain("version");
  });

  it("should print the version when action is called", async () => {
    const command = versionCommand();
    // Parse with just the command name, no extra arguments
    await command.parseAsync([], { from: "user" });
    expect(consoleLogSpy).toHaveBeenCalledWith(VERSION);
  });
});
