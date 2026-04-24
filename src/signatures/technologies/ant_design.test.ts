import { describe, it, expect } from "vitest";
import { applySignature } from "../../analyzer/apply.js";
import type { Context, Response } from "../../browser/types.js";
import { antDesignSignature } from "./ant_design.js";

function createMockContext(
  overrides: Partial<Pick<Context, "responses" | "javascriptVariables">> = {},
): Context {
  return {
    browser: {} as Context["browser"],
    page: {} as Context["page"],
    urls: [],
    responses: [],
    cookies: [],
    javascriptVariables: {},
    timeoutMs: 30000,
    timeoutOccurred: false,
    ...overrides,
  };
}

function createMockResponse(overrides: Partial<Response> = {}): Response {
  return {
    url: "https://example.com",
    host: "example.com",
    isFirstParty: true,
    status: 200,
    headers: { "content-type": "text/html" },
    body: "",
    ...overrides,
  };
}

describe("antDesignSignature", () => {
  describe("body matching", () => {
    it("detects Ant Design from ant-* class name", () => {
      const context = createMockContext({
        responses: [
          createMockResponse({
            body: '<button class="ant-btn ant-btn-primary">Click</button>',
          }),
        ],
      });

      const result = applySignature(context, antDesignSignature);
      expect(result).toBeDefined();
    });

    it("detects Ant Design from anticon icon markup", () => {
      const context = createMockContext({
        responses: [
          createMockResponse({
            body: '<i class="anticon anticon-search"></i>',
          }),
        ],
      });

      const result = applySignature(context, antDesignSignature);
      expect(result).toBeDefined();
    });

    it("detects Ant Design from CDN stylesheet with @-delimited version", () => {
      const context = createMockContext({
        responses: [
          createMockResponse({
            body: '<link rel="stylesheet" href="https://cdn.example.com/npm/antd@5.12.0/dist/reset.min.css">',
          }),
        ],
      });

      const result = applySignature(context, antDesignSignature);
      expect(result).toBeDefined();
      expect(result?.evidences?.some((e) => e.version === "5.12.0")).toBe(true);
    });

    it("detects Ant Design from CDN stylesheet with /-delimited version (cdnjs-style)", () => {
      const context = createMockContext({
        responses: [
          createMockResponse({
            body: '<link rel="stylesheet" href="https://cdn.example.com/ajax/libs/antd/5.12.0/antd.min.css">',
          }),
        ],
      });

      const result = applySignature(context, antDesignSignature);
      expect(result).toBeDefined();
      expect(result?.evidences?.some((e) => e.version === "5.12.0")).toBe(true);
    });

    it("detects Ant Design from CDN stylesheet path without version", () => {
      const context = createMockContext({
        responses: [
          createMockResponse({
            body: '<link rel="stylesheet" href="/vendor/antd/dist/antd.min.css">',
          }),
        ],
      });

      const result = applySignature(context, antDesignSignature);
      expect(result).toBeDefined();
    });

    it("detects Ant Design from a stylesheet named antd.css without any path prefix", () => {
      const context = createMockContext({
        responses: [
          createMockResponse({
            body: '<link rel="stylesheet" href="/assets/antd.css">',
          }),
        ],
      });

      const result = applySignature(context, antDesignSignature);
      expect(result).toBeDefined();
    });

    it("detects Ant Design from a minified antd.min.css filename", () => {
      const context = createMockContext({
        responses: [
          createMockResponse({
            body: '<link rel="stylesheet" href="/cdn/antd.min.css">',
          }),
        ],
      });

      const result = applySignature(context, antDesignSignature);
      expect(result).toBeDefined();
    });

    it("does not detect Ant Design when 'antd' is embedded inside a longer word (e.g. antdate.css)", () => {
      const context = createMockContext({
        responses: [
          createMockResponse({
            body: '<link rel="stylesheet" href="/assets/antdate.css">',
          }),
        ],
      });

      const result = applySignature(context, antDesignSignature);
      expect(result).toBeUndefined();
    });

    it("does not detect Ant Design from minified JavaScript that incidentally contains 'antD' inside an unrelated identifier", () => {
      const context = createMockContext({
        responses: [
          createMockResponse({
            body: "var a=someObject.href,b=a.relevantData;function c(x){return x.importantDetails}",
          }),
        ],
      });

      const result = applySignature(context, antDesignSignature);
      expect(result).toBeUndefined();
    });

    it("does not detect Ant Design from an unrelated stylesheet whose filename contains 'antd' as a sub-word", () => {
      const context = createMockContext({
        responses: [
          createMockResponse({
            body: '<link rel="stylesheet" href="/assets/merchantDashboard.css">',
          }),
        ],
      });

      const result = applySignature(context, antDesignSignature);
      expect(result).toBeUndefined();
    });
  });

  describe("javascript variable matching", () => {
    it("detects Ant Design from antd.version variable", () => {
      const context = createMockContext({
        javascriptVariables: {
          "antd.version": "5.12.0",
        },
      });

      const result = applySignature(context, antDesignSignature);
      expect(result).toBeDefined();
      expect(result?.evidences?.some((e) => e.version === "5.12.0")).toBe(true);
    });
  });
});
