import { describe, it, expect, vi } from "vitest";
import type { APIRequestContext } from "playwright";
import { applyActiveScans } from "../../commands/active_scan_runner.js";
import type { Detection } from "../../analyzer/types.js";
import { drupalSignature } from "./drupal.js";

const makeRequest = (
  impl: (url: string) => { status: number; body: string },
) => {
  const get = vi.fn(async (url: string) => {
    const r = impl(url);
    return {
      status: () => r.status,
      headers: () => ({}),
      text: async () => r.body,
    };
  });
  return { get, request: { get } as unknown as APIRequestContext };
};

const changelog = (version: string, date: string) =>
  `Drupal ${version}, ${date}\n` +
  `----------------------\n` +
  `- Fixed a bunch of things.\n`;

const installPage = (version: string) =>
  `<html><body><span class="site-version">${version}</span></body></html>`;

describe("drupalSignature activeRules", () => {
  it("declares probes for /CHANGELOG.txt, /core/CHANGELOG.txt, then /core/install.php", () => {
    const paths = drupalSignature.activeRules?.map((r) => r.path);
    expect(paths).toEqual([
      "/CHANGELOG.txt",
      "/core/CHANGELOG.txt",
      "/core/install.php",
    ]);
  });

  it("captures version from /CHANGELOG.txt (Drupal 7 layout)", async () => {
    const detections: Detection[] = [{ name: "Drupal", evidences: [] }];
    const { request } = makeRequest((url) =>
      url.endsWith("/CHANGELOG.txt") && !url.endsWith("/core/CHANGELOG.txt")
        ? { status: 200, body: changelog("7.35", "2015-03-18") }
        : { status: 404, body: "" },
    );

    await applyActiveScans(
      "https://example.com/",
      detections,
      [drupalSignature],
      request,
      5000,
    );

    expect(detections[0]!.evidences).toHaveLength(1);
    expect(detections[0]!.evidences![0]).toMatchObject({
      type: "body",
      version: "7.35",
      confidence: "high",
      sourceUrl: "https://example.com/CHANGELOG.txt",
    });
  });

  it("captures version from /core/CHANGELOG.txt when root CHANGELOG.txt is absent (Drupal 8+)", async () => {
    const detections: Detection[] = [{ name: "Drupal", evidences: [] }];
    const { request } = makeRequest((url) =>
      url.endsWith("/core/CHANGELOG.txt")
        ? { status: 200, body: changelog("9.4.5", "2022-08-03") }
        : { status: 404, body: "" },
    );

    await applyActiveScans(
      "https://example.com/",
      detections,
      [drupalSignature],
      request,
      5000,
    );

    expect(detections[0]!.evidences).toHaveLength(1);
    expect(detections[0]!.evidences![0]).toMatchObject({
      version: "9.4.5",
      sourceUrl: "https://example.com/core/CHANGELOG.txt",
    });
  });

  it("falls back to /core/install.php site-version span when no CHANGELOG.txt exists", async () => {
    const detections: Detection[] = [{ name: "Drupal", evidences: [] }];
    const { request } = makeRequest((url) =>
      url.endsWith("/core/install.php")
        ? { status: 200, body: installPage("10.1.0") }
        : { status: 404, body: "" },
    );

    await applyActiveScans(
      "https://example.com/",
      detections,
      [drupalSignature],
      request,
      5000,
    );

    expect(detections[0]!.evidences).toHaveLength(1);
    expect(detections[0]!.evidences![0]).toMatchObject({
      version: "10.1.0",
      sourceUrl: "https://example.com/core/install.php",
    });
  });

  it("does not probe any path when Drupal is not detected", async () => {
    const detections: Detection[] = [{ name: "Other", evidences: [] }];
    const { get, request } = makeRequest(() => ({
      status: 200,
      body: changelog("9.4.5", "2022-08-03"),
    }));

    await applyActiveScans(
      "https://example.com/",
      detections,
      [drupalSignature],
      request,
      5000,
    );

    expect(get).not.toHaveBeenCalled();
  });
});
