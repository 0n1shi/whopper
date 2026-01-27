import { describe, it, expect, beforeAll } from "vitest";
import { execSync, exec } from "child_process";
import { promisify } from "util";
import { existsSync } from "fs";
import path from "path";

const execAsync = promisify(exec);

const CLI_PATH = path.join(process.cwd(), "dist", "main.js");

describe("CLI E2E Tests", () => {
  beforeAll(() => {
    // Ensure the CLI is built
    if (!existsSync(CLI_PATH)) {
      execSync("npm run build", { stdio: "inherit" });
    }
  });

  describe("--version flag", () => {
    it("should output version number", async () => {
      const { stdout } = await execAsync(`node ${CLI_PATH} --version`);
      expect(stdout.trim()).toMatch(/^\d+\.\d+\.\d+$/);
    });
  });

  describe("--help flag", () => {
    it("should output help information", async () => {
      const { stdout } = await execAsync(`node ${CLI_PATH} --help`);
      expect(stdout).toContain("Usage:");
      expect(stdout).toContain("detect");
      expect(stdout).toContain("version");
    });
  });

  describe("version command", () => {
    it("should output version number", async () => {
      const { stdout } = await execAsync(`node ${CLI_PATH} version`);
      expect(stdout.trim()).toMatch(/^\d+\.\d+\.\d+$/);
    });
  });

  describe("detect command", () => {
    describe("--help flag", () => {
      it("should output detect command help", async () => {
        const { stdout } = await execAsync(`node ${CLI_PATH} detect --help`);
        expect(stdout).toContain("url");
        expect(stdout).toContain("--timeout");
        expect(stdout).toContain("--json");
        expect(stdout).toContain("--evidence");
        expect(stdout).toContain("--debug");
      });
    });

    it("should fail without URL argument", async () => {
      try {
        await execAsync(`node ${CLI_PATH} detect`);
        expect.fail("Should have thrown");
      } catch (error) {
        const err = error as { stderr: string; code: number };
        expect(err.stderr).toContain("url");
      }
    });
  });

  describe("invalid command", () => {
    it("should show error for unknown command", async () => {
      try {
        await execAsync(`node ${CLI_PATH} unknown`);
        expect.fail("Should have thrown");
      } catch (error) {
        const err = error as { stderr: string };
        expect(err.stderr).toContain("unknown");
      }
    });
  });

  describe("banner output", () => {
    it("should display banner on stderr", async () => {
      const { stderr } = await execAsync(`node ${CLI_PATH} --help`);
      expect(stderr).toContain("Whopper");
    });
  });
});

// Optional: Real detection tests (skipped by default due to network dependency)
describe.skip("Detection E2E Tests (requires network)", () => {
  it("should detect technologies on example.com", async () => {
    const { stdout } = await execAsync(
      `node ${CLI_PATH} detect https://example.com --json --timeout 30000`,
    );
    const result = JSON.parse(stdout);
    expect(result).toHaveProperty("detectedSoftwares");
    expect(Array.isArray(result.detectedSoftwares)).toBe(true);
  }, 60000);
});
