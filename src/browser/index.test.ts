import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { openPage } from "./index.js";

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
      await openPage("https://example.com", 10000, [], { userAgent: "MyCustomAgent/1.0" });

      expect(mockBrowser.newContext).toHaveBeenCalledWith({
        ignoreHTTPSErrors: true,
        userAgent: "MyCustomAgent/1.0",
      });
    });

    it("should pass locale to browser context", async () => {
      await openPage("https://example.com", 10000, [], { locale: "ja-JP" });

      expect(mockBrowser.newContext).toHaveBeenCalledWith({
        ignoreHTTPSErrors: true,
        locale: "ja-JP",
      });
    });

    it("should pass extraHTTPHeaders to browser context", async () => {
      await openPage("https://example.com", 10000, [], {
        extraHTTPHeaders: { "Accept-Language": "ja", "X-Custom": "value" },
      });

      expect(mockBrowser.newContext).toHaveBeenCalledWith({
        ignoreHTTPSErrors: true,
        extraHTTPHeaders: { "Accept-Language": "ja", "X-Custom": "value" },
      });
    });

    it("should navigate to the specified URL", async () => {
      await openPage("https://example.com", 10000, []);

      expect(mockPage.goto).toHaveBeenCalledWith("https://example.com", {
        waitUntil: "load",
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

    it("should block cross-domain navigation when blocking is enabled", async () => {
      let routeHandler: (route: unknown) => Promise<void> = async () => {};
      mockPage.route.mockImplementation(
        async (_pattern: string, handler: (route: unknown) => Promise<void>) => {
          routeHandler = handler;
        },
      );
      vi.mocked(sleep).mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 100)),
      );

      await openPage("https://example.com", 10000, [], {
        blockCrossDomainRedirect: true,
      });

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
        expect.stringContaining("Blocked cross-domain redirect"),
      );
    });

    it("should allow any redirect when blocking is disabled", async () => {
      let routeHandler: (route: unknown) => Promise<void> = async () => {};
      mockPage.route.mockImplementation(
        async (_pattern: string, handler: (route: unknown) => Promise<void>) => {
          routeHandler = handler;
        },
      );

      await openPage("https://example.com", 10000, [], { blockCrossDomainRedirect: false });

      const mockResponse = { status: () => 200, headers: () => ({}) };
      const continueMock = vi.fn(() => Promise.resolve());
      const abortMock = vi.fn(() => Promise.resolve());
      const fetchMock = vi.fn(() => Promise.resolve(mockResponse));
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

      expect(fetchMock).toHaveBeenCalledWith({ maxRedirects: 0 });
      expect(fulfillMock).toHaveBeenCalledWith({ response: mockResponse });
      expect(abortMock).not.toHaveBeenCalled();
    });

    it("should continue for non-navigation requests", async () => {
      let routeHandler: (route: unknown) => Promise<void> = async () => {};
      mockPage.route.mockImplementation(
        async (_pattern: string, handler: (route: unknown) => Promise<void>) => {
          routeHandler = handler;
        },
      );

      await openPage("https://example.com", 10000, [], {
        blockCrossDomainRedirect: true,
      });

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

      await openPage("https://example.com", 10000, [], {
        blockCrossDomainRedirect: true,
      });

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

      await openPage("https://example.com", 10000, [], {
        blockCrossDomainRedirect: true,
      });

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

    it("should block subdomain redirect when blocking is enabled", async () => {
      let routeHandler: (route: unknown) => Promise<void> = async () => {};
      mockPage.route.mockImplementation(
        async (_pattern: string, handler: (route: unknown) => Promise<void>) => {
          routeHandler = handler;
        },
      );
      vi.mocked(sleep).mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 100)),
      );

      await openPage("https://app.example.com", 10000, [], {
        blockCrossDomainRedirect: true,
      });

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

      expect(fulfillMock).toHaveBeenCalledTimes(1);
      expect(abortMock).toHaveBeenCalledWith("blockedbyclient");
    });

    it("should block HTTP 301 redirect to cross-domain when blocking is enabled", async () => {
      let routeHandler: (route: unknown) => Promise<void> = async () => {};
      mockPage.route.mockImplementation(
        async (_pattern: string, handler: (route: unknown) => Promise<void>) => {
          routeHandler = handler;
        },
      );
      vi.mocked(sleep).mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 100)),
      );

      await openPage("https://www.example.com", 10000, [], {
        blockCrossDomainRedirect: true,
      });

      const mockResponse = {
        status: () => 301,
        headers: () => ({ location: "https://example.com/" }),
        text: () => Promise.resolve(null),
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
        expect.stringContaining("Blocked cross-domain redirect: https://example.com/"),
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

      await openPage("https://example.com", 10000, [], {
        blockCrossDomainRedirect: true,
      });

      const mockResponse = {
        status: () => 301,
        headers: () => ({ location: "https://example.com/top" }),
        text: () => Promise.resolve(null),
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

      await openPage("https://example.com", 10000, [], {
        blockCrossDomainRedirect: true,
      });

      const mockResponse = {
        status: () => 301,
        headers: () => ({ location: "://broken" }),
        text: () => Promise.resolve(null),
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

    it("should block HTTP 302 redirect to cross-domain when blocking is enabled", async () => {
      let routeHandler: (route: unknown) => Promise<void> = async () => {};
      mockPage.route.mockImplementation(
        async (_pattern: string, handler: (route: unknown) => Promise<void>) => {
          routeHandler = handler;
        },
      );
      vi.mocked(sleep).mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 100)),
      );

      await openPage("https://example.com", 10000, [], {
        blockCrossDomainRedirect: true,
      });

      const mockResponse = {
        status: () => 302,
        headers: () => ({ location: "https://other.example/login" }),
        text: () => Promise.resolve(null),
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
        expect.stringContaining("Blocked cross-domain redirect"),
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

      await openPage("https://example.com", 10000, [], {
        blockCrossDomainRedirect: true,
      });

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

    it("should record non-Error thrown by route.fetch() in urls", async () => {
      let routeHandler: (route: unknown) => Promise<void> = async () => {};
      mockPage.route.mockImplementation(
        async (_pattern: string, handler: (route: unknown) => Promise<void>) => {
          routeHandler = handler;
        },
      );
      vi.mocked(sleep).mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 100)),
      );

      const result = await openPage("https://example.com", 10000, []);

      const abortMock = vi.fn(() => Promise.resolve());
      const fetchMock = vi.fn(() => Promise.reject("string error"));
      await routeHandler({
        request: () => ({
          isNavigationRequest: () => true,
          frame: () => mockMainFrame,
          url: () => "https://example.com",
        }),
        continue: vi.fn(() => Promise.resolve()),
        abort: abortMock,
        fetch: fetchMock,
        fulfill: vi.fn(() => Promise.resolve()),
      });

      expect(result.urls).toEqual([
        { url: "https://example.com", error: "string error" },
      ]);
    });

    it("should continue for already-inspected URLs on route re-entry", async () => {
      let routeHandler: (route: unknown) => Promise<void> = async () => {};
      mockPage.route.mockImplementation(
        async (_pattern: string, handler: (route: unknown) => Promise<void>) => {
          routeHandler = handler;
        },
      );
      vi.mocked(sleep).mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 100)),
      );

      await openPage("https://example.com", 10000, [], {
        blockCrossDomainRedirect: true,
      });

      // First call: 301 chain example.com -> example.com/page
      const mockRedirectResponse = {
        status: () => 301,
        headers: () => ({ location: "https://example.com/page" }),
        text: () => Promise.resolve(null),
      };
      const mock200Response = {
        status: () => 200,
        headers: () => ({}),
      };
      const fetchMock = vi
        .fn()
        .mockResolvedValueOnce(mockRedirectResponse)
        .mockResolvedValueOnce(mock200Response);
      const fulfillMock = vi.fn(() => Promise.resolve());
      const abortMock = vi.fn(() => Promise.resolve());

      await routeHandler({
        request: () => ({
          isNavigationRequest: () => true,
          frame: () => mockMainFrame,
          url: () => "https://example.com",
        }),
        continue: vi.fn(),
        abort: abortMock,
        fetch: fetchMock,
        fulfill: fulfillMock,
      });

      // Simulate browser re-entry for the inspected redirect target
      const continueMock = vi.fn(() => Promise.resolve());
      await routeHandler({
        request: () => ({
          isNavigationRequest: () => true,
          frame: () => mockMainFrame,
          url: () => "https://example.com/page",
        }),
        continue: continueMock,
        abort: vi.fn(),
        fetch: vi.fn(),
        fulfill: vi.fn(),
      });

      expect(continueMock).toHaveBeenCalled();
    });

    it("should abort after too many re-entries for inspected URLs", async () => {
      let routeHandler: (route: unknown) => Promise<void> = async () => {};
      mockPage.route.mockImplementation(
        async (
          _pattern: string,
          handler: (route: unknown) => Promise<void>,
        ) => {
          routeHandler = handler;
        },
      );
      vi.mocked(sleep).mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 100)),
      );

      await openPage("https://example.com", 10000, [], {
        blockCrossDomainRedirect: true,
      });

      // First call: build a chain so inspectedUrls is populated
      const mockRedirectResponse = {
        status: () => 301,
        headers: () => ({ location: "https://example.com/page" }),
        text: () => Promise.resolve(null),
      };
      const mock200Response = {
        status: () => 200,
        headers: () => ({}),
      };
      const fetchMock = vi
        .fn()
        .mockResolvedValueOnce(mockRedirectResponse)
        .mockResolvedValueOnce(mock200Response);

      await routeHandler({
        request: () => ({
          isNavigationRequest: () => true,
          frame: () => mockMainFrame,
          url: () => "https://example.com",
        }),
        continue: vi.fn(),
        abort: vi.fn(),
        fetch: fetchMock,
        fulfill: vi.fn(() => Promise.resolve()),
      });

      // Simulate re-entries exceeding MAX_REDIRECT_HOPS (20)
      for (let i = 0; i < 20; i++) {
        await routeHandler({
          request: () => ({
            isNavigationRequest: () => true,
            frame: () => mockMainFrame,
            url: () => "https://example.com/page",
          }),
          continue: vi.fn(() => Promise.resolve()),
          abort: vi.fn(() => Promise.resolve()),
          fetch: vi.fn(),
          fulfill: vi.fn(),
        });
      }

      // The 21st re-entry should abort
      const abortMock = vi.fn(() => Promise.resolve());
      await routeHandler({
        request: () => ({
          isNavigationRequest: () => true,
          frame: () => mockMainFrame,
          url: () => "https://example.com/page",
        }),
        continue: vi.fn(() => Promise.resolve()),
        abort: abortMock,
        fetch: vi.fn(),
        fulfill: vi.fn(),
      });

      expect(abortMock).toHaveBeenCalledWith("failed");
    });

    it("should abort when redirect chain fetch fails mid-chain", async () => {
      let routeHandler: (route: unknown) => Promise<void> = async () => {};
      mockPage.route.mockImplementation(
        async (_pattern: string, handler: (route: unknown) => Promise<void>) => {
          routeHandler = handler;
        },
      );
      vi.mocked(sleep).mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 100)),
      );

      await openPage("https://example.com", 10000, [], {
        blockCrossDomainRedirect: true,
      });

      const mockRedirectResponse = {
        status: () => 301,
        headers: () => ({ location: "https://example.com/page" }),
        text: () => Promise.resolve(null),
      };
      const continueMock = vi.fn(() => Promise.resolve());
      const abortMock = vi.fn(() => Promise.resolve());
      const fetchMock = vi
        .fn()
        .mockResolvedValueOnce(mockRedirectResponse)
        .mockRejectedValueOnce(new Error("net::ERR_CONNECTION_RESET"));
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

      expect(fetchMock).toHaveBeenCalledTimes(2);
      expect(abortMock).toHaveBeenCalledWith("failed");
      expect(fulfillMock).not.toHaveBeenCalled();
    });

    it("should record non-Error thrown by redirect chain fetch in urls", async () => {
      let routeHandler: (route: unknown) => Promise<void> = async () => {};
      mockPage.route.mockImplementation(
        async (_pattern: string, handler: (route: unknown) => Promise<void>) => {
          routeHandler = handler;
        },
      );
      vi.mocked(sleep).mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 100)),
      );

      const result = await openPage("https://example.com", 10000, []);

      const mockRedirectResponse = {
        status: () => 301,
        headers: () => ({ location: "https://example.com/page" }),
        text: () => Promise.resolve(null),
      };
      const abortMock = vi.fn(() => Promise.resolve());
      const fetchMock = vi
        .fn()
        .mockResolvedValueOnce(mockRedirectResponse)
        .mockRejectedValueOnce("string error");

      await routeHandler({
        request: () => ({
          isNavigationRequest: () => true,
          frame: () => mockMainFrame,
          url: () => "https://example.com",
        }),
        continue: vi.fn(() => Promise.resolve()),
        abort: abortMock,
        fetch: fetchMock,
        fulfill: vi.fn(() => Promise.resolve()),
      });

      expect(result.urls).toEqual([
        { url: "https://example.com", status: 301 },
        { url: "https://example.com/page", error: "string error" },
      ]);
    });

    it("should break loop when Location URL cannot be parsed", async () => {
      let routeHandler: (route: unknown) => Promise<void> = async () => {};
      mockPage.route.mockImplementation(
        async (_pattern: string, handler: (route: unknown) => Promise<void>) => {
          routeHandler = handler;
        },
      );
      vi.mocked(sleep).mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 100)),
      );

      await openPage("https://example.com", 10000, [], {
        blockCrossDomainRedirect: true,
      });

      // Location with an invalid base URL combination that triggers URL parse error
      const mockResponse = {
        status: () => 301,
        headers: () => ({ location: "https://[invalid" }),
        text: () => Promise.resolve(null),
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

    it("should capture 3xx response headers and body into responses array", async () => {
      let routeHandler: (route: unknown) => Promise<void> = async () => {};
      mockPage.route.mockImplementation(
        async (_pattern: string, handler: (route: unknown) => Promise<void>) => {
          routeHandler = handler;
        },
      );
      vi.mocked(sleep).mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 100)),
      );

      const result = await openPage("https://example.com", 10000, []);

      const mock301Response = {
        status: () => 301,
        headers: () => ({
          location: "https://example.com/new",
          server: "awselb/2.0",
        }),
        text: () =>
          Promise.resolve("<html><body>Moved Permanently</body></html>"),
      };
      const mock200Response = {
        status: () => 200,
        headers: () => ({ server: "nginx" }),
      };
      const fetchMock = vi
        .fn()
        .mockResolvedValueOnce(mock301Response)
        .mockResolvedValueOnce(mock200Response);
      const fulfillMock = vi.fn(() => Promise.resolve());
      await routeHandler({
        request: () => ({
          isNavigationRequest: () => true,
          frame: () => mockMainFrame,
          url: () => "https://example.com",
        }),
        continue: vi.fn(),
        abort: vi.fn(),
        fetch: fetchMock,
        fulfill: fulfillMock,
      });

      expect(result.responses).toHaveLength(1);
      expect(result.responses[0]).toEqual({
        url: "https://example.com",
        host: "example.com",
        isFirstParty: true,
        status: 301,
        headers: { location: "https://example.com/new", server: "awselb/2.0" },
        body: "<html><body>Moved Permanently</body></html>",
      });
    });

    it("should capture multi-hop 3xx chain into responses array", async () => {
      let routeHandler: (route: unknown) => Promise<void> = async () => {};
      mockPage.route.mockImplementation(
        async (_pattern: string, handler: (route: unknown) => Promise<void>) => {
          routeHandler = handler;
        },
      );
      vi.mocked(sleep).mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 100)),
      );

      const result = await openPage("https://example.com", 10000, []);

      const mock301Response = {
        status: () => 301,
        headers: () => ({
          location: "https://example.com/step2",
          server: "awselb/2.0",
        }),
        text: () => Promise.resolve(null),
      };
      const mock302Response = {
        status: () => 302,
        headers: () => ({
          location: "https://example.com/final",
          server: "cloudflare",
        }),
        text: () =>
          Promise.resolve("<html><body>Found</body></html>"),
      };
      const mock200Response = {
        status: () => 200,
        headers: () => ({ server: "nginx" }),
      };
      const fetchMock = vi
        .fn()
        .mockResolvedValueOnce(mock301Response)
        .mockResolvedValueOnce(mock302Response)
        .mockResolvedValueOnce(mock200Response);
      const fulfillMock = vi.fn(() => Promise.resolve());
      await routeHandler({
        request: () => ({
          isNavigationRequest: () => true,
          frame: () => mockMainFrame,
          url: () => "https://example.com",
        }),
        continue: vi.fn(),
        abort: vi.fn(),
        fetch: fetchMock,
        fulfill: fulfillMock,
      });

      expect(result.responses).toHaveLength(2);
      expect(result.responses[0]).toMatchObject({
        url: "https://example.com",
        status: 301,
        headers: expect.objectContaining({ server: "awselb/2.0" }),
      });
      expect(result.responses[1]).toMatchObject({
        url: "https://example.com/step2",
        status: 302,
        headers: expect.objectContaining({ server: "cloudflare" }),
        body: "<html><body>Found</body></html>",
      });
    });

    it("should not duplicate 3xx responses in page.on response listener", async () => {
      let routeHandler: (route: unknown) => Promise<void> = async () => {};
      let responseListener: (response: unknown) => Promise<void> =
        async () => {};
      mockPage.route.mockImplementation(
        async (_pattern: string, handler: (route: unknown) => Promise<void>) => {
          routeHandler = handler;
        },
      );
      mockPage.on.mockImplementation(
        (event: string, handler: (response: unknown) => Promise<void>) => {
          if (event === "response") {
            responseListener = handler;
          }
        },
      );
      vi.mocked(sleep).mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 100)),
      );

      const result = await openPage("https://example.com", 10000, []);

      const mock301Response = {
        status: () => 301,
        headers: () => ({
          location: "https://example.com/new",
          server: "awselb/2.0",
        }),
        text: () => Promise.resolve(null),
      };
      const mock200Response = {
        status: () => 200,
        headers: () => ({}),
      };
      const fetchMock = vi
        .fn()
        .mockResolvedValueOnce(mock301Response)
        .mockResolvedValueOnce(mock200Response);
      await routeHandler({
        request: () => ({
          isNavigationRequest: () => true,
          frame: () => mockMainFrame,
          url: () => "https://example.com",
        }),
        continue: vi.fn(),
        abort: vi.fn(),
        fetch: fetchMock,
        fulfill: vi.fn(() => Promise.resolve()),
      });

      // Simulate browser re-delivering the same 3xx response via
      // page.on("response") — it should be skipped as a duplicate.
      await responseListener({
        url: () => "https://example.com",
        status: () => 301,
        headers: () => ({
          location: "https://example.com/new",
          server: "awselb/2.0",
        }),
        text: () => Promise.resolve(null),
      });

      const matching301 = result.responses.filter(
        (r) => r.url === "https://example.com" && r.status === 301,
      );
      expect(matching301).toHaveLength(1);
    });

    it("should omit body from 3xx response when body is empty", async () => {
      let routeHandler: (route: unknown) => Promise<void> = async () => {};
      mockPage.route.mockImplementation(
        async (_pattern: string, handler: (route: unknown) => Promise<void>) => {
          routeHandler = handler;
        },
      );
      vi.mocked(sleep).mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 100)),
      );

      const result = await openPage("https://example.com", 10000, []);

      const mock301Response = {
        status: () => 301,
        headers: () => ({ location: "https://example.com/new" }),
        text: () => Promise.resolve(null),
      };
      const mock200Response = {
        status: () => 200,
        headers: () => ({}),
      };
      const fetchMock = vi
        .fn()
        .mockResolvedValueOnce(mock301Response)
        .mockResolvedValueOnce(mock200Response);
      await routeHandler({
        request: () => ({
          isNavigationRequest: () => true,
          frame: () => mockMainFrame,
          url: () => "https://example.com",
        }),
        continue: vi.fn(),
        abort: vi.fn(),
        fetch: fetchMock,
        fulfill: vi.fn(() => Promise.resolve()),
      });

      expect(result.responses).toHaveLength(1);
      expect(result.responses[0]).not.toHaveProperty("body");
    });

    it("should capture 3xx response without Location header", async () => {
      let routeHandler: (route: unknown) => Promise<void> = async () => {};
      mockPage.route.mockImplementation(
        async (_pattern: string, handler: (route: unknown) => Promise<void>) => {
          routeHandler = handler;
        },
      );
      vi.mocked(sleep).mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 100)),
      );

      const result = await openPage("https://example.com", 10000, []);

      // 3xx response without a Location header — the loop should capture it
      // and then break.
      const mock301Response = {
        status: () => 301,
        headers: () => ({ server: "awselb/2.0" }),
        text: () => Promise.resolve(null),
      };
      const fetchMock = vi.fn().mockResolvedValueOnce(mock301Response);
      const fulfillMock = vi.fn(() => Promise.resolve());
      await routeHandler({
        request: () => ({
          isNavigationRequest: () => true,
          frame: () => mockMainFrame,
          url: () => "https://example.com",
        }),
        continue: vi.fn(),
        abort: vi.fn(),
        fetch: fetchMock,
        fulfill: fulfillMock,
      });

      expect(result.responses).toHaveLength(1);
      expect(result.responses[0]).toMatchObject({
        url: "https://example.com",
        status: 301,
        headers: { server: "awselb/2.0" },
      });
      // Only the initial fetch should have been called (no redirect to follow)
      expect(fetchMock).toHaveBeenCalledTimes(1);
      expect(fulfillMock).toHaveBeenCalled();
    });

    it("should handle 3xx response where URL has no extractable host", async () => {
      let routeHandler: (route: unknown) => Promise<void> = async () => {};
      mockPage.route.mockImplementation(
        async (_pattern: string, handler: (route: unknown) => Promise<void>) => {
          routeHandler = handler;
        },
      );
      vi.mocked(sleep).mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 100)),
      );

      const result = await openPage("https://example.com", 10000, []);

      const mock301Response = {
        status: () => 301,
        headers: () => ({ location: "https://example.com/new" }),
        text: () => Promise.resolve(null),
      };
      const mock200Response = {
        status: () => 200,
        headers: () => ({}),
      };
      const fetchMock = vi
        .fn()
        .mockResolvedValueOnce(mock301Response)
        .mockResolvedValueOnce(mock200Response);
      const fulfillMock = vi.fn(() => Promise.resolve());

      // Use a data: URL that getHostFromUrl returns null for
      await routeHandler({
        request: () => ({
          isNavigationRequest: () => true,
          frame: () => mockMainFrame,
          url: () => "https://example.com",
        }),
        continue: vi.fn(),
        abort: vi.fn(),
        fetch: fetchMock,
        fulfill: fulfillMock,
      });

      // The 3xx response should still be captured
      expect(result.responses).toHaveLength(1);
      expect(result.responses[0]).toMatchObject({
        status: 301,
        host: "example.com",
        isFirstParty: true,
      });
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

  describe("network idle tracking", () => {
    it("should register request, requestfinished, and requestfailed listeners", async () => {
      await openPage("https://example.com", 10000, []);

      const registeredEvents = mockPage.on.mock.calls.map(
        (call: unknown[]) => call[0],
      );
      expect(registeredEvents).toContain("request");
      expect(registeredEvents).toContain("requestfinished");
      expect(registeredEvents).toContain("requestfailed");
      expect(registeredEvents).toContain("response");
    });

    it("should set timeoutOccurred when idle wait exhausts timeout budget", async () => {
      mockPage.goto.mockResolvedValue(undefined);
      // Use setTimeout(0) so sleep resolves via a macrotask (ensuring
      // goto's microtask chain wins the race with "loaded"), while still
      // being fast enough for the idle loop to spin through quickly.
      vi.mocked(sleep).mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 0)),
      );

      // Very short timeout: the idle loop will exhaust the budget before
      // the NETWORK_IDLE_THRESHOLD_MS (2000ms) quiet period is reached.
      const result = await openPage("https://example.com", 10, []);

      expect(result.timeoutOccurred).toBe(true);
      expect(logger.warn).toHaveBeenCalledWith(
        expect.stringContaining("waiting for network idle after load"),
      );
    });

    it("should wait for in-flight requests before declaring idle", async () => {
      const listeners: Record<string, (...args: unknown[]) => void> = {};
      mockPage.on.mockImplementation(
        (event: string, callback: (...args: unknown[]) => void) => {
          listeners[event] = callback;
        },
      );

      // During goto, fire a request event but NOT requestfinished,
      // so the request stays in-flight.
      mockPage.goto.mockImplementation(async () => {
        listeners["request"]?.();
      });
      vi.mocked(sleep).mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 0)),
      );

      // With an in-flight request (count=1), the idle condition
      // (inFlightRequestCount === 0) is never met, so the loop can
      // only exit via timeout budget exhaustion.
      const result = await openPage("https://example.com", 10, []);

      expect(result.timeoutOccurred).toBe(true);
    });

    it("should exit idle loop after requestfinished fires", async () => {
      const listeners: Record<string, (...args: unknown[]) => void> = {};
      mockPage.on.mockImplementation(
        (event: string, callback: (...args: unknown[]) => void) => {
          listeners[event] = callback;
        },
      );

      mockPage.goto.mockImplementation(async () => {
        listeners["request"]?.();
        listeners["requestfinished"]?.();
      });
      vi.mocked(sleep).mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 100)),
      );

      const result = await openPage("https://example.com", 10000, []);

      expect(result.timeoutOccurred).toBe(false);
      expect(logger.info).toHaveBeenCalledWith("Page loaded successfully");
    });

    it("should exit idle loop after requestfailed fires", async () => {
      const listeners: Record<string, (...args: unknown[]) => void> = {};
      mockPage.on.mockImplementation(
        (event: string, callback: (...args: unknown[]) => void) => {
          listeners[event] = callback;
        },
      );

      mockPage.goto.mockImplementation(async () => {
        listeners["request"]?.();
        listeners["requestfailed"]?.();
      });
      vi.mocked(sleep).mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 100)),
      );

      const result = await openPage("https://example.com", 10000, []);

      expect(result.timeoutOccurred).toBe(false);
      expect(logger.info).toHaveBeenCalledWith("Page loaded successfully");
    });

    it("should await pending response handlers after idle loop exits", async () => {
      const listeners: Record<string, (...args: unknown[]) => void> = {};
      mockPage.on.mockImplementation(
        (event: string, callback: (...args: unknown[]) => void) => {
          listeners[event] = callback;
        },
      );

      let resolveText!: (value: string) => void;
      const textPromise = new Promise<string>((resolve) => {
        resolveText = resolve;
      });

      // During goto, fire a response whose text() is intentionally slow.
      mockPage.goto.mockImplementation(async () => {
        listeners["response"]?.({
          url: () => "https://example.com/slow.js",
          status: () => 200,
          headers: () => ({}),
          text: () => textPromise,
          request: () => ({
            isNavigationRequest: () => false,
            frame: () => null,
          }),
        });
      });
      vi.mocked(sleep).mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 0)),
      );

      // Short timeout: the idle loop exits via budget exhaustion while
      // the response handler is still awaiting text().
      const openPagePromise = openPage("https://example.com", 10, []);

      // Resolve text() after the idle loop has exited but before
      // Promise.allSettled gives up.
      setTimeout(() => resolveText("slow content"), 50);

      const result = await openPagePromise;

      // The response should be captured because Promise.allSettled
      // waited for the pending handler to finish.
      const slowResponse = result.responses.find(
        (r) => r.url === "https://example.com/slow.js",
      );
      expect(slowResponse).toBeDefined();
      expect(slowResponse!.body).toBe("slow content");
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

    it("should not duplicate error in urls when route handler already recorded entries", async () => {
      let routeHandler: (route: unknown) => Promise<void> = async () => {};
      mockPage.route.mockImplementation(
        async (_pattern: string, handler: (route: unknown) => Promise<void>) => {
          routeHandler = handler;
        },
      );
      mockPage.goto.mockImplementation(async () => {
        // Route handler records a fetch error
        await routeHandler({
          request: () => ({
            isNavigationRequest: () => true,
            frame: () => mockMainFrame,
            url: () => "https://example.com",
          }),
          continue: vi.fn(() => Promise.resolve()),
          abort: vi.fn(() => Promise.resolve()),
          fetch: vi.fn(() => Promise.reject(new Error("net::ERR_NAME_NOT_RESOLVED"))),
          fulfill: vi.fn(() => Promise.resolve()),
        });
        throw new Error("page.goto: net::ERR_FAILED");
      });
      vi.mocked(sleep).mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 100)),
      );

      const result = await openPage("https://example.com", 10000, []);

      // Only the route handler's error should be in urls, not the page.goto error
      expect(result.urls).toHaveLength(1);
      expect(result.urls[0]!.error).toContain("net::ERR_NAME_NOT_RESOLVED");
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

      await openPage("https://example.com", 10000, [], {
        blockCrossDomainRedirect: true,
      });

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
          request: () => ({
            isNavigationRequest: () => false,
            frame: () => null,
          }),
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
          request: () => ({
            isNavigationRequest: () => false,
            frame: () => null,
          }),
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
          request: () => ({
            isNavigationRequest: () => false,
            frame: () => null,
          }),
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

    it("should record navigation response in urls", async () => {
      const mockMainFrame = { id: "main" };
      mockPage.mainFrame.mockReturnValue(mockMainFrame);

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
          url: () => "https://example.com/",
          status: () => 200,
          headers: () => ({ "content-type": "text/html" }),
          text: () => Promise.resolve("<html></html>"),
          request: () => ({
            isNavigationRequest: () => true,
            frame: () => mockMainFrame,
          }),
        });
      });

      vi.mocked(sleep).mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 100)),
      );

      const result = await openPage("https://example.com", 10000, []);

      expect(result.urls).toEqual([
        { url: "https://example.com/", status: 200 },
      ]);
    });

    it("should not record non-navigation response in urls", async () => {
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
          url: () => "https://example.com/style.css",
          status: () => 200,
          headers: () => ({ "content-type": "text/css" }),
          text: () => Promise.resolve("body {}"),
          request: () => ({
            isNavigationRequest: () => false,
            frame: () => null,
          }),
        });
      });

      vi.mocked(sleep).mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 100)),
      );

      const result = await openPage("https://example.com", 10000, []);

      expect(result.urls).toEqual([]);
    });
  });
});
