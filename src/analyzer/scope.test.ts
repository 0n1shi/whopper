import { describe, it, expect } from "vitest";
import { stripOutOfScopeUrls } from "./scope.js";

describe("stripOutOfScopeUrls", () => {
  it("removes an out-of-scope absolute URL", () => {
    const body = '"https://external.example/wp-content/plugins/foo/bar.js"';
    const result = stripOutOfScopeUrls(body, ["example.com"]);
    expect(result.includes("wp-content")).toBe(false);
    expect(result.includes("external.example")).toBe(false);
  });

  it("keeps an in-scope absolute URL", () => {
    const body = '<link href="https://example.com/wp-content/themes/foo.css">';
    const result = stripOutOfScopeUrls(body, ["example.com"]);
    expect(result.includes("wp-content")).toBe(true);
  });

  it("treats a subdomain of the in-scope host as in scope", () => {
    const body = '<script src="https://cdn.example.com/wp-includes/js/a.js">';
    const result = stripOutOfScopeUrls(body, ["example.com"]);
    expect(result.includes("wp-includes")).toBe(true);
  });

  it("keeps relative paths untouched", () => {
    const body = '<link href="/wp-content/themes/foo/style.css">';
    const result = stripOutOfScopeUrls(body, ["example.com"]);
    expect(result).toBe(body);
  });

  it("returns the body unchanged when no in-scope hosts are known", () => {
    const body = '"https://external.example/wp-content/plugins/foo/bar.js"';
    const result = stripOutOfScopeUrls(body, []);
    expect(result).toBe(body);
  });

  it("removes only the out-of-scope URL when both are present", () => {
    const body =
      '"https://external.example/wp-json/x" and "https://example.com/wp-content/y"';
    const result = stripOutOfScopeUrls(body, ["example.com"]);
    expect(result.includes("wp-json")).toBe(false);
    expect(result.includes("wp-content")).toBe(true);
  });

  it("removes an out-of-scope protocol-relative URL", () => {
    const body = '"//external.example/wp-content/plugins/foo/bar.js"';
    const result = stripOutOfScopeUrls(body, ["example.com"]);
    expect(result.includes("wp-content")).toBe(false);
  });

  it("keeps an in-scope protocol-relative URL", () => {
    const body = '<script src="//example.com/wp-includes/js/a.js">';
    const result = stripOutOfScopeUrls(body, ["example.com"]);
    expect(result.includes("wp-includes")).toBe(true);
  });

  it("removes query and fragment belonging to an out-of-scope URL", () => {
    const body = 'x="https://external.example/a?p=wp-json#wp-content"';
    const result = stripOutOfScopeUrls(body, ["example.com"]);
    expect(result.includes("wp-json")).toBe(false);
    expect(result.includes("wp-content")).toBe(false);
  });

  it("leaves a token untouched when it does not parse to a host", () => {
    const body = "see https://[ for details";
    const result = stripOutOfScopeUrls(body, ["example.com"]);
    expect(result).toBe(body);
  });

  it("leaves a URL with an empty host untouched", () => {
    // `https://./...` parses to an empty hostname; without a real host we
    // cannot prove it is out of scope, so it must not be stripped.
    const body = '"https://./wp-content/themes/foo/style.css"';
    const result = stripOutOfScopeUrls(body, ["example.com"]);
    expect(result).toBe(body);
  });
});
