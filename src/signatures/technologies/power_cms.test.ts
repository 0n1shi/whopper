import { describe, it, expect } from "vitest";
import { matchString } from "../../analyzer/match.js";
import { powerCmsSignature } from "./power_cms.js";
import { movableTypeSignature } from "./movable_type.js";

describe("powerCmsSignature", () => {
  describe("rule (passive, public-facing marker)", () => {
    const urls = powerCmsSignature.rule?.urls ?? [];
    const bodies = powerCmsSignature.rule?.bodies ?? [];

    it("matches the PowerCMS plugin static path in URLs", () => {
      const url =
        "https://example.com/mt-static/plugins/PowerCMS/css/style.css";
      expect(urls.some((r) => matchString(url, r).hit)).toBe(true);
    });

    it("matches the PowerCMS plugin static path inline in HTML", () => {
      const html =
        '<link rel="stylesheet" href="/mt-static/plugins/PowerCMS/x.css">';
      expect(bodies.some((r) => matchString(html, r).hit)).toBe(true);
    });

    it("does not match a plain Movable Type asset path", () => {
      const url = "https://example.com/mt-static/themes-base/blog.css";
      expect(urls.some((r) => matchString(url, r).hit)).toBe(false);
    });
  });

  describe("activeRules (mt.cgi admin probe)", () => {
    const rules = powerCmsSignature.activeRules ?? [];

    it("probes the root and common install dirs with logout mode", () => {
      expect(rules.map((r) => r.path)).toEqual([
        "/mt.cgi?__mode=logout",
        "/mt/mt.cgi?__mode=logout",
        "/cgi-bin/mt/mt.cgi?__mode=logout",
        "/blog/mt.cgi?__mode=logout",
      ]);
    });

    it("extracts the version from the 'PowerCMS version X.Y' footer", () => {
      const regex = rules[0]!.bodyRegexes.find((r) =>
        r.includes("PowerCMS version"),
      )!;
      const result = matchString("<p>PowerCMS version 5.43</p>", regex);
      expect(result.hit).toBe(true);
      expect(result.version).toBe("5.43");
    });

    it("extracts the version from the 'PowerCMS X.Y' footer", () => {
      const result = rules[0]!.bodyRegexes
        .map((r) => matchString("Powered by PowerCMS 4.46", r))
        .find((r) => r.hit)!;
      expect(result.hit).toBe(true);
      expect(result.version).toBe("4.46");
    });

    it("extracts the version from the v6/v7 'version X.Y' footer (no product prefix)", () => {
      const result = rules[0]!.bodyRegexes
        .map((r) => matchString("<p>version 6.83</p>", r))
        .find((r) => r.hit)!;
      expect(result.hit).toBe(true);
      expect(result.version).toBe("6.83");
    });

    it("does not pick up a single-token 'version 3' as a version", () => {
      const bare = rules[0]!.bodyRegexes.find(
        (r) => r === "\\bversion ([0-9]+\\.[0-9]+(?:\\.[0-9]+)*)",
      )!;
      expect(matchString("requires version 3", bare).hit).toBe(false);
    });

    it("does not match a word that merely ends in 'version' (e.g. Subversion)", () => {
      const bare = rules[0]!.bodyRegexes.find(
        (r) => r === "\\bversion ([0-9]+\\.[0-9]+(?:\\.[0-9]+)*)",
      )!;
      expect(matchString("Subversion 1.14.2", bare).hit).toBe(false);
    });

    it("extracts irregular-precision versions (e.g. 2.0493)", () => {
      const result = rules[0]!.bodyRegexes
        .map((r) => matchString("PowerCMS 2.0493", r))
        .find((r) => r.hit)!;
      expect(result.version).toBe("2.0493");
    });

    it("confirms PowerCMS via the plugin path even without a version", () => {
      const regex = rules[0]!.bodyRegexes.find((r) =>
        r.includes("/mt-static/plugins/PowerCMS/"),
      )!;
      const result = matchString(
        '<img src="/mt-static/plugins/PowerCMS/logo.png">',
        regex,
      );
      expect(result.hit).toBe(true);
      expect(result.version).toBeUndefined();
    });
  });

  it("uses the Alfasado PowerCMS CPE 2.2 identifier", () => {
    expect(powerCmsSignature.cpe).toBe("cpe:/a:alfasado:powercms");
  });

  it("excludes Movable Type so only PowerCMS is reported", () => {
    expect(powerCmsSignature.excludes).toContain(movableTypeSignature.name);
  });

  it("implies Perl as the underlying runtime", () => {
    expect(powerCmsSignature.impliedSoftwares).toContain("Perl");
  });
});
