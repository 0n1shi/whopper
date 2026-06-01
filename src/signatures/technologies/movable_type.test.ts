import { describe, it, expect } from "vitest";
import { matchString } from "../../analyzer/match.js";
import { movableTypeSignature } from "./movable_type.js";

describe("movableTypeSignature", () => {
  describe("rule (passive, public-facing markers)", () => {
    const bodies = movableTypeSignature.rule?.bodies ?? [];
    const urls = movableTypeSignature.rule?.urls ?? [];
    const generatorRegex = bodies.find((r) => r.includes("generator"))!;

    it("matches the generator meta tag without a version", () => {
      const html = '<meta name="generator" content="Movable Type" />';
      const result = matchString(html, generatorRegex);
      expect(result.hit).toBe(true);
      expect(result.version).toBeUndefined();
    });

    it("extracts the version from the generator meta tag", () => {
      const html =
        '<meta name="generator" content="Movable Type Pro 7.9.1" />';
      const result = matchString(html, generatorRegex);
      expect(result.hit).toBe(true);
      expect(result.version).toBe("7.9.1");
    });

    it("matches a single-quoted generator meta tag", () => {
      const html =
        "<meta name='generator' content='Movable Type Pro 7.9.1' />";
      const result = matchString(html, generatorRegex);
      expect(result.hit).toBe(true);
      expect(result.version).toBe("7.9.1");
    });

    it("matches mt-static asset URLs", () => {
      const url = "https://example.com/mt-static/themes-base/blog.css";
      expect(urls.some((r) => matchString(url, r).hit)).toBe(true);
    });

    it("matches the admin image marker", () => {
      const html = '<a href="mt.cgi"><img alt="Movable Type" src="logo.png">';
      expect(bodies.some((r) => matchString(html, r).hit)).toBe(true);
    });

    it("extracts the version from the mt-static mt.js asset reference", () => {
      const verRegex = bodies.find((r) => r.includes("mt\\.js"))!;
      const result = matchString(
        '<script src="/mt-static/mt.js?v=7.9.7"></script>',
        verRegex,
      );
      expect(result.hit).toBe(true);
      expect(result.version).toBe("7.9.7");
    });

    it("does not match an escaped generator example quoted in an article", () => {
      const html =
        'Movable Type emits &lt;meta name="generator" ' +
        'content="Movable Type 7"&gt; in the head.';
      expect(bodies.some((r) => matchString(html, r).hit)).toBe(false);
    });

    it("does not match an unrelated page", () => {
      const html =
        '<html><head><title>Some Blog</title>' +
        '<meta name="generator" content="WordPress 6.5" /></head></html>';
      expect(bodies.some((r) => matchString(html, r).hit)).toBe(false);
    });
  });

  describe("activeRules (mt.cgi admin probe)", () => {
    const rules = movableTypeSignature.activeRules ?? [];

    it("probes the root and common install dirs with logout mode", () => {
      expect(rules.map((r) => r.path)).toEqual([
        "/mt.cgi?__mode=logout",
        "/mt/mt.cgi?__mode=logout",
        "/cgi-bin/mt/mt.cgi?__mode=logout",
        "/blog/mt.cgi?__mode=logout",
      ]);
    });

    it("detects the MT v2, v3 and v4 admin-page markers", () => {
      const regexes = rules[0]!.bodyRegexes;
      const v2 = "<html><head><title>MOVABLE TYPE</title></head></html>";
      const v3 = '<a href="mt.cgi"><img alt="Movable Type" src="x">';
      const v4 = "<title>Sign in | Movable Type</title>";
      for (const html of [v2, v3, v4]) {
        expect(regexes.some((r) => matchString(html, r).hit)).toBe(true);
      }
    });

    it("extracts the version from the mt.js asset reference", () => {
      const regex = rules[0]!.bodyRegexes.find((r) => r.includes("mt\\.js"))!;
      const result = matchString('src="/mt.js?v=5.2.6"', regex);
      expect(result.hit).toBe(true);
      expect(result.version).toBe("5.2.6");
    });

    it("extracts the version from the 'Version x.y' marker (MT v2/v3)", () => {
      const regex = rules[0]!.bodyRegexes.find((r) => r.includes("Version"))!;
      const result = matchString("<b>Version 3.2</b>", regex);
      expect(result.hit).toBe(true);
      expect(result.version).toBe("3.2");
    });

    it("keeps a non-numeric version suffix (e.g. Japanese editions)", () => {
      const regex = rules[0]!.bodyRegexes.find((r) => r.includes("Version"))!;
      const result = matchString("<b>Version 3.36-ja</b>", regex);
      expect(result.hit).toBe(true);
      expect(result.version).toBe("3.36-ja");
    });

    it("does not over-capture across multiple <b> tags", () => {
      const regex = rules[0]!.bodyRegexes.find((r) => r.includes("Version"))!;
      const result = matchString("<b>Version 3.2</b> x <b>y</b>", regex);
      expect(result.hit).toBe(true);
      expect(result.version).toBe("3.2");
    });

    it("does not match an unrelated response", () => {
      const probe = rules[0]!;
      expect(
        probe.bodyRegexes.some((r) => matchString("<html>not mt</html>", r).hit),
      ).toBe(false);
    });
  });

  it("uses the Six Apart Movable Type CPE 2.2 identifier", () => {
    expect(movableTypeSignature.cpe).toBe("cpe:/a:sixapart:movable_type");
  });
});
