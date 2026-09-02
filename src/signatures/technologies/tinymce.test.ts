import { describe, it, expect } from "vitest";
import { applySignature } from "../../analyzer/apply.js";
import type { Context, Response } from "../../browser/types.js";
import { tinyMceSignature } from "./tinymce.js";

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
    url: "https://example.com/js/tinymce/tinymce.min.js",
    host: "example.com",
    isFirstParty: true,
    status: 200,
    headers: { "content-type": "application/javascript" },
    body: "",
    ...overrides,
  };
}

function versionsOf(detection: ReturnType<typeof applySignature>): string[] {
  return [
    ...new Set(
      (detection?.evidences ?? [])
        .map((evidence) => evidence.version)
        .filter((version): version is string => version !== undefined),
    ),
  ];
}

function editorManager(major: string, minor: string): string {
  return `documentBaseURL:null,suffix:null,majorVersion:"${major}",minorVersion:"${minor}",releaseDate:"2026-07-27",i18n:t`;
}

describe("tinyMceSignature", () => {
  describe("body matching", () => {
    it("joins the major and minor fields into the full version", () => {
      const context = createMockContext({
        responses: [createMockResponse({ body: editorManager("8", "8.2") })],
      });

      expect(versionsOf(applySignature(context, tinyMceSignature))).toEqual([
        "8.8.2",
      ]);
    });

    it("reads the same fields in a TinyMCE 4 bundle", () => {
      const context = createMockContext({
        responses: [createMockResponse({ body: editorManager("4", "9.11") })],
      });

      expect(versionsOf(applySignature(context, tinyMceSignature))).toEqual([
        "4.9.11",
      ]);
    });

    it("reads the version out of an application bundle", () => {
      const context = createMockContext({
        responses: [
          createMockResponse({
            url: "https://example.com/static/spa/index-3ef96762.js",
            body: `var e=1;${editorManager("8", "8.2")};export{e};`,
          }),
        ],
      });

      expect(versionsOf(applySignature(context, tinyMceSignature))).toEqual([
        "8.8.2",
      ]);
    });

    it("ignores a version named in prose on an unrelated page", () => {
      const context = createMockContext({
        responses: [
          createMockResponse({
            url: "https://example.com/blog/release-notes.html",
            headers: { "content-type": "text/html" },
            body: "<p>We upgraded to TinyMCE version 5.10.9 (2023-11-15) last year.</p>",
          }),
        ],
      });

      expect(applySignature(context, tinyMceSignature)).toBeUndefined();
    });

    it("detects a bundle without the version fields but reports no version", () => {
      const context = createMockContext({
        responses: [
          createMockResponse({ body: '!function(){"use strict"}();' }),
        ],
      });

      const detection = applySignature(context, tinyMceSignature);
      expect(detection).toBeDefined();
      expect(versionsOf(detection)).toEqual([]);
    });
  });

  describe("javascript variables", () => {
    it("detects TinyMCE without reporting the major number as a version", () => {
      const context = createMockContext({
        javascriptVariables: {
          "tinyMCE.majorVersion": "8",
          tinymce: { majorVersion: "8", minorVersion: "8.2" },
        },
      });

      const detection = applySignature(context, tinyMceSignature);
      expect(detection).toBeDefined();
      expect(versionsOf(detection)).toEqual([]);
    });
  });
});
