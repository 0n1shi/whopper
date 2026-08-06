import { describe, it, expect } from "vitest";
import { outOfScopeUrlSpans } from "./scope.js";

function spannedText(body: string, inScopeHosts: string[]): string[] {
  return outOfScopeUrlSpans(body, inScopeHosts).map(([start, end]) =>
    body.slice(start, end),
  );
}

describe("outOfScopeUrlSpans", () => {
  it("spans an out-of-scope absolute URL", () => {
    const url = "https://external.example/wp-content/plugins/foo/bar.js";
    expect(spannedText(`"${url}"`, ["example.com"])).toEqual([url]);
  });

  it("does not span an in-scope absolute URL", () => {
    const body = '<link href="https://example.com/wp-content/themes/foo.css">';
    expect(outOfScopeUrlSpans(body, ["example.com"])).toEqual([]);
  });

  it("treats a subdomain of the in-scope host as in scope", () => {
    const body = '<script src="https://cdn.example.com/wp-includes/js/a.js">';
    expect(outOfScopeUrlSpans(body, ["example.com"])).toEqual([]);
  });

  it("does not span relative paths", () => {
    const body = '<link href="/wp-content/themes/foo/style.css">';
    expect(outOfScopeUrlSpans(body, ["example.com"])).toEqual([]);
  });

  it("returns no spans when no in-scope hosts are known", () => {
    const body = '"https://external.example/wp-content/plugins/foo/bar.js"';
    expect(outOfScopeUrlSpans(body, [])).toEqual([]);
  });

  it("spans an out-of-scope protocol-relative URL", () => {
    const url = "//external.example/wp-content/plugins/foo/bar.js";
    expect(spannedText(`"${url}"`, ["example.com"])).toEqual([url]);
  });

  it("does not span an in-scope protocol-relative URL", () => {
    const body = '"//example.com/wp-includes/js/a.js"';
    expect(outOfScopeUrlSpans(body, ["example.com"])).toEqual([]);
  });

  it("spans only the out-of-scope URL when both are present", () => {
    const outOfScope = "https://external.example/wp-json/x";
    const body = `"${outOfScope}" and "https://example.com/wp-content/y"`;
    expect(spannedText(body, ["example.com"])).toEqual([outOfScope]);
  });

  it("does not span a URL without an identifiable host", () => {
    // Unparseable and empty-authority (`https://./...`) URLs cannot be proven
    // out of scope, so they are not excluded.
    expect(outOfScopeUrlSpans("see https://[ here", ["example.com"])).toEqual(
      [],
    );
    expect(
      outOfScopeUrlSpans('"https://./wp-content/x"', ["example.com"]),
    ).toEqual([]);
  });
});
