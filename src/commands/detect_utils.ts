import chalk from "chalk";
import type { Confidence, Signature } from "../signatures/_types.js";
import type { Detection } from "../analyzer/types.js";
import type { DetectCommandOutput, DetectedSoftware } from "./detect_types.js";
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

export function makeDetectCommandOutput(
  detections: Detection[],
  signatures: Signature[],
): DetectCommandOutput {
  // Handle directly detected softwares
  const detectedSoftwares = detections.map((detection) => {
    const signature = signatures.find(
      (signature) => signature.name === detection.name,
    )!;
    const detectedSoftware: DetectedSoftware = {
      name: detection.name,
      confidence: maxConfidence(
        detection.evidences?.map((e) => e.confidence) || [],
      ),
    };
    if (signature.description) {
      detectedSoftware.description = signature.description;
    }
    const evidences = detection.evidences;
    if (evidences && evidences.length > 0) {
      detectedSoftware.evidences = evidences;
    }
    const versions = [
      ...new Set(
        evidences
          ?.map((evidence) => evidence.version)
          .filter((v): v is string => v !== undefined),
      ),
    ];
    if (versions && versions.length > 0) {
      detectedSoftware.versions = versions;
    }
    const cpes = signature.cpe
      ? [
          ...new Set(
            evidences
              ?.map((evidence) => evidence.version)
              .filter((v): v is string => v !== undefined)
              .map((version) => signature.cpe + ":" + version),
          ),
        ]
      : undefined;
    if (cpes && cpes.length > 0) {
      detectedSoftware.cpes = cpes;
    }
    return detectedSoftware;
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

  const mergedByName = new Map<string, DetectedSoftware>();
  const allSoftwares = [...detectedSoftwares, ...impliedSoftwares];

  for (const software of allSoftwares) {
    const existing = mergedByName.get(software.name);
    if (!existing) {
      mergedByName.set(software.name, software);
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

    const versions = [
      ...new Set([...(existing.versions || []), ...(software.versions || [])]),
    ];
    if (versions.length > 0) {
      merged.versions = versions;
    }

    const cpes = [
      ...new Set([...(existing.cpes || []), ...(software.cpes || [])]),
    ];
    if (cpes.length > 0) {
      merged.cpes = cpes;
    }

    const evidences = [
      ...(existing.evidences || []),
      ...(software.evidences || []),
    ];
    if (evidences.length > 0) {
      merged.evidences = evidences;
    }

    if (uniqueImpliedBy.length > 0) {
      merged.impliedBy = uniqueImpliedBy.join(", ");
    }

    mergedByName.set(software.name, merged);
  }

  return {
    detectedSoftwares: [...mergedByName.values()],
  };
}

export function printDetectCommandOutputAsText(
  output: DetectCommandOutput,
  showEvidence: boolean,
): void {
  console.log();
  for (const detection of output.detectedSoftwares) {
    let message = `* ${chalk.green(detection.name)}`;
    const versions = [
      ...new Set(detection.evidences?.map((e) => e.version).filter((v) => v)),
    ];
    if (versions.length > 0) {
      message += ` ${versions.join(", ")}`;
    }
    console.log(message);

    if (!showEvidence) {
      continue;
    }
    for (const evidence of detection.evidences || []) {
      console.log(`    [${evidence.type}] ${evidence.value}`);
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
