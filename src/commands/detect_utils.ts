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
      description: signature.description,
      confidence: maxConfidence(
        detection.evidences?.map((e) => e.confidence) || [],
      ),
    };
    const evidences = detection.evidences;
    if (evidences && evidences.length > 0) {
      detectedSoftware.evidences = evidences;
    }
    const versions = evidences
      ?.map((evidence) => evidence.version)
      .filter((v): v is string => v !== undefined);
    if (versions && versions.length > 0) {
      detectedSoftware.versions = versions;
    }
    const cpes = evidences
      ?.map((evidence) => evidence.version)
      .filter((v): v is string => v !== undefined)
      .map((version) => signature.cpe + ":" + version);
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
        description: impliedSignature.description,
        confidence: detectedSoftware.confidence,
        impliedBy: detectedSoftware.name,
      };
      return [impliedSoftware];
    });
  });

  return {
    detectedSoftwares: [...detectedSoftwares, ...impliedSoftwares],
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
