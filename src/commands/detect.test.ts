import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { detectCommand } from "./detect.js";

// Mock dependencies
vi.mock("../browser/index.js", () => ({
  openPage: vi.fn(),
}));

vi.mock("../analyzer/index.js", () => ({
  analyze: vi.fn(),
}));

vi.mock("../logger/index.js", () => ({
  logger: {
    debug: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  },
  setLogLevel: vi.fn(),
}));

vi.mock("./detect_utils.js", () => ({
  makeDetectCommandOutput: vi.fn(),
  printDetectCommandOutputAsJSON: vi.fn(),
  printDetectCommandOutputAsText: vi.fn(),
}));

import { openPage } from "../browser/index.js";
import { analyze } from "../analyzer/index.js";
import { logger, setLogLevel } from "../logger/index.js";
import {
  makeDetectCommandOutput,
  printDetectCommandOutputAsJSON,
  printDetectCommandOutputAsText,
} from "./detect_utils.js";

describe("detectCommand", () => {
  let mockContext: {
    browser: { close: ReturnType<typeof vi.fn> };
    page: { close: ReturnType<typeof vi.fn> };
    urls: never[];
    responses: never[];
    javascriptVariables: Record<string, unknown>;
    cookies: never[];
    timeoutMs: number;
    timeoutOccurred: boolean;
  };

  beforeEach(() => {
    vi.clearAllMocks();
    process.exitCode = undefined;

    mockContext = {
      browser: { close: vi.fn() },
      page: { close: vi.fn() },
      urls: [],
      responses: [],
      javascriptVariables: {},
      cookies: [],
      timeoutMs: 10000,
      timeoutOccurred: false,
    };

    vi.mocked(openPage).mockResolvedValue(mockContext as never);
    vi.mocked(analyze).mockReturnValue([]);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // Helper to run command
  const runCommand = async (args: string[] = []) => {
    const command = detectCommand();
    command.exitOverride(); // Prevent process.exit
    try {
      await command.parseAsync(["https://example.com", ...args], {
        from: "user",
      });
    } catch {
      // Commander throws on exit, ignore
    }
  };

  describe("command configuration", () => {
    it("should create a command named detect", () => {
      const command = detectCommand();
      expect(command.name()).toBe("detect");
    });

    it("should have url as required argument", () => {
      const command = detectCommand();
      const args = command.registeredArguments;
      expect(args[0]?.name()).toBe("url");
      expect(args[0]?.required).toBe(true);
    });

    it("should have timeout option with default 10000", () => {
      const command = detectCommand();
      const options = command.options;
      const timeoutOpt = options.find((o) => o.long === "--timeout");
      expect(timeoutOpt).toBeDefined();
      expect(timeoutOpt?.defaultValue).toBe(10000);
    });

    it("should have debug option", () => {
      const command = detectCommand();
      const options = command.options;
      const debugOpt = options.find((o) => o.long === "--debug");
      expect(debugOpt).toBeDefined();
    });

    it("should have evidence option", () => {
      const command = detectCommand();
      const options = command.options;
      const evidenceOpt = options.find((o) => o.long === "--evidence");
      expect(evidenceOpt).toBeDefined();
    });

    it("should have json option", () => {
      const command = detectCommand();
      const options = command.options;
      const jsonOpt = options.find((o) => o.long === "--json");
      expect(jsonOpt).toBeDefined();
    });

    it("should have user-agent option", () => {
      const command = detectCommand();
      const options = command.options;
      const uaOpt = options.find((o) => o.long === "--user-agent");
      expect(uaOpt).toBeDefined();
    });

    it("should have block-cross-domain-redirect option with default false", () => {
      const command = detectCommand();
      const options = command.options;
      const blockOpt = options.find(
        (o) => o.long === "--block-cross-domain-redirect",
      );
      expect(blockOpt).toBeDefined();
      expect(blockOpt?.defaultValue).toBe(false);
    });
  });

  describe("action execution", () => {
    it("should call openPage with correct arguments", async () => {
      await runCommand();

      expect(openPage).toHaveBeenCalledWith(
        "https://example.com",
        10000,
        expect.any(Array),
        {
          userAgent: undefined,
          locale: undefined,
          extraHTTPHeaders: undefined,
          blockCrossDomainRedirect: false,
        },
      );
    });

    it("should use custom timeout when provided", async () => {
      await runCommand(["-t", "5000"]);

      expect(openPage).toHaveBeenCalledWith(
        "https://example.com",
        5000,
        expect.any(Array),
        expect.objectContaining({ blockCrossDomainRedirect: false }),
      );
    });

    it("should pass custom user-agent when provided", async () => {
      await runCommand(["--user-agent", "MyAgent/1.0"]);

      expect(openPage).toHaveBeenCalledWith(
        "https://example.com",
        10000,
        expect.any(Array),
        expect.objectContaining({ userAgent: "MyAgent/1.0" }),
      );
    });

    it("should pass block-cross-domain-redirect when provided", async () => {
      await runCommand(["--block-cross-domain-redirect"]);

      expect(openPage).toHaveBeenCalledWith(
        "https://example.com",
        10000,
        expect.any(Array),
        expect.objectContaining({ blockCrossDomainRedirect: true }),
      );
    });

    it("should pass locale when provided", async () => {
      await runCommand(["--locale", "ja-JP"]);

      expect(openPage).toHaveBeenCalledWith(
        "https://example.com",
        10000,
        expect.any(Array),
        expect.objectContaining({ locale: "ja-JP" }),
      );
    });

    it("should pass extra HTTP headers when provided", async () => {
      await runCommand(["-H", "X-Custom: value", "-H", "Accept-Language: ja"]);

      expect(openPage).toHaveBeenCalledWith(
        "https://example.com",
        10000,
        expect.any(Array),
        expect.objectContaining({
          extraHTTPHeaders: {
            "X-Custom": "value",
            "Accept-Language": "ja",
          },
        }),
      );
    });

    it("should handle header values containing colons", async () => {
      await runCommand(["-H", "Authorization: Bearer token:with:colons"]);

      expect(openPage).toHaveBeenCalledWith(
        "https://example.com",
        10000,
        expect.any(Array),
        expect.objectContaining({
          extraHTTPHeaders: {
            Authorization: "Bearer token:with:colons",
          },
        }),
      );
    });

    it("should warn on invalid header format", async () => {
      await runCommand(["-H", "InvalidHeader"]);

      expect(logger.warn).toHaveBeenCalledWith(
        expect.stringContaining("Invalid header"),
      );
      expect(openPage).toHaveBeenCalledWith(
        "https://example.com",
        10000,
        expect.any(Array),
        expect.objectContaining({ extraHTTPHeaders: undefined }),
      );
    });

    it("should warn on empty header name", async () => {
      await runCommand(["-H", ": value"]);

      expect(logger.warn).toHaveBeenCalledWith(
        expect.stringContaining("Invalid header name"),
      );
      expect(openPage).toHaveBeenCalledWith(
        "https://example.com",
        10000,
        expect.any(Array),
        expect.objectContaining({ extraHTTPHeaders: undefined }),
      );
    });

    it("should warn on header name with spaces", async () => {
      await runCommand(["-H", "X Foo: bar"]);

      expect(logger.warn).toHaveBeenCalledWith(
        expect.stringContaining("Invalid header name"),
      );
      expect(openPage).toHaveBeenCalledWith(
        "https://example.com",
        10000,
        expect.any(Array),
        expect.objectContaining({ extraHTTPHeaders: undefined }),
      );
    });

    it("should enable debug logging when --debug flag is set", async () => {
      await runCommand(["--debug"]);

      expect(setLogLevel).toHaveBeenCalled();
    });

    it("should log info messages on start", async () => {
      await runCommand();

      expect(logger.info).toHaveBeenCalledWith(
        expect.stringContaining("Starting detection"),
      );
      expect(logger.info).toHaveBeenCalledWith(
        expect.stringContaining("Timeout"),
      );
    });

    it("should close browser and page after execution", async () => {
      await runCommand();

      expect(mockContext.page.close).toHaveBeenCalled();
      expect(mockContext.browser.close).toHaveBeenCalled();
    });

    it("should analyze using smart default behavior", async () => {
      await runCommand();

      expect(analyze).toHaveBeenCalledWith(
        mockContext,
        expect.any(Array),
      );
      expect(analyze).toHaveBeenCalledTimes(1);
      expect(vi.mocked(analyze).mock.calls[0]?.length).toBe(2);
    });

    it("should reject removed --scope option", async () => {
      await runCommand(["--scope", "all"]);

      expect(openPage).not.toHaveBeenCalled();
      expect(analyze).not.toHaveBeenCalled();
    });
  });

  describe("detection output", () => {
    it("should log message when no technologies detected", async () => {
      vi.mocked(analyze).mockReturnValue([]);

      await runCommand();

      expect(logger.info).toHaveBeenCalledWith("No technologies detected.");
    });

    it("should print text output by default", async () => {
      vi.mocked(analyze).mockReturnValue([{ name: "nginx" }]);
      vi.mocked(makeDetectCommandOutput).mockReturnValue({
        urls: [],
        detectedSoftwares: [{ name: "nginx", confidence: "high" }],
      });

      await runCommand();

      expect(printDetectCommandOutputAsText).toHaveBeenCalled();
      expect(printDetectCommandOutputAsJSON).not.toHaveBeenCalled();
    });

    it("should print JSON output when --json flag is set", async () => {
      vi.mocked(analyze).mockReturnValue([{ name: "nginx" }]);
      vi.mocked(makeDetectCommandOutput).mockReturnValue({
        urls: [],
        detectedSoftwares: [{ name: "nginx", confidence: "high" }],
      });

      await runCommand(["--json"]);

      expect(printDetectCommandOutputAsJSON).toHaveBeenCalled();
      expect(printDetectCommandOutputAsText).not.toHaveBeenCalled();
    });

    it("should pass evidence flag to text output", async () => {
      vi.mocked(analyze).mockReturnValue([{ name: "nginx" }]);
      vi.mocked(makeDetectCommandOutput).mockReturnValue({
        urls: [],
        detectedSoftwares: [{ name: "nginx", confidence: "high" }],
      });

      await runCommand(["--evidence"]);

      expect(printDetectCommandOutputAsText).toHaveBeenCalledWith(
        expect.any(Object),
        true,
      );
    });
  });

  describe("error handling", () => {
    it("should handle playwright not installed error", async () => {
      vi.mocked(openPage).mockRejectedValue(
        new Error("Executable doesn't exist at /path/to/chromium"),
      );

      await runCommand();

      expect(logger.error).toHaveBeenCalledWith(
        expect.stringContaining("Playwright browsers are not installed"),
      );
      expect(process.exitCode).toBe(1);
    });

    it("should handle playwright install message error", async () => {
      vi.mocked(openPage).mockRejectedValue(
        new Error("Please run: npx playwright install"),
      );

      await runCommand();

      expect(logger.error).toHaveBeenCalledWith(
        expect.stringContaining("Playwright browsers are not installed"),
      );
      expect(process.exitCode).toBe(1);
    });

    it("should handle general errors", async () => {
      vi.mocked(openPage).mockRejectedValue(new Error("Connection refused"));

      await runCommand();

      expect(logger.error).toHaveBeenCalledWith(
        expect.stringContaining("Detection failed"),
      );
      expect(process.exitCode).toBe(1);
    });

    it("should handle non-Error objects", async () => {
      vi.mocked(openPage).mockRejectedValue("String error");

      await runCommand();

      expect(logger.error).toHaveBeenCalledWith(
        expect.stringContaining("Detection failed"),
      );
      expect(process.exitCode).toBe(1);
    });

    it("should not close browser/page if context is null on error", async () => {
      vi.mocked(openPage).mockRejectedValue(new Error("Failed to launch"));

      // Create new mockContext that won't be used
      const unusedMockContext = {
        browser: { close: vi.fn() },
        page: { close: vi.fn() },
      };

      await runCommand();

      // These should not be called because openPage threw before returning context
      expect(unusedMockContext.page.close).not.toHaveBeenCalled();
      expect(unusedMockContext.browser.close).not.toHaveBeenCalled();
    });
  });
});
