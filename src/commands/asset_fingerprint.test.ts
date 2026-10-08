import { createHash } from "node:crypto";
import { describe, expect, it, vi } from "vitest";
import type { APIRequestContext } from "playwright";
import type { Response } from "../browser/types.js";
import type { AssetFingerprint } from "../signatures/_types.js";
import { fingerprintAssets } from "./asset_fingerprint.js";

const sha = (value: string) => createHash("sha256").update(value).digest("hex");
const css = "body { color: black; }\n";
const js = "const someValue = 1;\n";
const fingerprints: AssetFingerprint[] = [
  {
    pathSuffix: "/css/admin/style.css",
    hashes: { [sha(css)]: ["5.0.0", "5.0.1"] },
  },
  {
    pathSuffix: "/js/admin/common.bundle.js",
    hashes: { [sha(js)]: ["5.0.1"] },
  },
];
const page = (body: string): Response => ({
  url: "https://example.com/shop/admin/login/",
  host: "example.com",
  isFirstParty: true,
  status: 200,
  headers: {},
  body,
});
const links = `<link rel="stylesheet" href="/assets/css/admin/style.css"><script src="/assets/js/admin/common.bundle.js"></script>`;
function requestFor(bodies: Record<string, string>, status = 200) {
  const get = vi.fn(async (url: string) => ({
    status: () => (bodies[url] === undefined ? 404 : status),
    headers: () => ({}),
    text: async () => bodies[url] ?? "",
  }));
  return { get, request: { get } as unknown as APIRequestContext };
}
const bodies = {
  "https://example.com/assets/css/admin/style.css": css,
  "https://example.com/assets/js/admin/common.bundle.js": js,
};

describe("fingerprintAssets", () => {
  it("infers a version only from agreeing hashes at two distinct asset paths", async () => {
    const { request } = requestFor(bodies);
    const result = await fingerprintAssets(
      page(links),
      fingerprints,
      request,
      5000,
    );
    expect(result.evidences.map((e) => e.version)).toEqual(["5.0.1", "5.0.1"]);
    expect(result.evidences[0]).toMatchObject({
      type: "hash",
      confidence: "medium",
      value: `sha256:${sha(css)}`,
    });
    expect(result.versionCandidates).toBeUndefined();
  });

  it("keeps ambiguous versions as candidates", async () => {
    const { request } = requestFor(bodies);
    const result = await fingerprintAssets(
      page(links),
      [fingerprints[0]!],
      request,
      5000,
    );
    expect(result.versionCandidates).toEqual(["5.0.0", "5.0.1"]);
    expect(result.evidences[0]?.version).toBeUndefined();
  });

  it("does not promote a single asset even when its candidate is unique", async () => {
    const { request } = requestFor(bodies);
    const result = await fingerprintAssets(
      page(links),
      [fingerprints[1]!],
      request,
      5000,
    );
    expect(result.versionCandidates).toEqual(["5.0.1"]);
    expect(result.evidences[0]?.version).toBeUndefined();
  });

  it("normalizes CRLF consistently with the dictionary generator", async () => {
    const { request } = requestFor(
      Object.fromEntries(
        Object.entries(bodies).map(([url, body]) => [
          url,
          body.replace(/\n/g, "\r\n"),
        ]),
      ),
    );
    const result = await fingerprintAssets(
      page(links),
      fingerprints,
      request,
      5000,
    );
    expect(result.evidences.map((e) => e.version)).toEqual(["5.0.1", "5.0.1"]);
  });

  it("never reinitializes an empty intersection with a later matching asset", async () => {
    const rules = [
      fingerprints[0]!,
      { ...fingerprints[1]!, hashes: { [sha(js)]: ["4.0.0"] } },
      { pathSuffix: "/third.js", hashes: { [sha(js)]: ["4.0.0"] } },
    ];
    const { request } = requestFor({
      ...bodies,
      "https://example.com/third.js": js,
    });
    const result = await fingerprintAssets(
      page(links + '<script src="/third.js"></script>'),
      rules,
      request,
      5000,
    );
    expect(result.evidences).toHaveLength(3);
    expect(result.versionCandidates).toBeUndefined();
    expect(result.evidences.every((e) => e.version === undefined)).toBe(true);
  });

  it("withholds inference when a known asset was modified", async () => {
    const { request } = requestFor({
      ...bodies,
      "https://example.com/assets/js/admin/common.bundle.js": "customized",
    });
    const result = await fingerprintAssets(
      page(links),
      fingerprints,
      request,
      5000,
    );
    expect(result.evidences).toHaveLength(1);
    expect(result.versionCandidates).toBeUndefined();
    expect(result.evidences[0]?.version).toBeUndefined();
  });

  it("resolves relative resources against the final login URL and strips fragments", async () => {
    const url =
      "https://example.com/shop/assets/js/admin/common.bundle.js?v=1&x=2";
    const { request, get } = requestFor({ [url]: js });
    await fingerprintAssets(
      page(
        '<script src="../../assets/js/admin/common.bundle.js?v=1&amp;x=2#anchor"></script>',
      ),
      fingerprints,
      request,
      5000,
    );
    expect(get.mock.calls.map(([url]) => url)).toEqual([url]);
  });

  it("honors a same-origin base URL", async () => {
    const { request, get } = requestFor(bodies);
    await fingerprintAssets(
      page(
        '<base href="/assets/"><script src="js/admin/common.bundle.js"></script>',
      ),
      fingerprints,
      request,
      5000,
    );
    expect(get.mock.calls.map(([url]) => url)).toEqual([
      "https://example.com/assets/js/admin/common.bundle.js",
    ]);
  });

  it("ignores external origins, credentials, comments, inline strings and unrelated paths", async () => {
    const { request, get } = requestFor({});
    const html = `
      <script src="https://other.test/js/admin/common.bundle.js"></script>
      <script src="http://example.com/js/admin/common.bundle.js"></script>
      <script src="https://example.com:8443/js/admin/common.bundle.js"></script>
      <script src="https://user@example.com/js/admin/common.bundle.js"></script>
      <!-- <script src="/assets/js/admin/common.bundle.js"></script> -->
      <script>const someValue = '<link rel="stylesheet" href="/css/admin/style.css">';</script>
      <script src="/unrelated.js"></script>
      <link rel="alternate" href="/css/admin/style.css">
    `;
    await fingerprintAssets(page(html), fingerprints, request, 5000);
    expect(get).not.toHaveBeenCalled();
  });

  it("blocks cross-origin redirects before issuing the redirected request", async () => {
    const get = vi.fn(async () => ({
      status: () => 302,
      headers: () => ({
        location: "https://example.com:8443/js/admin/common.bundle.js",
      }),
    }));
    const result = await fingerprintAssets(
      page(links),
      [fingerprints[1]!],
      { get } as unknown as APIRequestContext,
      5000,
    );
    expect(get).toHaveBeenCalledTimes(1);
    expect(result.evidences).toEqual([]);
  });

  it("ignores non-200 responses even if their bodies match", async () => {
    const { request } = requestFor(bodies, 404);
    const result = await fingerprintAssets(
      page(links),
      fingerprints,
      request,
      5000,
    );
    expect(result).toEqual({ evidences: [] });
  });

  it("deduplicates URLs and cannot turn query aliases into two independent matches", async () => {
    const base = "https://example.com/assets/js/admin/common.bundle.js";
    const { request, get } = requestFor({ [base]: js, [base + "?v=1"]: js });
    const result = await fingerprintAssets(
      page(
        `<script src="${base}"></script><script src="${base}#x"></script><script src="${base}?v=1"></script>`,
      ),
      fingerprints,
      request,
      5000,
    );
    expect(get).toHaveBeenCalledTimes(2);
    expect(result.versionCandidates).toEqual(["5.0.1"]);
    expect(result.evidences.every((e) => e.version === undefined)).toBe(true);
  });

  it("bounds requests and does not start them after the total budget is spent", async () => {
    const { request, get } = requestFor({});
    const html = Array.from(
      { length: 30 },
      (_, i) =>
        `<script src="/assets/js/admin/common.bundle.js?v=${i}"></script>`,
    ).join("");
    await fingerprintAssets(page(html), fingerprints, request, 5000);
    expect(get).toHaveBeenCalledTimes(8);
    get.mockClear();
    await fingerprintAssets(page(html), fingerprints, request, 0);
    expect(get).not.toHaveBeenCalled();
  });
});
