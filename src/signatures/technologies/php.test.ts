import { describe, it, expect, vi } from "vitest";
import type { APIRequestContext } from "playwright";
import { applyActiveScans } from "../../commands/active_scan_runner.js";
import type { Detection } from "../../analyzer/types.js";
import { phpSignature } from "./php.js";

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

const phpinfoTableBody = (version: string) =>
  `<html><body><table>` +
  `<tr><td class="e">PHP Version</td><td class="v">${version}</td></tr>` +
  `</table></body></html>`;

const phpinfoTableBodyWithTrailingSpace = (version: string) =>
  `<html><body><table>` +
  `<tr><td class="e">PHP Version </td><td class="v">${version} </td></tr>` +
  `</table></body></html>`;

const phpinfoHeadingBody = (version: string) =>
  `<html><body><h1 class="p">PHP Version ${version}</h1></body></html>`;

describe("phpSignature activeRules", () => {
  it("declares probes for info.php, test.php, and phpinfo.php", () => {
    const paths = phpSignature.activeRules?.map((r) => r.path);
    expect(paths).toEqual(["/info.php", "/test.php", "/phpinfo.php"]);
  });

  it("captures version from phpinfo.php table-row body", async () => {
    const detections: Detection[] = [{ name: "PHP", evidences: [] }];
    const { request } = makeRequest((url) =>
      url.endsWith("/phpinfo.php")
        ? { status: 200, body: phpinfoTableBody("8.1.2") }
        : { status: 404, body: "" },
    );

    await applyActiveScans(
      "https://example.com/",
      detections,
      [phpSignature],
      request,
      5000,
    );

    expect(detections[0]!.evidences).toHaveLength(1);
    expect(detections[0]!.evidences![0]).toMatchObject({
      type: "body",
      version: "8.1.2",
      confidence: "high",
      sourceUrl: "https://example.com/phpinfo.php",
    });
  });

  it("captures version from phpinfo.php table-row body with trailing spaces", async () => {
    const detections: Detection[] = [{ name: "PHP", evidences: [] }];
    const { request } = makeRequest((url) =>
      url.endsWith("/phpinfo.php")
        ? { status: 200, body: phpinfoTableBodyWithTrailingSpace("8.1.2") }
        : { status: 404, body: "" },
    );

    await applyActiveScans(
      "https://example.com/",
      detections,
      [phpSignature],
      request,
      5000,
    );

    expect(detections[0]!.evidences).toHaveLength(1);
    expect(detections[0]!.evidences![0]).toMatchObject({
      version: "8.1.2",
      sourceUrl: "https://example.com/phpinfo.php",
    });
  });

  it("captures version from phpinfo.php heading body", async () => {
    const detections: Detection[] = [{ name: "PHP", evidences: [] }];
    const { request } = makeRequest((url) =>
      url.endsWith("/phpinfo.php")
        ? { status: 200, body: phpinfoHeadingBody("8.2.7") }
        : { status: 404, body: "" },
    );

    await applyActiveScans(
      "https://example.com/",
      detections,
      [phpSignature],
      request,
      5000,
    );

    expect(detections[0]!.evidences).toHaveLength(1);
    expect(detections[0]!.evidences![0]).toMatchObject({
      version: "8.2.7",
      sourceUrl: "https://example.com/phpinfo.php",
    });
  });

  it("captures version from info.php when phpinfo.php is absent", async () => {
    const detections: Detection[] = [{ name: "PHP", evidences: [] }];
    const { request } = makeRequest((url) =>
      url.endsWith("/info.php")
        ? { status: 200, body: phpinfoTableBody("7.4.33") }
        : { status: 404, body: "" },
    );

    await applyActiveScans(
      "https://example.com/",
      detections,
      [phpSignature],
      request,
      5000,
    );

    expect(detections[0]!.evidences).toHaveLength(1);
    expect(detections[0]!.evidences![0]).toMatchObject({
      version: "7.4.33",
      sourceUrl: "https://example.com/info.php",
    });
  });

  it("captures version from test.php when only test.php exposes phpinfo", async () => {
    const detections: Detection[] = [{ name: "PHP", evidences: [] }];
    const { request } = makeRequest((url) =>
      url.endsWith("/test.php")
        ? { status: 200, body: phpinfoTableBody("8.3.0") }
        : { status: 404, body: "" },
    );

    await applyActiveScans(
      "https://example.com/",
      detections,
      [phpSignature],
      request,
      5000,
    );

    expect(detections[0]!.evidences).toHaveLength(1);
    expect(detections[0]!.evidences![0]).toMatchObject({
      version: "8.3.0",
      sourceUrl: "https://example.com/test.php",
    });
  });

  it("adds no evidence when responses are 200 but body lacks phpinfo marker", async () => {
    const detections: Detection[] = [{ name: "PHP", evidences: [] }];
    const { request } = makeRequest(() => ({
      status: 200,
      body: "<html><body>not phpinfo</body></html>",
    }));

    await applyActiveScans(
      "https://example.com/",
      detections,
      [phpSignature],
      request,
      5000,
    );

    expect(detections[0]!.evidences).toEqual([]);
  });

  it("does not probe phpinfo paths when PHP is not detected", async () => {
    const detections: Detection[] = [{ name: "Other", evidences: [] }];
    const { get, request } = makeRequest(() => ({
      status: 200,
      body: phpinfoTableBody("8.1.2"),
    }));

    await applyActiveScans(
      "https://example.com/",
      detections,
      [phpSignature],
      request,
      5000,
    );

    expect(get).not.toHaveBeenCalled();
  });
});
