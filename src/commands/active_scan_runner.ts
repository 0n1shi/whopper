import type { APIRequestContext } from "playwright";
import { fetchActiveRule } from "../browser/active_scan.js";
import { matchString, truncateBodyForEvidence } from "../analyzer/match.js";
import type { Detection } from "../analyzer/types.js";
import type { Signature } from "../signatures/_types.js";

export async function applyActiveScans(
  baseUrl: string,
  detections: Detection[],
  signatures: Signature[],
  request: APIRequestContext,
  timeoutMs: number,
): Promise<void> {
  const signatureByName = new Map(signatures.map((s) => [s.name, s]));

  for (const detection of detections) {
    const signature = signatureByName.get(detection.name);
    if (!signature?.rule || !signature.activeRules?.length) continue;

    for (const activeRule of signature.activeRules) {
      const response = await fetchActiveRule(
        baseUrl,
        activeRule.path,
        request,
        timeoutMs,
      );
      if (!response || response.status !== 200 || !response.body) {
        continue;
      }
      let result: ReturnType<typeof matchString> | undefined;
      for (const regex of activeRule.bodyRegexes) {
        const candidate = matchString(response.body, regex);
        if (candidate.hit) {
          result = candidate;
          break;
        }
      }
      if (!result) continue;

      (detection.evidences ??= []).push({
        type: "body",
        value: truncateBodyForEvidence(response.body),
        version: result.version,
        confidence: activeRule.confidence ?? signature.rule.confidence,
        host: response.host,
        sourceUrl: response.url,
      });
    }
  }
}
