import { describe, it, expect, vi } from "vitest";
import type { APIRequestContext } from "playwright";
import { applyActiveScans } from "./active_scan_runner.js";
import type { Detection } from "../analyzer/types.js";
import type { Signature } from "../signatures/_types.js";

const makeRequest = (impl: (url: string) => {
  status: number;
  body: string;
}) => {
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

const sig: Signature = {
  name: "Magento",
  rule: { confidence: "high" },
  activeRules: [{ path: "./magento_version", bodyRegex: "^Magento/(\\S+)" }],
};

const otherSig: Signature = {
  name: "Other",
  rule: { confidence: "medium" },
};

describe("applyActiveScans", () => {
  it("adds version evidence when detected and body matches", async () => {
    const detections: Detection[] = [{ name: "Magento", evidences: [] }];
    const { get, request } = makeRequest((url) => {
      expect(url).toBe("https://example.com/shop/magento_version");
      return { status: 200, body: "Magento/2.4 (Community)" };
    });

    await applyActiveScans(
      "https://example.com/shop/",
      detections,
      [sig, otherSig],
      request,
      5000,
    );

    expect(get).toHaveBeenCalledTimes(1);
    expect(detections[0]!.evidences).toHaveLength(1);
    expect(detections[0]!.evidences![0]).toMatchObject({
      type: "body",
      version: "2.4",
      confidence: "high",
      sourceUrl: "https://example.com/shop/magento_version",
    });
  });

  it("does not run when signature is not in detections", async () => {
    const detections: Detection[] = [{ name: "Other", evidences: [] }];
    const { get, request } = makeRequest(() => ({ status: 200, body: "x" }));

    await applyActiveScans(
      "https://example.com/",
      detections,
      [sig, otherSig],
      request,
      5000,
    );

    expect(get).not.toHaveBeenCalled();
    expect(detections[0]!.evidences).toEqual([]);
  });

  it("leaves detection unchanged on non-200", async () => {
    const detections: Detection[] = [{ name: "Magento", evidences: [] }];
    const { request } = makeRequest(() => ({ status: 404, body: "" }));

    await applyActiveScans(
      "https://example.com/",
      detections,
      [sig],
      request,
      5000,
    );

    expect(detections[0]!.evidences).toEqual([]);
  });

  it("leaves detection unchanged when bodyRegex does not match", async () => {
    const detections: Detection[] = [{ name: "Magento", evidences: [] }];
    const { request } = makeRequest(() => ({ status: 200, body: "<html/>" }));

    await applyActiveScans(
      "https://example.com/",
      detections,
      [sig],
      request,
      5000,
    );

    expect(detections[0]!.evidences).toEqual([]);
  });

  it("uses activeRule.confidence override when present", async () => {
    const sigLow: Signature = {
      name: "Magento",
      rule: { confidence: "high" },
      activeRules: [
        {
          path: "./magento_version",
          bodyRegex: "^Magento/(\\S+)",
          confidence: "low",
        },
      ],
    };
    const detections: Detection[] = [{ name: "Magento", evidences: [] }];
    const { request } = makeRequest(() => ({
      status: 200,
      body: "Magento/2.4.6",
    }));

    await applyActiveScans(
      "https://example.com/",
      detections,
      [sigLow],
      request,
      5000,
    );

    expect(detections[0]!.evidences![0]!.confidence).toBe("low");
  });
});
