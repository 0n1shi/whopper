import { describe, it, expect } from "vitest";
import { signatures } from "./index.js";
import { isRelativePath } from "../browser/active_scan.js";

const VALID_CONFIDENCES = ["high", "medium", "low"];

describe("signatures validation", () => {
  describe("required fields", () => {
    it("all signatures should have a non-empty name", () => {
      for (const sig of signatures) {
        expect(sig.name, `Signature missing name`).toBeDefined();
        expect(sig.name.length, `Signature has empty name`).toBeGreaterThan(0);
      }
    });
  });

  describe("uniqueness", () => {
    it("all signature names should be unique", () => {
      const names = signatures.map((s) => s.name);
      const duplicates = names.filter(
        (name, index) => names.indexOf(name) !== index,
      );
      expect(
        duplicates,
        `Duplicate signature names: ${duplicates.join(", ")}`,
      ).toEqual([]);
    });
  });

  describe("confidence values", () => {
    it("all rules should have valid confidence values", () => {
      for (const sig of signatures) {
        if (sig.rule) {
          expect(
            VALID_CONFIDENCES,
            `Invalid confidence "${sig.rule.confidence}" in ${sig.name}`,
          ).toContain(sig.rule.confidence);
        }
      }
    });
  });

  describe("runtime values", () => {
    it("all runtime values should be valid when present", () => {
      const validRuntimes = ["client", "server"];
      for (const sig of signatures) {
        if (sig.runtime) {
          expect(
            validRuntimes,
            `Invalid runtime "${sig.runtime}" in ${sig.name}`,
          ).toContain(sig.runtime);
        }
      }
    });
  });

  describe("regex patterns", () => {
    const testRegex = (pattern: string, sigName: string, field: string) => {
      try {
        new RegExp(pattern, "i");
      } catch {
        throw new Error(`Invalid regex in ${sigName}.${field}: "${pattern}"`);
      }
    };

    it("all header patterns should be valid regex", () => {
      for (const sig of signatures) {
        if (sig.rule?.headers) {
          for (const [header, pattern] of Object.entries(sig.rule.headers)) {
            testRegex(pattern, sig.name, `headers.${header}`);
          }
        }
      }
    });

    it("all body patterns should be valid regex", () => {
      for (const sig of signatures) {
        if (sig.rule?.bodies) {
          for (const pattern of sig.rule.bodies) {
            testRegex(pattern, sig.name, "bodies");
          }
        }
      }
    });

    it("all url patterns should be valid regex", () => {
      for (const sig of signatures) {
        if (sig.rule?.urls) {
          for (const pattern of sig.rule.urls) {
            testRegex(pattern, sig.name, "urls");
          }
        }
      }
    });

    it("all cookie patterns should be valid regex", () => {
      for (const sig of signatures) {
        if (sig.rule?.cookies) {
          for (const [cookie, pattern] of Object.entries(sig.rule.cookies)) {
            testRegex(pattern, sig.name, `cookies.${cookie}`);
          }
        }
      }
    });

    it("all activeRules bodyRegexes patterns should be valid regex", () => {
      for (const sig of signatures) {
        if (sig.activeRules) {
          for (const [i, rule] of sig.activeRules.entries()) {
            for (const [j, pattern] of rule.bodyRegexes.entries()) {
              testRegex(
                pattern,
                sig.name,
                `activeRules[${i}].bodyRegexes[${j}]`,
              );
            }
          }
        }
      }
    });

    it("all activeRules paths should be relative", () => {
      for (const sig of signatures) {
        if (!sig.activeRules) continue;
        for (const [i, rule] of sig.activeRules.entries()) {
          expect(
            isRelativePath(rule.path),
            `${sig.name}.activeRules[${i}].path must be relative: "${rule.path}"`,
          ).toBe(true);
          if (rule.confidence) {
            expect(
              VALID_CONFIDENCES,
              `Invalid confidence in ${sig.name}.activeRules[${i}]`,
            ).toContain(rule.confidence);
          }
        }
      }
    });

    it("all javascriptVariables patterns should be valid regex", () => {
      for (const sig of signatures) {
        if (sig.rule?.javascriptVariables) {
          for (const [varName, pattern] of Object.entries(
            sig.rule.javascriptVariables,
          )) {
            testRegex(pattern, sig.name, `javascriptVariables.${varName}`);
          }
        }
      }
    });
  });

  describe("implied softwares", () => {
    it("all implied software references should exist", () => {
      const allNames = new Set(signatures.map((s) => s.name));
      const missingRefs: string[] = [];

      for (const sig of signatures) {
        if (sig.impliedSoftwares) {
          for (const implied of sig.impliedSoftwares) {
            if (!allNames.has(implied)) {
              missingRefs.push(`${sig.name} -> ${implied}`);
            }
          }
        }
      }

      expect(
        missingRefs,
        `Missing implied software references: ${missingRefs.join(", ")}`,
      ).toEqual([]);
    });
  });

  describe("data integrity", () => {
    it("should have a reasonable number of signatures", () => {
      expect(signatures.length).toBeGreaterThan(100);
    });

    it("all signatures with rules should have at least one detection method", () => {
      for (const sig of signatures) {
        if (sig.rule) {
          const hasDetectionMethod =
            sig.rule.headers ||
            sig.rule.bodies ||
            sig.rule.urls ||
            sig.rule.cookies ||
            sig.rule.javascriptVariables;

          expect(
            hasDetectionMethod,
            `${sig.name} has a rule but no detection method`,
          ).toBeTruthy();
        }
      }
    });
  });

  describe("cpe format", () => {
    it("all cpe values should follow CPE format", () => {
      const cpePattern = /^cpe:[/:]?[0-9.]*:?[a-z]:[\w\-_.]+:[\w\-_.]+/i;
      for (const sig of signatures) {
        if (sig.cpe) {
          expect(
            sig.cpe,
            `Invalid CPE format in ${sig.name}: "${sig.cpe}"`,
          ).toMatch(cpePattern);
        }
      }
    });
  });
});
