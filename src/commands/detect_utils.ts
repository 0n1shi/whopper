import chalk from "chalk";
import type { Confidence, Signature } from "../signatures/_types.js";
import type { Detection, Evidence } from "../analyzer/types.js";
import type { DetectCommandOutput, DetectedSoftware } from "./detect_types.js";
import type { UrlEntry } from "../browser/types.js";
import { maxConfidence } from "../analyzer/utils.js";

export function colorizeConfidence(confidence: Confidence): string {
  switch (confidence) {
    case "high":
      return chalk.green(confidence);
    case "medium":
      return chalk.yellow(confidence);
    case "low":
      return chalk.red(confidence);
    default:
      return confidence;
  }
}

function compareMaybeString(a?: string, b?: string): number {
  return (a ?? "").localeCompare(b ?? "");
}

function compareEvidence(a: Evidence, b: Evidence): number {
  return (
    compareMaybeString(a.type, b.type) ||
    compareMaybeString(a.value, b.value) ||
    compareMaybeString(a.version, b.version) ||
    compareMaybeString(a.confidence, b.confidence) ||
    compareMaybeString(a.host, b.host) ||
    compareMaybeString(a.sourceUrl, b.sourceUrl)
  );
}

export function makeDetectCommandOutput(
  urls: UrlEntry[],
  detections: Detection[],
  signatures: Signature[],
): DetectCommandOutput {
  // Handle directly detected softwares (one entry per version)
  const detectedSoftwares = detections.flatMap((detection) => {
    const signature = signatures.find(
      (signature) => signature.name === detection.name,
    )!;
    const evidences = [...(detection.evidences || [])].sort(compareEvidence);

    // Group evidences by version
    const versionGroups = new Map<string | undefined, typeof evidences>();
    for (const evidence of evidences) {
      const key = evidence.version;
      if (!versionGroups.has(key)) {
        versionGroups.set(key, []);
      }
      versionGroups.get(key)!.push(evidence);
    }

    // If no evidences, create a single entry
    if (versionGroups.size === 0) {
      const ds: DetectedSoftware = {
        name: detection.name,
        confidence: maxConfidence([]),
      };
      if (signature.description) {
        ds.description = signature.description;
      }
      return [ds];
    }

    return [...versionGroups.entries()].map(([version, versionEvidences]) => {
      const ds: DetectedSoftware = {
        name: detection.name,
        confidence: maxConfidence(versionEvidences.map((e) => e.confidence)),
      };
      if (signature.description) {
        ds.description = signature.description;
      }
      if (versionEvidences.length > 0) {
        ds.evidences = versionEvidences;
      }
      if (version) {
        ds.version = version;
        if (signature.cpe) {
          ds.cpe = signature.cpe + ":" + version;
        }
      }
      return ds;
    });
  });

  // Handle implied softwares
  const impliedSoftwares = detectedSoftwares.flatMap((detectedSoftware) => {
    const signature = signatures.find(
      (signature) => signature.name === detectedSoftware.name,
    )!;
    const impliedSignatures = signatures.filter((s) =>
      signature.impliedSoftwares?.includes(s.name),
    );
    return impliedSignatures.flatMap((impliedSignature) => {
      // Avoid duplicates
      if (detectedSoftwares.some((ds) => ds.name === impliedSignature.name)) {
        return [];
      }

      const impliedSoftware: DetectedSoftware = {
        name: impliedSignature.name,
        confidence: detectedSoftware.confidence,
        impliedBy: detectedSoftware.name,
      };
      if (impliedSignature.description) {
        impliedSoftware.description = impliedSignature.description;
      }
      return [impliedSoftware];
    });
  });

  const mergedByKey = new Map<string, DetectedSoftware>();
  const allSoftwares = [...detectedSoftwares, ...impliedSoftwares];

  for (const software of allSoftwares) {
    const key = software.name + "|" + (software.version || "");
    const existing = mergedByKey.get(key);
    if (!existing) {
      mergedByKey.set(key, software);
      continue;
    }

    const impliedBy = [
      ...(existing.impliedBy ? existing.impliedBy.split(", ") : []),
      ...(software.impliedBy ? software.impliedBy.split(", ") : []),
    ];
    const uniqueImpliedBy = [...new Set(impliedBy)].filter((v) => v.length > 0);

    const merged: DetectedSoftware = {
      name: software.name,
      confidence: maxConfidence([existing.confidence, software.confidence]),
    };

    const description = existing.description ?? software.description;
    if (description) {
      merged.description = description;
    }

    if (existing.version) {
      merged.version = existing.version;
    }
    if (existing.cpe) {
      merged.cpe = existing.cpe;
    }

    const evidences = [
      ...(existing.evidences || []),
      ...(software.evidences || []),
    ].sort(compareEvidence);
    if (evidences.length > 0) {
      merged.evidences = evidences;
    }

    if (uniqueImpliedBy.length > 0) {
      merged.impliedBy = uniqueImpliedBy.join(", ");
    }

    mergedByKey.set(key, merged);
  }

  return {
    urls,
    detectedSoftwares: [...mergedByKey.values()],
  };
}

export function printDetectCommandOutputAsText(
  output: DetectCommandOutput,
  showEvidence: boolean,
): void {
  console.log();
  for (const detection of output.detectedSoftwares) {
    let message = `* ${chalk.green(detection.name)}`;
    if (detection.version) {
      message += ` ${detection.version}`;
    }
    console.log(message);

    if (!showEvidence) {
      continue;
    }
    for (const evidence of detection.evidences || []) {
      const evidenceValue =
        evidence.type === "body" && evidence.sourceUrl
          ? evidence.sourceUrl
          : evidence.value;
      console.log(`    [${evidence.type}] ${evidenceValue}`);
    }
    if (detection.impliedBy) {
      console.log(`    [implied] ${detection.impliedBy}`);
    }
  }
}

export function printDetectCommandOutputAsJSON(
  output: DetectCommandOutput,
): void {
  console.log(JSON.stringify(output, null, 2));
}
