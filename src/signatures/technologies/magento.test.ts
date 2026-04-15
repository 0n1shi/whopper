import { describe, it, expect } from "vitest";
import { matchString } from "../../analyzer/match.js";
import { magentoSignature } from "./magento.js";

describe("magentoSignature", () => {
  describe("activeRules", () => {
    it("defines a /magento_version probe", () => {
      expect(magentoSignature.activeRules).toHaveLength(1);
      expect(magentoSignature.activeRules?.[0]?.path).toBe("/magento_version");
    });

    it("extracts version from 'Magento/2.4 (Community)'", () => {
      const rule = magentoSignature.activeRules![0]!;
      const result = matchString("Magento/2.4 (Community)", rule.bodyRegex);
      expect(result.hit).toBe(true);
      expect(result.version).toBe("2.4");
    });

    it("extracts version from 'Magento/2.4.6'", () => {
      const rule = magentoSignature.activeRules![0]!;
      const result = matchString("Magento/2.4.6", rule.bodyRegex);
      expect(result.hit).toBe(true);
      expect(result.version).toBe("2.4.6");
    });

    it("does not match unrelated responses", () => {
      const rule = magentoSignature.activeRules![0]!;
      expect(matchString("<html>not magento</html>", rule.bodyRegex).hit).toBe(
        false,
      );
    });
  });
});
