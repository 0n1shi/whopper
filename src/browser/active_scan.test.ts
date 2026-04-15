import { describe, it, expect, vi, beforeEach } from "vitest";
import type { APIRequestContext } from "playwright";
import { fetchActiveRule } from "./active_scan.js";

type MockResponse = {
  status: () => number;
  text: () => Promise<string>;
  headers: () => Record<string, string>;
};

const mockRequest = (impl: (url: string) => MockResponse | Promise<MockResponse>) => {
  return {
    get: vi.fn(async (url: string) => impl(url)),
  } as unknown as APIRequestContext;
};

describe("fetchActiveRule", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("fetches a relative path resolved against the base URL", async () => {
    const request = mockRequest((url) => {
      expect(url).toBe("https://example.com/magento_version");
      return {
        status: () => 200,
        text: async () => "Magento/2.4 (Community)",
        headers: () => ({ "content-type": "text/plain" }),
      };
    });

    const res = await fetchActiveRule(
      "https://example.com/some/page",
      "/magento_version",
      request,
      5000,
    );

    expect(res?.url).toBe("https://example.com/magento_version");
    expect(res?.status).toBe(200);
    expect(res?.body).toBe("Magento/2.4 (Community)");
    expect(res?.host).toBe("example.com");
    expect(res?.isFirstParty).toBe(true);
  });

  it("rejects absolute URLs", async () => {
    const request = mockRequest(() => {
      throw new Error("should not be called");
    });

    const res = await fetchActiveRule(
      "https://example.com/",
      "https://evil.example/x",
      request,
      5000,
    );

    expect(res).toBeNull();
  });

  it("rejects protocol-relative paths", async () => {
    const request = mockRequest(() => {
      throw new Error("should not be called");
    });

    const res = await fetchActiveRule(
      "https://example.com/",
      "//evil.example/x",
      request,
      5000,
    );

    expect(res).toBeNull();
  });

  it("returns null when the request throws", async () => {
    const request = mockRequest(() => {
      throw new Error("network down");
    });

    const res = await fetchActiveRule(
      "https://example.com/",
      "/magento_version",
      request,
      5000,
    );

    expect(res).toBeNull();
  });

  describe("URL resolution with /path (host root)", () => {
    const cases: Array<{ base: string; expected: string; note: string }> = [
      {
        base: "https://example.com/",
        expected: "https://example.com/magento_version",
        note: "root",
      },
      {
        base: "https://www.example.com/en/",
        expected: "https://www.example.com/magento_version",
        note: "redirected to subpath ignores subpath",
      },
      {
        base: "https://example.com/shop/catalog/item",
        expected: "https://example.com/magento_version",
        note: "deep path ignored",
      },
    ];

    for (const { base, expected, note } of cases) {
      it(`resolves '/magento_version' on ${note} (${base})`, async () => {
        let called = "";
        const request = mockRequest((url) => {
          called = url;
          return {
            status: () => 200,
            text: async () => "Magento/2.4",
            headers: () => ({}),
          };
        });

        await fetchActiveRule(base, "/magento_version", request, 5000);
        expect(called).toBe(expected);
      });
    }
  });

  describe("URL resolution with ./path", () => {
    const cases: Array<{ base: string; expected: string; note: string }> = [
      {
        base: "https://example.com/",
        expected: "https://example.com/magento_version",
        note: "root",
      },
      {
        base: "https://example.com/shop/",
        expected: "https://example.com/shop/magento_version",
        note: "subpath with trailing slash",
      },
      {
        base: "https://example.com/shop",
        expected: "https://example.com/magento_version",
        note: "subpath without trailing slash (treated as file)",
      },
      {
        base: "https://example.com/index.html",
        expected: "https://example.com/magento_version",
        note: "file at root",
      },
      {
        base: "https://example.com/shop/index.html",
        expected: "https://example.com/shop/magento_version",
        note: "file under subpath",
      },
    ];

    for (const { base, expected, note } of cases) {
      it(`resolves './magento_version' on ${note} (${base})`, async () => {
        let called = "";
        const request = mockRequest((url) => {
          called = url;
          return {
            status: () => 200,
            text: async () => "Magento/2.4",
            headers: () => ({}),
          };
        });

        await fetchActiveRule(base, "./magento_version", request, 5000);
        expect(called).toBe(expected);
      });
    }
  });

  it("returns null when baseUrl is not a valid absolute URL", async () => {
    const request = mockRequest(() => {
      throw new Error("should not be called");
    });

    const res = await fetchActiveRule(
      "not-a-url",
      "./magento_version",
      request,
      5000,
    );

    expect(res).toBeNull();
  });

  it("returns response even on non-200 status (caller decides)", async () => {
    const request = mockRequest(() => ({
      status: () => 404,
      text: async () => "",
      headers: () => ({}),
    }));

    const res = await fetchActiveRule(
      "https://example.com/",
      "/magento_version",
      request,
      5000,
    );

    expect(res?.status).toBe(404);
  });
});
