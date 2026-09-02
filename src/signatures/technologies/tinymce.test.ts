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

describe("tinyMceSignature", () => {
  describe("body matching", () => {
    it("takes the full version from the TinyMCE 6+ bundle banner", () => {
      const context = createMockContext({
        responses: [
          createMockResponse({
            body: '/**\n * TinyMCE version 8.1.2 (TBD)\n */\n!function(){"use strict"}();',
          }),
        ],
      });

      expect(versionsOf(applySignature(context, tinyMceSignature))).toEqual([
        "8.1.2",
      ]);
    });

    it("takes the full version from the TinyMCE 5 copyright banner", () => {
      const context = createMockContext({
        responses: [
          createMockResponse({
            body: [
              "/**",
              " * Copyright (c) Tiny Technologies, Inc. All rights reserved.",
              " * Licensed under the LGPL or a commercial license.",
              " * For LGPL see License.txt in the project root for license information.",
              " * For commercial licenses see https://www.tiny.cloud/",
              " *",
              " * Version: 5.10.9 (2023-11-15)",
              " */",
            ].join("\n"),
          }),
        ],
      });

      expect(versionsOf(applySignature(context, tinyMceSignature))).toEqual([
        "5.10.9",
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

    it("takes the full version from the TinyMCE 4 leading comment", () => {
      const context = createMockContext({
        responses: [
          createMockResponse({
            body: '// 4.9.11 (2020-07-13)\n!function(V){"use strict"}();',
          }),
        ],
      });

      expect(versionsOf(applySignature(context, tinyMceSignature))).toEqual([
        "4.9.11",
      ]);
    });

    it("ignores a Markdown bullet that repeats the banner", () => {
      const context = createMockContext({
        responses: [
          createMockResponse({
            url: "https://example.com/docs/changelog.md",
            headers: { "content-type": "text/markdown" },
            body: "* TinyMCE version 8.1.2 (2023-11-15)\n* Something else\n",
          }),
        ],
      });

      expect(applySignature(context, tinyMceSignature)).toBeUndefined();
    });

    it("ignores a banner quoted inside a documentation page", () => {
      const context = createMockContext({
        responses: [
          createMockResponse({
            url: "https://example.com/docs/upgrading.html",
            headers: { "content-type": "text/html" },
            body: "<p>The bundle starts with:</p><pre>/**\n * TinyMCE version 8.1.2 (2023-11-15)\n */</pre>",
          }),
        ],
      });

      expect(applySignature(context, tinyMceSignature)).toBeUndefined();
    });

    it("detects a bundle whose banner was stripped without a version", () => {
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
          tinymce: { majorVersion: "8", minorVersion: "1.2" },
        },
      });

      const detection = applySignature(context, tinyMceSignature);
      expect(detection).toBeDefined();
      expect(versionsOf(detection)).toEqual([]);
    });
  });
});
