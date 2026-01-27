import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { openPage } from "./index.js";

// Mock playwright
vi.mock("playwright", () => {
  const mockPage = {
    on: vi.fn(),
    goto: vi.fn(),
    context: vi.fn(),
    evaluate: vi.fn(),
    close: vi.fn(),
  };

  const mockBrowserContext = {
    newPage: vi.fn(() => Promise.resolve(mockPage)),
    cookies: vi.fn(() => Promise.resolve([])),
  };

  const mockBrowser = {
    newContext: vi.fn(() => Promise.resolve(mockBrowserContext)),
    close: vi.fn(),
  };

  return {
    chromium: {
      launch: vi.fn(() => Promise.resolve(mockBrowser)),
    },
  };
});

// Mock logger
vi.mock("../logger/index.js", () => ({
  logger: {
    debug: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  },
}));

// Mock sleep to be instant in tests
vi.mock("./utils.js", () => ({
  sleep: vi.fn(() => Promise.resolve()),
}));

import { chromium } from "playwright";
import { logger } from "../logger/index.js";
import { sleep } from "./utils.js";

describe("openPage", () => {
  let mockPage: {
    on: ReturnType<typeof vi.fn>;
    goto: ReturnType<typeof vi.fn>;
    context: ReturnType<typeof vi.fn>;
    evaluate: ReturnType<typeof vi.fn>;
    close: ReturnType<typeof vi.fn>;
  };
  let mockBrowserContext: {
    newPage: ReturnType<typeof vi.fn>;
    cookies: ReturnType<typeof vi.fn>;
  };
  let mockBrowser: {
    newContext: ReturnType<typeof vi.fn>;
    close: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    vi.clearAllMocks();

    // Get references to mocked objects
    mockPage = {
      on: vi.fn(),
      goto: vi.fn(() => Promise.resolve()),
      context: vi.fn(),
      evaluate: vi.fn(() => Promise.resolve({})),
      close: vi.fn(),
    };

    mockBrowserContext = {
      newPage: vi.fn(() => Promise.resolve(mockPage)),
      cookies: vi.fn(() => Promise.resolve([])),
    };

    mockBrowser = {
      newContext: vi.fn(() => Promise.resolve(mockBrowserContext)),
      close: vi.fn(),
    };

    mockPage.context.mockReturnValue(mockBrowserContext);

    vi.mocked(chromium.launch).mockResolvedValue(mockBrowser as never);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("successful page load", () => {
    it("should launch browser with headless mode", async () => {
      await openPage("https://example.com", 10000, []);

      expect(chromium.launch).toHaveBeenCalledWith({ headless: true });
    });

    it("should create browser context with ignoreHTTPSErrors", async () => {
      await openPage("https://example.com", 10000, []);

      expect(mockBrowser.newContext).toHaveBeenCalledWith({
        ignoreHTTPSErrors: true,
      });
    });

    it("should navigate to the specified URL", async () => {
      await openPage("https://example.com", 10000, []);

      expect(mockPage.goto).toHaveBeenCalledWith("https://example.com", {
        waitUntil: "networkidle",
      });
    });

    it("should log success message on successful load", async () => {
      mockPage.goto.mockResolvedValue(undefined);
      vi.mocked(sleep).mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 100)),
      );

      await openPage("https://example.com", 10000, []);

      expect(logger.info).toHaveBeenCalledWith("Page loaded successfully");
    });

    it("should return context with expected properties", async () => {
      mockPage.goto.mockResolvedValue(undefined);
      vi.mocked(sleep).mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 100)),
      );

      const result = await openPage("https://example.com", 5000, []);

      expect(result).toHaveProperty("browser");
      expect(result).toHaveProperty("page");
      expect(result).toHaveProperty("responses");
      expect(result).toHaveProperty("javascriptVariables");
      expect(result).toHaveProperty("cookies");
      expect(result).toHaveProperty("timeoutMs", 5000);
      expect(result).toHaveProperty("timeoutOccurred", false);
    });
  });

  describe("timeout handling", () => {
    it("should set timeoutOccurred to true when timeout occurs", async () => {
      // Make goto never resolve, and sleep resolve immediately
      mockPage.goto.mockImplementation(
        () => new Promise(() => {}), // Never resolves
      );
      vi.mocked(sleep).mockResolvedValue(undefined);

      const result = await openPage("https://example.com", 1000, []);

      expect(result.timeoutOccurred).toBe(true);
      expect(logger.warn).toHaveBeenCalledWith(
        expect.stringContaining("Timeout"),
      );
    });
  });

  describe("error handling", () => {
    it("should log error when page load fails", async () => {
      mockPage.goto.mockRejectedValue(new Error("Connection refused"));
      vi.mocked(sleep).mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 100)),
      );

      await openPage("https://example.com", 10000, []);

      expect(logger.error).toHaveBeenCalledWith(
        expect.stringContaining("Connection refused"),
      );
    });

    it("should handle cookie/JS extraction failure gracefully", async () => {
      mockPage.goto.mockResolvedValue(undefined);
      mockBrowserContext.cookies.mockRejectedValue(
        new Error("Context destroyed"),
      );
      vi.mocked(sleep).mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 100)),
      );

      const result = await openPage("https://example.com", 10000, []);

      expect(logger.warn).toHaveBeenCalledWith(
        expect.stringContaining("Failed to extract cookies"),
      );
      expect(result.cookies).toEqual([]);
    });
  });

  describe("cookie extraction", () => {
    it("should extract cookies from page context", async () => {
      const mockCookies = [
        {
          name: "session",
          value: "abc123",
          domain: "example.com",
          path: "/",
          expires: -1,
          httpOnly: true,
          secure: true,
          sameSite: "Lax" as const,
        },
      ];

      mockPage.goto.mockResolvedValue(undefined);
      mockBrowserContext.cookies.mockResolvedValue(mockCookies);
      vi.mocked(sleep).mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 100)),
      );

      const result = await openPage("https://example.com", 10000, []);

      expect(result.cookies).toEqual([
        {
          name: "session",
          value: "abc123",
          domain: "example.com",
          path: "/",
          expires: -1,
          httpOnly: true,
          secure: true,
          sameSite: "Lax",
        },
      ]);
    });
  });

  describe("javascript variable extraction", () => {
    it("should evaluate javascript variables on page", async () => {
      mockPage.goto.mockResolvedValue(undefined);
      mockPage.evaluate.mockResolvedValue({ jQuery: "3.6.0" });
      vi.mocked(sleep).mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 100)),
      );

      const result = await openPage("https://example.com", 10000, ["jQuery"]);

      expect(mockPage.evaluate).toHaveBeenCalled();
      expect(result.javascriptVariables).toEqual({ jQuery: "3.6.0" });
    });
  });

  describe("response listener", () => {
    it("should register response listener on page", async () => {
      await openPage("https://example.com", 10000, []);

      expect(mockPage.on).toHaveBeenCalledWith(
        "response",
        expect.any(Function),
      );
    });
  });
});
