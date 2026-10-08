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

describe("fingerprint output", () => {
  it("keeps candidates on the direct product without manufacturing versions or CPEs", () => {
    const output = makeDetectCommandOutput(
      [],
      [
        {
          name: "baserCMS",
          versionCandidates: ["5.0.0", "5.0.1"],
          evidences: [evidence],
        },
      ],
      signatures,
    );
    const direct = output.detectedSoftwares.find((s) => s.name === "baserCMS")!;
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
      [{ name: "baserCMS", evidences: [{ ...evidence, version: "5.0.1" }] }],
      signatures,
    );
    expect(
      output.detectedSoftwares.find((s) => s.name === "baserCMS"),
    ).toMatchObject({
      version: "5.0.1",
      cpe: "cpe:/a:basercms:basercms:5.0.1",
      confidence: "medium",
    });
    expect(
      output.detectedSoftwares
        .filter((s) => s.name !== "baserCMS")
        .every((s) => !s.version && !s.versionCandidates),
    ).toBe(true);
  });
});
