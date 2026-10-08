import { describe, expect, it, vi } from "vitest";
import {
  makeDetectCommandOutput,
  printDetectCommandOutputAsJSON,
  printDetectCommandOutputAsText,
} from "./detect_utils.js";
import type { Evidence } from "../analyzer/types.js";
import { baserCmsSignature } from "../signatures/technologies/basercms.js";
import { phpSignature } from "../signatures/technologies/php.js";
import { cakePhpSignature } from "../signatures/technologies/cakephp.js";

const evidence: Evidence = {
  type: "hash",
  value: "sha256:example",
  version: undefined,
  confidence: "medium",
  sourceUrl: "https://example.com/js/admin/common.bundle.js",
  isFirstParty: true,
};
const signatures = [baserCmsSignature, phpSignature, cakePhpSignature];
const presence: Evidence[] = [
  { type: "cookie", value: "BASERCMS", version: undefined, confidence: "high" },
  { type: "body", value: "bca-login", version: undefined, confidence: "high" },
];

describe("fingerprint output", () => {
  it("keeps candidates on the direct product without manufacturing versions or CPEs", () => {
    const output = makeDetectCommandOutput(
      [],
      [
        {
          name: "baserCMS",
          versionCandidates: ["5.0.0", "5.0.1"],
          evidences: [...presence, evidence],
        },
      ],
      signatures,
    );
    const direct = output.detectedSoftwares.find((s) => s.name === "baserCMS")!;
    expect(
      output.detectedSoftwares.filter((s) => s.name === "baserCMS"),
    ).toHaveLength(1);
    expect(direct.versionCandidates).toEqual(["5.0.0", "5.0.1"]);
    expect(output.detectedSoftwares.every((s) => !s.version && !s.cpe)).toBe(
      true,
    );
    expect(
      output.detectedSoftwares
        .filter((s) => s.name !== "baserCMS")
        .every((s) => !s.versionCandidates),
    ).toBe(true);
    const log = vi.spyOn(console, "log").mockImplementation(() => {});
    try {
      printDetectCommandOutputAsText(output, false);
      expect(log.mock.calls.flat().join("\n")).toContain(
        "version candidates: 5.0.0, 5.0.1",
      );
      log.mockClear();
      printDetectCommandOutputAsJSON(output);
      expect(
        JSON.parse(log.mock.calls[0]![0]).detectedSoftwares[0]
          .versionCandidates,
      ).toEqual(["5.0.0", "5.0.1"]);
    } finally {
      log.mockRestore();
    }
  });

  it("exports an inferred unique version with medium confidence", () => {
    const output = makeDetectCommandOutput(
      [],
      [
        {
          name: "baserCMS",
          evidences: [
            ...presence,
            { ...evidence, version: "5.0.1" },
            {
              ...evidence,
              sourceUrl: "https://example.com/css/admin/style.css",
              version: "5.0.1",
            },
          ],
        },
      ],
      signatures,
    );
    const direct = output.detectedSoftwares.filter(
      (s) => s.name === "baserCMS",
    );
    expect(direct).toHaveLength(1);
    expect(direct[0]).toMatchObject({
      version: "5.0.1",
      cpe: "cpe:/a:basercms:basercms:5.0.1",
      confidence: "medium",
    });
    expect(direct[0]!.evidences).toHaveLength(4);
    expect(
      direct[0]!.evidences!.filter((e) => e.version === undefined),
    ).toEqual(expect.arrayContaining(presence));
    expect(
      output.detectedSoftwares
        .filter((s) => s.name !== "baserCMS")
        .every((s) => !s.version && !s.versionCandidates),
    ).toBe(true);
  });

  it("does not attach versionless evidence arbitrarily when multiple versions exist", () => {
    const output = makeDetectCommandOutput(
      [],
      [
        {
          name: "baserCMS",
          evidences: [
            ...presence,
            { ...evidence, version: "5.0.1" },
            { ...evidence, version: "5.0.2" },
          ],
        },
      ],
      signatures,
    );
    const direct = output.detectedSoftwares.filter(
      (s) => s.name === "baserCMS",
    );
    expect(direct.map((s) => s.version)).toEqual([undefined, "5.0.1", "5.0.2"]);
    expect(direct.find((s) => !s.version)!.evidences).toEqual(
      expect.arrayContaining(presence),
    );
  });
});
