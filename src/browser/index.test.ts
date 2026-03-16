import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { openPage } from "./index.js";
import { RedirectPolicy } from "./types.js";

// Mock playwright
vi.mock("playwright", () => {
  const mockPage = {
    on: vi.fn(),
    route: vi.fn(),
    mainFrame: vi.fn(),
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

// Mock sleep to be instant in tests, but keep extractJsVariables
vi.mock("./utils.js", async (importOriginal) => {
  const actual = await importOriginal<typeof import("./utils.js")>();
  return {
    ...actual,
    sleep: vi.fn(() => Promise.resolve()),
  };
});

import { chromium } from "playwright";
import { logger } from "../logger/index.js";
import { sleep } from "./utils.js";

describe("openPage", () => {
  let mockPage: {
    on: ReturnType<typeof vi.fn>;
    route: ReturnType<typeof vi.fn>;
    mainFrame: ReturnType<typeof vi.fn>;
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
  let mockMainFrame: { id: string };

  beforeEach(() => {
    vi.clearAllMocks();

    // Get references to mocked objects
    mockPage = {
      on: vi.fn(),
      route: vi.fn(),
      mainFrame: vi.fn(),
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

    mockMainFrame = { id: "main-frame" };
    mockPage.context.mockReturnValue(mockBrowserContext);
    mockPage.mainFrame.mockReturnValue(mockMainFrame);

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

    it("should pass custom userAgent to browser context", async () => {
      await openPage("https://example.com", 10000, [], "MyCustomAgent/1.0");

      expect(mockBrowser.newContext).toHaveBeenCalledWith({
        ignoreHTTPSErrors: true,
        userAgent: "MyCustomAgent/1.0",
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

  describe("redirect policy", () => {
    it("should register route handler for request interception", async () => {
      await openPage("https://example.com", 10000, []);

      expect(mockPage.route).toHaveBeenCalledWith("**/*", expect.any(Function));
    });

    it("should block first cross-host navigation when policy is same-host", async () => {
      let routeHandler: (route: unknown) => Promise<void> = async () => {};
      mockPage.route.mockImplementation(
        async (_pattern: string, handler: (route: unknown) => Promise<void>) => {
          routeHandler = handler;
        },
      );
      vi.mocked(sleep).mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 100)),
      );

      await openPage(
        "https://example.com",
        10000,
        [],
        undefined,
        RedirectPolicy.SameHost,
      );

      const continueMock = vi.fn(() => Promise.resolve());
      const abortMock = vi.fn(() => Promise.resolve());
      const fetchMock = vi.fn();
      const fulfillMock = vi.fn(() => Promise.resolve());
      await routeHandler({
        request: () => ({
          isNavigationRequest: () => true,
          frame: () => mockMainFrame,
          url: () => "https://www.example.com",
        }),
        continue: continueMock,
        abort: abortMock,
        fetch: fetchMock,
        fulfill: fulfillMock,
      });

      expect(abortMock).toHaveBeenCalledWith("blockedbyclient");
      expect(continueMock).not.toHaveBeenCalled();
      expect(fetchMock).not.toHaveBeenCalled();
      expect(logger.warn).toHaveBeenCalledWith(
        expect.stringContaining("Blocked redirect by policy same-host"),
      );
    });

    it("should always continue when policy is any", async () => {
      let routeHandler: (route: unknown) => Promise<void> = async () => {};
      mockPage.route.mockImplementation(
        async (_pattern: string, handler: (route: unknown) => Promise<void>) => {
          routeHandler = handler;
        },
      );

      await openPage("https://example.com", 10000, [], undefined, RedirectPolicy.Any);

      const continueMock = vi.fn(() => Promise.resolve());
      const abortMock = vi.fn(() => Promise.resolve());
      await routeHandler({
        request: () => ({
          isNavigationRequest: () => true,
          frame: () => mockMainFrame,
          url: () => "https://example.net",
        }),
        continue: continueMock,
        abort: abortMock,
      });

      expect(continueMock).toHaveBeenCalledTimes(1);
      expect(abortMock).not.toHaveBeenCalled();
    });

    it("should continue for non-navigation requests", async () => {
      let routeHandler: (route: unknown) => Promise<void> = async () => {};
      mockPage.route.mockImplementation(
        async (_pattern: string, handler: (route: unknown) => Promise<void>) => {
          routeHandler = handler;
        },
      );

      await openPage(
        "https://example.com",
        10000,
        [],
        undefined,
        RedirectPolicy.SameHost,
      );

      const continueMock = vi.fn(() => Promise.resolve());
      const abortMock = vi.fn(() => Promise.resolve());
      await routeHandler({
        request: () => ({
          isNavigationRequest: () => false,
          frame: () => mockMainFrame,
          url: () => "https://example.net/script.js",
        }),
        continue: continueMock,
        abort: abortMock,
      });

      expect(continueMock).toHaveBeenCalledTimes(1);
      expect(abortMock).not.toHaveBeenCalled();
    });

    it("should continue for non-main-frame navigation requests", async () => {
      let routeHandler: (route: unknown) => Promise<void> = async () => {};
      mockPage.route.mockImplementation(
        async (_pattern: string, handler: (route: unknown) => Promise<void>) => {
          routeHandler = handler;
        },
      );

      await openPage(
        "https://example.com",
        10000,
        [],
        undefined,
        RedirectPolicy.SameHost,
      );

      const continueMock = vi.fn(() => Promise.resolve());
      const abortMock = vi.fn(() => Promise.resolve());
      await routeHandler({
        request: () => ({
          isNavigationRequest: () => true,
          frame: () => ({ id: "iframe-1" }),
          url: () => "https://example.net/embedded",
        }),
        continue: continueMock,
        abort: abortMock,
      });

      expect(continueMock).toHaveBeenCalledTimes(1);
      expect(abortMock).not.toHaveBeenCalled();
    });

    it("should continue when navigation target host cannot be parsed", async () => {
      let routeHandler: (route: unknown) => Promise<void> = async () => {};
      mockPage.route.mockImplementation(
        async (_pattern: string, handler: (route: unknown) => Promise<void>) => {
          routeHandler = handler;
        },
      );

      await openPage(
        "https://example.com",
        10000,
        [],
        undefined,
        RedirectPolicy.SameHost,
      );

      const mockResponse = { status: () => 200, headers: () => ({}) };
      const continueMock = vi.fn(() => Promise.resolve());
      const abortMock = vi.fn(() => Promise.resolve());
      const fetchMock = vi.fn(() => Promise.resolve(mockResponse));
      const fulfillMock = vi.fn(() => Promise.resolve());
      // first top-level navigation
      await routeHandler({
        request: () => ({
          isNavigationRequest: () => true,
          frame: () => mockMainFrame,
          url: () => "https://example.com",
        }),
        continue: continueMock,
        abort: abortMock,
        fetch: fetchMock,
        fulfill: fulfillMock,
      });
      // second top-level navigation with invalid URL should still continue
      await routeHandler({
        request: () => ({
          isNavigationRequest: () => true,
          frame: () => mockMainFrame,
          url: () => "not-a-url",
        }),
        continue: continueMock,
        abort: abortMock,
        fetch: fetchMock,
        fulfill: fulfillMock,
      });

      // First call uses fetch+fulfill (same host, allowed), second uses continue (unparseable URL)
      expect(fulfillMock).toHaveBeenCalledTimes(1);
      expect(continueMock).toHaveBeenCalledTimes(1);
      expect(abortMock).not.toHaveBeenCalled();
    });

    it("should allow same-site redirect for subdomains", async () => {
      let routeHandler: (route: unknown) => Promise<void> = async () => {};
      mockPage.route.mockImplementation(
        async (_pattern: string, handler: (route: unknown) => Promise<void>) => {
          routeHandler = handler;
        },
      );
      vi.mocked(sleep).mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 100)),
      );

      await openPage(
        "https://app.example.com",
        10000,
        [],
        undefined,
        RedirectPolicy.SameSite,
      );

      const mockResponse = { status: () => 200, headers: () => ({}) };
      const continueMock = vi.fn(() => Promise.resolve());
      const abortMock = vi.fn(() => Promise.resolve());
      const fetchMock = vi.fn(() => Promise.resolve(mockResponse));
      const fulfillMock = vi.fn(() => Promise.resolve());
      await routeHandler({
        request: () => ({
          isNavigationRequest: () => true,
          frame: () => mockMainFrame,
          url: () => "https://app.example.com",
        }),
        continue: continueMock,
        abort: abortMock,
        fetch: fetchMock,
        fulfill: fulfillMock,
      });
      await routeHandler({
        request: () => ({
          isNavigationRequest: () => true,
          frame: () => mockMainFrame,
          url: () => "https://cdn.example.com",
        }),
        continue: continueMock,
        abort: abortMock,
        fetch: fetchMock,
        fulfill: fulfillMock,
      });

      expect(fulfillMock).toHaveBeenCalledTimes(2);
      expect(abortMock).not.toHaveBeenCalled();
    });

    it("should block first cross-site navigation when policy is same-site", async () => {
      let routeHandler: (route: unknown) => Promise<void> = async () => {};
      mockPage.route.mockImplementation(
        async (_pattern: string, handler: (route: unknown) => Promise<void>) => {
          routeHandler = handler;
        },
      );
      vi.mocked(sleep).mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 100)),
      );

      await openPage(
        "https://example.com",
        10000,
        [],
        undefined,
        RedirectPolicy.SameSite,
      );

      const continueMock = vi.fn(() => Promise.resolve());
      const abortMock = vi.fn(() => Promise.resolve());
      const fetchMock = vi.fn();
      const fulfillMock = vi.fn(() => Promise.resolve());
      await routeHandler({
        request: () => ({
          isNavigationRequest: () => true,
          frame: () => mockMainFrame,
          url: () => "https://example.net",
        }),
        continue: continueMock,
        abort: abortMock,
        fetch: fetchMock,
        fulfill: fulfillMock,
      });

      expect(abortMock).toHaveBeenCalledWith("blockedbyclient");
      expect(continueMock).not.toHaveBeenCalled();
      expect(fetchMock).not.toHaveBeenCalled();
    });

    it("should block HTTP 301 redirect to cross-host when policy is same-host", async () => {
      let routeHandler: (route: unknown) => Promise<void> = async () => {};
      mockPage.route.mockImplementation(
        async (_pattern: string, handler: (route: unknown) => Promise<void>) => {
          routeHandler = handler;
        },
      );
      vi.mocked(sleep).mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 100)),
      );

      await openPage(
        "https://www.example.com",
        10000,
        [],
        undefined,
        RedirectPolicy.SameHost,
      );

      const mockResponse = {
        status: () => 301,
        headers: () => ({ location: "https://example.com/" }),
      };
      const continueMock = vi.fn(() => Promise.resolve());
      const abortMock = vi.fn(() => Promise.resolve());
      const fetchMock = vi.fn(() => Promise.resolve(mockResponse));
      const fulfillMock = vi.fn(() => Promise.resolve());
      await routeHandler({
        request: () => ({
          isNavigationRequest: () => true,
          frame: () => mockMainFrame,
          url: () => "https://www.example.com",
        }),
        continue: continueMock,
        abort: abortMock,
        fetch: fetchMock,
        fulfill: fulfillMock,
      });

      expect(fetchMock).toHaveBeenCalledWith({ maxRedirects: 0 });
      expect(abortMock).toHaveBeenCalledWith("blockedbyclient");
      expect(fulfillMock).not.toHaveBeenCalled();
      expect(logger.warn).toHaveBeenCalledWith(
        expect.stringContaining("Blocked redirect by policy same-host: https://example.com/"),
      );
    });

    it("should allow HTTP 301 redirect to same host", async () => {
      let routeHandler: (route: unknown) => Promise<void> = async () => {};
      mockPage.route.mockImplementation(
        async (_pattern: string, handler: (route: unknown) => Promise<void>) => {
          routeHandler = handler;
        },
      );
      vi.mocked(sleep).mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 100)),
      );

      await openPage(
        "https://example.com",
        10000,
        [],
        undefined,
        RedirectPolicy.SameHost,
      );

      const mockResponse = {
        status: () => 301,
        headers: () => ({ location: "https://example.com/top" }),
      };
      const continueMock = vi.fn(() => Promise.resolve());
      const abortMock = vi.fn(() => Promise.resolve());
      const fetchMock = vi.fn(() => Promise.resolve(mockResponse));
      const fulfillMock = vi.fn(() => Promise.resolve());
      await routeHandler({
        request: () => ({
          isNavigationRequest: () => true,
          frame: () => mockMainFrame,
          url: () => "https://example.com",
        }),
        continue: continueMock,
        abort: abortMock,
        fetch: fetchMock,
        fulfill: fulfillMock,
      });

      expect(fetchMock).toHaveBeenCalledWith({ maxRedirects: 0 });
      expect(fulfillMock).toHaveBeenCalledWith({ response: mockResponse });
      expect(abortMock).not.toHaveBeenCalled();
    });

    it("should fulfill response when Location header is malformed", async () => {
      let routeHandler: (route: unknown) => Promise<void> = async () => {};
      mockPage.route.mockImplementation(
        async (_pattern: string, handler: (route: unknown) => Promise<void>) => {
          routeHandler = handler;
        },
      );
      vi.mocked(sleep).mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 100)),
      );

      await openPage(
        "https://example.com",
        10000,
        [],
        undefined,
        RedirectPolicy.SameHost,
      );

      const mockResponse = {
        status: () => 301,
        headers: () => ({ location: "://broken" }),
      };
      const continueMock = vi.fn(() => Promise.resolve());
      const abortMock = vi.fn(() => Promise.resolve());
      const fetchMock = vi.fn(() => Promise.resolve(mockResponse));
      const fulfillMock = vi.fn(() => Promise.resolve());
      await routeHandler({
        request: () => ({
          isNavigationRequest: () => true,
          frame: () => mockMainFrame,
          url: () => "https://example.com",
        }),
        continue: continueMock,
        abort: abortMock,
        fetch: fetchMock,
        fulfill: fulfillMock,
      });

      expect(fetchMock).toHaveBeenCalledWith({ maxRedirects: 0 });
      expect(fulfillMock).toHaveBeenCalledWith({ response: mockResponse });
      expect(abortMock).not.toHaveBeenCalled();
    });

    it("should block HTTP 302 redirect to cross-site when policy is same-site", async () => {
      let routeHandler: (route: unknown) => Promise<void> = async () => {};
      mockPage.route.mockImplementation(
        async (_pattern: string, handler: (route: unknown) => Promise<void>) => {
          routeHandler = handler;
        },
      );
      vi.mocked(sleep).mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 100)),
      );

      await openPage(
        "https://example.com",
        10000,
        [],
        undefined,
        RedirectPolicy.SameSite,
      );

      const mockResponse = {
        status: () => 302,
        headers: () => ({ location: "https://other.example/login" }),
      };
      const continueMock = vi.fn(() => Promise.resolve());
      const abortMock = vi.fn(() => Promise.resolve());
      const fetchMock = vi.fn(() => Promise.resolve(mockResponse));
      const fulfillMock = vi.fn(() => Promise.resolve());
      await routeHandler({
        request: () => ({
          isNavigationRequest: () => true,
          frame: () => mockMainFrame,
          url: () => "https://example.com",
        }),
        continue: continueMock,
        abort: abortMock,
        fetch: fetchMock,
        fulfill: fulfillMock,
      });

      expect(fetchMock).toHaveBeenCalledWith({ maxRedirects: 0 });
      expect(abortMock).toHaveBeenCalledWith("blockedbyclient");
      expect(fulfillMock).not.toHaveBeenCalled();
      expect(logger.warn).toHaveBeenCalledWith(
        expect.stringContaining("Blocked redirect by policy same-site"),
      );
    });

    it("should abort when route.fetch() throws an error", async () => {
      let routeHandler: (route: unknown) => Promise<void> = async () => {};
      mockPage.route.mockImplementation(
        async (_pattern: string, handler: (route: unknown) => Promise<void>) => {
          routeHandler = handler;
        },
      );
      vi.mocked(sleep).mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 100)),
      );

      await openPage(
        "https://example.com",
        10000,
        [],
        undefined,
        RedirectPolicy.SameHost,
      );

      const continueMock = vi.fn(() => Promise.resolve());
      const abortMock = vi.fn(() => Promise.resolve());
      const fetchMock = vi.fn(() => Promise.reject(new Error("net::ERR_CONNECTION_REFUSED")));
      const fulfillMock = vi.fn(() => Promise.resolve());
      await routeHandler({
        request: () => ({
          isNavigationRequest: () => true,
          frame: () => mockMainFrame,
          url: () => "https://example.com",
        }),
        continue: continueMock,
        abort: abortMock,
        fetch: fetchMock,
        fulfill: fulfillMock,
      });

      expect(fetchMock).toHaveBeenCalledWith({ maxRedirects: 0 });
      expect(abortMock).toHaveBeenCalledWith("failed");
      expect(fulfillMock).not.toHaveBeenCalled();
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

    it("should not log error when navigation is blocked by redirect policy", async () => {
      let routeHandler: (route: unknown) => Promise<void> = async () => {};
      mockPage.route.mockImplementation(
        async (_pattern: string, handler: (route: unknown) => Promise<void>) => {
          routeHandler = handler;
        },
      );
      mockPage.goto.mockImplementation(async () => {
        // Simulate the route handler blocking a cross-host redirect
        await routeHandler({
          request: () => ({
            isNavigationRequest: () => true,
            frame: () => mockMainFrame,
            url: () => "https://other.example",
          }),
          continue: vi.fn(() => Promise.resolve()),
          abort: vi.fn(() => Promise.resolve()),
          fetch: vi.fn(),
          fulfill: vi.fn(() => Promise.resolve()),
        });
        throw new Error("page.goto: net::ERR_BLOCKED_BY_CLIENT");
      });
      vi.mocked(sleep).mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 100)),
      );

      await openPage(
        "https://example.com",
        10000,
        [],
        undefined,
        RedirectPolicy.SameHost,
      );

      expect(logger.error).not.toHaveBeenCalled();
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
          host: "example.com",
          isFirstParty: true,
          path: "/",
          expires: -1,
          httpOnly: true,
          secure: true,
          sameSite: "Lax",
        },
      ]);
    });

    it("should mark third-party cookies as non first-party", async () => {
      const mockCookies = [
        {
          name: "tracking",
          value: "xyz",
          domain: ".thirdparty.example",
          path: "/",
          expires: -1,
          httpOnly: false,
          secure: true,
          sameSite: "None" as const,
        },
      ];

      mockPage.goto.mockResolvedValue(undefined);
      mockBrowserContext.cookies.mockResolvedValue(mockCookies);
      vi.mocked(sleep).mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 100)),
      );

      const result = await openPage("https://example.com", 10000, []);

      expect(result.cookies[0]).toMatchObject({
        host: "thirdparty.example",
        isFirstParty: false,
      });
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

    it("should capture responses with body", async () => {
      let capturedCallback: (response: unknown) => Promise<void>;

      mockPage.on.mockImplementation(
        (event: string, callback: (response: unknown) => Promise<void>) => {
          if (event === "response") {
            capturedCallback = callback;
          }
        },
      );

      mockPage.goto.mockImplementation(async () => {
        // Simulate a response being received during page load
        await capturedCallback({
          url: () => "https://example.com/api/data",
          status: () => 200,
          headers: () => ({ "content-type": "application/json" }),
          text: () => Promise.resolve('{"data": "test"}'),
        });
      });

      vi.mocked(sleep).mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 100)),
      );

      const result = await openPage("https://example.com", 10000, []);

      expect(result.responses).toHaveLength(1);
      expect(result.responses[0]).toEqual({
        url: "https://example.com/api/data",
        host: "example.com",
        isFirstParty: true,
        status: 200,
        headers: { "content-type": "application/json" },
        body: '{"data": "test"}',
      });
      expect(logger.debug).toHaveBeenCalledWith(
        expect.stringMatching(
          /^Received response \[.*200.*\] https:\/\/example\.com\/api\/data$/,
        ),
      );
    });

    it("should capture responses without body when text() fails", async () => {
      let capturedCallback: (response: unknown) => Promise<void>;

      mockPage.on.mockImplementation(
        (event: string, callback: (response: unknown) => Promise<void>) => {
          if (event === "response") {
            capturedCallback = callback;
          }
        },
      );

      mockPage.goto.mockImplementation(async () => {
        await capturedCallback({
          url: () => "https://example.com/binary",
          status: () => 200,
          headers: () => ({ "content-type": "application/octet-stream" }),
          text: () => Promise.reject(new Error("Cannot read binary")),
        });
      });

      vi.mocked(sleep).mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 100)),
      );

      const result = await openPage("https://example.com", 10000, []);

      expect(result.responses).toHaveLength(1);
      expect(result.responses[0]).toEqual({
        url: "https://example.com/binary",
        host: "example.com",
        isFirstParty: true,
        status: 200,
        headers: { "content-type": "application/octet-stream" },
      });
      expect(result.responses[0]?.body).toBeUndefined();
    });

    it("should mark third-party responses as non first-party", async () => {
      let capturedCallback: (response: unknown) => Promise<void>;

      mockPage.on.mockImplementation(
        (event: string, callback: (response: unknown) => Promise<void>) => {
          if (event === "response") {
            capturedCallback = callback;
          }
        },
      );

      mockPage.goto.mockImplementation(async () => {
        await capturedCallback({
          url: () => "https://cdn.example.net/app.js",
          status: () => 200,
          headers: () => ({ "content-type": "text/javascript" }),
          text: () => Promise.resolve("console.log('ok')"),
        });
      });

      vi.mocked(sleep).mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 100)),
      );

      const result = await openPage("https://example.com", 10000, []);

      expect(result.responses[0]).toMatchObject({
        host: "cdn.example.net",
        isFirstParty: false,
      });
    });
  });
});
